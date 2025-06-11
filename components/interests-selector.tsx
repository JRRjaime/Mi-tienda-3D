"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Palette,
  Cpu,
  Home,
  Heart,
  Car,
  Gamepad2,
  Music,
  Camera,
  Dumbbell,
  Book,
  Plane,
  Coffee,
  Smartphone,
  Watch,
  Headphones,
  Search,
  Plus,
  X,
} from "lucide-react"

interface InterestsSelectorProps {
  selectedInterests: string[]
  onSelectionChange: (interests: string[]) => void
  userProfiles: string[]
}

// Categorías de intereses organizadas por perfil
const INTEREST_CATEGORIES = {
  creator: {
    title: "Creación y Diseño",
    icon: Palette,
    interests: [
      "Modelado 3D",
      "Diseño Industrial",
      "Arte Digital",
      "Escultura",
      "Arquitectura",
      "Diseño de Producto",
      "Animación 3D",
      "Prototipado",
      "CAD/CAM",
      "Diseño Paramétrico",
    ],
  },
  printer: {
    title: "Impresión y Manufactura",
    icon: Cpu,
    interests: [
      "Impresión 3D",
      "Materiales Avanzados",
      "Post-procesado",
      "Control de Calidad",
      "Optimización",
      "Ingeniería",
      "Manufactura",
      "Automatización",
      "Metrología",
      "Procesos Industriales",
    ],
  },
  user: {
    title: "Aplicaciones y Usos",
    icon: Home,
    interests: [
      "Hogar y Decoración",
      "Gadgets Tecnológicos",
      "Herramientas Útiles",
      "Juguetes y Figuras",
      "Reparaciones",
      "Personalización",
      "Organización",
      "Accesorios",
      "Prototipos Caseros",
      "DIY Projects",
    ],
  },
}

// Intereses generales para todos los perfiles
const GENERAL_INTERESTS = [
  { name: "Tecnología", icon: Smartphone },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Música", icon: Music },
  { name: "Fotografía", icon: Camera },
  { name: "Deportes", icon: Dumbbell },
  { name: "Lectura", icon: Book },
  { name: "Viajes", icon: Plane },
  { name: "Gastronomía", icon: Coffee },
  { name: "Automovilismo", icon: Car },
  { name: "Fitness", icon: Dumbbell },
  { name: "Audio", icon: Headphones },
  { name: "Relojes", icon: Watch },
]

export function InterestsSelector({ selectedInterests, onSelectionChange, userProfiles }: InterestsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [customInterest, setCustomInterest] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      onSelectionChange(selectedInterests.filter((i) => i !== interest))
    } else {
      onSelectionChange([...selectedInterests, interest])
    }
  }

  const addCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      onSelectionChange([...selectedInterests, customInterest.trim()])
      setCustomInterest("")
      setShowCustomInput(false)
    }
  }

  const removeInterest = (interest: string) => {
    onSelectionChange(selectedInterests.filter((i) => i !== interest))
  }

  // Filtrar intereses basado en búsqueda
  const filterInterests = (interests: string[]) => {
    if (!searchTerm) return interests
    return interests.filter((interest) => interest.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  // Obtener categorías relevantes según el perfil del usuario
  const getRelevantCategories = () => {
    const categories = []

    if (userProfiles.includes("creator")) {
      categories.push(INTEREST_CATEGORIES.creator)
    }
    if (userProfiles.includes("printer")) {
      categories.push(INTEREST_CATEGORIES.printer)
    }
    if (userProfiles.includes("user")) {
      categories.push(INTEREST_CATEGORIES.user)
    }

    return categories
  }

  const relevantCategories = getRelevantCategories()

  return (
    <div className="space-y-6">
      {/* Intereses seleccionados */}
      {selectedInterests.length > 0 && (
        <div className="space-y-3">
          <Label className="text-white text-lg font-semibold">Tus Intereses Seleccionados</Label>
          <div className="flex flex-wrap gap-2">
            {selectedInterests.map((interest) => (
              <Badge
                key={interest}
                variant="default"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 text-sm flex items-center gap-2"
              >
                {interest}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-white/20"
                  onClick={() => removeInterest(interest)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Buscador */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-white">
          Buscar Intereses
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="search"
            type="text"
            placeholder="Busca tus intereses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Categorías específicas del perfil */}
      {relevantCategories.map((category) => {
        const filteredInterests = filterInterests(category.interests)
        if (filteredInterests.length === 0) return null

        return (
          <Card key={category.title} className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                  <category.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white text-lg font-semibold">{category.title}</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredInterests.map((interest) => (
                  <Button
                    key={interest}
                    variant={selectedInterests.includes(interest) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleInterest(interest)}
                    className={`justify-start text-left h-auto py-3 px-4 ${
                      selectedInterests.includes(interest)
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0"
                        : "border-white/20 text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedInterests.includes(interest) ? "bg-white" : "bg-cyan-400"
                        }`}
                      />
                      {interest}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Intereses generales */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-white text-lg font-semibold">Intereses Generales</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GENERAL_INTERESTS.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map(
              (item) => (
                <Button
                  key={item.name}
                  variant={selectedInterests.includes(item.name) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleInterest(item.name)}
                  className={`justify-start text-left h-auto py-3 px-4 ${
                    selectedInterests.includes(item.name)
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
                      : "border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </div>
                </Button>
              ),
            )}
          </div>
        </CardContent>
      </Card>

      {/* Añadir interés personalizado */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-white text-lg font-semibold">Interés Personalizado</h3>
          </div>

          {!showCustomInput ? (
            <Button
              variant="outline"
              onClick={() => setShowCustomInput(true)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir interés personalizado
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Escribe tu interés..."
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomInterest()}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button
                onClick={addCustomInterest}
                disabled={!customInterest.trim()}
                className="bg-gradient-to-r from-green-500 to-emerald-500"
              >
                Añadir
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCustomInput(false)
                  setCustomInterest("")
                }}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="text-center text-gray-400 text-sm">
        {selectedInterests.length} intereses seleccionados
        {selectedInterests.length >= 3 && (
          <div className="text-green-400 mt-1">
            ¡Perfecto! Tienes suficientes intereses para personalizar tu experiencia
          </div>
        )}
        {selectedInterests.length < 3 && (
          <div className="text-yellow-400 mt-1">Selecciona al menos 3 intereses para una mejor experiencia</div>
        )}
      </div>
    </div>
  )
}
