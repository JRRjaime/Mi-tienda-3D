# 🔐 Configuración de OAuth en Supabase

## 📋 **Guía Completa para Habilitar Autenticación Social**

### **🚀 Paso 1: Configurar Proveedores en Supabase**

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. **Authentication** → **Providers**

---

### **🔵 Google OAuth**

1. **En Supabase:**
   - Habilita "Google" en Providers
   - Copia la URL de callback: `https://[tu-proyecto].supabase.co/auth/v1/callback`

2. **En Google Cloud Console:**
   - Ve a [Google Cloud Console](https://console.cloud.google.com)
   - **APIs & Services** → **Credentials**
   - **Create Credentials** → **OAuth 2.0 Client ID**
   - **Application type:** Web application
   - **Authorized redirect URIs:** Pega la URL de Supabase
   - Copia **Client ID** y **Client Secret**

3. **De vuelta en Supabase:**
   - Pega Client ID y Client Secret en la configuración de Google

---

### **🍎 Apple OAuth**

1. **En Apple Developer:**
   - Ve a [Apple Developer](https://developer.apple.com)
   - **Certificates, Identifiers & Profiles**
   - **Identifiers** → **App IDs** → Crear nuevo
   - Habilita "Sign In with Apple"

2. **En Supabase:**
   - Habilita "Apple" en Providers
   - Configura con los datos de Apple Developer

---

### **🐙 GitHub OAuth**

1. **En GitHub:**
   - Ve a **Settings** → **Developer settings** → **OAuth Apps**
   - **New OAuth App**
   - **Authorization callback URL:** `https://[tu-proyecto].supabase.co/auth/v1/callback`
   - Copia **Client ID** y **Client Secret**

2. **En Supabase:**
   - Habilita "GitHub" en Providers
   - Pega Client ID y Client Secret

---

### **🎮 Discord OAuth**

1. **En Discord Developer:**
   - Ve a [Discord Developer Portal](https://discord.com/developers/applications)
   - **New Application**
   - **OAuth2** → **General**
   - **Redirects:** Añade la URL de callback de Supabase
   - Copia **Client ID** y **Client Secret**

2. **En Supabase:**
   - Habilita "Discord" en Providers
   - Configura con los datos de Discord

---

### **📘 Facebook OAuth**

1. **En Facebook Developers:**
   - Ve a [Facebook for Developers](https://developers.facebook.com)
   - **My Apps** → **Create App**
   - **Facebook Login** → **Settings**
   - **Valid OAuth Redirect URIs:** Añade URL de Supabase

2. **En Supabase:**
   - Habilita "Facebook" en Providers
   - Configura App ID y App Secret

---

### **🐦 Twitter/X OAuth**

1. **En Twitter Developer:**
   - Ve a [Twitter Developer Portal](https://developer.twitter.com)
   - **Projects & Apps** → **Create App**
   - **Authentication settings** → Habilita OAuth 2.0
   - **Callback URLs:** Añade URL de Supabase

2. **En Supabase:**
   - Habilita "Twitter" en Providers
   - Configura API Key y API Secret

---

### **🏢 Microsoft OAuth**

1. **En Azure Portal:**
   - Ve a [Azure Portal](https://portal.azure.com)
   - **Azure Active Directory** → **App registrations**
   - **New registration**
   - **Redirect URI:** Añade URL de Supabase

2. **En Supabase:**
   - Habilita "Azure" en Providers
   - Configura Application ID y Secret

---

### **💼 LinkedIn OAuth**

1. **En LinkedIn Developers:**
   - Ve a [LinkedIn Developer Portal](https://www.linkedin.com/developers)
   - **Create App**
   - **Auth** → **OAuth 2.0 settings**
   - **Authorized redirect URLs:** Añade URL de Supabase

2. **En Supabase:**
   - Habilita "LinkedIn" en Providers
   - Configura Client ID y Client Secret

---

## ⚙️ **Configuración en tu Aplicación**

### **Variables de Entorno Necesarias:**

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
\`\`\`

### **URL de Callback en tu Dominio:**

Cuando despliegues, también configura:
\`\`\`
https://tu-dominio.com/auth/callback
\`\`\`

---

## 🧪 **Probar la Configuración**

1. **Modo Desarrollo:** Los botones aparecerán habilitados
2. **Hacer clic** en cualquier proveedor social
3. **Completar** el flujo de OAuth
4. **Verificar** que el usuario se crea correctamente

---

## 🚨 **Notas Importantes**

- **URLs de Callback:** Deben coincidir exactamente
- **Dominios:** Configura tanto localhost como tu dominio de producción
- **Permisos:** Algunos proveedores requieren verificación de la app
- **Rate Limits:** Cada proveedor tiene límites de uso

---

## 🎯 **Estado Actual**

✅ **Interfaz creada** - Botones de OAuth listos
✅ **Lógica implementada** - Manejo de autenticación social
⏳ **Configuración pendiente** - Necesitas configurar cada proveedor
⏳ **Testing** - Probar cada proveedor individualmente

¡Una vez configurado, tendrás autenticación social completa! 🚀
