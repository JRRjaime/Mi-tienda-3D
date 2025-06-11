"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Sparkles, Users, Zap } from "lucide-react"

interface OnboardingCompleteProps {
  selectedProfiles: string[]
  selectedInterests: string[]
}

const profileNames: Record<string, string> = {
  usuario: "Usuario",
  creador: "Creador",
  impresor: "Impresor",
}

const interestNames: Record<string, string> = {
  gaming: "Gaming",
  anime: "Anime/Manga",
  peliculas: "Películas/Series",
  musica: "Música",
  coleccionables: "Coleccionables",
  decoracion: "Decoración",
  organizacion: "Organización",
  cocina: "Cocina",
  jardineria: "Jardinería",
  moda: "Moda",
  ingenieria: "Ingeniería",
  arquitectura: "Arquitectura",
  medicina: "Medicina",
  educacion: "Educación",
  tecnologia: "Tecnología",
  arte: "Arte y Diseño",
  fotografia: "Fotografía",
  deportes: "Deportes",
  viajes: "Viajes",
  joyeria: "Joyería",
  automoviles: "Automóviles",
  motocicletas: "Motocicletas",
  drones: "Drones",
  modelismo: "Modelismo",
  rc: "Radio Control",
}

export function OnboardingComplete({ selectedProfiles, selectedInterests }: OnboardingCompleteProps) {
  const getPersonalizedMessage = () => {
    if (selectedProfiles.includes("creador") && selectedProfiles.includes("impresor")) {
      return "Como creador e impresor, tendrás acceso completo a nuestra plataforma para diseñar, vender y producir modelos 3D."
    }
    if (selectedProfiles.includes("creador")) {
      return "Como creador, podrás subir tus diseños y conectar con una comunidad global de entusiastas del 3D."
    }
    if (selectedProfiles.includes("impresor")) {
      return "Como impresor, recibirás pedidos de clientes que necesitan materializar sus ideas en 3D."
    }
    return "Como usuario, tendrás acceso a miles de modelos 3D y servicios de impresión profesional."
  }

  const getRecommendations = () => {
    const recommendations = []

    if (selectedInterests.includes("gaming") || selectedInterests.includes("anime")) {
      recommendations.push("Explora nuestra sección de figuras coleccionables")
    }
    if (selectedInterests.includes("decoracion") || selectedInterests.includes("organizacion")) {
      recommendations.push("Descubre modelos para el hogar y organización")
    }
    if (selectedInterests.includes("ingenieria") || selectedInterests.includes("tecnologia")) {
      recommendations.push("Revisa nuestros prototipos industriales")
    }
    if (selectedInterests.includes("arte") || selectedInterests.includes("joyeria")) {
      recommendations.push("Visita la galería de arte y joyería personalizada")
    }

    return recommendations.slice(0, 3)
  }

  return (
    <div className="space-y-6">
      {/* Mensaje de bienvenida */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">¡Bienvenido a World 3D!</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">{getPersonalizedMessage()}</p>
      </div>

      {/* Resumen de configuración */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-400" />
              Tipos de Perfil
            </CardTitle>
            <CardDescription className="text-gray-300">Los roles que has seleccionado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedProfiles.map((profileId) => (
                <Badge key={profileId} className="bg-cyan-500 text-white">
                  {profileNames[profileId]}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Tus Intereses
            </CardTitle>
            <CardDescription className="text-gray-300">
              {selectedInterests.length} intereses seleccionados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {selectedInterests.map((interestId) => (
                <Badge key={interestId} variant="outline" className="text-purple-400 border-purple-400/30">
                  {interestNames[interestId]}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones personalizadas */}
      {getRecommendations().length > 0 && (
        <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-400/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Recomendaciones Personalizadas
            </CardTitle>
            <CardDescription className="text-gray-300">Basado en tus intereses, te sugerimos:</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {getRecommendations().map((recommendation, index) => (
                <li key={index} className="flex items-center text-white">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3" />
                  {recommendation}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Próximos pasos */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">¿Qué sigue?</CardTitle>
          <CardDescription className="text-gray-300">Aquí tienes algunas acciones que puedes realizar:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-cyan-400 font-medium">Explora la plataforma</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Navega por las categorías de productos</li>
                <li>• Descubre modelos populares</li>
                <li>• Conecta con la comunidad</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-cyan-400 font-medium">Personaliza tu perfil</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Completa tu información personal</li>
                <li>• Configura tus preferencias</li>
                <li>• Añade una foto de perfil</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
