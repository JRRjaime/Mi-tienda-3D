"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Tipos para los datos de la plataforma
export interface PlatformStats {
  totalModels: number
  totalCreators: number
  totalDownloads: number
  totalUsers: number
  totalPrinters: number
  totalOrders: number
}

// Tipos para modelos
export interface Model3D {
  id: string
  title: string
  description: string
  price: number
  authorId: string
  authorName: string
  category: string
  tags: string[]
  imageUrl: string
  fileUrl: string
  downloads: number
  likes: number
  rating: number
  reviews: number
  createdAt: string
  materials: string[]
  printTime: string
  difficulty: "Fácil" | "Intermedio" | "Avanzado"
}

// Tipos para el contexto
interface PlatformDataContextType {
  stats: PlatformStats
  models: Model3D[]
  addModel: (model: Omit<Model3D, "id" | "downloads" | "likes" | "rating" | "reviews" | "createdAt">) => void
  incrementDownloads: (modelId: string) => void
  incrementLikes: (modelId: string) => void
  addReview: (modelId: string, rating: number) => void
  getUserModels: (userId: string) => Model3D[]
  updateStats: () => void
}

// EMPEZAR SIN MODELOS - Array vacío para que todo esté en 0
const INITIAL_MODELS: Model3D[] = []

// Crear el contexto
const PlatformDataContext = createContext<PlatformDataContextType | undefined>(undefined)

// Hook personalizado para usar el contexto
export const usePlatformData = () => {
  const context = useContext(PlatformDataContext)
  if (context === undefined) {
    throw new Error("usePlatformData debe ser usado dentro de un PlatformDataProvider")
  }
  return context
}

// Proveedor del contexto
export function PlatformDataProvider({ children }: { children: ReactNode }) {
  const [models, setModels] = useState<Model3D[]>([])
  const [stats, setStats] = useState<PlatformStats>({
    totalModels: 0,
    totalCreators: 0,
    totalDownloads: 0,
    totalUsers: 0,
    totalPrinters: 0,
    totalOrders: 0,
  })

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const storedModels = localStorage.getItem("platformModels")
    const storedStats = localStorage.getItem("platformStats")

    if (storedModels) {
      try {
        const parsedModels = JSON.parse(storedModels)
        setModels(parsedModels)
        updateStatsFromModels(parsedModels)
      } catch (error) {
        console.error("Error parsing stored models:", error)
        setModels([])
        updateStatsFromModels([])
      }
    } else {
      // Si no hay modelos guardados, empezar con array vacío
      setModels([])
      updateStatsFromModels([])
    }
  }, [])

  // Función para actualizar estadísticas basadas en los modelos (empezando en 0)
  const updateStatsFromModels = (modelsList: Model3D[]) => {
    const uniqueCreators = new Set(modelsList.map((m) => m.authorId)).size
    const totalDownloads = modelsList.reduce((sum, m) => sum + m.downloads, 0)

    const newStats = {
      totalModels: modelsList.length,
      totalCreators: uniqueCreators,
      totalDownloads: totalDownloads,
      totalUsers: uniqueCreators, // Solo contar usuarios reales que han subido modelos
      totalPrinters: 0, // Empezar en 0, se incrementará cuando haya impresores activos
      totalOrders: 0, // Empezar en 0, se incrementará con pedidos reales
    }

    setStats(newStats)
    localStorage.setItem("platformStats", JSON.stringify(newStats))
  }

  // Guardar modelos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("platformModels", JSON.stringify(models))
    updateStatsFromModels(models)
  }, [models])

  // Función para añadir un nuevo modelo
  const addModel = (modelData: Omit<Model3D, "id" | "downloads" | "likes" | "rating" | "reviews" | "createdAt">) => {
    const newModel: Model3D = {
      ...modelData,
      id: `model-${Date.now()}`,
      downloads: 0,
      likes: 0,
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString(),
    }

    setModels((prev) => [...prev, newModel])
  }

  // Función para incrementar descargas
  const incrementDownloads = (modelId: string) => {
    setModels((prev) =>
      prev.map((model) => (model.id === modelId ? { ...model, downloads: model.downloads + 1 } : model)),
    )
  }

  // Función para incrementar likes
  const incrementLikes = (modelId: string) => {
    setModels((prev) => prev.map((model) => (model.id === modelId ? { ...model, likes: model.likes + 1 } : model)))
  }

  // Función para añadir review
  const addReview = (modelId: string, rating: number) => {
    setModels((prev) =>
      prev.map((model) => {
        if (model.id === modelId) {
          const newReviewCount = model.reviews + 1
          const newRating = (model.rating * model.reviews + rating) / newReviewCount
          return {
            ...model,
            reviews: newReviewCount,
            rating: Math.round(newRating * 10) / 10, // Redondear a 1 decimal
          }
        }
        return model
      }),
    )
  }

  // Función para obtener modelos de un usuario
  const getUserModels = (userId: string) => {
    return models.filter((model) => model.authorId === userId)
  }

  // Función para actualizar estadísticas manualmente
  const updateStats = () => {
    updateStatsFromModels(models)
  }

  return (
    <PlatformDataContext.Provider
      value={{
        stats,
        models,
        addModel,
        incrementDownloads,
        incrementLikes,
        addReview,
        getUserModels,
        updateStats,
      }}
    >
      {children}
    </PlatformDataContext.Provider>
  )
}
