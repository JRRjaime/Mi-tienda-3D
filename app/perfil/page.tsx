"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  User,
  Wallet,
  Package,
  Settings,
  Heart,
  Upload,
  Printer,
  ShoppingBag,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { ProfileSettings } from "@/components/profile-settings"
import { UserWallet } from "@/components/user-wallet"
import { UserShipments } from "@/components/user-shipments"
import { UserFavorites } from "@/components/user-favorites"
import { UserPurchases } from "@/components/user-purchases"
import { CreatorModels } from "@/components/creator-models"
import { PrinterOrders } from "@/components/printer-orders"
import { PrinterReceivedModels } from "@/components/printer-received-models"
import { AccountSettings } from "@/components/account-settings"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { NotificationSystem } from "@/components/notification-system"
import { ChatSystem } from "@/components/chat/chat-system"
import { useAuth } from "@/contexts/auth-context"
// Importar el nuevo componente de foto de perfil
import { ProfilePhotoUpload } from "@/components/profile/profile-photo-upload"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("perfil")
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <header className="relative z-10 p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </header>
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader className="text-center">
                  <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-40 mx-auto" />
                </CardHeader>
              </Card>
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-12 w-full mb-8" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Si no hay usuario, no renderizar nada (se redirigirá)
  if (!user) {
    return null
  }

  // Mapear el rol del usuario a tipos de perfil
  const getProfileTypesFromRole = (role: string) => {
    switch (role) {
      case "creator":
        return ["creador"]
      case "printer":
        return ["impresor"]
      case "user":
        return ["usuario"]
      case "admin":
        return ["usuario", "creador", "impresor"]
      default:
        return ["usuario"]
    }
  }

  const profileTypes = getProfileTypesFromRole(user.role)

  const getProfileBadges = () => {
    return profileTypes.map((type) => {
      switch (type) {
        case "impresor":
          return (
            <Badge key={type} className="bg-blue-500">
              <Printer className="h-3 w-3 mr-1" />
              Impresor
            </Badge>
          )
        case "creador":
          return (
            <Badge key={type} className="bg-purple-500">
              <Upload className="h-3 w-3 mr-1" />
              Creador
            </Badge>
          )
        case "usuario":
          return (
            <Badge key={type} className="bg-green-500">
              <User className="h-3 w-3 mr-1" />
              Usuario
            </Badge>
          )
        default:
          return null
      }
    })
  }

  const getTabsForProfile = () => {
    const baseTabs = [
      { id: "perfil", label: "Mi Perfil", icon: User },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "cartera", label: "Cartera", icon: Wallet },
      { id: "envios", label: "Envíos", icon: Package },
      { id: "configuracion", label: "Configuración", icon: Settings },
    ]

    const specificTabs = []

    // Agregar tabs específicos según los tipos de perfil
    if (profileTypes.includes("impresor")) {
      specificTabs.push({ id: "modelos-recibidos", label: "Modelos Recibidos", icon: Printer })
      specificTabs.push({ id: "pedidos", label: "Pedidos", icon: Package })
    }

    if (profileTypes.includes("creador")) {
      specificTabs.push({ id: "mis-modelos", label: "Mis Modelos", icon: Upload })
    }

    if (profileTypes.includes("usuario")) {
      specificTabs.push({ id: "compras", label: "Compras", icon: ShoppingBag })
      specificTabs.push({ id: "favoritos", label: "Favoritos", icon: Heart })
    }

    return [...baseTabs, ...specificTabs]
  }

  // Calcular fecha de registro formateada
  const getJoinDate = () => {
    const date = new Date(user.createdAt)
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long" })
  }

  // Simular balance basado en el tipo de usuario
  const getBalance = () => {
    // Todos los usuarios empiezan con balance en 0
    return 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/productos">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">3D</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
            <div className="flex items-center gap-2">
              <NotificationSystem userId={user.email} userType={profileTypes} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar con información del usuario */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader className="text-center">
                {/* Usar el nuevo componente de foto de perfil */}
                <ProfilePhotoUpload currentPhoto={user.avatar} userName={user.name} />
                <CardTitle className="text-white">{user.name}</CardTitle>
                <CardDescription className="text-gray-300">{user.email}</CardDescription>
                <div className="flex flex-wrap justify-center gap-2 mt-2">{getProfileBadges()}</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">${getBalance().toFixed(2)}</div>
                  <div className="text-sm text-gray-400">Saldo disponible</div>
                </div>
                <div className="text-center text-sm text-gray-400">Miembro desde {getJoinDate()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
                {getTabsForProfile().map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              <TabsContent value="perfil">
                <ProfileSettings user={user} />
              </TabsContent>

              <TabsContent value="analytics">
                <AnalyticsDashboard userType={profileTypes} />
              </TabsContent>

              <TabsContent value="cartera">
                <UserWallet user={user} />
              </TabsContent>

              <TabsContent value="envios">
                <UserShipments />
              </TabsContent>

              <TabsContent value="configuracion">
                <AccountSettings user={user} />
              </TabsContent>

              {/* Tabs específicos por tipo de perfil */}
              {profileTypes.includes("usuario") && (
                <>
                  <TabsContent value="favoritos">
                    <UserFavorites />
                  </TabsContent>
                  <TabsContent value="compras">
                    <UserPurchases />
                  </TabsContent>
                </>
              )}

              {profileTypes.includes("creador") && (
                <TabsContent value="mis-modelos">
                  <CreatorModels />
                </TabsContent>
              )}

              {profileTypes.includes("impresor") && (
                <>
                  <TabsContent value="modelos-recibidos">
                    <PrinterReceivedModels />
                  </TabsContent>
                  <TabsContent value="pedidos">
                    <PrinterOrders />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </div>
      {/* Sistema de chat */}
      <ChatSystem userId={user.email} userType={profileTypes} />
    </div>
  )
}
