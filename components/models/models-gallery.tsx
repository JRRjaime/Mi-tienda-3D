"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Download, ShoppingCart, Star, Search, Eye, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usePlatformData } from "@/contexts/platform-data-context"
import type { Model3D } from "@/types"
import Link from "next/link"

export function ModelsGallery() {
  const { models: contextModels } = usePlatformData()
  const [filteredModels, setFilteredModels] = useState<Model3D[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas las Categorías")
  const [sortBy, setSortBy] = useState("newest")
  const [likedModels, setLikedModels] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const categories = useMemo(() => {
    const allCategories = new Set(contextModels.map((m) => m.category))
    return ["Todas las Categorías", ...Array.from(allCategories)]
  }, [contextModels])

  const sortOptions = [
    { value: "newest", label: "Más Recientes" },
    { value: "popular", label: "Más Populares" },
    { value: "rating", label: "Mejor Valorados" },
    { value: "price-low", label: "Precio: Menor a Mayor" },
    { value: "price-high", label: "Precio: Mayor a Menor" },
    { value: "downloads", label: "Más Descargados" },
  ]

  useEffect(() => {
    let filtered = [...contextModels]

    if (searchTerm) {
      filtered = filtered.filter(
        (model) =>
          model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCategory !== "Todas las Categorías") {
      filtered = filtered.filter((model) => model.category === selectedCategory)
    }

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
  }, [contextModels, searchTerm, selectedCategory, sortBy])

  const handleLike = (modelId: string) => {
    const newLikedModels = new Set(likedModels)
    if (likedModels.has(modelId)) {
      newLikedModels.delete(modelId)
      toast({ title: "Eliminado de favoritos" })
    } else {
      newLikedModels.add(modelId)
      toast({ title: "Añadido a favoritos" })
    }
    setLikedModels(newLikedModels)
  }

  const handleAddToCart = (model: Model3D) => {
    toast({
      title: "Añadido al carrito",
      description: `${model.title} se añadió a tu carrito.`,
    })
  }

  const getDifficultyColor = (difficulty: Model3D["difficulty"]) => {
    const colors = {
      beginner: "bg-green-600",
      intermediate: "bg-yellow-600",
      advanced: "bg-orange-600",
      expert: "bg-red-600",
    }
    return colors[difficulty] || "bg-gray-600"
  }

  const getDifficultyLabel = (difficulty: Model3D["difficulty"]) => {
    const labels = {
      beginner: "Principiante",
      intermediate: "Intermedio",
      advanced: "Avanzado",
      expert: "Experto",
    }
    return labels[difficulty] || difficulty
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
            Galería de Modelos 3D
          </h1>
          <p className="text-gray-300">Descubre miles de modelos 3D listos para imprimir</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar modelos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white pl-10"
              />
            </div>
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
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-300">
            Mostrando {filteredModels.length} de {contextModels.length} modelos
          </p>
        </div>

        {filteredModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModels.map((model) => (
              <Card
                key={model.id}
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group"
              >
                <CardContent className="p-0">
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
                      className={`absolute top-2 right-2 ${likedModels.has(model.id) ? "text-red-500 hover:text-red-400" : "text-white hover:text-red-500"}`}
                    >
                      <Heart className={`h-4 w-4 ${likedModels.has(model.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 flex-1">{model.title}</h3>
                      <span className="text-cyan-400 font-bold text-lg ml-2">${model.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">{model.description}</p>
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
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-2xl font-semibold mb-2 text-white">El mercado está vacío</h3>
              <p className="text-gray-400">No se encontraron modelos. ¿Por qué no subes el primero?</p>
              <Button
                asChild
                className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                <Link href="/subir-modelo">
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Modelo
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
