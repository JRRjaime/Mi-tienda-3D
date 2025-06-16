"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ARVRViewer } from "./ar-vr-viewer"
import { Heart, MessageCircle, Download, Star, Eye, Smartphone, Glasses, ShoppingCart, Share2 } from "lucide-react"
import { useEnhancedCart } from "@/contexts/enhanced-cart-context"
import { useToast } from "@/hooks/use-toast"

interface EnhancedProductCardProps {
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

export function EnhancedProductCard({
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
}: EnhancedProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const { addItem } = useEnhancedCart()
  const { toast } = useToast()

  const handleLike = () => {
    setIsLiked(!isLiked)
    toast({
      title: isLiked ? "Eliminado de favoritos" : "Añadido a favoritos",
      description: `${title} ${isLiked ? "eliminado de" : "añadido a"} tus favoritos`,
    })
  }

  const handleAddToCart = () => {
    const cartItem = {
      id,
      name: title,
      description,
      price,
      type: "download" as const,
      image,
      creatorName: author,
      creatorId: author.toLowerCase().replace(" ", ""),
      category,
      tags,
      downloadFormat: ["STL", "OBJ", "3MF"],
    }

    addItem(cartItem)
    toast({
      title: "Producto añadido",
      description: `${title} se ha añadido al carrito`,
    })
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
          title: "Enlace copiado",
          description: "El enlace del modelo se ha copiado al portapapeles",
        })
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Enlace copiado",
        description: "El enlace del modelo se ha copiado al portapapeles",
      })
    }
  }

  return (
    <>
      <Card
        className={`group overflow-hidden backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          isOwner
            ? "bg-purple-500/10 border-purple-400/30 hover:border-purple-400/50"
            : "bg-white/5 border-white/10 hover:border-white/20"
        }`}
      >
        <div className="relative">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Overlay con botones AR/VR */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver en 3D
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {title}
                  </DialogTitle>
                </DialogHeader>
                <ARVRViewer modelId={id} modelName={title} modelUrl={image} creatorName={author} category={category} />
              </DialogContent>
            </Dialog>

            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Smartphone className="h-4 w-4 mr-1" />
              AR
            </Button>

            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Glasses className="h-4 w-4 mr-1" />
              VR
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-2 right-2 flex gap-2">
            {isOwner && <Badge className="bg-purple-500">Mi Modelo</Badge>}
            <Badge className="bg-black/50 text-white">{difficulty}</Badge>
          </div>

          {/* Stats */}
          <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white text-sm">
            <Eye className="h-4 w-4" />
            <span>{views.toLocaleString()}</span>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle
              className={`text-lg line-clamp-2 transition-colors ${
                isOwner ? "text-purple-300 group-hover:text-purple-200" : "text-white group-hover:text-cyan-400"
              }`}
            >
              {title}
            </CardTitle>
            <div className="flex items-center gap-1 text-yellow-400 text-sm">
              <Star className="h-4 w-4 fill-current" />
              <span>{rating}</span>
            </div>
          </div>
          <CardDescription className="text-gray-300 line-clamp-2">{description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Autor */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={authorAvatar || "/placeholder.svg"} />
              <AvatarFallback>{author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className={isOwner ? "text-purple-300 text-sm" : "text-gray-400 text-sm"}>{author}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={
                  isOwner ? "text-xs text-purple-400 border-purple-400/30" : "text-xs text-cyan-400 border-cyan-400/30"
                }
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Detalles técnicos */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div>Tiempo: {printTime}</div>
            <div>Material: {material}</div>
          </div>

          {/* Precio */}
          <div className="flex items-center justify-between">
            <div className={`text-2xl font-bold ${isOwner ? "text-purple-400" : "text-cyan-400"}`}>${price}</div>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-4 text-gray-400">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 transition-colors ${
                  isLiked ? "text-red-400" : "hover:text-red-400"
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-sm">{likes + (isLiked ? 1 : 0)}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{comments}</span>
              </button>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span className="text-sm">{downloads}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={handleShare} className="text-gray-400 hover:text-white">
                <Share2 className="h-4 w-4" />
              </Button>
              {!isOwner && (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Comprar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
