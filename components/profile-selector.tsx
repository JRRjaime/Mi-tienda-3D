"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, Palette, User } from "lucide-react"

interface ProfileSelectorProps {
  onSelectProfile: (profileType: string) => void
}

const profileTypes = [
  {
    id: "impresor",
    title: "Impresor",
    description: "Ofrece servicios de impresión 3D y gestiona pedidos",
    icon: Printer,
    color: "from-blue-500 to-cyan-500",
    features: ["Gestionar pedidos", "Modelos a imprimir", "Configurar precios", "Historial de trabajos"],
  },
  {
    id: "creador",
    title: "Creador",
    description: "Sube y vende modelos 3D a la comunidad",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    features: ["Subir modelos", "Gestionar ventas", "Estadísticas", "Comunidad"],
  },
  {
    id: "usuario",
    title: "Usuario",
    description: "Compra modelos y servicios de impresión",
    icon: User,
    color: "from-green-500 to-emerald-500",
    features: ["Comprar modelos", "Solicitar impresiones", "Favoritos", "Historial"],
  },
]

export function ProfileSelector({ onSelectProfile }: ProfileSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Selecciona tu perfil</h2>
        <p className="text-gray-400">Elige el tipo de cuenta que mejor se adapte a tus necesidades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profileTypes.map((profile) => {
          const IconComponent = profile.icon
          return (
            <Card
              key={profile.id}
              className="group cursor-pointer bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
              onClick={() => onSelectProfile(profile.id)}
            >
              <CardHeader className="text-center">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${profile.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white group-hover:text-cyan-400 transition-colors">
                  {profile.title}
                </CardTitle>
                <CardDescription className="text-gray-300">{profile.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400 mb-4">
                  {profile.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full bg-gradient-to-r ${profile.color} hover:opacity-90 transition-opacity`}
                  onClick={() => onSelectProfile(profile.id)}
                >
                  Seleccionar
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
