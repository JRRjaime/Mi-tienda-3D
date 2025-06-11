"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Tipos para las estadísticas
export interface UserStats {
  modelsUploaded: number
  totalDownloads: number
  totalEarnings: number
  totalViews: number
  totalReviews: number
  totalLikes: number
  averageRating: number
}

// Tipos para el contexto de estadísticas
interface StatsContextType {
  stats: UserStats
  updateStats: (newStats: Partial<UserStats>) => void
  incrementModelCount: () => void
  incrementDownloads: (count?: number) => void
  incrementEarnings: (amount: number) => void
  incrementViews: (count?: number) => void
  incrementReviews: () => void
  incrementLikes: () => void
  resetStats: () => void
}

// Estadísticas iniciales (todo en 0)
const initialStats: UserStats = {
  modelsUploaded: 0,
  totalDownloads: 0,
  totalEarnings: 0,
  totalViews: 0,
  totalReviews: 0,
  totalLikes: 0,
  averageRating: 0,
}

// Crear el contexto
const StatsContext = createContext<StatsContextType | undefined>(undefined)

// Hook personalizado para usar el contexto
export const useStats = () => {
  const context = useContext(StatsContext)
  if (context === undefined) {
    throw new Error("useStats debe ser usado dentro de un StatsProvider")
  }
  return context
}

// Proveedor del contexto
export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<UserStats>(initialStats)

  // Cargar estadísticas del localStorage al inicializar
  useEffect(() => {
    const storedStats = localStorage.getItem("userStats")
    if (storedStats) {
      try {
        setStats(JSON.parse(storedStats))
      } catch (error) {
        console.error("Error parsing stored stats:", error)
        setStats(initialStats)
      }
    }
  }, [])

  // Guardar estadísticas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("userStats", JSON.stringify(stats))
  }, [stats])

  // Función para actualizar estadísticas
  const updateStats = (newStats: Partial<UserStats>) => {
    setStats((prev) => ({ ...prev, ...newStats }))
  }

  // Función para incrementar el contador de modelos
  const incrementModelCount = () => {
    setStats((prev) => ({
      ...prev,
      modelsUploaded: prev.modelsUploaded + 1,
      // Agregar algunas vistas iniciales aleatorias cuando se sube un modelo
      totalViews: prev.totalViews + Math.floor(Math.random() * 10) + 1,
    }))
  }

  // Función para incrementar descargas
  const incrementDownloads = (count = 1) => {
    setStats((prev) => ({
      ...prev,
      totalDownloads: prev.totalDownloads + count,
    }))
  }

  // Función para incrementar ganancias
  const incrementEarnings = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      totalEarnings: prev.totalEarnings + amount,
    }))
  }

  // Función para incrementar vistas
  const incrementViews = (count = 1) => {
    setStats((prev) => ({
      ...prev,
      totalViews: prev.totalViews + count,
    }))
  }

  // Función para incrementar reviews
  const incrementReviews = () => {
    setStats((prev) => ({
      ...prev,
      totalReviews: prev.totalReviews + 1,
    }))
  }

  // Función para incrementar likes
  const incrementLikes = () => {
    setStats((prev) => ({
      ...prev,
      totalLikes: prev.totalLikes + 1,
    }))
  }

  // Función para resetear estadísticas
  const resetStats = () => {
    setStats(initialStats)
    localStorage.removeItem("userStats")
  }

  return (
    <StatsContext.Provider
      value={{
        stats,
        updateStats,
        incrementModelCount,
        incrementDownloads,
        incrementEarnings,
        incrementViews,
        incrementReviews,
        incrementLikes,
        resetStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  )
}
