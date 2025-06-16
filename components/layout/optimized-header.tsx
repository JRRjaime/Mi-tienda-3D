"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { CartSystem } from "@/components/cart/cart-system"
import { NotificationSystem } from "@/components/notification-system"
import {
  Menu,
  X,
  Search,
  User,
  Settings,
  LogOut,
  Zap,
  Crown,
  Palette,
  Printer,
  BarChart3,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const navigation = [
  { name: "Inicio", href: "/", icon: null },
  { name: "Productos", href: "/productos", icon: null },
  { name: "Monetización", href: "/monetizacion", icon: Zap, badge: "Nuevo", color: "text-yellow-400" },
  { name: "Colaboración", href: "/collaboration", icon: null },
  { name: "Herramientas", href: "/printer-tools", icon: Printer, color: "text-blue-400" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, color: "text-green-400" },
]

export function OptimizedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isAdmin = user?.role === "admin"
  const isCreator = user?.profileTypes?.includes("creador")
  const isPrinter = user?.profileTypes?.includes("impresor")

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-blue-200/50 dark:border-slate-700/50 shadow-lg shadow-blue-500/10"
          : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-lg">3D</span>
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-pulse" />
              </div>
              {isAdmin && <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-bounce" />}
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                World 3D
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Plataforma de Modelos 3D</p>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "relative transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800",
                    )}
                  >
                    {Icon && <Icon className={cn("h-4 w-4 mr-2", item.color)} />}
                    {item.name}
                    {item.badge && (
                      <Badge className="ml-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-1 py-0 animate-pulse">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <NotificationSystem />

            {/* Cart */}
            <CartSystem />

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Profile Types Badges */}
                <div className="hidden md:flex items-center space-x-1">
                  {isCreator && (
                    <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white border-0 shadow-lg shadow-purple-500/30">
                      <Palette className="h-3 w-3 mr-1" />
                      Creador
                    </Badge>
                  )}
                  {isPrinter && (
                    <Badge className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/30">
                      <Printer className="h-3 w-3 mr-1" />
                      Impresor
                    </Badge>
                  )}
                  {isAdmin && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg shadow-yellow-500/30 animate-pulse">
                      <Crown className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>

                {/* User Avatar */}
                <Link href="/perfil">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Admin Panel */}
                {isAdmin && (
                  <Link href="/admin">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </Link>
                )}

                {/* Logout */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300"
                  >
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-blue-200/50 dark:border-slate-700/50 py-4 animate-in slide-in-from-top-2 duration-200 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        isActive
                          ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                          : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800",
                      )}
                    >
                      {Icon && <Icon className={cn("h-4 w-4 mr-2", item.color)} />}
                      {item.name}
                      {item.badge && (
                        <Badge className="ml-auto bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs animate-pulse">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Profile Types */}
            {user && (
              <div className="mt-4 pt-4 border-t border-blue-200/50 dark:border-slate-700/50">
                <div className="flex flex-wrap gap-2">
                  {isCreator && (
                    <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white border-0 shadow-lg shadow-purple-500/30">
                      <Palette className="h-3 w-3 mr-1" />
                      Creador
                    </Badge>
                  )}
                  {isPrinter && (
                    <Badge className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/30">
                      <Printer className="h-3 w-3 mr-1" />
                      Impresor
                    </Badge>
                  )}
                  {isAdmin && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg shadow-yellow-500/30 animate-pulse">
                      <Crown className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
