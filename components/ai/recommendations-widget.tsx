"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Sparkles } from "lucide-react"
import { useRecommendations } from "@/contexts/recommendations-context"

export function RecommendationsWidget() {
  const { getRecommendations, trackView } = useRecommendations()
  const recommendations = getRecommendations("trending", 3)

  return (
    <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="h-5 w-5 text-cyan-400" />🤖 Recomendado para ti
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => trackView(item.id)}
            >
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-cyan-400 font-bold text-sm">${item.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-white/60">{item.rating}</span>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0"
              >
                <ShoppingCart className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          className="w-full mt-4 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white border-0"
          onClick={() => (window.location.href = "/modelos")}
        >
          Ver Más Recomendaciones
        </Button>
      </CardContent>
    </Card>
  )
}
