"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { useToast } from "@/hooks/use-toast"

// Tipos para bundles
export interface SmartBundle {
  id: string
  name: string
  description: string
  type: "ai_recommended" | "seasonal" | "creator_collection" | "trending" | "user_behavior"
  products: BundleProduct[]
  originalPrice: number
  bundlePrice: number
  discount: number
  discountPercentage: number
  validUntil?: string
  popularity: number
  tags: string[]
  createdAt: string
  isActive: boolean
  purchaseCount: number
  viewCount: number
  creatorId?: string
  creatorName?: string
  seasonalTheme?: string
  aiConfidence: number // 0-100, qué tan segura está la IA de que este bundle funcionará
}

export interface BundleProduct {
  id: string
  name: string
  price: number
  image: string
  category: string
  creatorName: string
  rating: number
  downloads: number
}

// Datos de ejemplo para productos
const sampleProducts: BundleProduct[] = [
  {
    id: "1",
    name: "Figura de Goku Super Saiyan",
    price: 12.99,
    image: "/images/goku-figure.png",
    category: "Figuras y Coleccionables",
    creatorName: "AnimeCreator3D",
    rating: 4.8,
    downloads: 2341,
  },
  {
    id: "2",
    name: "Organizador de Escritorio",
    price: 8.5,
    image: "/images/desk-organizer.png",
    category: "Hogar y Cocina",
    creatorName: "FunctionalDesigns",
    rating: 4.6,
    downloads: 1567,
  },
  {
    id: "3",
    name: "Engranaje Industrial",
    price: 25.0,
    image: "/images/industrial-gear.png",
    category: "Prototipos Industriales",
    creatorName: "EngineerPro",
    rating: 4.9,
    downloads: 892,
  },
  {
    id: "4",
    name: "Anillo Personalizado",
    price: 15.75,
    image: "/images/custom-ring.png",
    category: "Joyería y Accesorios",
    creatorName: "JewelryMaster",
    rating: 4.7,
    downloads: 1876,
  },
  {
    id: "5",
    name: "Lámpara Geométrica",
    price: 18.99,
    image: "/images/decorative-lamp.png",
    category: "Decoración y Arte",
    creatorName: "LightDesigner",
    rating: 4.5,
    downloads: 1234,
  },
  {
    id: "6",
    name: "Soporte para Teléfono",
    price: 5.99,
    image: "/images/phone-stand.png",
    category: "Herramientas y Utilidades",
    creatorName: "GadgetMaker",
    rating: 4.4,
    downloads: 3456,
  },
]

interface SmartBundlesContextType {
  bundles: SmartBundle[]
  generateAIBundle: (userPreferences: string[], purchaseHistory: string[]) => SmartBundle
  generateSeasonalBundle: (theme: string) => SmartBundle
  generateCreatorBundle: (creatorId: string) => SmartBundle
  generateTrendingBundle: () => SmartBundle
  getBundlesByType: (type: SmartBundle["type"]) => SmartBundle[]
  purchaseBundle: (bundleId: string) => Promise<boolean>
  trackBundleView: (bundleId: string) => void
  getRecommendedBundles: (userId: string) => SmartBundle[]
  calculateBundleSavings: (products: BundleProduct[]) => { originalPrice: number; bundlePrice: number; savings: number }
}

const SmartBundlesContext = createContext<SmartBundlesContextType | undefined>(undefined)

export const useSmartBundles = () => {
  const context = useContext(SmartBundlesContext)
  if (context === undefined) {
    throw new Error("useSmartBundles debe ser usado dentro de un SmartBundlesProvider")
  }
  return context
}

