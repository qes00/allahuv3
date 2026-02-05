# Configuración de Google OAuth para Allahu Store (Vercel)

## Resumen de Cambios Realizados

### Archivos Modificados:

1. **`stores/authStore.ts`** - Agregado método `signInWithGoogle()` usando OAuth de Supabase
2. **`components/LoginModal.tsx`** - UI actualizada con:
   - Botón "Continuar con Google" como método principal
   - Formulario email/password **temporalmente deshabilitado**
   - Mensaje informativo para usuarios
   - Opción para usuarios existentes de loguearse con email
3. **`services/database.types.ts`** - Tipos de TypeScript actualizados desde Supabase

---

## ⚠️ CONFIGURACIÓN REQUERIDA EN SUPABASE

Para que Google OAuth funcione, necesitas configurarlo en el Dashboard de Supabase:

### Paso 1: Crear credenciales en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona o crea un proyecto
3. Ve a **APIs & Services** → **Credentials**
4. Click en **Create Credentials** → **OAuth 2.0 Client IDs**
5. Selecciona **Web application**
6. Configura:
   - **Name**: `Allahu Store`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (desarrollo)
     - `https://TU-APP.vercel.app` (producción - reemplaza con tu URL de Vercel)
     - Si tienes dominio propio: `https://tu-dominio.com`
   - **Authorized redirect URIs**:
     - `https://ltmdgtuohnwdfjjntklo.supabase.co/auth/v1/callback`
7. Guarda el **Client ID** y **Client Secret**

### Paso 2: Configurar Google en Supabase

1. Ve a [Supabase Dashboard - Providers](https://supabase.com/dashboard/project/ltmdgtuohnwdfjjntklo/auth/providers)
2. Busca **Google** y habilítalo
3. Ingresa:
   - **Client ID**: (el que obtuviste de Google)
   - **Client Secret**: (el que obtuviste de Google)
4. Guarda los cambios

### Paso 3: Configurar URLs de Redirección (Vercel)

1. En Supabase Dashboard ve a [URL Configuration](https://supabase.com/dashboard/project/ltmdgtuohnwdfjjntklo/auth/url-configuration)
2. Configura:
   - **Site URL**: `https://TU-APP.vercel.app` (tu URL de producción en Vercel)
   - **Redirect URLs**: Agrega todas las URLs válidas:
     - `http://localhost:3000/`
     - `https://TU-APP.vercel.app/`
     - Si tienes dominio propio: `https://tu-dominio.com/`

> **Nota**: Reemplaza `TU-APP.vercel.app` con la URL real de tu aplicación en Vercel (ej: `allahu-store.vercel.app`)

---

## Reactivar Login por Email

Cuando el proveedor de correo esté configurado, cambia en `LoginModal.tsx`:

```typescript
// Línea 15 - Cambiar de false a true
const EMAIL_LOGIN_ENABLED = true;
```

---

## Verificar la Implementación

1. **Local**: Ejecuta `npm run dev` y prueba el botón de Google
2. **Vercel**: Despliega con `git push` y verifica en producción
3. El botón "Continuar con Google" debe redirigir a la autenticación de Google
4. Después de autenticarse, debe regresar a tu app

---

## Troubleshooting

### Error "redirect_uri_mismatch"

- Verifica que la URL de callback de Supabase esté en **Authorized redirect URIs** de Google
- La URL exacta es: `https://ltmdgtuohnwdfjjntklo.supabase.co/auth/v1/callback`

### Error "Invalid origin"

- Agrega tu dominio de Vercel a **Authorized JavaScript origins** en Google Cloud

### Usuario no se crea en user_profiles

- Verifica que el trigger `auto_create_profile_trigger` existe en Supabase
- Ejecuta la migración `auto_create_profile_trigger.sql` si no existe
