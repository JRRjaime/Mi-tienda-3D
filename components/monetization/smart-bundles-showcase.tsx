"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useSmartBundles } from "@/contexts/smart-bundles-context"
import { useAuth } from "@/contexts/auth-context"
import { ShoppingCart, Clock, Star, Download, Sparkles, TrendingUp, Calendar, User } from "lucide-react"

export function SmartBundlesShowcase() {
  const { bundles, purchaseBundle, trackBundleView, getRecommendedBundles } = useSmartBundles()
  const { user } = useAuth()
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null)

  const recommendedBundles = user ? getRecommendedBundles(user.id) : bundles.slice(0, 3)

  const getBundleIcon = (type: string) => {
    switch (type) {
      case "ai_recommended":
        return <Sparkles className="h-5 w-5 text-purple-400" />
      case "trending":
        return <TrendingUp className="h-5 w-5 text-orange-400" />
      case "seasonal":
        return <Calendar className="h-5 w-5 text-green-400" />
      case "creator_collection":
        return <User className="h-5 w-5 text-blue-400" />
      default:
        return <ShoppingCart className="h-5 w-5 text-gray-400" />
    }
  }

  const getBundleTypeLabel = (type: string) => {
    switch (type) {
      case "ai_recommended":
        return "IA Recomendado"
      case "trending":
        return "Trending"
      case "seasonal":
        return "Estacional"
      case "creator_collection":
        return "Colección Creador"
      default:
        return "Bundle"
    }
  }

  const handlePurchaseBundle = async (bundleId: string) => {
    const success = await purchaseBundle(bundleId)
    if (success) {
      setSelectedBundle(null)
    }
  }

  const handleViewBundle = (bundleId: string) => {
    trackBundleView(bundleId)
    setSelectedBundle(bundleId)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getTimeRemaining = (validUntil?: string) => {
    if (!validUntil) return null

    const now = new Date().getTime()
    const end = new Date(validUntil).getTime()
    const diff = end - now

    if (diff <= 0) return "Expirado"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h restantes`
    return `${hours}h restantes`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
          🤖 Bundles Inteligentes
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Nuestra IA crea paquetes perfectos basados en tus preferencias, tendencias del mercado y comportamiento de
          compra
        </p>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedBundles.map((bundle) => (
          <Card
            key={bundle.id}
            className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group cursor-pointer"
            onClick={() => handleViewBundle(bundle.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getBundleIcon(bundle.type)}
                  <Badge variant="outline" className="text-xs">
                    {getBundleTypeLabel(bundle.type)}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-purple-400">
                  <Sparkles className="h-3 w-3" />
                  <span className="text-xs">{bundle.aiConfidence}% IA</span>
                </div>
              </div>

              <CardTitle className="text-white group-hover:text-purple-400 transition-colors">{bundle.name}</CardTitle>
              <CardDescription className="text-gray-400 line-clamp-2">{bundle.description}</CardDescription>

              {/* Countdown Timer */}
              {bundle.validUntil && (
                <div className="flex items-center gap-2 text-orange-400 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{getTimeRemaining(bundle.validUntil)}</span>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Products Preview */}
              <div className="grid grid-cols-3 gap-2">
                {bundle.products.slice(0, 3).map((product, index) => (
                  <div key={product.id} className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-16 object-cover rounded-lg"
                    />
                    {index === 2 && bundle.products.length > 3 && (
                      <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-medium">+{bundle.products.length - 3}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400" />
                    <span>{bundle.popularity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{bundle.purchaseCount}</span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 line-through text-sm">{formatCurrency(bundle.originalPrice)}</span>
                    <span className="text-2xl font-bold text-white ml-2">{formatCurrency(bundle.bundlePrice)}</span>
                  </div>
                  <Badge className="bg-green-600 text-white">-{bundle.discountPercentage}%</Badge>
                </div>

                <div className="text-sm text-green-400">
                  Ahorras {formatCurrency(bundle.discount)} ({bundle.discountPercentage}%)
                </div>

                {/* Savings Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Ahorro</span>
                    <span>{bundle.discountPercentage}%</span>
                  </div>
                  <Progress value={bundle.discountPercentage} className="h-2" />
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePurchaseBundle(bundle.id)
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Comprar Bundle
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bundle Details Modal */}
      {selectedBundle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-800 border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{bundles.find((b) => b.id === selectedBundle)?.name}</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedBundle(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Detailed bundle view would go here */}
              <p className="text-gray-400 mb-4">{bundles.find((b) => b.id === selectedBundle)?.description}</p>
              <div className="grid grid-cols-1 gap-4">
                {bundles
                  .find((b) => b.id === selectedBundle)
                  ?.products.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-400">{product.creatorName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-400">{product.rating}</span>
                          </div>
                          <span className="text-purple-400 font-medium">{formatCurrency(product.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
