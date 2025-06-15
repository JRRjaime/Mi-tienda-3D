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
  Search,
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
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Diseños Personalizados",
      description: "Crea exactamente lo que imaginas con nuestros expertos",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Múltiples Materiales",
      description: "PLA, ABS, PETG, resina y materiales especializados",
      gradient: "from-orange-400 to-red-500",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Comunidad Activa",
      description: "Miles de creadores compartiendo sus mejores diseños",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Entrega Rápida",
      description: "Recibe tus impresiones en tiempo récord",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Garantía de Calidad",
      description: "100% satisfacción garantizada en cada pedido",
      gradient: "from-indigo-400 to-purple-500",
    },
  ]

  const stats = [
    { icon: <Download className="h-6 w-6" />, value: "50K+", label: "Modelos Descargados", color: "text-cyan-400" },
    { icon: <Users className="h-6 w-6" />, value: "10K+", label: "Usuarios Activos", color: "text-purple-400" },
    { icon: <Star className="h-6 w-6" />, value: "4.9", label: "Calificación Promedio", color: "text-yellow-400" },
    { icon: <Globe className="h-6 w-6" />, value: "25+", label: "Países Atendidos", color: "text-green-400" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Floating Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/10 backdrop-blur-md rounded-full px-8 py-4 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between space-x-8 min-w-[800px]">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-2 rounded-lg">
              <Printer className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">World 3D</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <a href="#explorar" className="text-white/80 hover:text-white transition-colors font-medium">
              Explorar
            </a>
            <a href="#figuras" className="text-white/80 hover:text-white transition-colors font-medium">
              Figuras
            </a>
            <a href="#hogar" className="text-white/80 hover:text-white transition-colors font-medium">
              Hogar
            </a>
            <a href="#industrial" className="text-white/80 hover:text-white transition-colors font-medium">
              Industrial
            </a>
            <a href="/collaboration" className="text-white/80 hover:text-white transition-colors font-medium">
              🤝 Colaborar
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              type="search"
              placeholder="Buscar modelos..."
              className="pl-10 pr-4 py-2 w-48 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:w-64 transition-all duration-300"
            />
          </div>

          {/* Auth & Theme */}
          <div className="flex items-center space-x-3">
            {!isAuthenticated ? (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 px-6 py-2 font-medium"
              >
                Iniciar Sesión
              </Button>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-white/80 text-sm font-medium">Hola, {user?.name}</span>
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                  Mi Perfil
                </Button>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu - Solo visible en móvil */}
        <div className="lg:hidden mt-4 pt-4 border-t border-white/20">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a href="#explorar" className="text-white/80 hover:text-white transition-colors text-sm">
              Explorar
            </a>
            <a href="#figuras" className="text-white/80 hover:text-white transition-colors text-sm">
              Figuras
            </a>
            <a href="#hogar" className="text-white/80 hover:text-white transition-colors text-sm">
              Hogar
            </a>
            <a href="#industrial" className="text-white/80 hover:text-white transition-colors text-sm">
              Industrial
            </a>
            <a href="/collaboration" className="text-white/80 hover:text-white transition-colors text-sm">
              🤝 Colaborar
            </a>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              type="search"
              placeholder="Buscar modelos 3D..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-400/30">
            🚀 Plataforma líder en impresión 3D
          </Badge>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
            El Futuro de la
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Impresión 3D
            </span>
          </h1>

          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Descubre, crea y comparte modelos 3D increíbles. Conecta con una comunidad global de diseñadores, impresores
            y entusiastas de la tecnología 3D.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-4 text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <Play className="mr-2 h-5 w-5" />
              Comenzar Ahora
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8 py-4 text-lg shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Explorar Catálogo
            </Button>
          </div>

          {/* Colorful Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`flex justify-center mb-2 ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="search"
              placeholder="Buscar modelos 3D increíbles..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-lg"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0">
              Buscar
            </Button>
          </div>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Aplicaciones Infinitas
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Desde prototipos industriales hasta arte decorativo, descubre las posibilidades ilimitadas de la impresión
              3D
            </p>
          </div>
          <ImageCarousel images={carouselImages} />
        </div>
      </section>

      {/* Colorful Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
              ¿Por qué elegir World 3D?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia en impresión 3D con tecnología de vanguardia y un servicio excepcional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group hover:scale-105"
              >
                <CardHeader>
                  <div
                    className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-xl mb-2 text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-white/80">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rainbow CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-500 via-purple-500 via-pink-500 to-orange-500 relative">
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            ¿Listo para crear algo increíble?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">
            Únete a miles de creadores que ya están transformando sus ideas en realidad con World 3D
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Crear Cuenta Gratis
            </Button>
            <Button
              size="lg"
              className="bg-black/20 backdrop-blur-md text-white hover:bg-black/30 border border-white/30 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Ver Planes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Colorful Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-2 rounded-lg">
                  <Printer className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">World 3D</span>
              </div>
              <p className="text-sm text-white/80">
                La plataforma líder para la creación, compartición y impresión de modelos 3D.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-cyan-400 mb-4">Productos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-white/80 hover:text-cyan-400 transition-colors">
                    Modelos 3D
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-cyan-400 transition-colors">
                    Servicios de Impresión
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-cyan-400 transition-colors">
                    Diseño Personalizado
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-cyan-400 transition-colors">
                    Materiales Premium
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-purple-400 mb-4">Soporte</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-white/80 hover:text-purple-400 transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-purple-400 transition-colors">
                    Guías de Impresión
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-purple-400 transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-purple-400 transition-colors">
                    Estado del Servicio
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-pink-400 mb-4">Contacto</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-white/80">
                  <Headphones className="h-4 w-4 text-pink-400" />
                  <span>Soporte 24/7</span>
                </div>
                <div className="flex items-center space-x-2 text-white/80">
                  <Globe className="h-4 w-4 text-pink-400" />
                  <span>Envíos mundiales</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm">
            <p className="text-white/60">&copy; 2024 World 3D. Todos los derechos reservados.</p>
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