export function SmartBundlesProvider({ children }: { children: ReactNode }) {
  const [bundles, setBundles] = useState<SmartBundle[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  // Cargar bundles del localStorage
  useEffect(() => {
    const storedBundles = localStorage.getItem("smartBundles")
    if (storedBundles) {
      try {
        setBundles(JSON.parse(storedBundles))
      } catch (error) {
        console.error("Error parsing stored bundles:", error)
        generateInitialBundles()
      }
    } else {
      generateInitialBundles()
    }
  }, [])

  // Guardar bundles en localStorage
  useEffect(() => {
    localStorage.setItem("smartBundles", JSON.stringify(bundles))
  }, [bundles])

  // Generar bundles iniciales
  const generateInitialBundles = () => {
    const initialBundles: SmartBundle[] = [
      generateAIBundle(["anime", "figuras"], ["1", "2"]),
      generateSeasonalBundle("Navidad 2024"),
      generateTrendingBundle(),
      generateCreatorBundle("AnimeCreator3D"),
    ]
    setBundles(initialBundles)
  }

  // Calcular ahorros de bundle
  const calculateBundleSavings = (products: BundleProduct[]) => {
    const originalPrice = products.reduce((sum, product) => sum + product.price, 0)
    let discountPercentage = 0

    // Lógica de descuentos progresivos
    if (products.length >= 5) {
      discountPercentage = 25 // 25% para 5+ productos
    } else if (products.length >= 3) {
      discountPercentage = 15 // 15% para 3-4 productos
    } else if (products.length >= 2) {
      discountPercentage = 10 // 10% para 2 productos
    }

    const savings = (originalPrice * discountPercentage) / 100
    const bundlePrice = originalPrice - savings

    return { originalPrice, bundlePrice, savings }
  }

  // Generar bundle con IA
  const generateAIBundle = (userPreferences: string[], purchaseHistory: string[]): SmartBundle => {
    // Simular IA que selecciona productos basados en preferencias
    const relevantProducts = sampleProducts.filter(
      (product) =>
        userPreferences.some((pref) => product.category.toLowerCase().includes(pref.toLowerCase())) ||
        product.tags?.some((tag) => userPreferences.includes(tag)),
    )

    // Si no hay suficientes productos relevantes, agregar productos populares
    const selectedProducts = relevantProducts.slice(0, 3)
    if (selectedProducts.length < 3) {
      const popularProducts = sampleProducts
        .filter((p) => !selectedProducts.includes(p))
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, 3 - selectedProducts.length)
      selectedProducts.push(...popularProducts)
    }

    const { originalPrice, bundlePrice, savings } = calculateBundleSavings(selectedProducts)

    return {
      id: `ai_bundle_${Date.now()}`,
      name: "🤖 Bundle Recomendado por IA",
      description: "Selección inteligente basada en tus preferencias y comportamiento de compra",
      type: "ai_recommended",
      products: selectedProducts,
      originalPrice,
      bundlePrice,
      discount: savings,
      discountPercentage: Math.round((savings / originalPrice) * 100),
      popularity: Math.floor(Math.random() * 100) + 50,
      tags: userPreferences,
      createdAt: new Date().toISOString(),
      isActive: true,
      purchaseCount: Math.floor(Math.random() * 50),
      viewCount: Math.floor(Math.random() * 200) + 100,
      aiConfidence: Math.floor(Math.random() * 30) + 70, // 70-100% confianza
    }
  }

  // Generar bundle estacional
  const generateSeasonalBundle = (theme: string): SmartBundle => {
    // Seleccionar productos que encajen con el tema
    const seasonalProducts = sampleProducts.slice(0, 4) // Simular selección temática

    const { originalPrice, bundlePrice, savings } = calculateBundleSavings(seasonalProducts)

    return {
      id: `seasonal_bundle_${Date.now()}`,
      name: `🎄 Bundle ${theme}`,
      description: `Colección especial para ${theme} con descuentos exclusivos`,
      type: "seasonal",
      products: seasonalProducts,
      originalPrice,
      bundlePrice,
      discount: savings,
      discountPercentage: Math.round((savings / originalPrice) * 100),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      popularity: Math.floor(Math.random() * 100) + 60,
      tags: [theme.toLowerCase(), "seasonal", "limited"],
      createdAt: new Date().toISOString(),
      isActive: true,
      purchaseCount: Math.floor(Math.random() * 30),
      viewCount: Math.floor(Math.random() * 150) + 80,
      seasonalTheme: theme,
      aiConfidence: 85,
    }
  }

  // Generar bundle de creador
  const generateCreatorBundle = (creatorId: string): SmartBundle => {
    const creatorProducts = sampleProducts.filter((product) => product.creatorName === creatorId).slice(0, 3)

    // Si no hay suficientes productos del creador, agregar productos similares
    if (creatorProducts.length < 3) {
      const similarProducts = sampleProducts
        .filter((p) => !creatorProducts.includes(p))
        .slice(0, 3 - creatorProducts.length)
      creatorProducts.push(...similarProducts)
    }

    const { originalPrice, bundlePrice, savings } = calculateBundleSavings(creatorProducts)

    return {
      id: `creator_bundle_${Date.now()}`,
      name: `👨‍🎨 Colección ${creatorId}`,
      description: `Los mejores modelos de ${creatorId} en un bundle exclusivo`,
      type: "creator_collection",
      products: creatorProducts,
      originalPrice,
      bundlePrice,
      discount: savings,
      discountPercentage: Math.round((savings / originalPrice) * 100),
      popularity: Math.floor(Math.random() * 100) + 40,
      tags: ["creator", creatorId.toLowerCase()],
      createdAt: new Date().toISOString(),
      isActive: true,
      purchaseCount: Math.floor(Math.random() * 25),
      viewCount: Math.floor(Math.random() * 120) + 60,
      creatorId,
      creatorName: creatorId,
      aiConfidence: 80,
    }
  }

  // Generar bundle trending
  const generateTrendingBundle = (): SmartBundle => {
    const trendingProducts = sampleProducts.sort((a, b) => b.downloads - a.downloads).slice(0, 4)

    const { originalPrice, bundlePrice, savings } = calculateBundleSavings(trendingProducts)

    return {
      id: `trending_bundle_${Date.now()}`,
      name: "🔥 Bundle Trending",
      description: "Los modelos más populares del momento con descuento especial",
      type: "trending",
      products: trendingProducts,
      originalPrice,
      bundlePrice,
      discount: savings,
      discountPercentage: Math.round((savings / originalPrice) * 100),
      popularity: Math.floor(Math.random() * 100) + 80,
      tags: ["trending", "popular", "hot"],
      createdAt: new Date().toISOString(),
      isActive: true,
      purchaseCount: Math.floor(Math.random() * 100) + 50,
      viewCount: Math.floor(Math.random() * 300) + 200,
      aiConfidence: 90,
    }
  }

  // Obtener bundles por tipo
  const getBundlesByType = (type: SmartBundle["type"]) => {
    return bundles.filter((bundle) => bundle.type === type && bundle.isActive)
  }

  // Comprar bundle
  const purchaseBundle = async (bundleId: string): Promise<boolean> => {
    const bundle = bundles.find((b) => b.id === bundleId)
    if (!bundle) return false

    // Simular compra
    setBundles((prev) => prev.map((b) => (b.id === bundleId ? { ...b, purchaseCount: b.purchaseCount + 1 } : b)))

    toast({
      title: "🎉 Bundle Comprado",
      description: `${bundle.name} se ha añadido a tu biblioteca`,
    })

    return true
  }

  // Trackear visualización de bundle
  const trackBundleView = (bundleId: string) => {
    setBundles((prev) =>
      prev.map((bundle) => (bundle.id === bundleId ? { ...bundle, viewCount: bundle.viewCount + 1 } : bundle)),
    )
  }

  // Obtener bundles recomendados para usuario
  const getRecommendedBundles = (userId: string): SmartBundle[] => {
    // Simular recomendaciones basadas en usuario
    return bundles
      .filter((bundle) => bundle.isActive)
      .sort((a, b) => b.aiConfidence - a.aiConfidence)
      .slice(0, 3)
  }

  return (
    <SmartBundlesContext.Provider
      value={{
        bundles,
        generateAIBundle,
        generateSeasonalBundle,
        generateCreatorBundle,
        generateTrendingBundle,
        getBundlesByType,
        purchaseBundle,
        trackBundleView,
        getRecommendedBundles,
        calculateBundleSavings,
      }}
    >
      {children}
    </SmartBundlesContext.Provider>
  )
}
