"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { usePlatformData } from "./platform-data-context"

// Tipos para analytics avanzado
export interface MarketTrend {
  category: string
  growth: number
  demand: "Alta" | "Media" | "Baja"
  avgPrice: number
  topKeywords: string[]
}

export interface PriceOptimization {
  modelId: string
  currentPrice: number
  suggestedPrice: number
  confidence: number
  reason: string
}

export interface EngagementMetrics {
  viewToDownloadRate: number
  likeToDownloadRate: number
  avgTimeOnModel: number
  bounceRate: number
  shareRate: number
}

export interface ModelROI {
  modelId: string
  title: string
  investment: number
  revenue: number
  roi: number
  profitMargin: number
  breakEvenDays: number
}

export interface AdvancedAnalytics {
  marketTrends: MarketTrend[]
  priceOptimizations: PriceOptimization[]
  engagementMetrics: EngagementMetrics
  modelROIs: ModelROI[]
  demandPrediction: {
    nextMonth: number
    confidence: number
    factors: string[]
  }
  competitorAnalysis: {
    avgPrice: number
    marketShare: number
    topCompetitors: string[]
  }
}

interface AnalyticsContextType {
  analytics: AdvancedAnalytics
  refreshAnalytics: () => void
  getPriceRecommendation: (modelId: string) => PriceOptimization | null
  getMarketInsights: (category: string) => MarketTrend | null
  calculateROI: (modelId: string) => ModelROI | null
  isLoading: boolean
}

const generateMockAnalytics = (): AdvancedAnalytics => ({
  marketTrends: [
    {
      category: "Figuras de Anime",
      growth: 45.2,
      demand: "Alta",
      avgPrice: 12.99,
      topKeywords: ["goku", "naruto", "one piece", "dragon ball"],
    },
    {
      category: "Prototipos",
      growth: 32.1,
      demand: "Alta",
      avgPrice: 25.5,
      topKeywords: ["drone", "mechanical", "engineering", "prototype"],
    },
    {
      category: "Joyería",
      growth: 28.7,
      demand: "Media",
      avgPrice: 18.75,
      topKeywords: ["ring", "pendant", "custom", "jewelry"],
    },
    {
      category: "Decoración",
      growth: 15.3,
      demand: "Media",
      avgPrice: 8.99,
      topKeywords: ["lamp", "vase", "home", "decoration"],
    },
  ],
  priceOptimizations: [
    {
      modelId: "model-1",
      currentPrice: 10.0,
      suggestedPrice: 14.99,
      confidence: 87,
      reason: "Demanda alta + competencia baja",
    },
    {
      modelId: "model-2",
      currentPrice: 25.0,
      suggestedPrice: 22.99,
      confidence: 73,
      reason: "Optimización para conversión",
    },
  ],
  engagementMetrics: {
    viewToDownloadRate: 12.5,
    likeToDownloadRate: 34.2,
    avgTimeOnModel: 2.3,
    bounceRate: 23.1,
    shareRate: 8.7,
  },
  modelROIs: [
    {
      modelId: "model-1",
      title: "Figura Goku SSJ",
      investment: 50.0,
      revenue: 245.8,
      roi: 391.6,
      profitMargin: 79.6,
      breakEvenDays: 12,
    },
    {
      modelId: "model-2",
      title: "Prototipo Drone",
      investment: 120.0,
      revenue: 380.5,
      roi: 217.1,
      profitMargin: 68.4,
      breakEvenDays: 18,
    },
  ],
  demandPrediction: {
    nextMonth: 156,
    confidence: 84,
    factors: ["Temporada navideña", "Lanzamiento anime", "Tendencia gaming"],
  },
  competitorAnalysis: { avgPrice: 16.45, marketShare: 23.7, topCompetitors: ["ModelMaster", "3DHub", "PrintCraft"] },
})

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    // Devolver un estado por defecto o lanzar un error menos disruptivo si es preferible
    // para componentes que podrían renderizarse antes de que el provider esté listo.
    // Por ahora, mantenemos el error para identificar problemas de integración.
    throw new Error("useAnalytics debe ser usado dentro de un AnalyticsProvider")
  }
  return context
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [analytics, setAnalytics] = useState<AdvancedAnalytics>(generateMockAnalytics())
  const [isLoading, setIsLoading] = useState(true)

  // Intentar obtener useAuth y usePlatformData de forma segura
  const [auth, setAuth] = useState(null)
  const [platformData, setPlatformData] = useState(null)

  useEffect(() => {
    try {
      setAuth(useAuth())
    } catch (e) {
      console.warn("AnalyticsProvider: AuthContext no disponible o con error.")
    }
    try {
      setPlatformData(usePlatformData())
    } catch (e) {
      console.warn("AnalyticsProvider: PlatformDataContext no disponible o con error.")
    }
  }, [])

  const authUser = auth?.user || null
  const platformModels = platformData?.models || []

  useEffect(() => {
    // Simular carga de datos
    setIsLoading(true)
    const timer = setTimeout(() => {
      setAnalytics(generateMockAnalytics()) // Generar nuevos datos mock o usar los existentes
      setIsLoading(false)
    }, 1000) // Simular delay de carga

    // Actualizar analytics cada 30 segundos (simulado)
    const interval = setInterval(() => {
      setAnalytics(generateMockAnalytics())
    }, 30000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [authUser, platformModels]) // Dependencias opcionales, si los datos de analytics dependen de ellas

  const refreshAnalytics = () => {
    setIsLoading(true)
    setTimeout(() => {
      setAnalytics(generateMockAnalytics())
      setIsLoading(false)
    }, 500)
  }

  const getPriceRecommendation = (modelId: string) => {
    return analytics.priceOptimizations.find((opt) => opt.modelId === modelId) || null
  }

  const getMarketInsights = (category: string) => {
    return analytics.marketTrends.find((trend) => trend.category === category) || null
  }

  const calculateROI = (modelId: string) => {
    return analytics.modelROIs.find((roi) => roi.modelId === modelId) || null
  }

  return (
    <AnalyticsContext.Provider
      value={{
        analytics,
        refreshAnalytics,
        getPriceRecommendation,
        getMarketInsights,
        calculateROI,
        isLoading,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}
