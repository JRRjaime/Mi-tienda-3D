"use client"

import { RealOrderManagement } from "@/components/orders/real-order-management"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

export default function PedidosPage() {
  const { user } = useAuth()
  const [userType, setUserType] = useState<"buyer" | "printer">("buyer")

  useEffect(() => {
    // Determinar el tipo de usuario basado en su perfil
    if (user?.profileTypes?.includes("printer")) {
      setUserType("printer")
    } else {
      setUserType("buyer")
    }
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acceso Requerido</h1>
          <p className="text-gray-400">Debes iniciar sesión para ver tus pedidos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <RealOrderManagement userType={userType} userId={user.id} />
      </div>
    </div>
  )
}
