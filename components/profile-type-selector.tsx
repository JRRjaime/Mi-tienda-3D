"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Printer, Palette, User, Check } from "lucide-react"

interface ProfileTypeSelectorProps {
  selectedProfiles: string[]
  onSelectionChange: (profiles: string[]) => void
}

const profileTypes = [
  {
    id: "usuario",
    title: "Usuario",
    description: "Compra modelos 3D y solicita servicios de impresión",
    icon: User,
    color: "from-green-500 to-emerald-500",
    features: [
      "Comprar modelos 3D",
      "Solicitar impresiones",
      "Guardar favoritos",
      "Seguimiento de pedidos",
      "Comunidad de usuarios",
    ],
    benefits: "Ideal para quienes buscan modelos únicos y servicios de impresión de calidad",
  },
  {
    id: "creador",
    title: "Creador",
    description: "Diseña y vende modelos 3D a la comunidad",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    features: [
      "Subir y vender modelos",
      "Gestionar tu tienda",
      "Analytics detallados",
      "Comunidad de creadores",
      "Herramientas de promoción",
    ],
    benefits: "Perfecto para diseñadores que quieren monetizar sus creaciones",
  },
  {
    id: "impresor",
    title: "Impresor",
    description: "Ofrece servicios de impresión 3D profesional",
    icon: Printer,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Recibir pedidos de impresión",
      "Gestionar tu taller",
      "Configurar precios",
      "Red de impresores",
      "Certificaciones de calidad",
    ],
    benefits: "Ideal para profesionales con impresoras 3D que buscan clientes",
  },
]

export function ProfileTypeSelector({ selectedProfiles, onSelectionChange }: ProfileTypeSelectorProps) {
  const handleProfileToggle = (profileId: string) => {
    const newSelection = selectedProfiles.includes(profileId)
      ? selectedProfiles.filter((id) => id !== profileId)
      : [...selectedProfiles, profileId]

    onSelectionChange(newSelection)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <p className="text-gray-300 text-lg">Puedes seleccionar múltiples tipos de perfil según tus intereses</p>
        <Badge variant="outline" className="mt-2 text-cyan-400 border-cyan-400/30">
          Selecciona al menos uno
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {profileTypes.map((profile) => {
          const IconComponent = profile.icon
          const isSelected = selectedProfiles.includes(profile.id)

          return (
            <Card
              key={profile.id}
              className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${
                isSelected
                  ? "bg-white/10 border-cyan-400 ring-2 ring-cyan-400/50"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
              onClick={() => handleProfileToggle(profile.id)}
            >
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${profile.color} flex items-center justify-center`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleProfileToggle(profile.id)}
                      className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    {isSelected && (
                      <Badge className="bg-cyan-500">
                        <Check className="h-3 w-3 mr-1" />
                        Seleccionado
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle
                  className={`text-white text-xl transition-colors ${
                    isSelected ? "text-cyan-400" : "group-hover:text-cyan-400"
                  }`}
                >
                  {profile.title}
                </CardTitle>
                <CardDescription className="text-gray-300 text-base">{profile.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Características:</h4>
                  <ul className="space-y-1">
                    {profile.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-300 italic">{profile.benefits}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedProfiles.length > 0 && (
        <div className="text-center p-4 bg-cyan-500/10 rounded-lg border border-cyan-400/30">
          <p className="text-cyan-400 font-medium">
            Has seleccionado {selectedProfiles.length} tipo{selectedProfiles.length > 1 ? "s" : ""} de perfil
          </p>
          <div className="flex justify-center gap-2 mt-2">
            {selectedProfiles.map((profileId) => {
              const profile = profileTypes.find((p) => p.id === profileId)
              return (
                <Badge key={profileId} className="bg-cyan-500">
                  {profile?.title}
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
