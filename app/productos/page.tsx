"use client"

import { ProductsGrid } from "@/components/products-grid"
import { GlobalHeader } from "@/components/global-header"
import { AuthModal } from "@/components/auth/auth-modal"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ProductsPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navegación Principal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">3D</span>
              </div>
              <span className="text-xl font-bold text-white">World 3D</span>
            </div>

            {/* Enlaces de navegación - Desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">
                Inicio
              </a>
              <a href="/productos" className="text-white font-medium">
                Explorar
              </a>
              <a href="/productos/figuras" className="text-gray-300 hover:text-white transition-colors">
                Figuras
              </a>
              <a href="/productos/hogar" className="text-gray-300 hover:text-white transition-colors">
                Hogar
              </a>
              <a href="/productos/industrial" className="text-gray-300 hover:text-white transition-colors">
                Industrial
              </a>
              <a href="/collaboration" className="text-gray-300 hover:text-white transition-colors">
                🤝 Colaborar
              </a>
            </div>

            {/* Búsqueda - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar modelos..."
                  className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent w-64"
                />
              </div>
            </div>

            {/* Autenticación y Tema */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300 hidden sm:block">Hola, {user.name}</span>
                  <Button
                    onClick={() => (window.location.href = "/perfil")}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
                >
                  Iniciar Sesión
                </Button>
              )}
              <ThemeToggle />
            </div>
          </div>

          {/* Navegación móvil */}
          <div className="lg:hidden pb-4">
            <div className="flex flex-wrap gap-4 mt-4">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">
                Inicio
              </a>
              <a href="/productos" className="text-white font-medium">
                Explorar
              </a>
              <a href="/productos/figuras" className="text-gray-300 hover:text-white transition-colors">
                Figuras
              </a>
              <a href="/productos/hogar" className="text-gray-300 hover:text-white transition-colors">
                Hogar
              </a>
              <a href="/productos/industrial" className="text-gray-300 hover:text-white transition-colors">
                Industrial
              </a>
              <a href="/collaboration" className="text-gray-300 hover:text-white transition-colors">
                🤝 Colaborar
              </a>
            </div>

            {/* Búsqueda móvil */}
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar modelos..."
                  className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Espaciado para navegación fija */}
      <div className="pt-16"></div>

      <GlobalHeader title="World 3D - Productos" showBackButton backHref="/" />

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Explora Nuestro Catálogo
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Descubre miles de modelos 3D, desde figuras coleccionables hasta herramientas prácticas. Usa nuestra
            búsqueda avanzada para encontrar exactamente lo que necesitas.
          </p>
        </div>

        <ProductsGrid />
      </main>

      {/* Modal de autenticación */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
