# 🚀 Guía Completa de Configuración de Stripe

## 📋 **Paso 1: Crear Cuenta en Stripe**

1. Ve a [https://stripe.com](https://stripe.com)
2. Haz clic en "Sign up"
3. Completa el registro con tu información
4. Verifica tu email

## 🔑 **Paso 2: Obtener las Claves API**

### **En el Dashboard de Stripe:**

1. **Ir a Developers → API Keys**
2. **Copiar las claves:**
   - `Publishable key` (empieza con `pk_test_...`)
   - `Secret key` (empieza con `sk_test_...`)

### **⚠️ IMPORTANTE:**
- Usa las claves de **TEST** para desarrollo
- Las claves de **LIVE** solo para producción

## 🌐 **Paso 3: Configurar Webhook**

### **En Stripe Dashboard:**

1. **Ir a Developers → Webhooks**
2. **Hacer clic en "Add endpoint"**
3. **Configurar:**
   - **Endpoint URL**: `https://tu-dominio.vercel.app/api/stripe/webhook`
   - **Events to send**: Seleccionar estos eventos:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.dispute.created`
     - `invoice.payment_succeeded`
     - `customer.subscription.created`

4. **Copiar el Webhook Secret** (empieza con `whsec_...`)

## 🔧 **Paso 4: Variables de Entorno**

### **Crear archivo `.env.local`:**

\`\`\`env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui

# Database (opcional)
DATABASE_URL=postgresql://tu_database_url_aqui

# App Configuration
NEXTAUTH_SECRET=tu-secret-super-seguro-aqui
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### **En Vercel (Producción):**

1. **Ir a tu proyecto en Vercel**
2. **Settings → Environment Variables**
3. **Añadir cada variable:**
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`

## 🧪 **Paso 5: Probar la Configuración**

### **Tarjetas de Prueba de Stripe:**

\`\`\`
✅ Pago Exitoso:
   Número: 4242 4242 4242 4242
   Fecha: 12/34
   CVC: 123

❌ Pago Fallido:
   Número: 4000 0000 0000 0002
   Fecha: 12/34
   CVC: 123

🔄 Requiere Autenticación:
   Número: 4000 0025 0000 3155
   Fecha: 12/34
   CVC: 123
\`\`\`

## 🚀 **Paso 6: Verificar Integración**

### **Checklist de Verificación:**

- [ ] ✅ Claves API configuradas
- [ ] 🌐 Webhook configurado y funcionando
- [ ] 💳 Formulario de pago carga correctamente
- [ ] 🔄 Pagos de prueba funcionan
- [ ] 📧 Webhooks reciben eventos
- [ ] 💰 Montos se procesan correctamente

## 🛠️ **Comandos de Prueba**

### **Probar localmente:**
\`\`\`bash
# Instalar Stripe CLI (opcional)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Probar webhook
stripe trigger payment_intent.succeeded
\`\`\`

## 🔒 **Seguridad**

### **Mejores Prácticas:**
- ✅ Nunca expongas `STRIPE_SECRET_KEY` en el frontend
- ✅ Usa HTTPS en producción
- ✅ Valida webhooks con la firma
- ✅ Maneja errores apropiadamente
- ✅ Registra transacciones para auditoría

## 🌍 **Configuración Internacional**

### **Países Soportados:**
- 🇪🇺 Unión Europea
- 🇺🇸 Estados Unidos
- 🇨🇦 Canadá
- 🇲🇽 México
- 🇧🇷 Brasil
- 🇦🇺 Australia
- 🇯🇵 Japón
- Y muchos más...

### **Monedas Soportadas:**
- USD, EUR, GBP, CAD, AUD, JPY, MXN, BRL, etc.

## 🆘 **Solución de Problemas**

### **Errores Comunes:**

1. **"Stripe is not configured"**
   - ✅ Verificar variables de entorno
   - ✅ Reiniciar servidor de desarrollo

2. **"Invalid API key"**
   - ✅ Verificar que la clave es correcta
   - ✅ Verificar que no hay espacios extra

3. **"Webhook signature verification failed"**
   - ✅ Verificar STRIPE_WEBHOOK_SECRET
   - ✅ Verificar URL del webhook

4. **"Payment failed"**
   - ✅ Usar tarjetas de prueba válidas
   - ✅ Verificar montos mínimos

## 📞 **Soporte**

- 📚 [Documentación de Stripe](https://stripe.com/docs)
- 💬 [Soporte de Stripe](https://support.stripe.com)
- 🛠️ [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

## 🎯 **Próximos Pasos**

Una vez configurado Stripe:

1. ✅ Probar pagos en desarrollo
2. 🚀 Configurar producción
3. 📊 Configurar analytics
4. 🔔 Configurar notificaciones
5. 💰 Configurar payouts automáticos
