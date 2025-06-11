"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Download, ShoppingCart, Star, Search, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Model3D {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: string
  tags: string[]
  rating: number
  reviews: number
  downloads: number
  likes: number
  author: {
    name: string
    avatar: string
    verified: boolean
  }
  materials: string[]
  difficulty: string
  printTime: string
  supports: boolean
  createdAt: string
  featured: boolean
}

// Datos de ejemplo
const sampleModels: Model3D[] = [
  {
    id: "1",
    title: "Figura de Goku Super Saiyan",
    description: "Figura detallada de Goku en su forma Super Saiyan, perfecta para coleccionistas de anime.",
    price: 12.99,
    images: ["/images/goku-figure.png", "/images/goku-figure.png"],
    category: "Figuras y Coleccionables",
    tags: ["anime", "dragon ball", "figura", "coleccionable"],
    rating: 4.8,
    reviews: 156,
    downloads: 2341,
    likes: 892,
    author: {
      name: "AnimeCreator3D",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    materials: ["PLA", "PETG"],
    difficulty: "intermediate",
    printTime: "8 horas",
    supports: true,
    createdAt: "2024-01-15",
    featured: true,
  },
  {
    id: "2",
    title: "Organizador de Escritorio Modular",
    description: "Sistema modular de organización para escritorio con compartimentos personalizables.",
    price: 8.5,
    images: ["/images/desk-organizer.png", "/images/desk-organizer.png"],
    category: "Hogar y Cocina",
    tags: ["organizador", "escritorio", "modular", "funcional"],
    rating: 4.6,
    reviews: 89,
    downloads: 1567,
    likes: 423,
    author: {
      name: "FunctionalDesigns",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    materials: ["PLA", "ABS"],
    difficulty: "beginner",
    printTime: "4 horas",
    supports: false,
    createdAt: "2024-01-10",
    featured: false,
  },
  {
    id: "3",
    title: "Engranaje Industrial Personalizado",
    description: "Engranaje de precisión para aplicaciones industriales, totalmente personalizable.",
    price: 25.0,
    images: ["/images/industrial-gear.png", "/images/industrial-gear.png"],
    category: "Prototipos Industriales",
    tags: ["engranaje", "industrial", "mecánico", "precisión"],
    rating: 4.9,
    reviews: 67,
    downloads: 892,
    likes: 234,
    author: {
      name: "EngineerPro",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    materials: ["Nylon", "PC", "ABS"],
    difficulty: "advanced",
    printTime: "12 horas",
    supports: true,
    createdAt: "2024-01-08",
    featured: true,
  },
  {
    id: "4",
    title: "Anillo Personalizado con Grabado",
    description: "Anillo elegante con posibilidad de grabado personalizado, perfecto para regalos.",
    price: 15.75,
    images: ["/images/custom-ring.png", "/images/custom-ring.png"],
    category: "Joyería y Accesorios",
    tags: ["anillo", "joyería", "personalizado", "regalo"],
    rating: 4.7,
    reviews: 203,
    downloads: 1876,
    likes: 654,
    author: {
      name: "JewelryMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    materials: ["Resina", "Metal Fill"],
    difficulty: "intermediate",
    printTime: "2 horas",
    supports: false,
    createdAt: "2024-01-12",
    featured: false,
  },
  {
    id: "5",
    title: "Lámpara Decorativa Geométrica",
    description: "Lámpara con diseño geométrico moderno que crea patrones de luz únicos.",
    price: 18.99,
    images: ["/images/decorative-lamp.png", "/images/decorative-lamp.png"],
    category: "Decoración y Arte",
    tags: ["lámpara", "decoración", "geométrico", "iluminación"],
    rating: 4.5,
    reviews: 124,
    downloads: 1234,
    likes: 567,
    author: {
      name: "LightDesigner",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
    },
    materials: ["PLA", "PETG"],
    difficulty: "intermediate",
    printTime: "6 horas",
    supports: true,
    createdAt: "2024-01-05",
    featured: true,
  },
  {
    id: "6",
    title: "Soporte para Teléfono Ajustable",
    description: "Soporte ergonómico para teléfono con múltiples ángulos de ajuste.",
    price: 5.99,
    images: ["/images/phone-stand.png", "/images/phone-stand.png"],
    category: "Herramientas y Utilidades",
    tags: ["soporte", "teléfono", "ajustable", "ergonómico"],
    rating: 4.4,
    reviews: 312,
    downloads: 3456,
    likes: 1234,
    author: {
      name: "GadgetMaker",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    materials: ["PLA", "TPU"],
    difficulty: "beginner",
    printTime: "1.5 horas",
    supports: false,
    createdAt: "2024-01-20",
    featured: false,
  },
]

const categories = [
  "Todas las Categorías",
  "Figuras y Coleccionables",
  "Herramientas y Utilidades",
  "Decoración y Arte",
  "Juguetes y Juegos",
  "Joyería y Accesorios",
  "Prototipos Industriales",
  "Educación y Ciencia",
  "Hogar y Cocina",
  "Automotriz",
  "Médico y Salud",
]

const sortOptions = [
  { value: "newest", label: "Más Recientes" },
  { value: "popular", label: "Más Populares" },
  { value: "rating", label: "Mejor Valorados" },
  { value: "price-low", label: "Precio: Menor a Mayor" },
  { value: "price-high", label: "Precio: Mayor a Menor" },
  { value: "downloads", label: "Más Descargados" },
]

export function ModelsGallery() {
  const [models, setModels] = useState<Model3D[]>(sampleModels)
  const [filteredModels, setFilteredModels] = useState<Model3D[]>(sampleModels)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas las Categorías")
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [likedModels, setLikedModels] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  useEffect(() => {
    let filtered = [...models]

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (model) =>
          model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filtrar por categoría
    if (selectedCategory !== "Todas las Categorías") {
      filtered = filtered.filter((model) => model.category === selectedCategory)
    }

    // Filtrar por precio
    if (priceRange.min) {
      filtered = filtered.filter((model) => model.price >= Number.parseFloat(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter((model) => model.price <= Number.parseFloat(priceRange.max))
    }

    // Ordenar
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.likes - a.likes)
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
      case "downloads":
        filtered.sort((a, b) => b.downloads - a.downloads)
        break
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    setFilteredModels(filtered)
  }, [models, searchTerm, selectedCategory, sortBy, priceRange])

  const handleLike = (modelId: string) => {
    const newLikedModels = new Set(likedModels)
    if (likedModels.has(modelId)) {
      newLikedModels.delete(modelId)
      toast({
        title: "Eliminado de favoritos",
        description: "El modelo se eliminó de tus favoritos",
      })
    } else {
      newLikedModels.add(modelId)
      toast({
        title: "Añadido a favoritos",
        description: "El modelo se añadió a tus favoritos",
      })
    }
    setLikedModels(newLikedModels)
  }

  const handleAddToCart = (model: Model3D) => {
    toast({
      title: "Añadido al carrito",
      description: `${model.title} se añadió a tu carrito`,
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-600"
      case "intermediate":
        return "bg-yellow-600"
      case "advanced":
        return "bg-orange-600"
      case "expert":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "Principiante"
      case "intermediate":
        return "Intermedio"
      case "advanced":
        return "Avanzado"
      case "expert":
        return "Experto"
      default:
        return difficulty
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
            Galería de Modelos 3D
          </h1>
          <p className="text-gray-300">Descubre miles de modelos 3D listos para imprimir</p>
        </div>

        {/* Filtros */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar modelos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white pl-10"
              />
            </div>

            {/* Categoría */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Ordenar */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
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

            {/* Filtro de precio */}
            <div className="flex gap-2">
              <Input
                placeholder="Min $"
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Input
                placeholder="Max $"
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-gray-300">
            Mostrando {filteredModels.length} de {models.length} modelos
          </p>
        </div>

        {/* Grid de Modelos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModels.map((model) => (
            <Card
              key={model.id}
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group"
            >
              <CardContent className="p-0">
                {/* Imagen */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={model.images[0] || "/placeholder.svg"}
                    alt={model.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {model.featured && (
                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500">
                      Destacado
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(model.id)}
                    className={`absolute top-2 right-2 ${
                      likedModels.has(model.id) ? "text-red-500 hover:text-red-400" : "text-white hover:text-red-500"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${likedModels.has(model.id) ? "fill-current" : ""}`} />
                  </Button>
                </div>

                {/* Contenido */}
                <div className="p-4">
                  {/* Título y Precio */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold text-sm line-clamp-2 flex-1">{model.title}</h3>
                    <span className="text-cyan-400 font-bold text-lg ml-2">${model.price}</span>
                  </div>

                  {/* Descripción */}
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">{model.description}</p>

                  {/* Autor */}
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={model.author.avatar || "/placeholder.svg"}
                      alt={model.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-gray-300 text-xs">{model.author.name}</span>
                    {model.author.verified && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        ✓
                      </Badge>
                    )}
                  </div>

                  {/* Estadísticas */}
                  <div className="flex items-center gap-4 mb-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{model.rating}</span>
                      <span>({model.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span>{model.downloads}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{model.likes}</span>
                    </div>
                  </div>

                  {/* Especificaciones */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getDifficultyColor(model.difficulty)} border-none text-white`}
                    >
                      {getDifficultyLabel(model.difficulty)}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {model.printTime}
                    </Badge>
                    {model.supports && (
                      <Badge variant="outline" className="text-xs border-orange-600 text-orange-400">
                        Soportes
                      </Badge>
                    )}
                  </div>

                  {/* Materiales */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {model.materials.slice(0, 2).map((material) => (
                      <Badge key={material} variant="secondary" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                    {model.materials.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{model.materials.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Botones */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      onClick={() => handleAddToCart(model)}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Comprar
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sin resultados */}
        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No se encontraron modelos</h3>
              <p>Intenta ajustar tus filtros de búsqueda</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
