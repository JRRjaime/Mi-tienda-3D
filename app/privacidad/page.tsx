import { LegalLayout } from "@/components/legal/legal-layout"
import { Shield } from "lucide-react"

export default function PrivacidadPage() {
  return (
    <LegalLayout
      title="Política de Privacidad"
      description="Cómo recopilamos, usamos y protegemos tu información personal"
      lastUpdated="17 de Junio de 2025"
      icon={<Shield className="h-8 w-8" />}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Información que Recopilamos</h2>

          <h3 className="text-lg font-semibold mb-2">1.1 Información que Proporcionas</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Datos de registro (nombre, email, contraseña)</li>
            <li>Información de perfil y preferencias</li>
            <li>Contenido que subes (modelos 3D, imágenes, descripciones)</li>
            <li>Información de pago y facturación</li>
            <li>Comunicaciones con soporte</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2 mt-4">1.2 Información Automática</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Datos de uso y navegación</li>
            <li>Información del dispositivo y navegador</li>
            <li>Dirección IP y ubicación aproximada</li>
            <li>Cookies y tecnologías similares</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Cómo Usamos tu Información</h2>
          <p>Utilizamos tu información para:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Proporcionar y mejorar nuestros servicios</li>
            <li>Procesar transacciones y pagos</li>
            <li>Comunicarnos contigo sobre tu cuenta</li>
            <li>Personalizar tu experiencia</li>
            <li>Prevenir fraude y garantizar seguridad</li>
            <li>Cumplir con obligaciones legales</li>
            <li>Enviar actualizaciones y promociones (con tu consentimiento)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Compartir Información</h2>

          <h3 className="text-lg font-semibold mb-2">3.1 Con Terceros</h3>
          <p>Compartimos información limitada con:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Stripe:</strong> Para procesamiento de pagos
            </li>
            <li>
              <strong>Supabase:</strong> Para almacenamiento de datos
            </li>
            <li>
              <strong>Vercel:</strong> Para hosting y analytics
            </li>
            <li>
              <strong>Proveedores de email:</strong> Para comunicaciones
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-2 mt-4">3.2 Información Pública</h3>
          <p>Es visible públicamente:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Tu nombre de usuario y foto de perfil</li>
            <li>Modelos 3D que publicas</li>
            <li>Calificaciones y reseñas</li>
            <li>Estadísticas de actividad (si las haces públicas)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Tus Derechos (GDPR)</h2>
          <p>Bajo el GDPR, tienes derecho a:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Acceso:</strong> Solicitar una copia de tus datos
            </li>
            <li>
              <strong>Rectificación:</strong> Corregir datos inexactos
            </li>
            <li>
              <strong>Supresión:</strong> Solicitar eliminación de tus datos
            </li>
            <li>
              <strong>Portabilidad:</strong> Recibir tus datos en formato estructurado
            </li>
            <li>
              <strong>Oposición:</strong> Oponerte al procesamiento
            </li>
            <li>
              <strong>Limitación:</strong> Restringir el procesamiento
            </li>
          </ul>

          <p className="mt-4">
            Para ejercer estos derechos, contáctanos en: <strong>privacy@world3d.com</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Seguridad de Datos</h2>
          <p>Protegemos tu información mediante:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Cifrado SSL/TLS para transmisión de datos</li>
            <li>Cifrado de datos sensibles en reposo</li>
            <li>Autenticación de dos factores disponible</li>
            <li>Auditorías regulares de seguridad</li>
            <li>Acceso limitado a datos personales</li>
            <li>Monitoreo continuo de amenazas</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Retención de Datos</h2>
          <p>Conservamos tus datos:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Cuenta activa:</strong> Mientras uses nuestros servicios
            </li>
            <li>
              <strong>Cuenta cerrada:</strong> Hasta 3 años para obligaciones legales
            </li>
            <li>
              <strong>Datos de transacciones:</strong> 7 años por requisitos fiscales
            </li>
            <li>
              <strong>Logs de seguridad:</strong> 1 año máximo
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Cookies y Tecnologías Similares</h2>
          <p>Utilizamos cookies para:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Mantener tu sesión iniciada</li>
            <li>Recordar tus preferencias</li>
            <li>Analizar el uso de la plataforma</li>
            <li>Personalizar contenido y anuncios</li>
          </ul>

          <p className="mt-4">
            Puedes gestionar las cookies en tu navegador o en nuestra
            <a href="/cookies" className="text-blue-600 hover:underline">
              {" "}
              página de cookies
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. Transferencias Internacionales</h2>
          <p>Tus datos pueden procesarse en países fuera del EEE. Garantizamos protección adecuada mediante:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Cláusulas contractuales estándar</li>
            <li>Certificaciones de adequación</li>
            <li>Medidas de seguridad adicionales</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">9. Menores de Edad</h2>
          <p>
            Nuestros servicios están dirigidos a mayores de 16 años. No recopilamos intencionalmente información de
            menores de 16 años.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">10. Cambios en esta Política</h2>
          <p>
            Podemos actualizar esta política ocasionalmente. Los cambios significativos se notificarán por email y en la
            plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">11. Contacto</h2>
          <p>Para preguntas sobre privacidad:</p>
          <ul className="list-none space-y-1 mt-2">
            <li>
              <strong>Email:</strong> privacy@world3d.com
            </li>
            <li>
              <strong>DPO:</strong> dpo@world3d.com
            </li>
            <li>
              <strong>Dirección:</strong> Madrid, España
            </li>
          </ul>
        </section>
      </div>
    </LegalLayout>
  )
}
