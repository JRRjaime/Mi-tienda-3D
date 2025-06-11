"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreatorUploadSection } from "@/components/creator/creator-upload-section"
import { useStats } from "@/contexts/stats-context"
import { Upload, Eye, Download, DollarSign, Search } from "lucide-react"

export function CreatorModels() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [showUpload, setShowUpload] = useState(false)
  const { stats } = useStats()

  // Modelos de ejemplo (en producción vendrían de una API)
  const userModels = []

  const sortOptions = [
    { value: "newest", label: "Más Recientes" },
    { value: "popular", label: "Más Populares" },
    { value: "earnings", label: "Mayores Ganancias" },
    { value: "downloads", label: "Más Descargados" },
  ]

  return (
    <div className="space-y-6">
      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Modelos Subidos</p>
                <p className="text-2xl font-bold">{stats.modelsUploaded}</p>
              </div>
              <Upload className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Descargas</p>
                <p className="text-2xl font-bold">{stats.totalDownloads}</p>
              </div>
              <Download className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Ganancias Totales</p>
                <p className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Total Vistas</p>
                <p className="text-2xl font-bold">{stats.totalViews}</p>
              </div>
              <Eye className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Subida o Lista de Modelos */}
      {stats.modelsUploaded === 0 ? (
        <CreatorUploadSection />
      ) : (
        <div className="space-y-6">
          {/* Header con controles */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Mis Modelos 3D</h2>
              <p className="text-gray-400">Gestiona tus creaciones y ve su rendimiento</p>
            </div>
            <Button
              onClick={() => setShowUpload(!showUpload)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir Nuevo Modelo
            </Button>
          </div>

          {/* Formulario de subida */}
          {showUpload && (
            <div className="border border-gray-700 rounded-lg p-6 bg-gray-800/30">
              <CreatorUploadSection />
            </div>
          )}

          {/* Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar en mis modelos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lista de modelos */}
          {userModels.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-12 text-center">
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">¡Sube tu primer modelo!</h3>
                <p className="text-gray-400 mb-6">
                  Comienza a compartir tus creaciones 3D con la comunidad y genera ingresos.
                </p>
                <Button
                  onClick={() => setShowUpload(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Primer Modelo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Aquí irían los modelos del usuario */}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
