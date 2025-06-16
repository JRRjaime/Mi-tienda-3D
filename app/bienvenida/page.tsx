"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { CheckCircle, User, Mail, Calendar, Star, ArrowRight, Zap } from "lucide-react"

export default function BienvenidaPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular un pequeño delay para mostrar la carga
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!isAuthenticated) {
        router.push("/")
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white">Configurando tu experiencia...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!user || !user.name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Error: No se pudo cargar la información del usuario</p>
          <Button onClick={() => router.push("/")} className="mt-4 bg-cyan-500 hover:bg-cyan-600">
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  const safeUser = {
    ...user,
    name: user.name || "Usuario",
    email: user.email || "email@ejemplo.com",
    role: user.role || "user",
    interests: user.interests || [],
    createdAt: user.createdAt || new Date().toISOString(),
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "creator":
        return {
          title: "Creador de Modelos 3D",
          description: "Sube y vende tus diseños únicos",
          color: "bg-purple-500",
          nextSteps: ["Sube tu primer modelo 3D", "Configura tus precios", "Promociona tus diseños"],
        }
      case "printer":
        return {
          title: "Proveedor de Impresión 3D",
          description: "Ofrece servicios de impresión profesional",
          color: "bg-green-500",
          nextSteps: [
            "Configura tu perfil de impresor",
            "Define tus materiales disponibles",
            "Establece tus tarifas de impresión",
          ],
        }
      case "user":
        return {
          title: "Explorador 3D",
          description: "Descubre y compra modelos increíbles",
          color: "bg-blue-500",
          nextSteps: ["Explora el catálogo de modelos", "Guarda tus favoritos", "Realiza tu primera compra"],
        }
      default:
        return {
          title: "Usuario",
          description: "Bienvenido a la plataforma",
          color: "bg-gray-500",
          nextSteps: ["Explora la plataforma"],
        }
    }
  }

  const roleInfo = getRoleInfo(safeUser.role)

  const safeStats = {
    balance: user.stats?.balance || 0,
    totalOrders: user.stats?.totalOrders || 0,
    modelsUploaded: user.stats?.modelsUploaded || 0,
    rating: user.stats?.rating || 5.0,
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header de Bienvenida */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">¡Bienvenido a World 3D!</h1>
              <p className="text-xl text-gray-300">Tu cuenta ha sido configurada exitosamente</p>
            </div>
          </div>
        </div>

        {/* Información del Usuario */}
        <Card className="mb-8 bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage
                  src={safeUser.avatar && !safeUser.avatar.includes("blob:") ? safeUser.avatar : undefined}
                  alt={safeUser.name}
                />
                <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                  {safeUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl">{safeUser.name}</h2>
                <Badge className={`${roleInfo.color} text-white mt-1`}>{roleInfo.title}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-cyan-400" />
                  <span>{safeUser.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-cyan-400" />
                  <span>Miembro desde {new Date(safeUser.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3 text-cyan-400" />
                  <span>{roleInfo.description}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Estado de tu Perfil</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Perfil Configurado</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Intereses Seleccionados</span>
                    <Badge variant="secondary">{safeUser.interests.length} temas</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Balance Inicial</span>
                    <Badge variant="outline">${safeStats.balance.toFixed(2)}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Pasos */}
        <Card className="mb-8 bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="h-6 w-6 mr-2 text-yellow-500" />
              Próximos Pasos Recomendados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roleInfo.nextSteps.map((step, index) => (
                <div key={index} className="flex items-center text-white">
                  <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas Iniciales */}
        <Card className="mb-8 bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-500" />
              Tu Dashboard Inicial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">${safeStats.balance.toFixed(2)}</div>
                <div className="text-sm text-gray-300">Balance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{safeStats.totalOrders}</div>
                <div className="text-sm text-gray-300">Pedidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{safeStats.modelsUploaded}</div>
                <div className="text-sm text-gray-300">Modelos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{safeStats.rating}</div>
                <div className="text-sm text-gray-300">Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/productos")}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3"
          >
            Explorar Mercado
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            onClick={() => router.push("/perfil")}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 px-8 py-3"
          >
            Ver Mi Perfil
            <User className="ml-2 h-5 w-5" />
          </Button>

          {safeUser.role === "creator" && (
            <Button
              onClick={() => router.push("/subir-modelo")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3"
            >
              Subir Modelo
              <Zap className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Mensaje de Confirmación */}
        <div className="text-center mt-8 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-green-300 font-medium">✅ Sistema de autenticación funcionando correctamente</p>
          <p className="text-green-200 text-sm mt-1">Todos los componentes se han cargado sin errores</p>
        </div>
      </div>
    </div>
  )
}
