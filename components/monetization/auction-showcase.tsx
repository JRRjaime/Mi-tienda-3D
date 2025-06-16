"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuctionSystem } from "@/contexts/auction-system-context"
import { useAuth } from "@/contexts/auth-context"
import { Gavel, Clock, Eye, Heart, TrendingUp, Zap, Shield, Star, Users, Timer, DollarSign } from "lucide-react"

export function AuctionShowcase() {
  const { activeAuctions, upcomingAuctions, placeBid, enableAutoBid, watchAuction, unwatchAuction, getTimeRemaining } =
    useAuctionSystem()
  const { user } = useAuth()

  const [selectedAuction, setSelectedAuction] = useState<string | null>(null)
  const [bidAmount, setBidAmount] = useState("")
  const [autoBidMax, setAutoBidMax] = useState("")
  const [timeRemaining, setTimeRemaining] = useState<Record<string, any>>({})

  // Actualizar tiempo restante cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining: Record<string, any> = {}
      activeAuctions.forEach((auction) => {
        newTimeRemaining[auction.id] = getTimeRemaining(auction.endTime)
      })
      setTimeRemaining(newTimeRemaining)
    }, 1000)

    return () => clearInterval(interval)
  }, [activeAuctions, getTimeRemaining])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatTimeRemaining = (time: { days: number; hours: number; minutes: number; seconds: number }) => {
    if (time.days > 0) {
      return `${time.days}d ${time.hours}h ${time.minutes}m`
    } else if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m ${time.seconds}s`
    } else {
      return `${time.minutes}m ${time.seconds}s`
    }
  }

  const handlePlaceBid = async (auctionId: string) => {
    const amount = Number.parseFloat(bidAmount)
    if (isNaN(amount) || amount <= 0) return

    const success = await placeBid(auctionId, amount)
    if (success) {
      setBidAmount("")
      setSelectedAuction(null)
    }
  }

  const handleEnableAutoBid = async (auctionId: string) => {
    const maxAmount = Number.parseFloat(autoBidMax)
    if (isNaN(maxAmount) || maxAmount <= 0) return

    const success = await enableAutoBid(auctionId, maxAmount)
    if (success) {
      setAutoBidMax("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600"
      case "upcoming":
        return "bg-blue-600"
      case "ended":
        return "bg-gray-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "En Vivo"
      case "upcoming":
        return "Próximamente"
      case "ended":
        return "Finalizada"
      default:
        return status
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent mb-2">
          🏆 Subastas Exclusivas
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Modelos únicos y ediciones limitadas. Puja en tiempo real y obtén piezas exclusivas con certificados NFT
        </p>
      </div>

      {/* Active Auctions */}
      {activeAuctions.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Gavel className="h-5 w-5 text-green-400" />
            Subastas Activas ({activeAuctions.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAuctions.map((auction) => (
              <Card
                key={auction.id}
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${getStatusColor(auction.status)} text-white`}>
                      <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                      {getStatusLabel(auction.status)}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {auction.isNFT && (
                        <Badge variant="outline" className="text-purple-400 border-purple-400">
                          <Shield className="h-3 w-3 mr-1" />
                          NFT
                        </Badge>
                      )}
                      {auction.isExclusive && (
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                          <Star className="h-3 w-3 mr-1" />
                          Exclusivo
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardTitle className="text-white group-hover:text-yellow-400 transition-colors">
                    {auction.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 line-clamp-2">{auction.description}</CardDescription>

                  {/* Countdown Timer */}
                  <div className="flex items-center gap-2 text-orange-400 text-sm font-mono">
                    <Timer className="h-4 w-4" />
                    <span>
                      {timeRemaining[auction.id] ? formatTimeRemaining(timeRemaining[auction.id]) : "Calculando..."}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Model Image */}
                  <div className="relative">
                    <img
                      src={auction.modelImage || "/placeholder.svg"}
                      alt={auction.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 rounded-lg px-2 py-1">
                      <span className="text-white text-xs">{auction.category}</span>
                    </div>
                  </div>

                  {/* Creator Info */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {auction.creatorName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">{auction.creatorName}</span>
                  </div>

                  {/* Current Bid */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Puja Actual</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span className="text-2xl font-bold text-white">{formatCurrency(auction.currentBid)}</span>
                      </div>
                    </div>

                    {auction.highestBidder && (
                      <div className="text-xs text-gray-400">
                        Líder: {auction.highestBidder.name}
                        {auction.highestBidder.id === user?.id && (
                          <Badge variant="outline" className="ml-2 text-green-400 border-green-400">
                            Tú lideras
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{auction.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{auction.watcherCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gavel className="h-3 w-3" />
                        <span>{auction.bidHistory.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {user ? (
                      <>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder={`Min: ${auction.currentBid + 1}`}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                          <Button
                            onClick={() => handlePlaceBid(auction.id)}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                          >
                            <Gavel className="h-4 w-4 mr-1" />
                            Pujar
                          </Button>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => watchAuction(auction.id)}
                            className="flex-1"
                          >
                            <Heart className="h-3 w-3 mr-1" />
                            Seguir
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedAuction(auction.id)}
                            className="flex-1"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Auto-Puja
                          </Button>
                        </div>

                        {auction.buyNowPrice && (
                          <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Comprar Ya - {formatCurrency(auction.buyNowPrice)}
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button className="w-full" disabled>
                        Inicia sesión para pujar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Auctions */}
      {upcomingAuctions.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            Próximas Subastas ({upcomingAuctions.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingAuctions.map((auction) => (
              <Card key={auction.id} className="bg-gray-800/30 border-gray-700">
                <CardContent className="p-4">
                  <img
                    src={auction.modelImage || "/placeholder.svg"}
                    alt={auction.title}
                    className="w-full h-24 object-cover rounded-lg mb-3"
                  />
                  <h4 className="text-white font-medium text-sm mb-1">{auction.title}</h4>
                  <p className="text-gray-400 text-xs mb-2">Precio inicial: {formatCurrency(auction.startingPrice)}</p>
                  <Badge className="bg-blue-600 text-white text-xs">
                    Empieza: {new Date(auction.startTime).toLocaleDateString()}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Auto-Bid Modal */}
      {selectedAuction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-800 border-gray-700 max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Configurar Puja Automática
              </CardTitle>
              <CardDescription>
                El sistema pujará automáticamente por ti hasta el monto máximo que establezcas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Monto Máximo</label>
                <Input
                  type="number"
                  placeholder="Ej: 200"
                  value={autoBidMax}
                  onChange={(e) => setAutoBidMax(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEnableAutoBid(selectedAuction)}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500"
                >
                  Activar Auto-Puja
                </Button>
                <Button variant="outline" onClick={() => setSelectedAuction(null)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
