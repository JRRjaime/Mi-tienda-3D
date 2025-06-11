"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Star, Eye, ShoppingBag, Calendar, DollarSign } from "lucide-react"

const userPurchases = [
  {
    id: "PUR-001",
    modelName: "Figura Dragon Ball Z - Vegeta",
    description: "Figura coleccionable de Vegeta en pose de combate",
    image: "/placeholder.svg?height=200&width=200",
    author: "Carlos Mendez",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    price: 12.99,
    purchaseDate: "2024-01-15",
    downloadCount: 3,
    rating: 4.8,
    category: "Figuras de Colección",
    fileFormats: ["STL", "OBJ"],
    status: "completed",
  },
  {
    id: "PUR-002",
    modelName: "Organizador Modular de Herramientas",
    description: "Sistema modular para organizar herramientas de trabajo",
    image: "/placeholder.svg?height=200&width=200",
    author: "Ana Rodriguez",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    price: 8.5,
    purchaseDate: "2024-01-12",
    downloadCount: 1,
    rating: 4.7,
    category: "Hogar y Decoración",
    fileFormats: ["STL"],
    status: "completed",
  },
  {
    id: "PUR-003",
    modelName: "Miniatura de Casa Moderna",
    description: "Modelo arquitectónico de casa moderna para maquetas",
    image: "/placeholder.svg?height=200&width=200",
    author: "Miguel Torres",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    price: 15.0,
    purchaseDate: "2024-01-10",
    downloadCount: 2,
    rating: 4.9,
    category: "Arquitectura",
    fileFormats: ["STL", "OBJ", "3MF"],
    status: "completed",
  },
  {
    id: "PUR-004",
    modelName: "Engranaje Industrial Personalizado",
    description: "Engranaje de precisión para maquinaria industrial",
    image: "/placeholder.svg?height=200&width=200",
    author: "Luis García",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    price: 25.0,
    purchaseDate: "2024-01-08",
    downloadCount: 0,
    rating: 4.6,
    category: "Industrial",
    fileFormats: ["STL", "STEP"],
    status: "processing",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500">Completado</Badge>
    case "processing":
      return <Badge className="bg-yellow-500">Procesando</Badge>
    case "failed":
      return <Badge className="bg-red-500">Fallido</Badge>
    default:
      return <Badge variant="secondary">Desconocido</Badge>
  }
}

export function UserPurchases() {
  const totalSpent = userPurchases.reduce((sum, purchase) => sum + purchase.price, 0)
  const completedPurchases = userPurchases.filter((purchase) => purchase.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Estadísticas de compras */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Gastado</CardTitle>
            <DollarSign className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-white/80">En {userPurchases.length} compras</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Compras Completadas</CardTitle>
            <ShoppingBag className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{completedPurchases}</div>
            <p className="text-xs text-gray-400">De {userPurchases.length} totales</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Descargas Totales</CardTitle>
            <Download className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">
              {userPurchases.reduce((sum, purchase) => sum + purchase.downloadCount, 0)}
            </div>
            <p className="text-xs text-gray-400">Archivos descargados</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de compras */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Historial de Compras
          </CardTitle>
          <CardDescription className="text-gray-300">Modelos 3D que has adquirido</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userPurchases.map((purchase) => (
              <Card key={purchase.id} className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Imagen del modelo */}
                    <div className="flex-shrink-0">
                      <img
                        src={purchase.image || "/placeholder.svg"}
                        alt={purchase.modelName}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Información del modelo */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{purchase.modelName}</h3>
                          <p className="text-gray-400 text-sm">{purchase.description}</p>
                          <Badge variant="outline" className="mt-2 text-cyan-400 border-cyan-400/30">
                            {purchase.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(purchase.status)}
                          <div className="text-2xl font-bold text-cyan-400 mt-2">${purchase.price.toFixed(2)}</div>
                        </div>
                      </div>

                      {/* Información del autor */}
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={purchase.authorAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{purchase.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-gray-400 text-sm">Creado por </span>
                          <span className="text-white text-sm font-medium">{purchase.author}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 text-sm">
                          <Star className="h-4 w-4 fill-current" />
                          <span>{purchase.rating}</span>
                        </div>
                      </div>

                      {/* Detalles de la compra */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-400">Comprado: </span>
                          <span className="text-white">{purchase.purchaseDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-400">Descargas: </span>
                          <span className="text-white">{purchase.downloadCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-400">Formatos: </span>
                          <span className="text-white">{purchase.fileFormats.join(", ")}</span>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex gap-2 pt-4 border-t border-white/10">
                        {purchase.status === "completed" ? (
                          <>
                            <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                              <Download className="h-4 w-4 mr-2" />
                              Descargar Archivos
                            </Button>
                            <Button
                              variant="outline"
                              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                            >
                              Ver Detalles
                            </Button>
                          </>
                        ) : purchase.status === "processing" ? (
                          <Button disabled className="bg-gray-500">
                            Procesando Compra...
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                          >
                            Reintentar Compra
                          </Button>
                        )}
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          Contactar Vendedor
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
