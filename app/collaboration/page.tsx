"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CollaborationDashboard } from "@/components/collaboration/collaboration-dashboard"
import { GlobalHeader } from "@/components/global-header"
import { useAuth } from "@/contexts/auth-context"

export default function CollaborationPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/?auth=login")
    }
  }, [isLoading, isAuthenticated, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario, no renderizar nada (se redirigirá)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />
      <div className="container mx-auto px-6 py-8">
        <CollaborationDashboard />
      </div>
    </div>
  )
}
