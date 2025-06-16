"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Recommendation {
  id: string
  title: string
  image: string
  price: number
  category: string
  rating: number
  type: "trending" | "for-you" | "similar" | "popular"
}

interface RecommendationsContextType {
  recommendations: Recommendation[]
  getRecommendations: (type?: string, limit?: number) => Recommendation[]
  trackView: (modelId: string) => void
  trackPurchase: (modelId: string) => void
}

const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined)

// Datos simulados de modelos
const mockModels: Recommendation[] = [
  {
    id: "1",
    title: "Figura Goku Super Saiyan",
    image: "/images/goku-figure.png",
    price: 25.99,
    category: "figuras",
    rating: 4.8,
    type: "trending",
  },
  {
    id: "2",
    title: "Naruto Uzumaki Figure",
    image: "/images/naruto-figure.png",
    price: 22.5,
    category: "figuras",
    rating: 4.7,
    type: "for-you",
  },
  {
    id: "3",
    title: "Jarrón Geométrico",
    image: "/images/geometric-vase.png",
    price: 18.99,
    category: "hogar",
    rating: 4.6,
    type: "popular",
  },
  {
    id: "4",
    title: "Engranaje Industrial",
    image: "/images/industrial-gear.png",
    price: 35.0,
    category: "industrial",
    rating: 4.9,
    type: "trending",
  },
  {
    id: "5",
    title: "Organizador de Escritorio",
    image: "/images/desk-organizer.png",
    price: 15.99,
    category: "hogar",
    rating: 4.5,
    type: "for-you",
  },
  {
    id: "6",
    title: "Anillo Personalizado",
    image: "/images/custom-ring.png",
    price: 45.0,
    category: "joyeria",
    rating: 4.8,
    type: "similar",
  },
]

export function RecommendationsProvider({ children }: { children: ReactNode }) {
  const [recommendations] = useState<Recommendation[]>(mockModels)
  const [userActivity, setUserActivity] = useState<string[]>([])

  const getRecommendations = (type?: string, limit = 6) => {
    let filtered = recommendations

    if (type) {
      filtered = recommendations.filter((r) => r.type === type)
    }

    // Algoritmo simple de IA: mezcla trending con personalizados
    const trending = filtered.filter((r) => r.type === "trending")
    const forYou = filtered.filter((r) => r.type === "for-you")
    const mixed = [...trending, ...forYou].slice(0, limit)

    return mixed.length > 0 ? mixed : filtered.slice(0, limit)
  }

  const trackView = (modelId: string) => {
    setUserActivity((prev) => [...prev, `view:${modelId}`])
  }

  const trackPurchase = (modelId: string) => {
    setUserActivity((prev) => [...prev, `purchase:${modelId}`])
  }

  return (
    <RecommendationsContext.Provider
      value={{
        recommendations,
        getRecommendations,
        trackView,
        trackPurchase,
      }}
    >
      {children}
    </RecommendationsContext.Provider>
  )
}

export const useRecommendations = () => {
  const context = useContext(RecommendationsContext)
  if (!context) {
    throw new Error("useRecommendations must be used within RecommendationsProvider")
  }
  return context
}
