"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProjectWorkspace } from "@/components/collaboration/project-workspace"
import { useAuth } from "@/contexts/auth-context"

export default function ProjectPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  // Datos del proyecto (en una app real vendría de la API)
  const [projectData, setProjectData] = useState({
    name: "Figura Dragon Ball Z - Goku Ultra Instinct",
    description: "Proyecto colaborativo para crear la figura más detallada de Goku en su forma Ultra Instinct",
    isOwner: true,
  })

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Cargando proyecto...</p>
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
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/collaboration">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Colaboración
              </Button>
            </Link>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">3D</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Proyecto Colaborativo</h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <ProjectWorkspace
          projectId={projectId}
          projectName={projectData.name}
          projectDescription={projectData.description}
          isOwner={projectData.isOwner}
        />
      </div>
    </div>
  )
}
