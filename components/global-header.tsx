"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { CartSystem } from "@/components/cart/cart-system"
import { NotificationSystem } from "@/components/notification-system"
import { User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface GlobalHeaderProps {
  title?: string
  showBackButton?: boolean
  backHref?: string
}

// Simular usuario logueado
const currentUser = {
  name: "Carlos Mendez",
  isLoggedIn: true,
}

export function GlobalHeader({ title = "World 3D", showBackButton = false, backHref = "/" }: GlobalHeaderProps) {
  const pathname = usePathname()

  // No mostrar el header en la página de onboarding
  if (pathname === "/onboarding") {
    return null
  }

  return (
    <header className="relative z-10 p-6 border-b border-white/10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Link href={backHref}>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
          )}
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">3D</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <ThemeToggle />
        </div>
        <div className="flex items-center space-x-4">
          <NotificationSystem />
          <CartSystem />
          {currentUser.isLoggedIn ? (
            <Link href="/perfil">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <User className="h-4 w-4 mr-2" />
                {currentUser.name}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <User className="h-4 w-4 mr-2" />
              Iniciar Sesión
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
