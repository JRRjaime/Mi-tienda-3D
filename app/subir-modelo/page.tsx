import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload } from "lucide-react"

export default function UploadModelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Subir Modelo 3D
            </h1>
            <p className="text-gray-400">Comparte tu creación con la comunidad</p>
          </div>
        </div>

        {/* Upload Form */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Subir Archivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white mb-2">Arrastra tu archivo aquí o haz clic para seleccionar</p>
              <p className="text-gray-400 text-sm">Formatos soportados: STL, OBJ, PLY (máx. 50MB)</p>
              <Button className="mt-4 bg-cyan-600 hover:bg-cyan-700">Seleccionar Archivo</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Título del Modelo *</label>
                <input
                  type="text"
                  placeholder="Ej: Figura de Goku"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Categoría *</label>
                <select className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  <option value="">Seleccionar categoría</option>
                  <option value="anime">Anime & Manga</option>
                  <option value="decoracion">Decoración</option>
                  <option value="juguetes">Juguetes</option>
                  <option value="herramientas">Herramientas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Descripción</label>
              <textarea
                rows={4}
                placeholder="Describe tu modelo, materiales recomendados, configuraciones de impresión..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Precio (€)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Licencia</label>
                <select className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  <option value="personal">Uso Personal</option>
                  <option value="commercial">Uso Comercial</option>
                  <option value="creative-commons">Creative Commons</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Dificultad</label>
                <select className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  <option value="facil">Fácil</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <Upload className="h-4 w-4 mr-2" />
                Subir Modelo
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Guardar Borrador
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
