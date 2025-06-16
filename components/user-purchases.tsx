"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ShoppingBag,
  Download,
  Star,
  MessageSquare,
  Search,
  Calendar,
  Package,
  Eye,
  RefreshCw,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Purchase {
  id: string
  productId: string
  productName: string
  productImage: string
  sellerId: string
  sellerName: string
  price: number
  purchaseDate: string
  status: "completed" | "processing" | "shipped" | "delivered" | "cancelled"
  downloadUrl?: string
  licenseType: "personal" | "commercial" | "extended"
  rating?: number
  review?: string
  orderNumber: string
  category: string
  tags: string[]
}

export function UserPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Inicializar con array vacío (sin datos de ejemplo)
  useEffect(() => {
    // Cargar compras desde localStorage si existen
    const savedPurchases = localStorage.getItem("user_purchases")
    if (savedPurchases) {
      try {
        const parsedPurchases = JSON.parse(savedPurchases)
        setPurchases(parsedPurchases)
        setFilteredPurchases(parsedPurchases)
      } catch (error) {
        console.error("Error parsing saved purchases:", error)
        setPurchases([])
        setFilteredPurchases([])
      }
    } else {
      setPurchases([])
      setFilteredPurchases([])
    }
  }, [])

  // Guardar compras en localStorage cuando cambien
  useEffect(() => {
    if (purchases.length > 0) {
      localStorage.setItem("user_purchases", JSON.stringify(purchases))
    }
  }, [purchases])

  // Filtrar compras
  useEffect(() => {
    let filtered = purchases

    if (searchTerm) {
      filtered = filtered.filter(
        (purchase) =>
          purchase.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          purchase.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          purchase.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((purchase) => purchase.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((purchase) => purchase.category === categoryFilter)
    }

    setFilteredPurchases(filtered)
  }, [purchases, searchTerm, statusFilter, categoryFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-400/30"
      case "processing":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30"
      case "shipped":
        return "bg-purple-500/20 text-purple-400 border-purple-400/30"
      case "delivered":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-400/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-400/30"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "processing":
        return "Procesando"
      case "shipped":
        return "Enviado"
      case "delivered":
        return "Entregado"
      case "cancelled":
        return "Cancelado"
      default:
        return "Desconocido"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "processing":
        return <Clock className="h-4 w-4" />
      case "shipped":
        return <Package className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleDownload = async (purchase: Purchase) => {
    if (!purchase.downloadUrl) {
      toast({
        title: "Error",
        description: "No hay archivo disponible para descargar",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simular descarga
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Descarga iniciada",
        description: `Descargando ${purchase.productName}...`,
      })
    } catch (error) {
      toast({
        title: "Error en la descarga",
        description: "No se pudo descargar el archivo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!selectedPurchase || !reviewText.trim() || rating === 0) {
      toast({
        title: "Información incompleta",
        description: "Por favor completa la reseña y calificación",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setPurchases((prev) =>
        prev.map((purchase) =>
          purchase.id === selectedPurchase.id ? { ...purchase, rating, review: reviewText } : purchase,
        ),
      )

      toast({
        title: "Reseña enviada",
        description: "Tu reseña ha sido publicada exitosamente",
      })

      setReviewText("")
      setRating(0)
      setSelectedPurchase(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la reseña",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [...new Set(purchases.map((p) => p.category))]
  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.price, 0)

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Mis Compras</h2>
          <p className="text-gray-400">
            {purchases.length} compra{purchases.length !== 1 ? "s" : ""} • Total gastado: ${totalSpent.toFixed(2)}
          </p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {purchases.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-full mb-4">
              <ShoppingBag className="h-12 w-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No tienes compras todavía</h3>
            <p className="text-gray-400 text-center max-w-md mb-6">
              Cuando realices tu primera compra, aparecerá aquí. Podrás descargar tus archivos, dejar reseñas y hacer
              seguimiento de tus pedidos.
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
              <Plus className="h-4 w-4 mr-2" />
              Explorar Productos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filtros y búsqueda */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por producto, vendedor o número de orden..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                      <SelectItem value="processing">Procesando</SelectItem>
                      <SelectItem value="shipped">Enviado</SelectItem>
                      <SelectItem value="delivered">Entregado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs de compras */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas ({filteredPurchases.length})</TabsTrigger>
              <TabsTrigger value="digital">
                Digitales ({filteredPurchases.filter((p) => p.downloadUrl).length})
              </TabsTrigger>
              <TabsTrigger value="physical">
                Físicos ({filteredPurchases.filter((p) => !p.downloadUrl).length})
              </TabsTrigger>
              <TabsTrigger value="reviews">Reseñas ({filteredPurchases.filter((p) => p.review).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid gap-4">
                {filteredPurchases.map((purchase) => (
                  <Card key={purchase.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={purchase.productImage || "/placeholder.svg"}
                          alt={purchase.productName}
                          className="w-20 h-20 rounded-lg object-cover bg-white/10"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-white font-semibold text-lg">{purchase.productName}</h3>
                              <p className="text-gray-400 text-sm">por {purchase.sellerName}</p>
                              <p className="text-gray-500 text-xs">Orden: {purchase.orderNumber}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold text-lg">${purchase.price.toFixed(2)}</div>
                              <Badge className={getStatusColor(purchase.status)}>
                                {getStatusIcon(purchase.status)}
                                <span className="ml-1">{getStatusText(purchase.status)}</span>
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(purchase.purchaseDate).toLocaleDateString()}
                            </div>
                            <Badge variant="outline" className="border-cyan-400/30 text-cyan-400">
                              {purchase.licenseType}
                            </Badge>
                            <Badge variant="outline" className="border-purple-400/30 text-purple-400">
                              {purchase.category}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {purchase.downloadUrl && purchase.status === "completed" && (
                              <Button
                                size="sm"
                                onClick={() => handleDownload(purchase)}
                                disabled={isLoading}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                {isLoading ? "Descargando..." : "Descargar"}
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>

                            {purchase.status === "completed" && !purchase.review && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                                    onClick={() => setSelectedPurchase(purchase)}
                                  >
                                    <Star className="h-4 w-4 mr-2" />
                                    Reseñar
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-900/95 backdrop-blur-sm border-white/10">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">Escribir Reseña</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                      Comparte tu experiencia con {purchase.productName}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-white">Calificación</Label>
                                      <div className="flex gap-1 mt-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`text-2xl ${
                                              star <= rating ? "text-yellow-400" : "text-gray-600"
                                            }`}
                                          >
                                            ★
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-white">Reseña</Label>
                                      <Textarea
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Escribe tu reseña..."
                                        className="bg-white/5 border-white/20 text-white mt-2"
                                        rows={4}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => {
                                          setSelectedPurchase(null)
                                          setReviewText("")
                                          setRating(0)
                                        }}
                                        variant="outline"
                                        className="flex-1 border-white/20 text-white"
                                      >
                                        Cancelar
                                      </Button>
                                      <Button
                                        onClick={handleSubmitReview}
                                        disabled={isLoading}
                                        className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500"
                                      >
                                        <Star className="h-4 w-4 mr-2" />
                                        {isLoading ? "Enviando..." : "Enviar Reseña"}
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}

                            {purchase.review && (
                              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                                <Star className="h-4 w-4 fill-current" />
                                <span>{purchase.rating}/5</span>
                                <MessageSquare className="h-4 w-4 ml-2" />
                                <span>Reseñado</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="digital">
              <div className="grid gap-4">
                {filteredPurchases
                  .filter((p) => p.downloadUrl)
                  .map((purchase) => (
                    <Card key={purchase.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                              <FileText className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{purchase.productName}</h3>
                              <p className="text-gray-400 text-sm">Archivo digital • {purchase.licenseType}</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDownload(purchase)}
                            disabled={isLoading || purchase.status !== "completed"}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="physical">
              <div className="grid gap-4">
                {filteredPurchases
                  .filter((p) => !p.downloadUrl)
                  .map((purchase) => (
                    <Card key={purchase.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/20 rounded-lg">
                              <Package className="h-6 w-6 text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{purchase.productName}</h3>
                              <p className="text-gray-400 text-sm">
                                Producto físico • {getStatusText(purchase.status)}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(purchase.status)}>
                            {getStatusIcon(purchase.status)}
                            <span className="ml-1">{getStatusText(purchase.status)}</span>
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="grid gap-4">
                {filteredPurchases
                  .filter((p) => p.review)
                  .map((purchase) => (
                    <Card key={purchase.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={purchase.productImage || "/placeholder.svg"}
                            alt={purchase.productName}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-white font-semibold">{purchase.productName}</h3>
                              <div className="flex items-center gap-1 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < (purchase.rating || 0) ? "fill-current" : "text-gray-600"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{purchase.review}</p>
                            <p className="text-gray-500 text-xs">
                              Reseñado el {new Date(purchase.purchaseDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
