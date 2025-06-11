"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SearchBarProps {
  onSearch: (query: string) => void
  onCategoryFilter: (categories: string[]) => void
  onPriceFilter: (range: { min: number; max: number }) => void
  selectedCategories: string[]
  searchQuery: string
}

const categories = [
  "Figuras de Acción",
  "Figuras Coleccionables",
  "Modelos 3D Decorativos",
  "Prototipos Industriales",
  "Herramientas y Utilidades",
  "Joyería y Accesorios",
  "Hogar y Organización",
  "Educativo y Didáctico",
  "Automotriz",
  "Médico y Científico",
  "Arte y Escultura",
  "Gaming y Entretenimiento",
]

const priceRanges = [
  { label: "Gratis", min: 0, max: 0 },
  { label: "$1 - $10", min: 1, max: 10 },
  { label: "$10 - $25", min: 10, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50+", min: 50, max: 1000 },
]

export function SearchBar({
  onSearch,
  onCategoryFilter,
  onPriceFilter,
  selectedCategories,
  searchQuery,
}: SearchBarProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("")

  const handleSearch = () => {
    onSearch(localQuery)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked ? [...selectedCategories, category] : selectedCategories.filter((c) => c !== category)
    onCategoryFilter(newCategories)
  }

  const handlePriceRangeChange = (range: { label: string; min: number; max: number }) => {
    setSelectedPriceRange(range.label)
    onPriceFilter({ min: range.min, max: range.max })
  }

  const clearFilters = () => {
    onCategoryFilter([])
    onPriceFilter({ min: 0, max: 1000 })
    setSelectedPriceRange("")
    setLocalQuery("")
    onSearch("")
  }

  const activeFiltersCount = selectedCategories.length + (selectedPriceRange ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda principal */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar modelos 3D, figuras, herramientas..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-cyan-400"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        >
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Filter className="h-4 w-4 mr-2" />
              Categorías
              {selectedCategories.length > 0 && (
                <Badge className="ml-2 bg-cyan-500 text-xs">{selectedCategories.length}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
            <DropdownMenuLabel>Filtrar por categoría</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked)}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Filter className="h-4 w-4 mr-2" />
              Precio
              {selectedPriceRange && <Badge className="ml-2 bg-cyan-500 text-xs">{selectedPriceRange}</Badge>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Filtrar por precio</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {priceRanges.map((range) => (
              <DropdownMenuCheckboxItem
                key={range.label}
                checked={selectedPriceRange === range.label}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handlePriceRangeChange(range)
                  } else {
                    setSelectedPriceRange("")
                    onPriceFilter({ min: 0, max: 1000 })
                  }
                }}
              >
                {range.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar filtros ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Filtros activos */}
      {(selectedCategories.length > 0 || selectedPriceRange || searchQuery) && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
              Búsqueda: "{searchQuery}"
            </Badge>
          )}
          {selectedCategories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="text-purple-400 border-purple-400/30 cursor-pointer hover:bg-purple-400/10"
              onClick={() => handleCategoryChange(category, false)}
            >
              {category}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {selectedPriceRange && (
            <Badge
              variant="outline"
              className="text-green-400 border-green-400/30 cursor-pointer hover:bg-green-400/10"
              onClick={() => {
                setSelectedPriceRange("")
                onPriceFilter({ min: 0, max: 1000 })
              }}
            >
              {selectedPriceRange}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
