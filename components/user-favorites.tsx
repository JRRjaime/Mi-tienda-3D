"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Download, Star, Eye, Trash2 } from "lucide-react"

const favoriteProjects = [
  {
    id: 1,
    title: "Figura de Dragon Ball Z - Vegeta",
    description: "Figura coleccionable de Vegeta en pose de combate",
    image: "/placeholder.svg?height=200&width=200",
    author: "Carlos Mendez",
    rating: 4.9,
    downloads: 2500,
    views: 8900,
    tags: ["Dragon Ball", "Anime", "Coleccionable"],
    price: 12.99,
    addedToFavorites: "2024-01-15",
  },
  {
    id: 2,
    title: "Organizador Modular de Herramientas",
    description: "Sistema modular para organizar herramientas de trabajo",
    image: "/placeholder.svg?height=200&width=200",
    author: "Ana Rodriguez",
    rating: 4.7,
    downloads: 1200,
    views: 3400,
    tags: ["Hogar", "Organización", "Herramientas"],
    price: 8.5,
    addedToFavorites: "2024-01-12",
  },
  {
    id: 3,
    title: "Miniatura de Casa Moderna",
    description: "Modelo arquitectónico de casa moderna para maquetas",
    image: "/placeholder.svg?height=200&width=200",
    author: "Miguel Torres",
    rating: 4.8,
    downloads: 890,
    views: 2100,
    tags: ["Arquitectura", "Miniatura", "Maqueta"],
    price: 15.0,
    addedToFavorites: "2024-01-10",
  },
]

export function UserFavorites() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-400" />
            Mis Favoritos
          </CardTitle>
          <CardDescription className="text-gray-300">Modelos que has guardado como favoritos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProjects.map((project) => (
              <Card
                key={project.id}
                className="group bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-red-500 text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white text-sm">
                    <Eye className="h-4 w-4" />
                    <span>{project.views.toLocaleString()}</span>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300 line-clamp-2">{project.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">por {project.author}</span>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{project.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs text-cyan-400 border-cyan-400/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-cyan-400">${project.price}</div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Download className="h-4 w-4" />
                      <span>{project.downloads}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                      Comprar
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Ver Detalles
                    </Button>
                  </div>

                  <div className="text-xs text-gray-400 text-center">Agregado el {project.addedToFavorites}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
