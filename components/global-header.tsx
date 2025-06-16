"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, User, LogOut, Settings, Heart, Upload, Wrench, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthModal } from "@/components/auth/auth-modal"
import { useAuth } from "@/contexts/auth-context"
import { EnhancedCartSystem } from "@/components/cart/enhanced-cart-system"

export function GlobalHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  const isCreator = user?.role === "creator" || user?.role === "admin"
  const isPrinter = user?.role === "printer" || user?.role === "admin"

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3D</span>
                </div>
                <span className="hidden sm:inline-block text-white font-semibold text-lg">Marketplace</span>
              </Link>
            </div>

            {/* Búsqueda - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar modelos 3D..."
                  className="w-full pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Navegación - Desktop */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/productos" className="text-white hover:text-cyan-400 transition-colors font-medium">
                Explorar
              </Link>
              {isCreator && (
                <Link href="/subir-modelo" className="text-white hover:text-cyan-400 transition-colors font-medium">
                  Subir Modelo
                </Link>
              )}
              {isPrinter && (
                <Link href="/printer-tools" className="text-white hover:text-cyan-400 transition-colors font-medium">
                  Herramientas
                </Link>
              )}
              <Link href="/collaboration" className="text-white hover:text-cyan-400 transition-colors font-medium">
                Colaborar
              </Link>
            </nav>

            {/* Acciones - Desktop */}
            <div className="flex items-center space-x-4">
              {/* Búsqueda móvil */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden text-white hover:bg-white/10"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Carrito de compras */}
              <EnhancedCartSystem />

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Usuario autenticado */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.avatar && !user.avatar.includes("blob:") ? user.avatar : undefined}
                          alt={user.name}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/perfil" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/perfil" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configuración</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/perfil" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Favoritos</span>
                      </Link>
                    </DropdownMenuItem>
                    {isCreator && (
                      <DropdownMenuItem asChild>
                        <Link href="/subir-modelo" className="cursor-pointer">
                          <Upload className="mr-2 h-4 w-4" />
                          <span>Subir Modelo</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {isPrinter && (
                      <DropdownMenuItem asChild>
                        <Link href="/printer-tools" className="cursor-pointer">
                          <Wrench className="mr-2 h-4 w-4" />
                          <span>Herramientas</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  Iniciar Sesión
                </Button>
              )}

              {/* Menú móvil */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-white hover:bg-white/10"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Búsqueda móvil expandida */}
          {isSearchOpen && (
            <div className="lg:hidden py-4 border-t border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar modelos 3D..."
                  className="w-full pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          {/* Menú móvil expandido */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-white/10">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/productos"
                  className="text-white hover:text-cyan-400 transition-colors font-medium px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Explorar Catálogo
                </Link>
                {isCreator && (
                  <Link
                    href="/subir-modelo"
                    className="text-white hover:text-cyan-400 transition-colors font-medium px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Subir Modelo
                  </Link>
                )}
                {isPrinter && (
                  <Link
                    href="/printer-tools"
                    className="text-white hover:text-cyan-400 transition-colors font-medium px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Herramientas de Impresión
                  </Link>
                )}
                <Link
                  href="/collaboration"
                  className="text-white hover:text-cyan-400 transition-colors font-medium px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Colaboración
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Modal de autenticación */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
