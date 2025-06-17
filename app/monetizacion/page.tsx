"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  Package,
  Gavel,
  TrendingUp,
  Plus,
  DollarSign,
  Users,
  Clock,
  ShoppingCart,
  BarChart3,
  Target,
  Zap,
} from "lucide-react"

export default function MonetizacionPage() {
  const [bundles, setBundles] = useState([])
  const [auctions, setAuctions] = useState([])
  const [showCreateBundle, setShowCreateBundle] = useState(false)
  const [showCreateAuction, setShowCreateAuction] = useState(false)
  const { toast } = useToast()

  const handleCreateBundle = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newBundle = {
      id: Date.now(),
      name: formData.get("name"),
      description: formData.get("description"),
      price: Number.parseFloat(formData.get("price")),
      discount: Number.parseInt(formData.get("discount")),
      models: Number.parseInt(formData.get("models")),
      category: formData.get("category"),
      createdAt: new Date().toISOString(),
    }

    setBundles([...bundles, newBundle])
    setShowCreateBundle(false)
    toast({
      title: "Bundle creado",
      description: `${newBundle.name} ha sido creado exitosamente`,
    })
    e.target.reset()
  }

  const handleCreateAuction = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newAuction = {
      id: Date.now(),
      title: formData.get("title"),
      description: formData.get("description"),
      startingPrice: Number.parseFloat(formData.get("startingPrice")),
      currentBid: Number.parseFloat(formData.get("startingPrice")),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      bidders: 0,
      category: formData.get("category"),
      createdAt: new Date().toISOString(),
    }

    setAuctions([...auctions, newAuction])
    setShowCreateAuction(false)
    toast({
      title: "Subasta creada",
      description: `${newAuction.title} ha sido creada exitosamente`,
    })
    e.target.reset()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Centro de Monetización
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Maximiza tus ingresos con bundles inteligentes y subastas en tiempo real
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Ingresos Totales</p>
                  <p className="text-3xl font-bold">$0</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Bundles Activos</p>
                  <p className="text-3xl font-bold">{bundles.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Subastas Activas</p>
                  <p className="text-3xl font-bold">{auctions.length}</p>
                </div>
                <Gavel className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Conversión</p>
                  <p className="text-3xl font-bold">0%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bundles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bundles" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Smart Bundles
            </TabsTrigger>
            <TabsTrigger value="auctions" className="flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              Subastas
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Smart Bundles Tab */}
          <TabsContent value="bundles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Smart Bundles</h2>
              <Button
                onClick={() => setShowCreateBundle(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Bundle
              </Button>
            </div>

            {bundles.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay bundles creados</h3>
                <p className="text-gray-500 mb-6">Crea tu primer bundle inteligente para empezar a monetizar</p>
                <Button
                  onClick={() => setShowCreateBundle(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Mi Primer Bundle
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bundles.map((bundle) => (
                  <Card key={bundle.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{bundle.name}</CardTitle>
                        <Badge variant="secondary">{bundle.category}</Badge>
                      </div>
                      <CardDescription>{bundle.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-green-600">${bundle.price}</span>
                          <Badge className="bg-red-100 text-red-800">{bundle.discount}% OFF</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {bundle.models} modelos
                          </span>
                        </div>
                        <Button className="w-full">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Comprar Bundle
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Create Bundle Modal */}
            {showCreateBundle && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Crear Nuevo Bundle</CardTitle>
                    <CardDescription>Configura tu bundle inteligente</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateBundle} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nombre del Bundle</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" name="description" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Precio ($)</Label>
                          <Input id="price" name="price" type="number" step="0.01" required />
                        </div>
                        <div>
                          <Label htmlFor="discount">Descuento (%)</Label>
                          <Input id="discount" name="discount" type="number" min="0" max="90" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="models">Nº Modelos</Label>
                          <Input id="models" name="models" type="number" min="1" required />
                        </div>
                        <div>
                          <Label htmlFor="category">Categoría</Label>
                          <Select name="category" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="arte">Arte</SelectItem>
                              <SelectItem value="juguetes">Juguetes</SelectItem>
                              <SelectItem value="hogar">Hogar</SelectItem>
                              <SelectItem value="industrial">Industrial</SelectItem>
                              <SelectItem value="joyeria">Joyería</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          Crear Bundle
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowCreateBundle(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Auctions Tab */}
          <TabsContent value="auctions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Subastas en Vivo</h2>
              <Button
                onClick={() => setShowCreateAuction(true)}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Subasta
              </Button>
            </div>

            {auctions.length === 0 ? (
              <Card className="p-12 text-center">
                <Gavel className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay subastas activas</h3>
                <p className="text-gray-500 mb-6">Crea tu primera subasta para maximizar el valor de tus modelos</p>
                <Button
                  onClick={() => setShowCreateAuction(true)}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Mi Primera Subasta
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.map((auction) => (
                  <Card key={auction.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{auction.title}</CardTitle>
                        <Badge variant="secondary">{auction.category}</Badge>
                      </div>
                      <CardDescription>{auction.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-green-600">${auction.currentBid}</span>
                          <Badge className="bg-blue-100 text-blue-800">
                            <Users className="h-3 w-3 mr-1" />
                            {auction.bidders} pujas
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>Termina en 24h</span>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                          <Gavel className="h-4 w-4 mr-2" />
                          Pujar Ahora
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Create Auction Modal */}
            {showCreateAuction && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Crear Nueva Subasta</CardTitle>
                    <CardDescription>Configura tu subasta en tiempo real</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateAuction} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Título de la Subasta</Label>
                        <Input id="title" name="title" required />
                      </div>
                      <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" name="description" required />
                      </div>
                      <div>
                        <Label htmlFor="startingPrice">Precio Inicial ($)</Label>
                        <Input id="startingPrice" name="startingPrice" type="number" step="0.01" required />
                      </div>
                      <div>
                        <Label htmlFor="category">Categoría</Label>
                        <Select name="category" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="arte">Arte</SelectItem>
                            <SelectItem value="juguetes">Juguetes</SelectItem>
                            <SelectItem value="hogar">Hogar</SelectItem>
                            <SelectItem value="industrial">Industrial</SelectItem>
                            <SelectItem value="joyeria">Joyería</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          Crear Subasta
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowCreateAuction(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics de Monetización</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Rendimiento de Bundles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No hay datos suficientes para mostrar gráficos</p>
                    <p className="text-sm text-gray-400 mt-2">Crea bundles para ver analytics detallados</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Actividad de Subastas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No hay subastas para analizar</p>
                    <p className="text-sm text-gray-400 mt-2">Crea subastas para ver métricas de rendimiento</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
