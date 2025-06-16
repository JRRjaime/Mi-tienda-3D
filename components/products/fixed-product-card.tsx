"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Download, Star, Eye, ShoppingCart, Share2, Sparkles } from "lucide-react"
import { useEnhancedCart } from "@/contexts/enhanced-cart-context"
import { useToast } from "@/hooks/use-toast"

interface FixedProductCardProps {
  id: string
  title: string
  description: string
  image: string
  author: string
  authorAvatar: string
  likes: number
  comments: number
  downloads: number
  rating: number
  views: number
  tags: string[]
  difficulty: string
  printTime: string
  material: string
  price: number
  category: string
  isOwner?: boolean
}

export function FixedProductCard({
  id,
  title,
  description,
  image,
  author,
  authorAvatar,
  likes,
  comments,
  downloads,
  rating,
  views,
  tags,
  difficulty,
  printTime,
  material,
  price,
  category,
  isOwner = false,
}: FixedProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const { addItem } = useEnhancedCart()
  const { toast } = useToast()

  const handleLike = () => {
    setIsLiked(!isLiked)
    toast({
      title: isLiked ? "💔 Eliminado de favoritos" : "❤️ Añadido a favoritos",
      description: `${title} ${isLiked ? "eliminado de" : "añadido a"} tus favoritos`,
    })
  }

  const handleAddToCart = async () => {
    setIsAdding(true)

    try {
      const cartItem = {
        id,
        name: title,
        description,
        price,
        type: "download" as const,
        image,
        creatorName: author,
        creatorId: author.toLowerCase().replace(/\s+/g, "-"),
        category,
        tags,
        downloadFormat: ["STL", "OBJ", "3MF"],
      }

      addItem(cartItem)

      toast({
        title: "🛒 ¡Producto añadido!",
        description: `${title} se agregó al carrito con éxito`,
      })
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudo agregar el producto al carrito",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - Modelo 3D`,
          text: `Mira este increíble modelo 3D de ${author}`,
          url: window.location.href,
        })
      } catch (error) {
        navigator.clipboard.writeText(window.location.href)
        toast({
          title: "📋 Enlace copiado",
          description: "El enlace del modelo se copió al portapapeles",
        })
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "📋 Enlace copiado",
        description: "El enlace del modelo se copió al portapapeles",
      })
    }
  }

  return (
    <Card className="group overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
      <div className="relative">
        <img
          src={image || "/placeholder.svg?height=200&width=300"}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay con efectos */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {isOwner && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Mi Modelo
            </Badge>
          )}
          <Badge className="bg-black/70 text-white border-0 backdrop-blur-sm">{difficulty}</Badge>
        </div>

        {/* Stats */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-sm bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
          <Eye className="h-4 w-4" />
          <span>{views.toLocaleString()}</span>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
            {title}
          </CardTitle>
          <div className="flex items-center gap-1 text-yellow-400 text-sm">
            <Star className="h-4 w-4 fill-current" />
            <span>{rating}</span>
          </div>
        </div>
        <CardDescription className="text-slate-300 line-clamp-2">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Autor */}
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 ring-2 ring-purple-500/30">
            <AvatarImage src={authorAvatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
              {author.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-slate-300 text-sm font-medium">{author}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={tag}
              variant="outline"
              className={`text-xs border-0 ${
                index === 0
                  ? "bg-purple-500/20 text-purple-300"
                  : index === 1
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-pink-500/20 text-pink-300"
              }`}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Detalles técnicos */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-800/50 p-2 rounded-lg">
          <div>⏱️ {printTime}</div>
          <div>🧱 {material}</div>
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            ${price}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors hover:scale-110 ${
                isLiked ? "text-red-400" : "hover:text-red-400"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm">{likes + (isLiked ? 1 : 0)}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-blue-400 transition-colors hover:scale-110">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{comments}</span>
            </button>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span className="text-sm">{downloads}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleShare}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            {!isOwner && (
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                {isAdding ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-1" />
                ) : (
                  <ShoppingCart className="h-4 w-4 mr-1" />
                )}
                {isAdding ? "Agregando..." : "Comprar"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
