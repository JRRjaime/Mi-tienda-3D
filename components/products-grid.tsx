"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Gamepad2,
  Wrench,
  Heart,
  Gem,
  Home,
  GraduationCap,
  Car,
  Palette,
  Users,
  ArrowRight,
  Crown,
  Download,
  Printer,
} from "lucide-react"
import Link from "next/link"

// Simular usuario logueado
const currentUser = {
  name: "Carlos Mendez",
  isLoggedIn: true,
  profileTypes: ["creador", "usuario"],
}

// Datos expandidos de productos con información del creador y tipo
const allProducts = [
  {
    id: "figuras-accion",
    title: "Figuras de Acción",
    description: "Figuras articuladas de superhéroes, anime y personajes populares",
    icon: Gamepad2,
    color: "from-pink-500 to-rose-500",
    projects: 245,
    featured: true,
    category: "Figuras de Acción",
    price: 15,
    tags: ["anime", "superhéroes", "coleccionables"],
    myModels: 2,
    type: "download", // Tipo: para descargar
  },
  {
    id: "figuras-coleccionables",
    title: "Figuras Coleccionables",
    description: "Estatuas y figuras de edición limitada para coleccionistas",
    icon: Gem,
    color: "from-purple-500 to-violet-500",
    projects: 189,
    featured: true,
    category: "Figuras Coleccionables",
    price: 25,
    tags: ["coleccionables", "estatuas", "edición limitada"],
    myModels: 0,
    type: "printed", // Tipo: modelos impresos
  },
  {
    id: "modelos-decorativos",
    title: "Modelos 3D Decorativos",
    description: "Esculturas y objetos decorativos para el hogar y oficina",
    icon: Palette,
    color: "from-indigo-500 to-purple-500",
    projects: 312,
    category: "Modelos 3D Decorativos",
    price: 12,
    tags: ["decoración", "arte", "hogar"],
    myModels: 1,
    type: "download",
  },
  {
    id: "prototipos-industriales",
    title: "Prototipos Industriales",
    description: "Componentes y prototipos para ingeniería y manufactura",
    icon: Wrench,
    color: "from-blue-500 to-cyan-500",
    projects: 156,
    featured: true,
    category: "Prototipos Industriales",
    price: 35,
    tags: ["ingeniería", "prototipos", "industrial"],
    myModels: 1,
    type: "printed",
  },
  {
    id: "herramientas-utilidades",
    title: "Herramientas y Utilidades",
    description: "Herramientas prácticas, organizadores y gadgets útiles",
    icon: Wrench,
    color: "from-green-500 to-emerald-500",
    projects: 278,
    category: "Herramientas y Utilidades",
    price: 8,
    tags: ["herramientas", "utilidades", "práctico"],
    myModels: 0,
    type: "download",
  },
  {
    id: "joyeria-accesorios",
    title: "Joyería y Accesorios",
    description: "Anillos, collares, pendientes y accesorios personalizados",
    icon: Gem,
    color: "from-yellow-500 to-orange-500",
    projects: 167,
    category: "Joyería y Accesorios",
    price: 18,
    tags: ["joyería", "accesorios", "personalizado"],
    myModels: 0,
    type: "printed",
  },
  {
    id: "hogar-organizacion",
    title: "Hogar y Organización",
    description: "Organizadores, contenedores y soluciones para el hogar",
    icon: Home,
    color: "from-green-500 to-emerald-500",
    projects: 203,
    featured: true,
    category: "Hogar y Organización",
    price: 10,
    tags: ["hogar", "organización", "contenedores"],
    myModels: 0,
    type: "download",
  },
  {
    id: "educativo-didactico",
    title: "Educativo y Didáctico",
    description: "Modelos educativos, puzzles y material de aprendizaje",
    icon: GraduationCap,
    color: "from-purple-500 to-violet-500",
    projects: 134,
    category: "Educativo y Didáctico",
    price: 6,
    tags: ["educación", "didáctico", "aprendizaje"],
    myModels: 0,
    type: "download",
  },
  {
    id: "automotriz",
    title: "Automotriz",
    description: "Repuestos, accesorios y componentes para vehículos",
    icon: Car,
    color: "from-gray-500 to-slate-500",
    projects: 89,
    category: "Automotriz",
    price: 22,
    tags: ["automotriz", "repuestos", "vehículos"],
    myModels: 0,
    type: "printed",
  },
  {
    id: "medico-cientifico",
    title: "Médico y Científico",
    description: "Modelos anatómicos, prótesis y equipos médicos",
    icon: Heart,
    color: "from-red-500 to-pink-500",
    projects: 67,
    category: "Médico y Científico",
    price: 45,
    tags: ["médico", "científico", "anatomía"],
    myModels: 0,
    type: "printed",
  },
  {
    id: "arte-escultura",
    title: "Arte y Escultura",
    description: "Obras de arte, esculturas y creaciones artísticas",
    icon: Palette,
    color: "from-indigo-500 to-purple-500",
    projects: 198,
    category: "Arte y Escultura",
    price: 20,
    tags: ["arte", "escultura", "creativo"],
    myModels: 0,
    type: "download",
  },
  {
    id: "gaming-entretenimiento",
    title: "Gaming y Entretenimiento",
    description: "Accesorios gaming, dados, fichas y entretenimiento",
    icon: Gamepad2,
    color: "from-pink-500 to-rose-500",
    projects: 223,
    category: "Gaming y Entretenimiento",
    price: 14,
    tags: ["gaming", "entretenimiento", "juegos"],
    myModels: 0,
    type: "download",
  },
  {
    id: "repuestos-personalizados",
    title: "Repuestos Personalizados",
    description: "Repuestos y componentes hechos a medida",
    icon: Wrench,
    color: "from-orange-500 to-red-500",
    projects: 145,
    category: "Repuestos Personalizados",
    price: 30,
    tags: ["repuestos", "personalizado", "componentes"],
    myModels: 0,
    type: "printed",
  },
  {
    id: "miniaturas-arquitectura",
    title: "Miniaturas y Arquitectura",
    description: "Maquetas arquitectónicas y modelos a escala",
    icon: Home,
    color: "from-teal-500 to-cyan-500",
    projects: 98,
    category: "Miniaturas y Arquitectura",
    price: 28,
    tags: ["arquitectura", "maquetas", "escala"],
    myModels: 0,
    type: "printed",
  },
]

