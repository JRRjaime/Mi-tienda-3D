"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Model3D, PlatformStats } from "@/types"

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

const PlatformDataContext = createContext<PlatformDataContextType | undefined>(undefined)

export const usePlatformData = () => {
  const context = useContext(PlatformDataContext)
  if (context === undefined) {
    throw new Error("usePlatformData debe ser usado dentro de un PlatformDataProvider")
  }
  return context
}

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

  useEffect(() => {
    try {
      const storedModels = localStorage.getItem("platformModels")
      if (storedModels) {
        const parsedModels = JSON.parse(storedModels)
        setModels(parsedModels)
        updateStatsFromModels(parsedModels)
      }
    } catch (error) {
      console.error("Error loading models from localStorage:", error)
      setModels([])
    }
  }, [])

  const updateStatsFromModels = (modelsList: Model3D[]) => {
    const uniqueCreators = new Set(modelsList.map((m) => m.author.id)).size
    const totalDownloads = modelsList.reduce((sum, m) => sum + m.downloads, 0)

    const newStats: PlatformStats = {
      totalModels: modelsList.length,
      totalCreators: uniqueCreators,
      totalDownloads: totalDownloads,
      totalUsers: uniqueCreators,
      totalPrinters: 0,
      totalOrders: 0,
    }
    setStats(newStats)
  }

  useEffect(() => {
    localStorage.setItem("platformModels", JSON.stringify(models))
    updateStatsFromModels(models)
  }, [models])

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

  const incrementDownloads = (modelId: string) => {
    setModels((prev) =>
      prev.map((model) => (model.id === modelId ? { ...model, downloads: model.downloads + 1 } : model)),
    )
  }

  const incrementLikes = (modelId: string) => {
    setModels((prev) => prev.map((model) => (model.id === modelId ? { ...model, likes: model.likes + 1 } : model)))
  }

  const addReview = (modelId: string, rating: number) => {
    setModels((prev) =>
      prev.map((model) => {
        if (model.id === modelId) {
          const newReviewCount = model.reviews + 1
          const newRating = (model.rating * model.reviews + rating) / newReviewCount
          return {
            ...model,
            reviews: newReviewCount,
            rating: Math.round(newRating * 10) / 10,
          }
        }
        return model
      }),
    )
  }

  const getUserModels = (userId: string) => {
    return models.filter((model) => model.author.id === userId)
  }

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
