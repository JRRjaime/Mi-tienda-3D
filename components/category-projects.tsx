"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useEnhancedCart } from "@/contexts/enhanced-cart-context"
import { useToast } from "@/hooks/use-toast"
import { EnhancedProductCard } from "./enhanced-product-card"

interface CategoryProjectsProps {
  categoria: string
}

// Simular usuario logueado
const currentUser = {
  name: "Carlos Mendez",
  isLoggedIn: true,
  profileTypes: ["creador", "usuario"],
}

// DATOS COMPLETOS PARA TODAS LAS CATEGORÍAS - TEST COMPLETO
const allProjects = [
  // FIGURAS DE ACCIÓN
  {
    id: 1,
    title: "Figura de Dragon Ball Z - Goku Super Saiyan",
    description: "Figura coleccionable de Goku en pose de combate, impresa en PLA con detalles pintados a mano",
    image: "/images/goku-figure.png",
    author: "Carlos Mendez",
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
    isOwner: true,
  },
  {
    id: 2,
    title: "Figura de Naruto - Modo Sabio",
    description: "Figura detallada de Naruto en modo sabio con efectos de chakra",
    image: "/images/naruto-figure.png",
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
    title: "Casco de Anime Personalizado",
    description: "Casco detallado inspirado en anime con acabado profesional",
    image: "/images/anime-helmet.png",
    author: "Miguel Torres",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 167,
    comments: 23,
    downloads: 567,
    rating: 4.6,
    views: 3100,
    tags: ["Anime", "Casco", "Cosplay", "Detallado"],
    difficulty: "Avanzado",
    printTime: "12 horas",
    material: "PLA+",
    price: 18.99,
    category: "figuras-accion",
    status: "published",
    isOwner: false,
  },

  // HOGAR Y ORGANIZACIÓN
  {
    id: 4,
    title: "Organizador de Escritorio Modular",
    description: "Sistema modular de organización para escritorio con compartimentos personalizables",
    image: "/images/desk-organizer.png",
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
    id: 5,
    title: "Soporte para Teléfono Ajustable",
    description: "Soporte ergonómico y ajustable para dispositivos móviles",
    image: "/images/phone-stand.png",
    author: "David Chen",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 445,
    comments: 89,
    downloads: 1890,
    rating: 4.7,
    views: 7200,
    tags: ["Soporte", "Teléfono", "Ajustable", "Ergonómico"],
    difficulty: "Fácil",
    printTime: "2 horas",
    material: "PLA",
    price: 4.99,
    category: "hogar-organizacion",
    status: "published",
    isOwner: false,
  },

  // PROTOTIPOS INDUSTRIALES
  {
    id: 6,
    title: "Engranaje Industrial Personalizado",
    description: "Engranaje de precisión para maquinaria industrial, diseñado con tolerancias específicas",
    image: "/images/industrial-gear.png",
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
    id: 7,
    title: "Componente Mecánico de Precisión",
    description: "Pieza mecánica de alta precisión para aplicaciones industriales",
    image: "/images/mechanical-part.png",
    author: "Roberto Silva",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 134,
    comments: 18,
    downloads: 389,
    rating: 4.8,
    views: 2800,
    tags: ["Mecánico", "Precisión", "Industrial", "Componente"],
    difficulty: "Avanzado",
    printTime: "6 horas",
    material: "ABS",
    price: 32.5,
    category: "prototipos-industriales",
    status: "published",
    isOwner: false,
  },
  {
    id: 8,
    title: "Prototipo de Drone Avanzado",
    description: "Modelo de drone personalizado para pruebas aerodinámicas",
    image: "/images/drone-prototype.png",
    author: "Carlos Mendez",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 12,
    comments: 3,
    downloads: 45,
    rating: 4.2,
    views: 145,
    tags: ["Drone", "Prototipo", "Aerodinámico", "Tecnología"],
    difficulty: "Avanzado",
    printTime: "6 horas",
    material: "PETG",
    price: 22.99,
    category: "prototipos-industriales",
    status: "published",
    earnings: 0,
    isOwner: true,
  },

  // JOYERÍA Y ACCESORIOS
  {
    id: 9,
    title: "Anillo de Compromiso Personalizado",
    description: "Elegante anillo con diseño personalizable y grabado opcional",
    image: "/images/custom-ring.png",
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
    id: 10,
    title: "Colgante Geométrico Elegante",
    description: "Colgante con diseño geométrico moderno para uso diario",
    image: "/images/pendant-jewelry.png",
    author: "Carmen López",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 278,
    comments: 34,
    downloads: 456,
    rating: 4.6,
    views: 2900,
    tags: ["Colgante", "Geométrico", "Elegante", "Moderno"],
    difficulty: "Intermedio",
    printTime: "1.5 horas",
    material: "Resina",
    price: 12.99,
    category: "joyeria-accesorios",
    status: "published",
    isOwner: false,
  },

  // MODELOS DECORATIVOS
  {
    id: 11,
    title: "Jarrón Geométrico Moderno",
    description: "Elegante jarrón con diseño geométrico moderno para decoración",
    image: "/images/geometric-vase.png",
    author: "Carlos Mendez",
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
    id: 12,
    title: "Lámpara Decorativa Moderna",
    description: "Lámpara con diseño contemporáneo y patrones únicos de luz",
    image: "/images/decorative-lamp.png",
    author: "Laura Vega",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 298,
    comments: 41,
    downloads: 723,
    rating: 4.8,
    views: 4500,
    tags: ["Lámpara", "Decoración", "Moderno", "Iluminación"],
    difficulty: "Intermedio",
    printTime: "5 horas",
    material: "PLA",
    price: 14.99,
    category: "modelos-decorativos",
    status: "published",
    isOwner: false,
  },

  // ARTE Y DISEÑO
  {
    id: 13,
    title: "Escultura Abstracta Moderna",
    description: "Pieza de arte abstracto para decoración contemporánea",
    image: "/images/3d-art.png",
    author: "Artista Digital",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 189,
    comments: 23,
    downloads: 345,
    rating: 4.5,
    views: 2100,
    tags: ["Arte", "Abstracto", "Escultura", "Moderno"],
    difficulty: "Intermedio",
    printTime: "4 horas",
    material: "PLA",
    price: 16.99,
    category: "arte-diseno",
    status: "published",
    isOwner: false,
  },

  // MÉDICO
  {
    id: 14,
    title: "Modelo Anatómico Educativo",
    description: "Modelo anatómico detallado para educación médica",
    image: "/images/3d-medical.png",
    author: "Dr. Medical",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 234,
    comments: 45,
    downloads: 567,
    rating: 4.9,
    views: 3400,
    tags: ["Médico", "Anatomía", "Educativo", "Profesional"],
    difficulty: "Avanzado",
    printTime: "8 horas",
    material: "PLA",
    price: 29.99,
    category: "medico",
    status: "published",
    isOwner: false,
  },

  // AUTOMOTRIZ
  {
    id: 15,
    title: "Pieza de Repuesto Automotriz",
    description: "Componente de repuesto para vehículos clásicos",
    image: "/images/3d-automotive.png",
    author: "Auto Parts Pro",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 123,
    comments: 34,
    downloads: 234,
    rating: 4.7,
    views: 1800,
    tags: ["Automotriz", "Repuesto", "Clásico", "Funcional"],
    difficulty: "Avanzado",
    printTime: "5 horas",
    material: "ABS",
    price: 19.99,
    category: "automotriz",
    status: "published",
    isOwner: false,
  },

  // EDUCATIVO
  {
    id: 16,
    title: "Modelo Educativo de Moléculas",
    description: "Set de moléculas para enseñanza de química",
    image: "/images/3d-prototype.png",
    author: "Profesor Ciencias",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 167,
    comments: 28,
    downloads: 445,
    rating: 4.8,
    views: 2600,
    tags: ["Educativo", "Química", "Moléculas", "Enseñanza"],
    difficulty: "Fácil",
    printTime: "2 horas",
    material: "PLA",
    price: 9.99,
    category: "educativo",
    status: "published",
    isOwner: false,
  },
]

export function CategoryProjects({ categoria }: CategoryProjectsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [showOnlyMyModels, setShowOnlyMyModels] = useState(false)

  const isCreator = currentUser.profileTypes.includes("creador")

  const { addItem } = useEnhancedCart()
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

  return (
    <div className="space-y-8">
      {/* Header de categoría con estadísticas */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">{filteredProjects.length} modelos encontrados</h2>
        <p className="text-gray-400">Explora nuestra colección de modelos 3D de alta calidad</p>
      </div>

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
            <EnhancedProductCard
              key={project.id}
              id={project.id.toString()}
              title={project.title}
              description={project.description}
              image={project.image}
              author={project.author}
              authorAvatar={project.authorAvatar}
              likes={project.likes}
              comments={project.comments}
              downloads={project.downloads}
              rating={project.rating}
              views={project.views}
              tags={project.tags}
              difficulty={project.difficulty}
              printTime={project.printTime}
              material={project.material}
              price={project.price}
              category={project.category}
              isOwner={project.isOwner}
            />
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
