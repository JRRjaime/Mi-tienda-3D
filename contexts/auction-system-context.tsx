"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { useToast } from "@/hooks/use-toast"

// Tipos para subastas
export interface Auction {
  id: string
  title: string
  description: string
  modelId: string
  modelImage: string
  creatorId: string
  creatorName: string
  startingPrice: number
  currentBid: number
  highestBidder?: {
    id: string
    name: string
    avatar?: string
  }
  startTime: string
  endTime: string
  duration: "24h" | "48h" | "7d"
  status: "upcoming" | "active" | "ended" | "cancelled"
  bidHistory: Bid[]
  isExclusive: boolean
  isNFT: boolean
  category: string
  tags: string[]
  viewCount: number
  watcherCount: number
  reservePrice?: number
  buyNowPrice?: number
  autoBidEnabled: boolean
  maxAutoBid?: number
}

export interface Bid {
  id: string
  auctionId: string
  bidderId: string
  bidderName: string
  bidderAvatar?: string
  amount: number
  timestamp: string
  isAutoBid: boolean
}

interface AuctionSystemContextType {
  auctions: Auction[]
  activeAuctions: Auction[]
  upcomingAuctions: Auction[]
  endedAuctions: Auction[]
  placeBid: (auctionId: string, amount: number, isAutoBid?: boolean) => Promise<boolean>
  enableAutoBid: (auctionId: string, maxAmount: number) => Promise<boolean>
  watchAuction: (auctionId: string) => void
  unwatchAuction: (auctionId: string) => void
  getAuctionById: (id: string) => Auction | undefined
  getUserBids: (userId: string) => Bid[]
  getUserWatchedAuctions: (userId: string) => Auction[]
  createAuction: (auctionData: Partial<Auction>) => Promise<string>
  getTimeRemaining: (endTime: string) => { days: number; hours: number; minutes: number; seconds: number }
}

const AuctionSystemContext = createContext<AuctionSystemContextType | undefined>(undefined)

export const useAuctionSystem = () => {
  const context = useContext(AuctionSystemContext)
  if (context === undefined) {
    throw new Error("useAuctionSystem debe ser usado dentro de un AuctionSystemProvider")
  }
  return context
}

