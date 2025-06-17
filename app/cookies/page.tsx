import { LegalLayout } from "@/components/legal/legal-layout"
import { Cookie } from "lucide-react"

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Política de Cookies"
      description="Información sobre el uso de cookies en World 3D"
      lastUpdated="17 de Junio de 2025"
      icon={<Cookie className="h-8 w-8" />}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">¿Qué son las Cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web.
            Nos ayudan a mejorar tu experiencia recordando tus preferencias y proporcionando funcionalidades
            personalizadas.
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Tipos de Cookies que Utilizamos</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">🍪 Cookies Esenciales</h3>
              <p className="mb-2">
                <strong>Propósito:</strong> Necesarias para el funcionamiento básico del sitio
              </p>
              <p className="mb-2">
                <strong>Duración:</strong> Sesión o hasta 1 año
              </p>
              <p className="mb-2">
                <strong>Ejemplos:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Mantener tu sesión iniciada</li>
                <li>Recordar items en tu carrito</li>
                <li>Configuraciones de seguridad</li>
                <li>Preferencias de idioma</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                ⚠️ Estas cookies no se pueden desactivar sin afectar la funcionalidad del sitio.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">📊 Cookies de Análisis</h3>
              <p className="mb-2">
                <strong>Propósito:</strong> Entender cómo usas la plataforma para mejorarla
              </p>
              <p className="mb-2">
                <strong>Duración:</strong> Hasta 2 años
              </p>
              <p className="mb-2">
                <strong>Información recopilada:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Páginas visitadas y tiempo de permanencia</li>
                <li>Rutas de navegación</li>
                <li>Errores técnicos</li>
                <li>Rendimiento del sitio</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                ✅ Puedes desactivar estas cookies en tus preferencias.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-2">
                🎯 Cookies de Personalización
              </h3>
              <p className="mb-2">
                <strong>Propósito:</strong> Personalizar tu experiencia en la plataforma
              </p>
              <p className="mb-2">
                <strong>Duración:</strong> Hasta 1 año
              </p>
              <p className="mb-2">
                <strong>Funcionalidades:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Tema oscuro/claro preferido</li>
                <li>Recomendaciones de modelos 3D</li>
                <li>Filtros y ordenación guardados</li>
                <li>Configuración de notificaciones</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                ✅ Puedes desactivar estas cookies, pero perderás personalización.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400 mb-2">
                📢 Cookies de Marketing
              </h3>
              <p className="mb-2">
                <strong>Propósito:</strong> Mostrar contenido y anuncios relevantes
              </p>
              <p className="mb-2">
                <strong>Duración:</strong> Hasta 1 año
              </p>
              <p className="mb-2">
                <strong>Usos:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Seguimiento de conversiones</li>
                <li>Retargeting en otras plataformas</li>
                <li>Medición de efectividad publicitaria</li>
                <li>Contenido promocional personalizado</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                ✅ Puedes desactivar estas cookies completamente.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Cookies de Terceros</h2>
          <p className="mb-4">Algunos servicios externos que utilizamos también establecen cookies:</p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Servicio</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Propósito</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Política</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">
                    <strong>Stripe</strong>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">
                    Procesamiento de pagos y prevención de fraude
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">
                    <a
                      href="https://stripe.com/privacy"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver política
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">
                    <strong>Google Analytics</strong>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">
                    Análisis de uso y rendimiento del sitio
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">
                    <a
                      href="https://policies.google.com/privacy"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver política
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">
                    <strong>Supabase</strong>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">
                    Autenticación y almacenamiento de datos
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 p-3">
                    <a
                      href="https://supabase.com/privacy"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver política
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Gestionar tus Preferencias de Cookies</h2>

          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🔧 En la Plataforma</h3>
              <p className="mb-2">Puedes gestionar tus preferencias de cookies directamente en la plataforma:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Ve a <strong>Configuración → Privacidad → Cookies</strong>
                </li>
                <li>Activa/desactiva categorías específicas</li>
                <li>Los cambios se aplican inmediatamente</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🌐 En tu Navegador</h3>
              <p className="mb-2">También puedes controlar cookies desde tu navegador:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies
                </li>
                <li>
                  <strong>Firefox:</strong> Preferencias → Privacidad y seguridad
                </li>
                <li>
                  <strong>Safari:</strong> Preferencias → Privacidad
                </li>
                <li>
                  <strong>Edge:</strong> Configuración → Cookies y permisos del sitio
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">⚠️ Importante</h3>
              <p>
                Desactivar ciertas cookies puede afectar la funcionalidad del sitio. Las cookies esenciales no se pueden
                desactivar sin impactar tu experiencia.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Actualizaciones de esta Política</h2>
          <p>
            Esta política de cookies puede actualizarse ocasionalmente para reflejar cambios en nuestras prácticas o por
            razones legales. Te notificaremos de cambios significativos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Contacto</h2>
          <p>Si tienes preguntas sobre nuestro uso de cookies:</p>
          <ul className="list-none space-y-1 mt-2">
            <li>
              <strong>Email:</strong> cookies@world3d.com
            </li>
            <li>
              <strong>Soporte:</strong> Configuración → Ayuda → Contactar
            </li>
          </ul>
        </section>
      </div>
    </LegalLayout>
  )
}
