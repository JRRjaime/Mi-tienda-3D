"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, DollarSign, Eye, Star, Upload, Zap, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function AnalyticsDashboard() {
  const { user } = useAuth()

  // Todos los datos empiezan en 0
  const stats = user?.stats || {
    totalViews: 0,
    totalDownloads: 0,
    totalEarnings: 0,
    totalLikes: 0,
    totalReviews: 0,
    modelsUploaded: 0,
    rating: 0,
  }

  const isEmpty = Object.values(stats).every((value) => value === 0)

  if (isEmpty) {
    return (
      <div className="space-y-6">
        {/* Estado vacío divertido */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader className="text-center pb-2">
            <div className="text-6xl mb-4">📊</div>
            <CardTitle className="text-white text-2xl">¡Tu Imperio Digital Está Por Nacer! 🚀</CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Aquí aparecerán tus estadísticas épicas... cuando empieces a conquistar el mundo 3D 😎
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-2xl mb-2">👀</div>
                <div className="text-sm text-gray-400">Vistas</div>
                <div className="text-xl font-bold text-white">0</div>
                <div className="text-xs text-gray-500">¡Pronto serán miles! 🔥</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-2xl mb-2">⬇️</div>
                <div className="text-sm text-gray-400">Descargas</div>
                <div className="text-xl font-bold text-white">0</div>
                <div className="text-xs text-gray-500">¡El contador va a explotar! 💥</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-sm text-gray-400">Ganancias</div>
                <div className="text-xl font-bold text-white">$0.00</div>
                <div className="text-xs text-gray-500">¡Tu primera fortuna! 🤑</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-2xl mb-2">❤️</div>
                <div className="text-sm text-gray-400">Likes</div>
                <div className="text-xl font-bold text-white">0</div>
                <div className="text-xs text-gray-500">¡Amor incoming! 💕</div>
              </div>
            </div>

            {user?.role === "creator" && (
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-6 rounded-lg border border-cyan-500/30">
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="text-white font-bold text-lg mb-2">¡Sube tu primer modelo y desata la magia! ✨</h3>
                <p className="text-gray-300 mb-4">
                  Tu primer modelo será el inicio de algo épico. ¡Los números van a volar! 🚀
                </p>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Mi Primer Modelo 🎯
                </Button>
              </div>
            )}

            {user?.role === "printer" && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-lg border border-green-500/30">
                <div className="text-4xl mb-3">🖨️</div>
                <h3 className="text-white font-bold text-lg mb-2">¡Configura tu perfil y empieza a imprimir! 🔥</h3>
                <p className="text-gray-300 mb-4">
                  Los pedidos están esperando. ¡Tu impresora va a trabajar sin parar! ⚡
                </p>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                  <Zap className="h-4 w-4 mr-2" />
                  Configurar Mi Perfil 🎯
                </Button>
              </div>
            )}

            {user?.role === "user" && (
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-lg border border-orange-500/30">
                <div className="text-4xl mb-3">🛍️</div>
                <h3 className="text-white font-bold text-lg mb-2">¡Explora y haz tu primera compra! 🎉</h3>
                <p className="text-gray-300 mb-4">
                  Miles de modelos increíbles te están esperando. ¡Tu colección va a ser épica! 🌟
                </p>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Explorar Modelos 🚀
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Motivación extra */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="text-white font-bold mb-2">¡Serás una Leyenda!</h3>
              <p className="text-gray-400 text-sm">
                Cada gran historia empieza con el primer paso. ¡El tuyo será épico!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-white font-bold mb-2">¡Velocidad Luz!</h3>
              <p className="text-gray-400 text-sm">
                Tus estadísticas van a crecer más rápido que un cohete espacial 🚀
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">💎</div>
              <h3 className="text-white font-bold mb-2">¡Calidad Premium!</h3>
              <p className="text-gray-400 text-sm">Cada número que veas aquí será 100% real y merecido ✨</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Si ya tiene datos, mostrar las estadísticas normales
  return (
    <div className="space-y-6">
      {/* Estadísticas reales cuando ya hay datos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Vistas</CardTitle>
            <Eye className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-white/80">¡Sigues creciendo! 🔥</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Descargas</CardTitle>
            <Download className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-white/80">¡Imparable! 💪</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Ganancias</CardTitle>
            <DollarSign className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${stats.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-white/80">¡Dinero real! 💰</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-500 to-purple-500 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Rating</CardTitle>
            <Star className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.rating.toFixed(1)} ⭐</div>
            <p className="text-xs text-white/80">¡Eres increíble! ✨</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
