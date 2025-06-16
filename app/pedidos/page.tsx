"use client"

import { OrderTrackingSystem } from "@/components/orders/order-tracking-system"
import { useAuth } from "@/contexts/auth-context"

export default function PedidosPage() {
  const { user } = useAuth()

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
        <OrderTrackingSystem userType={user.profileTypes || ["buyer"]} userId={user.id} />
      </div>
    </div>
  )
}
