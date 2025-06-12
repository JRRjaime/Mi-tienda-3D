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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, User, LogOut, Settings, Menu, Heart, Upload, Users, Wrench } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthModal } from "@/components/auth/auth-modal"
import { useAuth } from "@/contexts/auth-context"
import { NotificationSystem } from "@/components/notification-system"

export function GlobalHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  const isCreator = user?.role === "creator" || user?.role === "admin"
  const isPrinter = user?.role === "printer" || user?.role === "admin"

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">3D</span>
              </div>
              <span className="hidden sm:inline-block font-bold text-white">World 3D</span>
            </Link>

            {/* Navegación Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/productos" className="text-gray-300 hover:text-white transition-colors">
                Explorar
              </Link>
              <Link href="/productos/figuras" className="text-gray-300 hover:text-white transition-colors">
                Figuras
              </Link>
              <Link href="/productos/hogar" className="text-gray-300 hover:text-white transition-colors">
                Hogar
              </Link>
              <Link href="/productos/industrial" className="text-gray-300 hover:text-white transition-colors">
                Industrial
              </Link>
              <Link href="/collaboration" className="text-gray-300 hover:text-white transition-colors">
                <Users className="h-4 w-4 inline mr-1" />
                Colaboración
              </Link>
              {isPrinter && (
                <Link href="/printer-tools" className="text-gray-300 hover:text-white transition-colors">
                  <Wrench className="h-4 w-4 inline mr-1" />
                  Herramientas
                </Link>
              )}
            </nav>

            {/* Búsqueda */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar modelos 3D..."
                  className="w-full pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center space-x-4">
              {/* Búsqueda móvil */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-gray-300 hover:text-white"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Usuario autenticado */}
              {isAuthenticated && user ? (
                <>
                  {/* Notificaciones */}
                  {user && user.id && <NotificationSystem userId={user.id} userType={[user.role]} />}

                  {/* Menú de usuario */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
                        <Link href="/perfil">
                          <User className="mr-2 h-4 w-4" />
                          <span>Mi Perfil</span>
                        </Link>
                      </DropdownMenuItem>
                      {isCreator && (
                        <DropdownMenuItem asChild>
                          <Link href="/perfil?tab=mis-modelos">
                            <Upload className="mr-2 h-4 w-4" />
                            <span>Mis Modelos</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href="/perfil?tab=favoritos">
                          <Heart className="mr-2 h-4 w-4" />
                          <span>Favoritos</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/collaboration">
                          <Users className="mr-2 h-4 w-4" />
                          <span>Colaboración</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/perfil?tab=configuracion">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Configuración</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                /* Usuario no autenticado */
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  Iniciar Sesión
                </Button>
              )}

              <ThemeToggle />

              {/* Menú móvil */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden text-gray-300 hover:text-white">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-4">
                    {/* Búsqueda móvil */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Buscar modelos 3D..." className="pl-10" />
                    </div>

                    <Link href="/productos" className="text-lg font-medium">
                      Explorar
                    </Link>
                    <Link href="/productos/figuras" className="text-lg font-medium">
                      Figuras
                    </Link>
                    <Link href="/productos/hogar" className="text-lg font-medium">
                      Hogar
                    </Link>
                    <Link href="/productos/industrial" className="text-lg font-medium">
                      Industrial
                    </Link>
                    <Link href="/collaboration" className="text-lg font-medium flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Colaboración
                    </Link>
                    {isPrinter && (
                      <Link href="/printer-tools" className="text-lg font-medium flex items-center">
                        <Wrench className="h-4 w-4 mr-2" />
                        Herramientas
                      </Link>
                    )}

                    {/* Botón de login en móvil si no está autenticado */}
                    {!isAuthenticated && (
                      <Button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 mt-4"
                      >
                        Iniciar Sesión
                      </Button>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
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
        </div>
      </header>

      {/* Modal de autenticación */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
