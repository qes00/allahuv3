/**
 * Auth Store - Estado Global de Autenticación
 * @description Gestiona la autenticación con Supabase usando Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import type { User, Session } from '@supabase/supabase-js';

export type UserRole = 'customer' | 'admin';

export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
}

interface AuthState {
    user: AuthUser | null;
    session: Session | null;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;

    // Actions
    initialize: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
    signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
    clearError: () => void;

    // Computed helpers
    isAuthenticated: () => boolean;
    isAdmin: () => boolean;
}

// Helper para obtener perfil de usuario y sincronizar con metadatos de Google si es necesario
const fetchUserProfile = async (user: User): Promise<Partial<AuthUser>> => {
    if (!supabase) return {};
    
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('first_name, last_name, phone, role')
            .eq('id', user.id)
            .maybeSingle();
        
        if (error) {
            console.error('❌ Error fetching user profile:', error);
            return {};
        }

        // Sincronizar con Google Metadata si el perfil está incompleto
        let syncedData = {};
        const metadata = user.user_metadata;
        
        if (data && (!data.first_name || !data.last_name) && metadata && (metadata.full_name || metadata.name)) {
            const fullName = metadata.full_name || metadata.name || '';
            const nameParts = fullName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            const updates: any = {};
            // Solo actualizar si faltan en la DB
            if (!data.first_name && firstName) updates.first_name = firstName;
            if (!data.last_name && lastName) updates.last_name = lastName;
            
            if (Object.keys(updates).length > 0) {
                console.log('🔄 Syncing user profile with Google data:', updates);
                const { error: updateError } = await supabase
                    .from('user_profiles')
                    .update(updates)
                    .eq('id', user.id);
                    
                if (!updateError) {
                    syncedData = {
                        firstName: updates.first_name,
                        lastName: updates.last_name
                    };
                }
            }
        }
        
        if (!data) {
            console.warn('⚠️ No profile found for user:', user.id);
            // Intento de auto-crear si no existe (fallback si el trigger falla)
            if (metadata && (metadata.full_name || metadata.name)) {
                 // Misma logica de parsing
                 const fullName = metadata.full_name || metadata.name || '';
                 const nameParts = fullName.split(' ');
                 const firstName = nameParts[0] || '';
                 const lastName = nameParts.slice(1).join(' ') || '';
                 
                 await ensureUserProfile(user.id, user.email || '', firstName, lastName);
                 // Retornar los datos recién creados
                 return {
                     firstName,
                     lastName,
                     phone: '',
                     role: 'customer'
                 };
            }
            return {};
        }
        
        return {
            firstName: (syncedData as any).firstName || data.first_name || '',
            lastName: (syncedData as any).lastName || data.last_name || '',
            phone: data.phone || '',
            role: (data.role as UserRole) || 'customer',
        };
    } catch (error) {
        console.error('❌ Exception in fetchUserProfile:', error);
        return {};
    }
};

// Helper para crear perfil de usuario si no existe
const ensureUserProfile = async (
    userId: string, 
    email: string,
    firstName?: string,
    lastName?: string
): Promise<void> => {
    if (!supabase) return;
    
    try {
        const { data: existing, error: checkError } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', userId)
            .maybeSingle();
        
        if (checkError) {
            console.error('❌ Error checking profile existence:', checkError);
        }
        
        if (!existing) {
            console.log('📝 Creating new user profile for:', email);
            const insertData = {
                id: userId,
                first_name: firstName || '',
                last_name: lastName || '',
                role: 'customer' as UserRole,
            };
            
            const { error: insertError } = await supabase
                .from('user_profiles')
                .insert(insertData);
            
            if (insertError) {
                console.error('❌ Error creating user profile:', insertError);
                console.error('❌ Profile data attempted:', insertData);
                throw new Error(`Failed to create profile: ${insertError.message}`);
            }
            
            console.log('✅ User profile created successfully');
        } else {
            console.log('ℹ️ User profile already exists');
        }
    } catch (error) {
        console.error('❌ Exception in ensureUserProfile:', error);
        throw error; // Re-throw para que signUp lo maneje
    }
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            session: null,
            isLoading: false,
            isInitialized: false,
            error: null,

            initialize: async () => {
                if (!isSupabaseConfigured() || !supabase) {
                    console.warn('⚠️ Supabase no configurado - Auth en modo offline');
                    set({ isInitialized: true, isLoading: false });
                    return;
                }

                set({ isLoading: true });

                try {
                    // Obtener sesión actual
                    const { data: { session }, error } = await supabase.auth.getSession();
                    
                    if (error) throw error;

                    if (session?.user) {
                        const profile = await fetchUserProfile(session.user);
                        
                        set({
                            session,
                            user: {
                                id: session.user.id,
                                email: session.user.email || '',
                                ...profile,
                            } as AuthUser,
                            isLoading: false,
                            isInitialized: true,
                        });
                    } else {
                        set({ session: null, user: null, isLoading: false, isInitialized: true });
                    }

                    // Escuchar cambios de autenticación
                    supabase.auth.onAuthStateChange(async (event, session) => {
                        if (event === 'SIGNED_IN' && session?.user) {
                            const profile = await fetchUserProfile(session.user);
                            set({
                                session,
                                user: {
                                    id: session.user.id,
                                    email: session.user.email || '',
                                    ...profile,
                                } as AuthUser,
                            });
                        } else if (event === 'SIGNED_OUT') {
                            set({ session: null, user: null });
                        }
                    });
                } catch (error) {
                    console.error('Error inicializando auth:', error);
                    set({ isLoading: false, isInitialized: true, error: 'Error de autenticación' });
                }
            },

            signIn: async (email: string, password: string) => {
                if (!isSupabaseConfigured() || !supabase) {
                    return { success: false, error: 'Supabase no configurado' };
                }

                set({ isLoading: true, error: null });

                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });

                    if (error) {
                        set({ isLoading: false, error: error.message });
                        return { success: false, error: error.message };
                    }

                    if (data.user) {
                        const profile = await fetchUserProfile(data.user);
                        
                        set({
                            session: data.session,
                            user: {
                                id: data.user.id,
                                email: data.user.email || '',
                                ...profile,
                            } as AuthUser,
                            isLoading: false,
                        });

                        return { success: true };
                    }

                    return { success: false, error: 'Error desconocido' };
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
                    set({ isLoading: false, error: message });
                    return { success: false, error: message };
                }
            },

            signInWithGoogle: async () => {
                if (!isSupabaseConfigured() || !supabase) {
                    return { success: false, error: 'Supabase no configurado' };
                }

                set({ isLoading: true, error: null });

                try {
                    const { error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: `${window.location.origin}/`,
                            queryParams: {
                                access_type: 'offline',
                                prompt: 'consent',
                            },
                        },
                    });
                    
                    console.log('🔐 Initiating Google OAuth with redirect to:', `${window.location.origin}/`);

                    if (error) {
                        set({ isLoading: false, error: error.message });
                        return { success: false, error: error.message };
                    }

                    // OAuth redirige, así que el éxito se maneja en onAuthStateChange
                    return { success: true };
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Error al iniciar sesión con Google';
                    set({ isLoading: false, error: message });
                    return { success: false, error: message };
                }
            },

            signUp: async (email: string, password: string, firstName?: string, lastName?: string) => {
                if (!isSupabaseConfigured() || !supabase) {
                    return { success: false, error: 'Supabase no configurado' };
                }

                set({ isLoading: true, error: null });

                try {
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                    });

                    if (error) {
                        set({ isLoading: false, error: error.message });
                        return { success: false, error: error.message };
                    }

                    if (data.user) {
                        // Crear perfil de usuario
                        await ensureUserProfile(data.user.id, email, firstName, lastName);
                        
                        set({
                            session: data.session,
                            user: {
                                id: data.user.id,
                                email: data.user.email || '',
                                firstName: firstName || '',
                                lastName: lastName || '',
                                phone: '',
                                role: 'customer',
                            },
                            isLoading: false,
                        });

                        return { success: true };
                    }

                    return { success: false, error: 'Error desconocido' };
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Error al registrar';
                    set({ isLoading: false, error: message });
                    return { success: false, error: message };
                }
            },

            signOut: async () => {
                if (!isSupabaseConfigured() || !supabase) {
                    set({ user: null, session: null });
                    return;
                }

                set({ isLoading: true });
                
                try {
                    await supabase.auth.signOut();
                    set({ user: null, session: null, isLoading: false });
                } catch (error) {
                    console.error('Error al cerrar sesión:', error);
                    set({ user: null, session: null, isLoading: false });
                }
            },

            clearError: () => set({ error: null }),

            isAuthenticated: () => get().user !== null,
            isAdmin: () => get().user?.role === 'admin',
        }),
        {
            name: 'allahu-auth-storage',
            partialize: (state) => ({ 
                // Solo persistir datos básicos, la sesión se valida al iniciar
                user: state.user,
            }),
        }
    )
);

// Selectores optimizados
export const useAuth = () => useAuthStore((state) => ({
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: state.isAuthenticated(),
    isAdmin: state.isAdmin(),
}));

export const useAuthActions = () => useAuthStore((state) => ({
    signIn: state.signIn,
    signInWithGoogle: state.signInWithGoogle,
    signUp: state.signUp,
    signOut: state.signOut,
    clearError: state.clearError,
}));
