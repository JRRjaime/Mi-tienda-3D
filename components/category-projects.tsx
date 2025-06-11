"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Download, Star, Eye, Search, Edit, Trash2, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

interface CategoryProjectsProps {
  categoria: string
}

// Simular usuario logueado
const currentUser = {
  name: "Carlos Mendez",
  isLoggedIn: true,
  profileTypes: ["creador", "usuario"],
}

// Datos expandidos de proyectos con más variedad
const allProjects = [
  {
    id: 1,
    title: "Figura de Dragon Ball Z - Goku Super Saiyan",
    description: "Figura coleccionable de Goku en pose de combate, impresa en PLA con detalles pintados a mano",
    image: "/placeholder.svg?height=300&width=300",
    author: "Carlos Mendez", // Este es del usuario actual
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 234,
    comments: 45,
    downloads: 1200,
    rating: 4.8,
    views: 5600,
    tags: ["Dragon Ball", "Anime", "Coleccionable", "Goku"],
    difficulty: "Intermedio",
    printTime: "8 horas",
    material: "PLA",
    price: 12.99,
    category: "figuras-accion",
    status: "published",
    earnings: 156.88,
    isOwner: true, // Indica que es del usuario actual
  },
  {
    id: 2,
    title: "Figura de Naruto - Modo Sabio",
    description: "Figura detallada de Naruto en modo sabio con efectos de chakra",
    image: "/placeholder.svg?height=300&width=300",
    author: "Ana Rodriguez",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 189,
    comments: 32,
    downloads: 890,
    rating: 4.7,
    views: 4200,
    tags: ["Naruto", "Anime", "Figura", "Chakra"],
    difficulty: "Avanzado",
    printTime: "10 horas",
    material: "PLA",
    price: 15.99,
    category: "figuras-accion",
    status: "published",
    isOwner: false,
  },
  {
    id: 3,
    title: "Modelo 3D Decorativo - Jarrón Geométrico",
    description: "Elegante jarrón con diseño geométrico moderno para decoración",
    image: "/placeholder.svg?height=300&width=300",
    author: "Carlos Mendez", // Otro modelo del usuario actual
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 156,
    comments: 28,
    downloads: 890,
    rating: 4.7,
    views: 3400,
    tags: ["Decoración", "Geométrico", "Jarrón", "Moderno"],
    difficulty: "Fácil",
    printTime: "3 horas",
    material: "PLA",
    price: 8.5,
    category: "modelos-decorativos",
    status: "published",
    earnings: 75.65,
    isOwner: true,
  },
  {
    id: 4,
    title: "Engranaje Industrial Personalizado",
    description: "Engranaje de precisión para maquinaria industrial, diseñado con tolerancias específicas",
    image: "/placeholder.svg?height=300&width=300",
    author: "Luis García",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 89,
    comments: 12,
    downloads: 456,
    rating: 4.9,
    views: 2100,
    tags: ["Industrial", "Mecánico", "Precisión", "Engranaje"],
    difficulty: "Avanzado",
    printTime: "4 horas",
    material: "PETG",
    price: 25.0,
    category: "prototipos-industriales",
    status: "published",
    isOwner: false,
  },
  {
    id: 5,
    title: "Organizador de Escritorio Modular",
    description: "Sistema modular de organización para escritorio con compartimentos personalizables",
    image: "/placeholder.svg?height=300&width=300",
    author: "Sofia Martinez",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 312,
    comments: 67,
    downloads: 1500,
    rating: 4.6,
    views: 6800,
    tags: ["Hogar", "Organización", "Modular", "Escritorio"],
    difficulty: "Fácil",
    printTime: "3 horas",
    material: "PLA",
    price: 6.99,
    category: "hogar-organizacion",
    status: "published",
    isOwner: false,
  },
  {
    id: 6,
    title: "Anillo de Compromiso Personalizado",
    description: "Elegante anillo con diseño personalizable y grabado opcional",
    image: "/placeholder.svg?height=300&width=300",
    author: "Elena Ruiz",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 445,
    comments: 89,
    downloads: 234,
    rating: 4.9,
    views: 3200,
    tags: ["Joyería", "Anillo", "Personalizado", "Compromiso"],
    difficulty: "Intermedio",
    printTime: "2 horas",
    material: "Resina",
    price: 18.99,
    category: "joyeria-accesorios",
    status: "published",
    isOwner: false,
  },
  {
    id: 7,
    title: "Prototipo de Drone - En Revisión",
    description: "Modelo de drone personalizado para pruebas aerodinámicas",
    image: "/placeholder.svg?height=300&width=300",
    author: "Carlos Mendez", // Modelo pendiente del usuario actual
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 12,
    comments: 3,
    downloads: 0,
    rating: 0,
    views: 45,
    tags: ["Drone", "Prototipo", "Aerodinámico", "Tecnología"],
    difficulty: "Avanzado",
    printTime: "6 horas",
    material: "PETG",
    price: 22.99,
    category: "prototipos-industriales",
    status: "pending",
    earnings: 0,
    isOwner: true,
  },
]

