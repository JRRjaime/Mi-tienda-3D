"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Gamepad2,
  Wrench,
  Heart,
  Gem,
  Home,
  GraduationCap,
  Car,
  Palette,
  Smartphone,
  Music,
  Camera,
  Plane,
  Dumbbell,
  Coffee,
  Shirt,
  Gift,
} from "lucide-react"

interface InterestsSelectorProps {
  selectedInterests: string[]
  onSelectionChange: (interests: string[]) => void
  userProfiles: string[]
}

const interestCategories = [
  {
    id: "entretenimiento",
    title: "Entretenimiento",
    icon: Gamepad2,
    color: "from-pink-500 to-rose-500",
    interests: [
      { id: "gaming", name: "Gaming", icon: Gamepad2 },
      { id: "anime", name: "Anime/Manga", icon: Palette },
      { id: "peliculas", name: "Películas/Series", icon: Camera },
      { id: "musica", name: "Música", icon: Music },
      { id: "coleccionables", name: "Coleccionables", icon: Gift },
    ],
  },
  {
    id: "hogar-vida",
    title: "Hogar y Estilo de Vida",
    icon: Home,
    color: "from-green-500 to-emerald-500",
    interests: [
      { id: "decoracion", name: "Decoración", icon: Home },
      { id: "organizacion", name: "Organización", icon: Wrench },
      { id: "cocina", name: "Cocina", icon: Coffee },
      { id: "jardineria", name: "Jardinería", icon: Heart },
      { id: "moda", name: "Moda", icon: Shirt },
    ],
  },
  {
    id: "profesional",
    title: "Profesional y Técnico",
    icon: Wrench,
    color: "from-blue-500 to-cyan-500",
    interests: [
      { id: "ingenieria", name: "Ingeniería", icon: Wrench },
      { id: "arquitectura", name: "Arquitectura", icon: Home },
      { id: "medicina", name: "Medicina", icon: Heart },
      { id: "educacion", name: "Educación", icon: GraduationCap },
      { id: "tecnologia", name: "Tecnología", icon: Smartphone },
    ],
  },
  {
    id: "hobbies",
    title: "Hobbies y Pasatiempos",
    icon: Palette,
    color: "from-purple-500 to-violet-500",
    interests: [
      { id: "arte", name: "Arte y Diseño", icon: Palette },
      { id: "fotografia", name: "Fotografía", icon: Camera },
      { id: "deportes", name: "Deportes", icon: Dumbbell },
      { id: "viajes", name: "Viajes", icon: Plane },
      { id: "joyeria", name: "Joyería", icon: Gem },
    ],
  },
  {
    id: "vehiculos",
    title: "Vehículos y Transporte",
    icon: Car,
    color: "from-gray-500 to-slate-500",
    interests: [
      { id: "automoviles", name: "Automóviles", icon: Car },
      { id: "motocicletas", name: "Motocicletas", icon: Car },
      { id: "drones", name: "Drones", icon: Plane },
      { id: "modelismo", name: "Modelismo", icon: Gamepad2 },
      { id: "rc", name: "Radio Control", icon: Smartphone },
    ],
  },
]

export function InterestsSelector({ selectedInterests, onSelectionChange, userProfiles }: InterestsSelectorProps) {
  const handleInterestToggle = (interestId: string) => {
    const newSelection = selectedInterests.includes(interestId)
      ? selectedInterests.filter((id) => id !== interestId)
      : [...selectedInterests, interestId]

    onSelectionChange(newSelection)
  }

  const getRecommendationText = () => {
    if (userProfiles.includes("creador")) {
      return "Como creador, estos intereses nos ayudarán a sugerir categorías populares para tus diseños"
    }
    if (userProfiles.includes("impresor")) {
      return "Como impresor, conocer tus especialidades nos ayudará a conectarte con los clientes adecuados"
    }
    return "Estos intereses nos ayudarán a personalizar tu experiencia y mostrarte contenido relevante"
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <p className="text-gray-300 text-lg mb-2">{getRecommendationText()}</p>
        <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
          Selecciona al menos 3 intereses
        </Badge>
      </div>

      <div className="space-y-6">
        {interestCategories.map((category) => {
          const CategoryIcon = category.icon
          const categoryInterests = category.interests.filter((interest) => selectedInterests.includes(interest.id))

          return (
            <Card key={category.id} className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}
                  >
                    <CategoryIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white">{category.title}</CardTitle>
                    {categoryInterests.length > 0 && (
                      <CardDescription className="text-cyan-400">
                        {categoryInterests.length} seleccionado{categoryInterests.length > 1 ? "s" : ""}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {category.interests.map((interest) => {
                    const InterestIcon = interest.icon
                    const isSelected = selectedInterests.includes(interest.id)

                    return (
                      <div
                        key={interest.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                          isSelected
                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-400"
                            : "bg-white/5 border-white/10 text-gray-300 hover:border-white/20 hover:text-white"
                        }`}
                        onClick={() => handleInterestToggle(interest.id)}
                      >
                        <div className="flex flex-col items-center text-center space-y-2">
                          <InterestIcon className="h-6 w-6" />
                          <span className="text-sm font-medium">{interest.name}</span>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleInterestToggle(interest.id)}
                            className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedInterests.length > 0 && (
        <div className="text-center p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-400/30">
          <p className="text-cyan-400 font-medium text-lg mb-3">
            Has seleccionado {selectedInterests.length} intereses
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {selectedInterests.map((interestId) => {
              const interest = interestCategories.flatMap((cat) => cat.interests).find((int) => int.id === interestId)
              return (
                <Badge key={interestId} className="bg-cyan-500">
                  {interest?.name}
                </Badge>
              )
            })}
          </div>
          {selectedInterests.length >= 3 && (
            <p className="text-green-400 text-sm mt-2">¡Perfecto! Ya puedes continuar al siguiente paso</p>
          )}
        </div>
      )}
    </div>
  )
}
