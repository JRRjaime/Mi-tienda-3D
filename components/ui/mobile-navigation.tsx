"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Printer,
  Palette,
  BarChart3,
  MessageSquare,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"

const mobileNavItems = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Buscar", href: "/productos", icon: Search },
  { name: "Carrito", href: "/carrito", icon: ShoppingCart },
  { name: "Perfil", href: "/perfil", icon: User },
]

export function MobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()
  const { totalItems } = useCart()

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-slate-700 md:hidden">
        <div className="grid grid-cols-4 h-16">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "h-full w-full flex flex-col items-center justify-center gap-1 rounded-none",
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-600 dark:text-gray-400",
                  )}
                >
                  <div className="relative">
                    <Icon className="h-5 w-5" />
                    {item.name === "Carrito" && totalItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 bg-red-500 text-xs flex items-center justify-center">
                        {totalItems > 9 ? "9+" : totalItems}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.name}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsMenuOpen(true)}
        className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg md:hidden"
        size="icon"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Full Screen Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden">
          <div className="absolute inset-x-0 bottom-0 bg-white dark:bg-slate-900 rounded-t-2xl p-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menú</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* User Info */}
              {user && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Link href="/subir-modelo" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                    <Palette className="h-4 w-4 mr-2" />
                    Subir Modelo
                  </Button>
                </Link>
                <Link href="/printer-tools" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    <Printer className="h-4 w-4 mr-2" />
                    Herramientas
                  </Button>
                </Link>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                <Link href="/analytics" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <BarChart3 className="h-5 w-5 mr-3" />
                    Analytics
                  </Button>
                </Link>
                <Link href="/mensajes" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <MessageSquare className="h-5 w-5 mr-3" />
                    Mensajes
                  </Button>
                </Link>
                <Link href="/notificaciones" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bell className="h-5 w-5 mr-3" />
                    Notificaciones
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for bottom navigation */}
      <div className="h-16 md:hidden" />
    </>
  )
}
