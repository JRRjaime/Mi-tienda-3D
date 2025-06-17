import { LegalLayout } from "@/components/legal/legal-layout"
import { FileText } from "lucide-react"

export default function TerminosPage() {
  return (
    <LegalLayout
      title="Términos de Uso"
      description="Condiciones de uso de la plataforma World 3D"
      lastUpdated="17 de Junio de 2025"
      icon={<FileText className="h-8 w-8" />}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar World 3D ("la Plataforma"), aceptas estar sujeto a estos Términos de Uso. Si no estás
            de acuerdo con alguna parte de estos términos, no debes usar nuestros servicios.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Descripción del Servicio</h2>
          <p>
            World 3D es una plataforma digital que conecta creadores de modelos 3D, impresores y usuarios finales.
            Facilitamos:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Compra y venta de modelos 3D digitales</li>
            <li>Servicios de impresión 3D</li>
            <li>Herramientas de colaboración y gestión</li>
            <li>Procesamiento de pagos seguros</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Cuentas de Usuario</h2>
          <h3 className="text-lg font-semibold mb-2">3.1 Registro</h3>
          <p>Para usar ciertos servicios, debes crear una cuenta proporcionando información precisa y actualizada.</p>

          <h3 className="text-lg font-semibold mb-2 mt-4">3.2 Tipos de Usuario</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Creadores:</strong> Usuarios que suben y venden modelos 3D
            </li>
            <li>
              <strong>Impresores:</strong> Usuarios que ofrecen servicios de impresión
            </li>
            <li>
              <strong>Compradores:</strong> Usuarios que adquieren modelos o servicios
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-2 mt-4">3.3 Responsabilidades</h3>
          <p>Eres responsable de:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Mantener la confidencialidad de tu cuenta</li>
            <li>Todas las actividades realizadas bajo tu cuenta</li>
            <li>Notificar inmediatamente cualquier uso no autorizado</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Contenido y Propiedad Intelectual</h2>
          <h3 className="text-lg font-semibold mb-2">4.1 Contenido del Usuario</h3>
          <p>Al subir contenido a la plataforma, declaras que:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Posees todos los derechos necesarios sobre el contenido</li>
            <li>El contenido no infringe derechos de terceros</li>
            <li>El contenido cumple con nuestras políticas de calidad</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2 mt-4">4.2 Licencias</h3>
          <p>Los modelos 3D se venden bajo diferentes tipos de licencia:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Uso Personal:</strong> Solo para uso no comercial
            </li>
            <li>
              <strong>Uso Comercial:</strong> Permite uso comercial limitado
            </li>
            <li>
              <strong>Licencia Extendida:</strong> Uso comercial completo
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Pagos y Comisiones</h2>
          <h3 className="text-lg font-semibold mb-2">5.1 Procesamiento de Pagos</h3>
          <p>Los pagos se procesan a través de Stripe. Al realizar una compra, aceptas los términos de Stripe.</p>

          <h3 className="text-lg font-semibold mb-2 mt-4">5.2 Comisiones de la Plataforma</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Creadores: 15% de comisión por venta</li>
            <li>Impresores: 10% de comisión por servicio</li>
            <li>Las comisiones pueden cambiar con 30 días de aviso</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2 mt-4">5.3 Reembolsos</h3>
          <p>Los reembolsos se procesan según nuestra política de reembolsos, disponible en el centro de ayuda.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Conducta Prohibida</h2>
          <p>Está prohibido:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Subir contenido que infrinja derechos de autor</li>
            <li>Crear cuentas falsas o múltiples</li>
            <li>Manipular el sistema de calificaciones</li>
            <li>Usar la plataforma para actividades ilegales</li>
            <li>Acosar o amenazar a otros usuarios</li>
            <li>Intentar acceder a cuentas de otros usuarios</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Terminación</h2>
          <p>
            Podemos suspender o terminar tu cuenta si violas estos términos. Tú puedes cancelar tu cuenta en cualquier
            momento desde la configuración.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. Limitación de Responsabilidad</h2>
          <p>
            World 3D no será responsable por daños indirectos, incidentales o consecuentes que surjan del uso de la
            plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">9. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios significativos se
            notificarán con 30 días de anticipación.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">10. Contacto</h2>
          <p>Para preguntas sobre estos términos, contáctanos en:</p>
          <ul className="list-none space-y-1 mt-2">
            <li>
              <strong>Email:</strong> legal@world3d.com
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
