"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CollaborationDashboard } from "@/components/collaboration/collaboration-dashboard"
import { GlobalHeader } from "@/components/global-header"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth/auth-modal"
import {
  Users,
  GitBranch,
  MessageSquare,
  Target,
  Star,
  Rocket,
  Shield,
  Award,
  Heart,
  Coffee,
  Sparkles,
} from "lucide-react"
import Image from "next/image"

export default function CollaborationPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Abrir modal de auth si viene del parámetro de URL
  useEffect(() => {
    if (searchParams.get("auth") === "login") {
      setIsAuthModalOpen(true)
    }
  }, [searchParams])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Si hay usuario autenticado, mostrar el dashboard
  if (user && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <GlobalHeader />
        <div className="container mx-auto px-6 py-8">
          <CollaborationDashboard />
        </div>
      </div>
    )
  }

  // Si no hay usuario, mostrar pantalla de bienvenida
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Centro de Colaboración 3D
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Colabora y{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Crea Juntos
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Únete a equipos de diseñadores, makers e impresores 3D de todo el mundo. Colabora en proyectos increíbles,
              comparte conocimientos y lleva tus ideas al siguiente nivel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 text-lg"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <Users className="h-5 w-5 mr-2" />
                Iniciar Sesión para Colaborar
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <Rocket className="h-5 w-5 mr-2" />
                Crear Cuenta Gratis
              </Button>
            </div>
          </div>

          {/* Imagen Hero */}
          <div className="relative w-full max-w-4xl mx-auto">
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image src="/images/collaboration-hero.png" alt="Colaboración en equipo" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-4 text-white">
                  <Badge className="bg-green-500">
                    <div className="w-2 h-2 bg-white rounded-full mr-2" />
                    En vivo
                  </Badge>
                  <span className="text-sm">12 equipos colaborando ahora</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Características de Colaboración */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">¿Por qué colaborar con nosotros?</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Descubre las herramientas y beneficios que hacen de nuestra plataforma el lugar perfecto para proyectos
            colaborativos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Característica 1 */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-cyan-400/50 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Equipos Globales</CardTitle>
              <CardDescription className="text-gray-300">
                Conecta con diseñadores y makers de todo el mundo para crear proyectos únicos
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Característica 2 */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-400/50 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GitBranch className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Control de Versiones</CardTitle>
              <CardDescription className="text-gray-300">
                Mantén un historial completo de cambios y colabora sin perder ninguna versión
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Característica 3 */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-green-400/50 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Chat en Tiempo Real</CardTitle>
              <CardDescription className="text-gray-300">
                Comunícate instantáneamente con tu equipo mientras trabajas en el proyecto
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Característica 4 */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-yellow-400/50 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Gestión de Tareas</CardTitle>
              <CardDescription className="text-gray-300">
                Organiza el trabajo con tableros Kanban y seguimiento de progreso en tiempo real
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Característica 5 */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-red-400/50 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Proyectos Seguros</CardTitle>
              <CardDescription className="text-gray-300">
                Controla quién puede ver y editar tus proyectos con permisos granulares
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Característica 6 */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-indigo-400/50 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Reconocimiento</CardTitle>
              <CardDescription className="text-gray-300">
                Gana badges y reconocimiento por tus contribuciones a la comunidad
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Estadísticas de la Comunidad */}
      <div className="bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Una comunidad que crece cada día</h2>
            <p className="text-gray-300 text-lg">Únete a miles de creadores que ya están colaborando</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">2.5K+</div>
              <div className="text-gray-300">Proyectos Activos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">15K+</div>
              <div className="text-gray-300">Colaboradores</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">50K+</div>
              <div className="text-gray-300">Modelos Creados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">98%</div>
              <div className="text-gray-300">Satisfacción</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonios */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Lo que dicen nuestros colaboradores</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "La plataforma de colaboración ha revolucionado la forma en que trabajo con mi equipo. Podemos iterar
                rápidamente y mantener a todos sincronizados."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">MR</span>
                </div>
                <div>
                  <div className="text-white font-medium">María Rodríguez</div>
                  <div className="text-gray-400 text-sm">Diseñadora Industrial</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "Increíble cómo puedo colaborar con diseñadores de otros países en tiempo real. Las herramientas son
                intuitivas y potentes."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">JL</span>
                </div>
                <div>
                  <div className="text-white font-medium">Jorge López</div>
                  <div className="text-gray-400 text-sm">Maker & Inventor</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "La gestión de versiones y el chat integrado han hecho que nuestros proyectos sean mucho más eficientes.
                ¡Altamente recomendado!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">AS</span>
                </div>
                <div>
                  <div className="text-white font-medium">Ana Silva</div>
                  <div className="text-gray-400 text-sm">Arquitecta 3D</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action Final */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">¿Listo para empezar a colaborar?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad de creadores y lleva tus proyectos 3D al siguiente nivel
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 text-lg"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <Heart className="h-5 w-5 mr-2" />
              Comenzar Ahora - Es Gratis
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
              onClick={() => router.push("/productos")}
            >
              <Coffee className="h-5 w-5 mr-2" />
              Explorar Proyectos
            </Button>
          </div>

          <p className="text-gray-400 text-sm mt-6">Sin compromisos • Cancela cuando quieras • Soporte 24/7</p>
        </div>
      </div>

      {/* Modal de Autenticación */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}
