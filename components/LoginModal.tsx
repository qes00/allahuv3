import React, { useState } from 'react';
import { Button } from './Button';
import { useAuthStore } from '../stores/authStore';
import { useToast } from './Toast';
import { PrivacyNoticeModal } from './PrivacyNoticeModal';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (email: string, password: string) => void;
    onForgotPassword: () => void;
}

// Flag para habilitar/deshabilitar login con email (temporalmente deshabilitado)
const EMAIL_LOGIN_ENABLED = false;

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onForgotPassword }) => {
    const signUp = useAuthStore(state => state.signUp);
    const signInWithGoogle = useAuthStore(state => state.signInWithGoogle);
    const { showToast } = useToast();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);

    if (!isOpen) return null;

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        const result = await signInWithGoogle();
        if (!result.success) {
            showToast('error', result.error || 'Error al iniciar sesión con Google');
            setIsLoading(false);
        }
        // Si es exitoso, la página redirigirá a Google OAuth
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'register') {
            if (password !== confirmPassword) {
                showToast('error', 'Las contraseñas no coinciden');
                return;
            }
            if (password.length < 8) {
                showToast('error', 'La contraseña debe tener al menos 8 caracteres');
                return;
            }
            if (!firstName || !lastName) {
                showToast('error', 'Por favor ingresa tu nombre completo');
                return;
            }
            if (!acceptedPrivacy) {
                showToast('error', 'Debes aceptar el Aviso de Privacidad para continuar');
                return;
            }
            
            setIsLoading(true);
            const result = await signUp(email, password, firstName, lastName);
            setIsLoading(false);
            
            if (result.success) {
                showToast('success', '¡Registro exitoso! Bienvenido');
                onClose();
                // Reset form
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setFirstName('');
                setLastName('');
                setAcceptedPrivacy(false);
            } else {
                showToast('error', result.error || 'Error al registrar');
            }
            return;
        }

        onLogin(email, password);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Botón de Google - Método principal */}
                    <Button 
                        onClick={handleGoogleSignIn} 
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400"
                        disabled={isLoading}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        {isLoading ? 'Conectando...' : 'Continuar con Google'}
                    </Button>

                    {/* Separador */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-stone-500">o</span>
                        </div>
                    </div>

                    {/* Mensaje de email temporalmente deshabilitado */}
                    {!EMAIL_LOGIN_ENABLED && !showEmailForm && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-amber-800">
                                        Registro por correo temporalmente deshabilitado
                                    </p>
                                    <p className="text-xs text-amber-700 mt-1">
                                        Estamos configurando el servicio de correo. Por favor usa Google para iniciar sesión.
                                    </p>
                                </div>
                            </div>
                            {mode === 'login' && (
                                <button
                                    type="button"
                                    onClick={() => setShowEmailForm(true)}
                                    className="mt-3 text-xs text-amber-700 hover:text-amber-900 underline"
                                >
                                    ¿Ya tienes cuenta? Inicia sesión con email
                                </button>
                            )}
                        </div>
                    )}

                    {/* Formulario de email - Solo visible si está habilitado o si el usuario lo solicita para login */}
                    {(EMAIL_LOGIN_ENABLED || showEmailForm) && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === 'register' && (
                                <>
                                    <div>
                                        <label className={styles.label}>Nombres *</label>
                                        <input
                                            type="text"
                                            required
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className={styles.input}
                                            placeholder="Ej: Juan"
                                        />
                                    </div>
                                    <div>
                                        <label className={styles.label}>Apellidos *</label>
                                        <input
                                            type="text"
                                            required
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className={styles.input}
                                            placeholder="Ej: Pérez"
                                        />
                                    </div>
                                </>
                            )}
                            
                            <div>
                                <label className={styles.label}>Correo Electrónico</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div>
                                <label className={styles.label}>Contraseña</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.input}
                                    placeholder="Mínimo 8 caracteres"
                                />
                            </div>

                            {mode === 'register' && (
                                <div>
                                    <label className={styles.label}>Confirmar Contraseña</label>
                                    <input
                                        type="password"
                                        required
                                        minLength={8}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={styles.input}
                                        placeholder="Repite tu contraseña"
                                    />
                                </div>
                            )}

                            {mode === 'register' && (
                                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                                    <input 
                                        type="checkbox" 
                                        id="privacy-consent"
                                        checked={acceptedPrivacy}
                                        onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                                        className="mt-0.5 w-4 h-4 text-gold-600 border-stone-300 rounded focus:ring-gold-500"
                                        required
                                    />
                                    <label htmlFor="privacy-consent" className={styles.label + " mb-0"}>
                                        He leído y acepto el{' '}
                                        <button 
                                            type="button"
                                            onClick={() => setShowPrivacyNotice(true)}
                                            className="text-gold-600 hover:text-gold-700 underline font-bold transition-colors"
                                        >
                                            Aviso de Privacidad
                                        </button>
                                        {' '}y autorizo el tratamiento de mis datos personales *
                                    </label>
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Procesando...' : mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                            </Button>

                            {mode === 'login' && (
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onClose();
                                            onForgotPassword();
                                        }}
                                        className={styles.forgotPasswordButton}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
                            )}
                        </form>
                    )}

                    {/* Toggle entre login y register - Solo si email está habilitado */}
                    {EMAIL_LOGIN_ENABLED && (
                        <div className={styles.footer}>
                            <button
                                type="button"
                                onClick={() => {
                                    setMode(mode === 'login' ? 'register' : 'login');
                                    setPassword('');
                                    setConfirmPassword('');
                                    setFirstName('');
                                    setLastName('');
                                    setAcceptedPrivacy(false);
                                }}
                                className={styles.switchButton}
                            >
                                {mode === 'login'
                                    ? '¿No tienes cuenta? Regístrate'
                                    : '¿Ya tienes cuenta? Inicia sesión'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            <PrivacyNoticeModal 
                isOpen={showPrivacyNotice} 
                onClose={() => setShowPrivacyNotice(false)} 
            />
        </div>
    );
};

const styles = {
    overlay: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4",
    modal: "bg-white rounded-xl shadow-2xl max-w-md w-full animate-fade-in-up max-h-[90vh] overflow-y-auto",
    header: "flex items-center justify-between p-6 border-b border-stone-200 sticky top-0 bg-white",
    title: "text-2xl font-bold text-black",
    closeButton: "text-stone-400 hover:text-black transition-colors p-1",
    form: "p-6 space-y-4",
    label: "block text-sm font-bold text-stone-900 mb-1",
    input: "w-full px-4 py-2 border border-stone-300 rounded-lg bg-white text-black font-medium focus:ring-2 focus:ring-gold-500 outline-none",
    forgotPasswordButton: "text-sm text-stone-600 hover:text-gold-700 font-medium transition-colors underline",
    footer: "text-center pt-4 border-t border-stone-200",
    switchButton: "text-sm text-gold-700 hover:text-gold-900 font-bold transition-colors"
};

