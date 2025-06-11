"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Eye, Download, Star, Edit, Trash2, DollarSign } from "lucide-react"

const creatorModels = [
  {
    id: 1,
    title: "Figura Dragon Ball Z - Goku Super Saiyan",
    description: "Figura coleccionable de Goku en pose de combate, impresa en PLA",
    image: "/placeholder.svg?height=200&width=200",
    status: "published",
    rating: 4.8,
    downloads: 1200,
    views: 5600,
    earnings: 234.5,
    price: 12.99,
    uploadDate: "2024-01-10",
    tags: ["Dragon Ball", "Anime", "Coleccionable"],
  },
  {
    id: 2,
    title: "Organizador de Escritorio Modular",
    description: "Sistema modular de organización para escritorio",
    image: "/placeholder.svg?height=200&width=200",
    status: "published",
    rating: 4.7,
    downloads: 890,
    views: 3400,
    earnings: 156.8,
    price: 8.5,
    uploadDate: "2024-01-08",
    tags: ["Hogar", "Organización", "Modular"],
  },
  {
    id: 3,
    title: "Prototipo de Engranaje",
    description: "Engranaje industrial en fase de revisión",
    image: "/placeholder.svg?height=200&width=200",
    status: "pending",
    rating: 0,
    downloads: 0,
    views: 45,
    earnings: 0,
    price: 15.0,
    uploadDate: "2024-01-16",
    tags: ["Industrial", "Prototipo", "Mecánico"],
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "published":
      return <Badge className="bg-green-500">Publicado</Badge>
    case "pending":
      return <Badge className="bg-yellow-500">Pendiente</Badge>
    case "rejected":
      return <Badge className="bg-red-500">Rechazado</Badge>
    default:
      return <Badge variant="secondary">Borrador</Badge>
  }
}

export function CreatorModels() {
  const totalEarnings = creatorModels.reduce((sum, model) => sum + model.earnings, 0)
  const totalDownloads = creatorModels.reduce((sum, model) => sum + model.downloads, 0)
  const publishedModels = creatorModels.filter((model) => model.status === "published").length

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Ganancias Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-white/80">De {totalDownloads} descargas</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Modelos Publicados</CardTitle>
            <Upload className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">{publishedModels}</div>
            <p className="text-xs text-gray-400">De {creatorModels.length} totales</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Descargas Totales</CardTitle>
            <Download className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-gray-400">Este mes: +156</p>
          </CardContent>
        </Card>
      </div>

      {/* Botón para subir nuevo modelo */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold mb-2">¿Tienes un nuevo modelo?</h3>
              <p className="text-gray-400 text-sm">Sube tu creación y comienza a ganar dinero</p>
            </div>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              <Upload className="h-4 w-4 mr-2" />
              Subir Modelo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de modelos */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Mis Modelos</CardTitle>
          <CardDescription className="text-gray-300">Gestiona tus modelos 3D subidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creatorModels.map((model) => (
              <Card
                key={model.id}
                className="group bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={model.image || "/placeholder.svg"}
                    alt={model.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">{getStatusBadge(model.status)}</div>
                  <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white text-sm">
                    <Eye className="h-4 w-4" />
                    <span>{model.views.toLocaleString()}</span>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg line-clamp-2">{model.title}</CardTitle>
                  <CardDescription className="text-gray-300 line-clamp-2">{model.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-cyan-400">${model.price}</div>
                    {model.status === "published" && (
                      <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{model.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {model.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs text-cyan-400 border-cyan-400/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-400">
                      Descargas: <span className="text-white">{model.downloads}</span>
                    </div>
                    <div className="text-gray-400">
                      Ganancias: <span className="text-green-400">${model.earnings.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 border-white/20 text-white hover:bg-white/10">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-xs text-gray-400 text-center">Subido el {model.uploadDate}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
