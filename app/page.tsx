"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth/auth-modal"
import { useAuth } from "@/contexts/auth-context"
import { ImageCarousel } from "@/components/image-carousel"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Printer,
  Palette,
  Wrench,
  Users,
  Star,
  Download,
  ShoppingCart,
  Zap,
  Globe,
  Shield,
  Headphones,
  ArrowRight,
  Play,
  CheckCircle,
} from "lucide-react"

// Componente separado para manejar los parámetros de búsqueda
function AuthHandler() {
  const searchParams = useSearchParams()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authTab, setAuthTab] = useState<"login" | "register">("login")
  const [preselectedRole, setPreselectedRole] = useState<"user" | "creator" | "printer" | null>(null)

  useEffect(() => {
    const auth = searchParams.get("auth")
    const role = searchParams.get("role")

    if (auth === "login") {
      setAuthTab("login")
      setIsAuthModalOpen(true)
    } else if (auth === "register") {
      setAuthTab("register")
      setIsAuthModalOpen(true)

      // Pre-select role if provided
      if (role === "creator" || role === "user" || role === "printer") {
        setPreselectedRole(role)
      }
    }
  }, [searchParams])

  return (
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      defaultTab={authTab}
      preselectedRole={preselectedRole}
    />
  )
}

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()

  const carouselImages = [
    {
      src: "/images/3d-prototype.png",
      alt: "Prototipo 3D",
      title: "Prototipos Profesionales",
      description: "Crea prototipos funcionales para tus proyectos",
    },
    {
      src: "/images/3d-art.png",
      alt: "Arte 3D",
      title: "Arte y Decoración",
      description: "Piezas artísticas únicas para tu hogar",
    },
    {
      src: "/images/3d-medical.png",
      alt: "Aplicación médica 3D",
      title: "Aplicaciones Médicas",
      description: "Modelos precisos para el sector salud",
    },
    {
      src: "/images/3d-automotive.png",
      alt: "Pieza automotriz 3D",
      title: "Sector Automotriz",
      description: "Repuestos y componentes personalizados",
    },
    {
      src: "/images/3d-jewelry.png",
      alt: "Joyería 3D",
      title: "Joyería Personalizada",
      description: "Diseños únicos en metales preciosos",
    },
  ]

  const features = [
    {
      icon: <Printer className="h-8 w-8" />,
      title: "Impresión de Alta Calidad",
      description: "Tecnología de vanguardia para resultados profesionales",
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Diseños Personalizados",
      description: "Crea exactamente lo que imaginas con nuestros expertos",
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Múltiples Materiales",
      description: "PLA, ABS, PETG, resina y materiales especializados",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Comunidad Activa",
      description: "Miles de creadores compartiendo sus mejores diseños",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Entrega Rápida",
      description: "Recibe tus impresiones en tiempo récord",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Garantía de Calidad",
      description: "100% satisfacción garantizada en cada pedido",
    },
  ]

  const stats = [
    { icon: <Download className="h-6 w-6" />, value: "50K+", label: "Modelos Descargados" },
    { icon: <Users className="h-6 w-6" />, value: "10K+", label: "Usuarios Activos" },
    { icon: <Star className="h-6 w-6" />, value: "4.9", label: "Calificación Promedio" },
    { icon: <Globe className="h-6 w-6" />, value: "25+", label: "Países Atendidos" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Printer className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              World 3D
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#explorar" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
              Explorar
            </a>
            <a href="#figuras" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
              Figuras
            </a>
            <a href="#hogar" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
              Hogar
            </a>
            <a href="#industrial" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
              Industrial
            </a>
            <a
              href="#colaboracion"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
            >
              🤝 Colaboración
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Buscar modelos 3D..."
                className="pl-4 pr-10 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {!isAuthenticated ? (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Iniciar Sesión
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600 dark:text-slate-300">Hola, {user?.name}</span>
                <Button variant="outline" size="sm">
                  Mi Perfil
                </Button>
              </div>
            )}

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            🚀 Plataforma líder en impresión 3D
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            El Futuro de la
            <br />
            Impresión 3D
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Descubre, crea y comparte modelos 3D increíbles. Conecta con una comunidad global de diseñadores, impresores
            y entusiastas de la tecnología 3D.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <Play className="mr-2 h-5 w-5" />
              Comenzar Ahora
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Explorar Catálogo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2 text-blue-600 dark:text-blue-400">{stat.icon}</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              Aplicaciones Infinitas
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Desde prototipos industriales hasta arte decorativo, descubre las posibilidades ilimitadas de la impresión
              3D
            </p>
          </div>
          <ImageCarousel images={carouselImages} />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white dark:bg-slate-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              ¿Por qué elegir World 3D?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia en impresión 3D con tecnología de vanguardia y un servicio excepcional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="text-blue-600 dark:text-blue-400 mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para crear algo increíble?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de creadores que ya están transformando sus ideas en realidad con World 3D
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Crear Cuenta Gratis
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
            >
              Ver Planes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Printer className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">World 3D</span>
              </div>
              <p className="text-sm">La plataforma líder para la creación, compartición y impresión de modelos 3D.</p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Productos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Modelos 3D
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Servicios de Impresión
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Diseño Personalizado
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Materiales Premium
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Soporte</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Guías de Impresión
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Estado del Servicio
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Contacto</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Headphones className="h-4 w-4" />
                  <span>Soporte 24/7</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Envíos mundiales</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 World 3D. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <Suspense fallback={null}>
        <AuthHandler />
      </Suspense>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultTab="login" />
    </div>
  )
}
