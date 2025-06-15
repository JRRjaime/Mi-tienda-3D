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