export function CategoryProjects({ categoria }: CategoryProjectsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [showOnlyMyModels, setShowOnlyMyModels] = useState(false)

  const isCreator = currentUser.profileTypes.includes("creador")

  const { addItem } = useCart()
  const { toast } = useToast()

  const filteredProjects = useMemo(() => {
    let filtered = allProjects.filter((project) => project.category === categoria)

    // Filtrar solo mis modelos si está activado
    if (showOnlyMyModels && isCreator) {
      filtered = filtered.filter((project) => project.isOwner)
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Ordenar
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.downloads - a.downloads)
        break
      case "recent":
        filtered.sort((a, b) => b.id - a.id)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    return filtered
  }, [categoria, searchQuery, sortBy, showOnlyMyModels, isCreator])

  const myModelsCount = allProjects.filter((project) => project.category === categoria && project.isOwner).length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Publicado</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">En Revisión</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rechazado</Badge>
      default:
        return <Badge variant="secondary">Borrador</Badge>
    }
  }

  const handleBuyProduct = (project: any) => {
    const cartItem = {
      id: project.id.toString(),
      name: project.title,
      description: project.description,
      price: project.price,
      type: project.category.includes("download") ? "download" : ("printed" as "download" | "printed"),
      image: project.image,
      creatorName: project.author,
      creatorId: project.author.toLowerCase().replace(" ", ""),
      category: project.category,
      tags: project.tags,
      downloadFormat: ["STL", "OBJ", "3MF"],
    }

    addItem(cartItem)
    toast({
      title: "Producto añadido",
      description: `${project.title} se ha añadido al carrito`,
    })
  }

  return (
    <div className="space-y-8">
      {/* Barra de búsqueda local */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar en esta categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-cyan-400"
          />
        </div>

        {/* Filtro para creadores */}
        {isCreator && myModelsCount > 0 && (
          <Button
            variant={showOnlyMyModels ? "default" : "outline"}
            onClick={() => setShowOnlyMyModels(!showOnlyMyModels)}
            className={
              showOnlyMyModels
                ? "bg-purple-500 hover:bg-purple-600"
                : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
            }
          >
            Mis Modelos ({myModelsCount})
          </Button>
        )}
      </div>

      {/* Filtros y ordenamiento */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={sortBy === "popular" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("popular")}
            className={sortBy === "popular" ? "bg-cyan-500" : "border-white/20 text-white hover:bg-white/10"}
          >
            Más populares
          </Button>
          <Button
            variant={sortBy === "recent" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("recent")}
            className={sortBy === "recent" ? "bg-cyan-500" : "border-white/20 text-white hover:bg-white/10"}
          >
            Más recientes
          </Button>
          <Button
            variant={sortBy === "rating" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("rating")}
            className={sortBy === "rating" ? "bg-cyan-500" : "border-white/20 text-white hover:bg-white/10"}
          >
            Mejor valorados
          </Button>
          <Button
            variant={sortBy === "price-low" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("price-low")}
            className={sortBy === "price-low" ? "bg-cyan-500" : "border-white/20 text-white hover:bg-white/10"}
          >
            Precio: Menor
          </Button>
          <Button
            variant={sortBy === "price-high" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("price-high")}
            className={sortBy === "price-high" ? "bg-cyan-500" : "border-white/20 text-white hover:bg-white/10"}
          >
            Precio: Mayor
          </Button>
        </div>
        <div className="text-gray-400 text-sm">
          Mostrando {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? "s" : ""}
          {showOnlyMyModels && " (solo mis modelos)"}
        </div>
      </div>

      {/* Grid de proyectos */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className={`group overflow-hidden backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                project.isOwner
                  ? "bg-purple-500/10 border-purple-400/30 hover:border-purple-400/50"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="relative">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {project.isOwner && getStatusBadge(project.status)}
                  {!project.isOwner && <Badge className="bg-black/50 text-white">{project.difficulty}</Badge>}
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white text-sm">
                  <Eye className="h-4 w-4" />
                  <span>{project.views.toLocaleString()}</span>
                </div>
                {project.isOwner && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-purple-500">Mi Modelo</Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle
                    className={`text-lg line-clamp-2 transition-colors ${
                      project.isOwner
                        ? "text-purple-300 group-hover:text-purple-200"
                        : "text-white group-hover:text-cyan-400"
                    }`}
                  >
                    {project.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {project.status === "published" && (
                      <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{project.rating}</span>
                      </div>
                    )}
                    {project.isOwner && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
                <CardDescription className="text-gray-300 line-clamp-2">{project.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Autor */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={project.authorAvatar || "/placeholder.svg"} />
                    <AvatarFallback>{project.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className={project.isOwner ? "text-purple-300 text-sm" : "text-gray-400 text-sm"}>
                    {project.author}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={
                        project.isOwner
                          ? "text-xs text-purple-400 border-purple-400/30"
                          : "text-xs text-cyan-400 border-cyan-400/30"
                      }
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Detalles técnicos */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <div>Tiempo: {project.printTime}</div>
                  <div>Material: {project.material}</div>
                </div>

                {/* Precio y ganancias */}
                <div className="flex items-center justify-between">
                  <div className={`text-2xl font-bold ${project.isOwner ? "text-purple-400" : "text-cyan-400"}`}>
                    ${project.price}
                  </div>
                  {project.isOwner && project.earnings > 0 && (
                    <div className="text-sm text-green-400">Ganado: ${project.earnings.toFixed(2)}</div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-center gap-4 text-gray-400">
                    <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">{project.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{project.comments}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span className="text-sm">{project.downloads}</span>
                    </div>
                  </div>
                  {project.isOwner ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                    >
                      Ver Estadísticas
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleBuyProduct(project)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    >
                      Comprar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            {showOnlyMyModels ? "No tienes modelos en esta categoría" : "No se encontraron proyectos"}
          </div>
          <p className="text-gray-500 mb-6">
            {showOnlyMyModels
              ? "Sube tu primer modelo en esta categoría para comenzar"
              : "Intenta ajustar tu búsqueda o explora otras categorías"}
          </p>
          <div className="flex gap-4 justify-center">
            {showOnlyMyModels ? (
              <>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500">Subir Modelo</Button>
                <Button
                  onClick={() => setShowOnlyMyModels(false)}
                  variant="outline"
                  className="border-white/20 text-white"
                >
                  Ver Todos los Modelos
                </Button>
              </>
            ) : (
              <Button onClick={() => setSearchQuery("")} className="bg-gradient-to-r from-cyan-500 to-blue-500">
                Limpiar búsqueda
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
