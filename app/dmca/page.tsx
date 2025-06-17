import { LegalLayout } from "@/components/legal/legal-layout"
import { Copyright } from "lucide-react"

export default function DMCAPage() {
  return (
    <LegalLayout
      title="Política DMCA"
      description="Procedimiento para reportar infracciones de derechos de autor"
      lastUpdated="17 de Junio de 2025"
      icon={<Copyright className="h-8 w-8" />}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Política de Derechos de Autor</h2>
          <p>
            World 3D respeta los derechos de propiedad intelectual y espera que nuestros usuarios hagan lo mismo.
            Cumplimos con la Digital Millennium Copyright Act (DMCA) y respondemos rápidamente a notificaciones válidas
            de infracción de derechos de autor.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Cómo Reportar una Infracción</h2>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">
              ⚠️ Antes de Enviar una Notificación DMCA
            </h3>
            <p className="text-red-700 dark:text-red-300">
              Las notificaciones DMCA falsas pueden tener consecuencias legales. Asegúrate de que realmente posees los
              derechos de autor o estás autorizado para actuar en nombre del propietario.
            </p>
          </div>

          <h3 className="text-lg font-semibold mb-3">Información Requerida</h3>
          <p className="mb-4">Tu notificación DMCA debe incluir:</p>

          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong>Identificación del trabajo protegido:</strong>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Descripción detallada del trabajo original</li>
                <li>URL o ubicación del trabajo original (si está disponible online)</li>
                <li>Número de registro de derechos de autor (si aplica)</li>
              </ul>
            </li>

            <li>
              <strong>Identificación del material infractor:</strong>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>URL exacta del modelo 3D en nuestra plataforma</li>
                <li>Nombre del archivo o título del modelo</li>
                <li>Nombre de usuario del presunto infractor</li>
                <li>Descripción específica de la infracción</li>
              </ul>
            </li>

            <li>
              <strong>Información de contacto:</strong>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Tu nombre completo</li>
                <li>Dirección postal completa</li>
                <li>Número de teléfono</li>
                <li>Dirección de email</li>
              </ul>
            </li>

            <li>
              <strong>Declaraciones requeridas:</strong>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Declaración de buena fe de que el uso no está autorizado</li>
                <li>Declaración de que la información es precisa</li>
                <li>Declaración bajo pena de perjurio de que estás autorizado</li>
              </ul>
            </li>

            <li>
              <strong>Firma:</strong>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Firma física o electrónica del propietario de los derechos</li>
                <li>O firma de la persona autorizada para actuar en su nombre</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Cómo Enviar tu Notificación</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">📧 Por Email (Recomendado)</h3>
              <p className="text-blue-700 dark:text-blue-300 mb-2">Envía tu notificación completa a:</p>
              <p className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded">dmca@world3d.com</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                Asunto: "Notificación DMCA - [Nombre del modelo]"
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3">📮 Por Correo Postal</h3>
              <p className="text-green-700 dark:text-green-300 mb-2">Envía tu notificación a:</p>
              <div className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded">
                World 3D - Agente DMCA
                <br />
                Madrid, España
                <br />
                [Dirección completa]
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Nuestro Proceso de Respuesta</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Revisión Inicial (24-48 horas)</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Verificamos que la notificación cumple con los requisitos DMCA
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Acción Inmediata</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Si la notificación es válida, removemos o deshabilitamos el contenido inmediatamente
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Notificación al Usuario</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Informamos al usuario afectado sobre la reclamación y sus opciones
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Seguimiento</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Te mantenemos informado sobre el estado de tu reclamación
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Contranotificación (Counter-Notice)</h2>
          <p className="mb-4">
            Si crees que tu contenido fue removido por error, puedes enviar una contranotificación que debe incluir:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Tu información de contacto completa</li>
            <li>Identificación del material removido y su ubicación anterior</li>
            <li>Declaración bajo pena de perjurio de que crees que la remoción fue errónea</li>
            <li>Consentimiento a la jurisdicción del tribunal federal</li>
            <li>Tu firma física o electrónica</li>
          </ul>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mt-4">
            <p className="text-yellow-800 dark:text-yellow-200">
              <strong>Nota:</strong> Después de recibir una contranotificación válida, podemos restaurar el contenido en
              10-14 días hábiles, a menos que el reclamante original inicie una acción legal.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Política de Infractores Reincidentes</h2>
          <p className="mb-4">Tomamos en serio las infracciones repetidas de derechos de autor:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Primera infracción:</strong> Advertencia y remoción del contenido
            </li>
            <li>
              <strong>Segunda infracción:</strong> Suspensión temporal de la cuenta (7 días)
            </li>
            <li>
              <strong>Tercera infracción:</strong> Suspensión temporal extendida (30 días)
            </li>
            <li>
              <strong>Infracciones adicionales:</strong> Terminación permanente de la cuenta
            </li>
          </ul>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg mt-4">
            <p className="text-red-800 dark:text-red-200">
              <strong>Importante:</strong> Los usuarios con cuentas terminadas por infracciones de derechos de autor no
              pueden crear nuevas cuentas en la plataforma.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Recursos Adicionales</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">📚 Información Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.copyright.gov/dmca/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Texto completo de la DMCA
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.copyright.gov/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Oficina de Derechos de Autor de EE.UU.
                  </a>
                </li>
                <li>
                  <a href="/licencias" className="text-blue-600 hover:underline">
                    Nuestras políticas de licencias
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">🤝 Soporte</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/contacto" className="text-blue-600 hover:underline">
                    Contactar soporte legal
                  </a>
                </li>
                <li>
                  <a href="/ayuda" className="text-blue-600 hover:underline">
                    Centro de ayuda
                  </a>
                </li>
                <li>
                  <a href="/foro" className="text-blue-600 hover:underline">
                    Foro de la comunidad
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Contacto del Agente DMCA</h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Agente Designado para Notificaciones DMCA</h3>
            <div className="space-y-2">
              <p>
                <strong>Nombre:</strong> Agente Legal World 3D
              </p>
              <p>
                <strong>Email:</strong> dmca@world3d.com
              </p>
              <p>
                <strong>Teléfono:</strong> +34 900 123 456
              </p>
              <p>
                <strong>Dirección:</strong>
              </p>
              <div className="ml-4">
                World 3D Legal Department
                <br />
                Calle Ejemplo, 123
                <br />
                28001 Madrid, España
              </div>
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  )
}