export function ProductsGrid() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [sortBy, setSortBy] = useState("featured")
  const [activeTab, setActiveTab] = useState("all") // "all", "download", "printed"

  const isCreator = currentUser.profileTypes.includes("creador")

  const filteredProducts = useMemo(() => {
    let filtered = allProducts

    // Filtrar por tipo (descargar o modelos impresos)
    if (activeTab === "download") {
      filtered = filtered.filter((product) => product.type === "download")
    } else if (activeTab === "printed") {
      filtered = filtered.filter((product) => product.type === "printed")
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filtrar por categorías
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => selectedCategories.includes(product.category))
    }

    // Filtrar por precio
    filtered = filtered.filter((product) => product.price >= priceRange.min && product.price <= priceRange.max)

    // Ordenar
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "popular":
        filtered.sort((a, b) => b.projects - a.projects)
        break
      case "my-models":
        if (isCreator) {
          filtered.sort((a, b) => b.myModels - a.myModels)
        }
        break
      case "featured":
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    return filtered
  }, [searchQuery, selectedCategories, priceRange, sortBy, isCreator, activeTab])

  // Contar modelos por tipo
  const downloadModelsCount = allProducts.filter((p) => p.type === "download").length
  const printedModelsCount = allProducts.filter((p) => p.type === "printed").length

  // Renderizar una categoría
  const renderCategoryCard = (category: (typeof allProducts)[0]) => {
    const IconComponent = category.icon
    const hasMyModels = isCreator && category.myModels > 0

    return (
      <Link key={category.id} href={`/productos/${category.id}`}>
        <Card
          className={`group relative overflow-hidden backdrop-blur-sm border transition-all duration-300 hover:scale-105 cursor-pointer h-full ${
            hasMyModels
              ? "bg-purple-500/10 border-purple-400/30 hover:border-purple-400/50"
              : "bg-white/5 border-white/10 hover:border-white/20"
          }`}
        >
          {category.featured && !hasMyModels && (
            <Badge className="absolute top-4 right-4 z-10 bg-gradient-to-r from-cyan-500 to-blue-500">Popular</Badge>
          )}

          {hasMyModels && (
            <Badge className="absolute top-4 right-4 z-10 bg-gradient-to-r from-purple-500 to-pink-500">
              <Crown className="h-3 w-3 mr-1" />
              Mis Modelos ({category.myModels})
            </Badge>
          )}

          <div
            className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
          />

          <CardHeader className="relative z-10">
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-4`}
            >
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <CardTitle
              className={`transition-colors ${
                hasMyModels ? "text-purple-300 group-hover:text-purple-200" : "text-white group-hover:text-cyan-400"
              }`}
            >
              {category.title}
            </CardTitle>
            <CardDescription className="text-gray-300">{category.description}</CardDescription>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="space-y-3">
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {category.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={
                      hasMyModels
                        ? "text-xs text-purple-400 border-purple-400/30"
                        : "text-xs text-cyan-400 border-cyan-400/30"
                    }
                  >
                    {tag}
                  </Badge>
                ))}
                <Badge
                  variant="outline"
                  className={
                    category.type === "download"
                      ? "text-xs text-blue-400 border-blue-400/30"
                      : "text-xs text-green-400 border-green-400/30"
                  }
                >
                  {category.type === "download" ? "Descargar" : "Impreso"}
                </Badge>
              </div>

              {/* Precio y proyectos */}
              <div className="flex items-center justify-between">
                <div className={`text-2xl font-bold ${hasMyModels ? "text-purple-400" : "text-cyan-400"}`}>
                  Desde ${category.price}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>{category.projects} proyectos</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className={`w-full opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                  hasMyModels
                    ? "text-purple-400 hover:text-purple-300 hover:bg-purple-400/10"
                    : "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
                }`}
              >
                {hasMyModels ? "Ver mis modelos" : "Explorar categoría"}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <div className="space-y-8">
      {/* Barra de búsqueda y filtros */}
      <SearchBar
        onSearch={setSearchQuery}
        onCategoryFilter={setSelectedCategories}
        onPriceFilter={setPriceRange}
        selectedCategories={selectedCategories}
        searchQuery={searchQuery}
      />

      {/* Tabs para tipos de modelos */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Todas las Categorías</span>
              <span className="sm:hidden">Todas</span>
              <Badge variant="outline" className="ml-1 text-xs">
                {allProducts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="download" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Modelos para Descargar</span>
              <span className="sm:hidden">Descargar</span>
              <Badge variant="outline" className="ml-1 text-xs">
                {downloadModelsCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="printed" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Modelos Impresos</span>
              <span className="sm:hidden">Impresos</span>
              <Badge variant="outline" className="ml-1 text-xs">
                {printedModelsCount}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Descripción de cada sección */}
        <div className="text-center mb-6">
          {activeTab === "download" && (
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
              <h3 className="text-blue-400 font-semibold mb-2">Modelos 3D para Descargar</h3>
              <p className="text-gray-300 text-sm">
                Descarga archivos STL, OBJ y otros formatos para imprimir en tu propia impresora 3D
              </p>
            </div>
          )}
          {activeTab === "printed" && (
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold mb-2">Modelos Impresos</h3>
              <p className="text-gray-300 text-sm">
                Solicita la impresión profesional de modelos 3D y recíbelos listos en tu domicilio
              </p>
            </div>
          )}
          {activeTab === "all" && (
            <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-semibold mb-2">Todas las Categorías</h3>
              <p className="text-gray-300 text-sm">
                Explora todas nuestras categorías de modelos 3D, tanto para descargar como para solicitar impresión
              </p>
            </div>
          )}
        </div>

        {/* Opciones de ordenamiento */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={sortBy === "featured" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("featured")}
              className={sortBy === "featured" ? "bg-cyan-500" : "border-white/20 text-white hover:bg-white/10"}
            >
              Destacados
            </Button>
            <Button
              variant={sortBy === "popular" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("popular")}
              className={sortBy === "popular" ? "bg-cyan-500" : "border-white/20 text-white hover:bg-white/10"}
            >
              Más populares
            </Button>
            {isCreator && (
              <Button
                variant={sortBy === "my-models" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("my-models")}
                className={
                  sortBy === "my-models"
                    ? "bg-purple-500"
                    : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                }
              >
                <Crown className="h-4 w-4 mr-1" />
                Mis Categorías
              </Button>
            )}
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
            Mostrando {filteredProducts.length} de {allProducts.length} categorías
          </div>
        </div>

        {/* Contenido de las pestañas */}
        <TabsContent value={activeTab} className="mt-6">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((category) => renderCategoryCard(category))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No se encontraron categorías</div>
              <p className="text-gray-500 mb-6">Intenta ajustar tus filtros de búsqueda</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategories([])
                  setPriceRange({ min: 0, max: 1000 })
                }}
                className="bg-gradient-to-r from-cyan-500 to-blue-500"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