export function AuctionSystemProvider({ children }: { children: ReactNode }) {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [watchedAuctions, setWatchedAuctions] = useState<Set<string>>(new Set())
  const { user } = useAuth()
  const { toast } = useToast()

  // Cargar subastas del localStorage
  useEffect(() => {
    const storedAuctions = localStorage.getItem("auctions")
    const storedWatched = localStorage.getItem("watchedAuctions")

    if (storedAuctions) {
      try {
        setAuctions(JSON.parse(storedAuctions))
      } catch (error) {
        console.error("Error parsing stored auctions:", error)
        generateSampleAuctions()
      }
    } else {
      generateSampleAuctions()
    }

    if (storedWatched) {
      try {
        setWatchedAuctions(new Set(JSON.parse(storedWatched)))
      } catch (error) {
        console.error("Error parsing watched auctions:", error)
      }
    }
  }, [])

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("auctions", JSON.stringify(auctions))
  }, [auctions])

  useEffect(() => {
    localStorage.setItem("watchedAuctions", JSON.stringify(Array.from(watchedAuctions)))
  }, [watchedAuctions])

  // Generar subastas de ejemplo
  const generateSampleAuctions = () => {
    const now = new Date()
    const sampleAuctions: Auction[] = [
      {
        id: "auction_1",
        title: "🏆 Figura Goku Edición Limitada",
        description: "Figura exclusiva de Goku Super Saiyan con detalles únicos y certificado NFT",
        modelId: "model_goku_exclusive",
        modelImage: "/images/goku-figure.png",
        creatorId: "creator_1",
        creatorName: "AnimeCreator3D",
        startingPrice: 50,
        currentBid: 127.5,
        highestBidder: {
          id: "user_2",
          name: "CollectorPro",
          avatar: "/placeholder.svg",
        },
        startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // Empezó hace 2 horas
        endTime: new Date(now.getTime() + 22 * 60 * 60 * 1000).toISOString(), // Termina en 22 horas
        duration: "24h",
        status: "active",
        bidHistory: [
          {
            id: "bid_1",
            auctionId: "auction_1",
            bidderId: "user_1",
            bidderName: "AnimeFan",
            amount: 55,
            timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
            isAutoBid: false,
          },
          {
            id: "bid_2",
            auctionId: "auction_1",
            bidderId: "user_2",
            bidderName: "CollectorPro",
            amount: 127.5,
            timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
            isAutoBid: true,
          },
        ],
        isExclusive: true,
        isNFT: true,
        category: "Figuras y Coleccionables",
        tags: ["anime", "dragon ball", "exclusive", "nft"],
        viewCount: 1247,
        watcherCount: 89,
        reservePrice: 100,
        buyNowPrice: 300,
        autoBidEnabled: false,
      },
      {
        id: "auction_2",
        title: "💎 Anillo de Diseño Único",
        description: "Anillo personalizado con grabado láser y acabado premium",
        modelId: "model_ring_premium",
        modelImage: "/images/custom-ring.png",
        creatorId: "creator_2",
        creatorName: "JewelryMaster",
        startingPrice: 25,
        currentBid: 45,
        startTime: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 42 * 60 * 60 * 1000).toISOString(),
        duration: "48h",
        status: "active",
        bidHistory: [
          {
            id: "bid_3",
            auctionId: "auction_2",
            bidderId: "user_3",
            bidderName: "JewelryLover",
            amount: 30,
            timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
            isAutoBid: false,
          },
          {
            id: "bid_4",
            auctionId: "auction_2",
            bidderId: "user_4",
            bidderName: "DesignCollector",
            amount: 45,
            timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
            isAutoBid: false,
          },
        ],
        isExclusive: true,
        isNFT: false,
        category: "Joyería y Accesorios",
        tags: ["jewelry", "custom", "premium"],
        viewCount: 567,
        watcherCount: 34,
        reservePrice: 40,
        autoBidEnabled: false,
      },
      {
        id: "auction_3",
        title: "🚀 Prototipo Industrial Avanzado",
        description: "Modelo de engranaje industrial con especificaciones técnicas detalladas",
        modelId: "model_gear_industrial",
        modelImage: "/images/industrial-gear.png",
        creatorId: "creator_3",
        creatorName: "EngineerPro",
        startingPrice: 100,
        currentBid: 100,
        startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // Empieza en 2 horas
        endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días
        duration: "7d",
        status: "upcoming",
        bidHistory: [],
        isExclusive: true,
        isNFT: true,
        category: "Prototipos Industriales",
        tags: ["industrial", "engineering", "prototype"],
        viewCount: 234,
        watcherCount: 12,
        reservePrice: 150,
        buyNowPrice: 500,
        autoBidEnabled: false,
      },
    ]

    setAuctions(sampleAuctions)
  }

  // Filtrar subastas por estado
  const activeAuctions = auctions.filter((auction) => auction.status === "active")
  const upcomingAuctions = auctions.filter((auction) => auction.status === "upcoming")
  const endedAuctions = auctions.filter((auction) => auction.status === "ended")

  // Colocar puja
  const placeBid = async (auctionId: string, amount: number, isAutoBid = false): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para pujar",
        variant: "destructive",
      })
      return false
    }

    const auction = auctions.find((a) => a.id === auctionId)
    if (!auction) return false

    if (auction.status !== "active") {
      toast({
        title: "Error",
        description: "Esta subasta no está activa",
        variant: "destructive",
      })
      return false
    }

    if (amount <= auction.currentBid) {
      toast({
        title: "Error",
        description: `La puja debe ser mayor a ${auction.currentBid}`,
        variant: "destructive",
      })
      return false
    }

    const newBid: Bid = {
      id: `bid_${Date.now()}`,
      auctionId,
      bidderId: user.id,
      bidderName: user.name,
      bidderAvatar: user.avatar,
      amount,
      timestamp: new Date().toISOString(),
      isAutoBid,
    }

    setAuctions((prev) =>
      prev.map((auction) =>
        auction.id === auctionId
          ? {
              ...auction,
              currentBid: amount,
              highestBidder: {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
              },
              bidHistory: [...auction.bidHistory, newBid],
            }
          : auction,
      ),
    )

    toast({
      title: "🎉 Puja Realizada",
      description: `Has pujado $${amount} en ${auction.title}`,
    })

    return true
  }

  // Habilitar puja automática
  const enableAutoBid = async (auctionId: string, maxAmount: number): Promise<boolean> => {
    if (!user) return false

    setAuctions((prev) =>
      prev.map((auction) =>
        auction.id === auctionId
          ? {
              ...auction,
              autoBidEnabled: true,
              maxAutoBid: maxAmount,
            }
          : auction,
      ),
    )

    toast({
      title: "🤖 Puja Automática Activada",
      description: `Pujarás automáticamente hasta $${maxAmount}`,
    })

    return true
  }

  // Seguir subasta
  const watchAuction = (auctionId: string) => {
    setWatchedAuctions((prev) => new Set([...prev, auctionId]))
    setAuctions((prev) =>
      prev.map((auction) =>
        auction.id === auctionId ? { ...auction, watcherCount: auction.watcherCount + 1 } : auction,
      ),
    )

    toast({
      title: "👁️ Siguiendo Subasta",
      description: "Recibirás notificaciones sobre esta subasta",
    })
  }

  // Dejar de seguir subasta
  const unwatchAuction = (auctionId: string) => {
    setWatchedAuctions((prev) => {
      const newSet = new Set(prev)
      newSet.delete(auctionId)
      return newSet
    })

    setAuctions((prev) =>
      prev.map((auction) =>
        auction.id === auctionId ? { ...auction, watcherCount: Math.max(0, auction.watcherCount - 1) } : auction,
      ),
    )
  }

  // Obtener subasta por ID
  const getAuctionById = (id: string) => {
    return auctions.find((auction) => auction.id === id)
  }

  // Obtener pujas del usuario
  const getUserBids = (userId: string) => {
    return auctions.flatMap((auction) => auction.bidHistory.filter((bid) => bid.bidderId === userId))
  }

  // Obtener subastas seguidas por el usuario
  const getUserWatchedAuctions = (userId: string) => {
    return auctions.filter((auction) => watchedAuctions.has(auction.id))
  }

  // Crear nueva subasta
  const createAuction = async (auctionData: Partial<Auction>): Promise<string> => {
    const newAuction: Auction = {
      id: `auction_${Date.now()}`,
      title: auctionData.title || "Nueva Subasta",
      description: auctionData.description || "",
      modelId: auctionData.modelId || "",
      modelImage: auctionData.modelImage || "/placeholder.svg",
      creatorId: user?.id || "",
      creatorName: user?.name || "",
      startingPrice: auctionData.startingPrice || 10,
      currentBid: auctionData.startingPrice || 10,
      startTime: auctionData.startTime || new Date().toISOString(),
      endTime: auctionData.endTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      duration: auctionData.duration || "24h",
      status: "upcoming",
      bidHistory: [],
      isExclusive: auctionData.isExclusive || false,
      isNFT: auctionData.isNFT || false,
      category: auctionData.category || "General",
      tags: auctionData.tags || [],
      viewCount: 0,
      watcherCount: 0,
      autoBidEnabled: false,
      ...auctionData,
    }

    setAuctions((prev) => [newAuction, ...prev])
    return newAuction.id
  }

  // Calcular tiempo restante
  const getTimeRemaining = (endTime: string) => {
    const now = new Date().getTime()
    const end = new Date(endTime).getTime()
    const diff = end - now

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }

  return (
    <AuctionSystemContext.Provider
      value={{
        auctions,
        activeAuctions,
        upcomingAuctions,
        endedAuctions,
        placeBid,
        enableAutoBid,
        watchAuction,
        unwatchAuction,
        getAuctionById,
        getUserBids,
        getUserWatchedAuctions,
        createAuction,
        getTimeRemaining,
      }}
    >
      {children}
    </AuctionSystemContext.Provider>
  )
}
