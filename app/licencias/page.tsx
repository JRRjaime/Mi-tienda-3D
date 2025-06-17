import { LegalLayout } from "@/components/legal/legal-layout"
import { Scale } from "lucide-react"

export default function LicenciasPage() {
  return (
    <LegalLayout
      title="Licencias y Derechos de Uso"
      description="Tipos de licencias para modelos 3D y contenido en la plataforma"
      lastUpdated="17 de Junio de 2025"
      icon={<Scale className="h-8 w-8" />}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Tipos de Licencias para Modelos 3D</h2>
          <p className="mb-6">
            En World 3D, los creadores pueden ofrecer sus modelos bajo diferentes tipos de licencia. Es importante
            entender qué puedes hacer con cada tipo de licencia antes de realizar una compra.
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg">
              <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-3">
                📱 Licencia de Uso Personal
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✅ Permitido:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Imprimir para uso personal</li>
                    <li>Modificar el modelo para uso propio</li>
                    <li>Imprimir hasta 5 copias</li>
                    <li>Regalar impresiones (sin vender)</li>
                    <li>Usar en proyectos educativos</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">❌ Prohibido:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Vender impresiones</li>
                    <li>Uso comercial de cualquier tipo</li>
                    <li>Redistribuir el archivo digital</li>
                    <li>Sublicenciar a terceros</li>
                    <li>Producción en masa</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                <strong>Precio típico:</strong> €5 - €25 por modelo
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-r-lg">
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">
                🏢 Licencia Comercial Básica
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✅ Permitido:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Todo lo de la licencia personal</li>
                    <li>Vender hasta 100 impresiones</li>
                    <li>Uso en proyectos comerciales</li>
                    <li>Modificar para uso comercial</li>
                    <li>Incluir en productos finales</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">❌ Prohibido:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Vender más de 100 unidades</li>
                    <li>Redistribuir archivo digital</li>
                    <li>Sublicenciar a terceros</li>
                    <li>Producción industrial masiva</li>
                    <li>Crear productos derivados para venta</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                <strong>Precio típico:</strong> €25 - €100 por modelo
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-r-lg">
              <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">
                🚀 Licencia Comercial Extendida
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✅ Permitido:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Todo lo de licencias anteriores</li>
                    <li>Ventas ilimitadas</li>
                    <li>Producción industrial</li>
                    <li>Crear productos derivados</li>
                    <li>Sublicenciar a empleados/socios</li>
                    <li>Uso en múltiples proyectos</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">❌ Prohibido:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Redistribuir archivo original</li>
                    <li>Vender como modelo 3D digital</li>
                    <li>Reclamar autoría del diseño</li>
                    <li>Competir directamente con el creador</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                <strong>Precio típico:</strong> €100 - €500+ por modelo
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-6 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-r-lg">
              <h3 className="text-xl font-semibold text-yellow-700 dark:text-yellow-400 mb-3">🎓 Licencia Educativa</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✅ Permitido:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Uso en instituciones educativas</li>
                    <li>Imprimir para estudiantes</li>
                    <li>Modificar para fines pedagógicos</li>
                    <li>Compartir con otros educadores</li>
                    <li>Usar en investigación académica</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">❌ Prohibido:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Uso comercial</li>
                    <li>Vender impresiones</li>
                    <li>Uso fuera del ámbito educativo</li>
                    <li>Redistribuir públicamente</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                <strong>Precio típico:</strong> €2 - €15 por modelo (descuento educativo)
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Licencias de Software y Herramientas</h2>

          <h3 className="text-lg font-semibold mb-3">Herramientas de la Plataforma</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Visor 3D:</strong> Uso gratuito para todos los usuarios
            </li>
            <li>
              <strong>Herramientas de optimización:</strong> Incluidas con suscripción Pro
            </li>
            <li>
              <strong>API de integración:</strong> Licencia comercial separada
            </li>
            <li>
              <strong>Plugins para software 3D:</strong> Licencia MIT (código abierto)
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-3 mt-6">Software de Terceros</h3>
          <p className="mb-3">La plataforma utiliza las siguientes tecnologías bajo sus respectivas licencias:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Three.js:</strong> Licencia MIT
            </li>
            <li>
              <strong>React:</strong> Licencia MIT
            </li>
            <li>
              <strong>Next.js:</strong> Licencia MIT
            </li>
            <li>
              <strong>Tailwind CSS:</strong> Licencia MIT
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Derechos de Autor y Propiedad Intelectual</h2>

          <h3 className="text-lg font-semibold mb-3">Para Creadores</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Mantienes todos los derechos de autor sobre tus creaciones originales</li>
            <li>Otorgas a World 3D una licencia para mostrar y distribuir tu contenido</li>
            <li>Puedes retirar tus modelos en cualquier momento</li>
            <li>Eres responsable de asegurar que tu contenido no infringe derechos de terceros</li>
          </ul>

          <h3 className="text-lg font-semibold mb-3 mt-6">Para Compradores</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Adquieres una licencia de uso, no la propiedad del diseño</li>
            <li>Los derechos están limitados por el tipo de licencia adquirida</li>
            <li>No puedes reclamar autoría del diseño original</li>
            <li>Debes respetar los términos específicos de cada licencia</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Contenido Bajo Creative Commons</h2>
          <p className="mb-4">Algunos creadores pueden optar por licenciar su contenido bajo Creative Commons:</p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">CC BY</span>
              <div>
                <strong>Atribución:</strong> Puedes usar libremente con atribución al autor
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">CC BY-SA</span>
              <div>
                <strong>Atribución-CompartirIgual:</strong> Debes compartir derivados bajo la misma licencia
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">CC BY-NC</span>
              <div>
                <strong>Atribución-NoComercial:</strong> Solo uso no comercial con atribución
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Resolución de Disputas</h2>
          <p className="mb-4">Si surge una disputa sobre licencias o derechos de autor:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Contacta primero directamente con el creador</li>
            <li>Si no se resuelve, usa nuestro sistema de mediación</li>
            <li>Para infracciones graves, consulta nuestro proceso DMCA</li>
            <li>Como último recurso, puede requerirse arbitraje legal</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Contacto Legal</h2>
          <p>Para consultas sobre licencias y derechos:</p>
          <ul className="list-none space-y-1 mt-2">
            <li>
              <strong>Email:</strong> legal@world3d.com
            </li>
            <li>
              <strong>Licencias:</strong> licensing@world3d.com
            </li>
            <li>
              <strong>DMCA:</strong> dmca@world3d.com
            </li>
          </ul>
        </section>
      </div>
    </LegalLayout>
  )
}
