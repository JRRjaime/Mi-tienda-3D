"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, ThumbsDown, Flag, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  title: string
  comment: string
  date: string
  helpful: number
  notHelpful: number
  verified: boolean
  images?: string[]
}

interface ReviewSystemProps {
  modelId: string
  modelTitle: string
  averageRating: number
  totalReviews: number
}

const sampleReviews: Review[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Carlos M.",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "¡Excelente modelo!",
    comment:
      "La calidad del modelo es increíble. Se imprimió perfectamente sin necesidad de soportes adicionales. Los detalles son muy precisos y el acabado quedó genial. Totalmente recomendado para cualquier nivel de experiencia.",
    date: "2024-01-15",
    helpful: 23,
    notHelpful: 1,
    verified: true,
    images: ["/images/review-1.jpg"],
  },
  {
    id: "2",
    userId: "user2",
    userName: "Ana R.",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    title: "Muy bueno, con pequeños detalles",
    comment:
      "El modelo está muy bien diseñado y las instrucciones son claras. Tuve que ajustar un poco la configuración de mi impresora para los detalles más finos, pero el resultado final es muy satisfactorio. El autor respondió rápidamente a mis preguntas.",
    date: "2024-01-12",
    helpful: 18,
    notHelpful: 3,
    verified: true,
  },
  {
    id: "3",
    userId: "user3",
    userName: "Miguel L.",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Perfecto para principiantes",
    comment:
      "Como alguien nuevo en la impresión 3D, este modelo fue perfecto para practicar. Las instrucciones son muy detalladas y el resultado es impresionante. Definitivamente compraré más modelos de este creador.",
    date: "2024-01-10",
    helpful: 15,
    notHelpful: 0,
    verified: false,
  },
  {
    id: "4",
    userId: "user4",
    userName: "Laura S.",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 3,
    title: "Bueno pero mejorable",
    comment:
      "El modelo está bien pero creo que podría tener más detalles en algunas partes. La impresión fue exitosa pero esperaba un poco más de complejidad. Aún así, cumple con lo prometido.",
    date: "2024-01-08",
    helpful: 8,
    notHelpful: 5,
    verified: true,
  },
]

export function ReviewSystem({ modelId, modelTitle, averageRating, totalReviews }: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews)
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    comment: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [filterRating, setFilterRating] = useState(0)
  const { toast } = useToast()

  const ratingDistribution = [
    { stars: 5, count: 89, percentage: 65 },
    { stars: 4, count: 32, percentage: 23 },
    { stars: 3, count: 12, percentage: 9 },
    { stars: 2, count: 3, percentage: 2 },
    { stars: 1, count: 1, percentage: 1 },
  ]

  const filteredReviews = reviews
    .filter((review) => filterRating === 0 || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case "helpful":
          return b.helpful - a.helpful
        case "rating-high":
          return b.rating - a.rating
        case "rating-low":
          return a.rating - b.rating
        default: // newest
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })

  const handleSubmitReview = async () => {
    if (newReview.rating === 0 || !newReview.title || !newReview.comment) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const review: Review = {
        id: Date.now().toString(),
        userId: "current-user",
        userName: "Tu Usuario",
        userAvatar: "/placeholder.svg?height=40&width=40",
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        date: new Date().toISOString().split("T")[0],
        helpful: 0,
        notHelpful: 0,
        verified: true,
      }

      setReviews((prev) => [review, ...prev])
      setNewReview({ rating: 0, title: "", comment: "" })

      toast({
        title: "¡Reseña publicada!",
        description: "Tu reseña ha sido publicada exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error al publicar",
        description: "Hubo un problema publicando tu reseña",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHelpful = (reviewId: string, helpful: boolean) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              helpful: helpful ? review.helpful + 1 : review.helpful,
              notHelpful: !helpful ? review.notHelpful + 1 : review.notHelpful,
            }
          : review,
      ),
    )

    toast({
      title: helpful ? "Marcado como útil" : "Marcado como no útil",
      description: "Gracias por tu feedback",
    })
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
          Reseñas y Valoraciones
        </h1>
        <p className="text-gray-400">{modelTitle}</p>
      </div>

      {/* Resumen de Valoraciones */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Puntuación General */}
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">{averageRating}</div>
              <div className="flex justify-center mb-2">{renderStars(Math.round(averageRating))}</div>
              <p className="text-gray-400">{totalReviews} reseñas</p>
            </div>

            {/* Distribución de Estrellas */}
            <div className="space-y-2">
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm text-gray-300 w-8">{stars}★</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Escribir Reseña */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Escribir una Reseña</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Tu Valoración *</label>
            {renderStars(newReview.rating, true, (rating) => setNewReview((prev) => ({ ...prev, rating })))}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Título de la Reseña *</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Resume tu experiencia en pocas palabras"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Tu Reseña *</label>
            <Textarea
              value={newReview.comment}
              onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
              placeholder="Comparte tu experiencia con este modelo. ¿Cómo fue la impresión? ¿Qué tal la calidad? ¿Recomendarías este modelo?"
              className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
            />
          </div>

          <Button
            onClick={handleSubmitReview}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isSubmitting ? "Publicando..." : "Publicar Reseña"}
          </Button>
        </CardContent>
      </Card>

      {/* Filtros y Ordenación */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <Button
            variant={sortBy === "newest" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("newest")}
            className={sortBy === "newest" ? "bg-blue-600" : "border-gray-600 text-gray-300"}
          >
            Más Recientes
          </Button>
          <Button
            variant={sortBy === "helpful" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("helpful")}
            className={sortBy === "helpful" ? "bg-blue-600" : "border-gray-600 text-gray-300"}
          >
            Más Útiles
          </Button>
          <Button
            variant={sortBy === "rating-high" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("rating-high")}
            className={sortBy === "rating-high" ? "bg-blue-600" : "border-gray-600 text-gray-300"}
          >
            Mayor Puntuación
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={filterRating === 0 ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterRating(0)}
            className={filterRating === 0 ? "bg-blue-600" : "border-gray-600 text-gray-300"}
          >
            Todas
          </Button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={filterRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRating(rating)}
              className={filterRating === rating ? "bg-blue-600" : "border-gray-600 text-gray-300"}
            >
              {rating}★
            </Button>
          ))}
        </div>
      </div>

      {/* Lista de Reseñas */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={review.userAvatar || "/placeholder.svg"}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-semibold">{review.userName}</h4>
                    {review.verified && <Badge className="bg-green-600 text-xs">Compra Verificada</Badge>}
                    <span className="text-gray-400 text-sm">{review.date}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {renderStars(review.rating)}
                    <h5 className="text-white font-medium">{review.title}</h5>
                  </div>

                  <p className="text-gray-300 mb-4 leading-relaxed">{review.comment}</p>

                  {review.images && (
                    <div className="flex gap-2 mb-4">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Review image ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review.id, true)}
                      className="text-gray-400 hover:text-green-400"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Útil ({review.helpful})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review.id, false)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      No útil ({review.notHelpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-400">
                      <Flag className="h-4 w-4 mr-1" />
                      Reportar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No hay reseñas</h3>
          <p className="text-gray-400">
            {filterRating > 0 ? `No hay reseñas con ${filterRating} estrellas` : "Sé el primero en escribir una reseña"}
          </p>
        </div>
      )}
    </div>
  )
}
