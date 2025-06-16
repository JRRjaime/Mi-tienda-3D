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
import { Search, User, LogOut, Settings, Heart, Upload, Wrench } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthModal } from "@/components/auth/auth-modal"
import { useAuth } from "@/contexts/auth-context"
import { EnhancedCartSystem } from "@/components/cart/enhanced-cart-system"

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
        <div className="container mx-auto flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <Link href="/" className="font-bold text-white">
            3D Models
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <EnhancedCartSystem />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                      <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  {isCreator && (
                    <DropdownMenuItem asChild>
                      <Link href="/creator/dashboard">
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Panel de Creador</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isPrinter && (
                    <DropdownMenuItem asChild>
                      <Link href="/printer/dashboard">
                        <Wrench className="mr-2 h-4 w-4" />
                        <span>Panel de Impresor</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/favorites">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Favoritos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Ajustes</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setIsAuthModalOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Acceder</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Modal de autenticación */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
