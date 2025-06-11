"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  Download,
  Printer,
  Eye,
  MessageSquare,
  Star,
  AlertCircle,
  MapPin,
  Calendar,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  type: "download" | "printed"
  image: string
  creatorName: string
  downloadUrl?: string
  printStatus?: "pending" | "printing" | "completed"
}

interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "printing" | "shipping" | "delivered" | "completed"
  createdAt: Date
  estimatedDelivery?: Date
  actualDelivery?: Date
  trackingNumber?: string
  shippingAddress?: {
    fullName: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  paymentMethod: string
  progress: number
  notes?: string
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Datos simulados de pedidos
  const mockOrders: Order[] = [
    {
      id: "ORD-1703123456",
      items: [
        {
          id: "1",
          name: "Dragón Articulado",
          quantity: 1,
          price: 25,
          type: "download",
          image: "/placeholder.svg?height=60&width=60",
          creatorName: "Carlos Mendez",
          downloadUrl: "/downloads/dragon-articulado.zip",
        },
      ],
      total: 25,
      status: "completed",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      paymentMethod: "Tarjeta de Crédito",
      progress: 100,
    },
    {
      id: "ORD-1703123457",
      items: [
        {
          id: "2",
          name: "Miniatura Guerrero",
          quantity: 2,
          price: 15,
          type: "printed",
          image: "/placeholder.svg?height=60&width=60",
          creatorName: "Ana García",
          printStatus: "printing",
        },
        {
          id: "3",
          name: "Escudo Medieval",
          quantity: 1,
          price: 8,
          type: "printed",
          image: "/placeholder.svg?height=60&width=60",
          creatorName: "Luis Martín",
          printStatus: "completed",
        },
      ],
      total: 38,
      status: "printing",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      shippingAddress: {
        fullName: "Juan Pérez",
        address: "Calle Mayor 123",
        city: "Madrid",
        state: "Madrid",
        zipCode: "28001",
      },
      paymentMethod: "PayPal",
      progress: 65,
      notes: "Impresión en curso. El guerrero está terminado, falta el escudo.",
    },
    {
      id: "ORD-1703123458",
      items: [
        {
          id: "4",
          name: "Vaso Personalizado",
          quantity: 1,
          price: 12,
          type: "printed",
          image: "/placeholder.svg?height=60&width=60",
          creatorName: "María López",
          printStatus: "pending",
        },
      ],
      total: 17.99, // Incluye envío
      status: "processing",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      shippingAddress: {
        fullName: "Juan Pérez",
        address: "Calle Mayor 123",
        city: "Madrid",
        state: "Madrid",
        zipCode: "28001",
      },
      paymentMethod: "Tarjeta de Crédito",
      progress: 25,
      notes: "Pedido confirmado. Esperando inicio de impresión.",
    },
  ]

  useEffect(() => {
    setOrders(mockOrders)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
      case "processing":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30"
      case "printing":
        return "bg-purple-500/20 text-purple-400 border-purple-400/30"
      case "shipping":
        return "bg-orange-500/20 text-orange-400 border-orange-400/30"
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-400/30"
      case "completed":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-400/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-400/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "printing":
        return <Printer className="h-4 w-4" />
      case "shipping":
        return <Truck className="h-4 w-4" />
      case "delivered":
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "processing":
        return "Procesando"
      case "printing":
        return "Imprimiendo"
      case "shipping":
        return "Enviando"
      case "delivered":
        return "Entregado"
      case "completed":
        return "Completado"
      default:
        return "Desconocido"
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return ["pending", "processing", "printing", "shipping"].includes(order.status)
    if (activeTab === "completed") return ["delivered", "completed"].includes(order.status)
    return true
  })

  const renderOrderCard = (order: Order) => (
    <Card key={order.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-lg">{order.id}</CardTitle>
            <p className="text-gray-400 text-sm">
              {order.createdAt.toLocaleDateString()} • {order.items.length} artículo(s)
            </p>
          </div>
          <div className="text-right">
            <Badge className={cn("mb-2", getStatusColor(order.status))}>
              {getStatusIcon(order.status)}
              <span className="ml-1">{getStatusText(order.status)}</span>
            </Badge>
            <p className="text-white font-semibold">${order.total.toFixed(2)}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progreso */}
        {order.status !== "completed" && order.status !== "delivered" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progreso</span>
              <span className="text-white">{order.progress}%</span>
            </div>
            <Progress value={order.progress} className="h-2" />
          </div>
        )}

        {/* Items del pedido */}
        <div className="space-y-2">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-10 h-10 rounded-lg object-cover bg-gray-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{item.name}</p>
                <p className="text-gray-400 text-xs">
                  {item.quantity}x • {item.creatorName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    item.type === "download" ? "text-blue-400 border-blue-400/30" : "text-green-400 border-green-400/30"
                  }
                >
                  {item.type === "download" ? <Download className="h-3 w-3" /> : <Printer className="h-3 w-3" />}
                </Badge>
                {item.type === "download" && order.status === "completed" && (
                  <Button size="sm" variant="ghost" className="text-cyan-400 hover:bg-cyan-400/10 h-6 px-2">
                    <Download className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {order.items.length > 2 && <p className="text-gray-400 text-sm">+{order.items.length - 2} artículo(s) más</p>}
        </div>

        {/* Información adicional */}
        {order.estimatedDelivery && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>Entrega estimada: {order.estimatedDelivery.toLocaleDateString()}</span>
          </div>
        )}

        {order.trackingNumber && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>Tracking: {order.trackingNumber}</span>
          </div>
        )}

        {order.notes && (
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
            <p className="text-blue-400 text-sm">{order.notes}</p>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(order)}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalles
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-gray-900/95 backdrop-blur-sm border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Detalles del Pedido {selectedOrder?.id}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Información completa del pedido y estado actual
                </DialogDescription>
              </DialogHeader>
              {selectedOrder && (
                <div className="space-y-6">
                  {/* Estado y progreso */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={cn("text-base px-3 py-1", getStatusColor(selectedOrder.status))}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-2">{getStatusText(selectedOrder.status)}</span>
                      </Badge>
                      <span className="text-white font-semibold text-lg">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                    {selectedOrder.status !== "completed" && selectedOrder.status !== "delivered" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progreso del pedido</span>
                          <span className="text-white">{selectedOrder.progress}%</span>
                        </div>
                        <Progress value={selectedOrder.progress} className="h-3" />
                      </div>
                    )}
                  </div>

                  {/* Items detallados */}
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Artículos del pedido</h4>
                    {selectedOrder.items.map((item) => (
                      <Card key={item.id} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover bg-gray-700"
                            />
                            <div className="flex-1">
                              <h5 className="text-white font-medium">{item.name}</h5>
                              <p className="text-gray-400 text-sm">por {item.creatorName}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge
                                  variant="outline"
                                  className={
                                    item.type === "download"
                                      ? "text-blue-400 border-blue-400/30"
                                      : "text-green-400 border-green-400/30"
                                  }
                                >
                                  {item.type === "download" ? (
                                    <>
                                      <Download className="h-3 w-3 mr-1" />
                                      Descarga
                                    </>
                                  ) : (
                                    <>
                                      <Printer className="h-3 w-3 mr-1" />
                                      Impreso
                                    </>
                                  )}
                                </Badge>
                                {item.printStatus && (
                                  <Badge
                                    variant="outline"
                                    className={
                                      item.printStatus === "completed"
                                        ? "text-green-400 border-green-400/30"
                                        : item.printStatus === "printing"
                                          ? "text-purple-400 border-purple-400/30"
                                          : "text-yellow-400 border-yellow-400/30"
                                    }
                                  >
                                    {item.printStatus === "completed"
                                      ? "Impreso"
                                      : item.printStatus === "printing"
                                        ? "Imprimiendo"
                                        : "Pendiente"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">{item.quantity}x</p>
                              <p className="text-gray-400 text-sm">${item.price.toFixed(2)} c/u</p>
                              <p className="text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Información de envío */}
                  {selectedOrder.shippingAddress && (
                    <div className="space-y-2">
                      <h4 className="text-white font-medium">Dirección de envío</h4>
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="text-gray-300">
                            <p className="font-medium text-white">{selectedOrder.shippingAddress.fullName}</p>
                            <p>{selectedOrder.shippingAddress.address}</p>
                            <p>
                              {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                              {selectedOrder.shippingAddress.zipCode}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contactar
          </Button>

          {order.status === "completed" && (
            <Button variant="outline" size="sm" className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
              <Star className="h-4 w-4 mr-2" />
              Valorar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Mis Pedidos</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Package className="h-4 w-4" />
          <span>{orders.length} pedidos totales</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todos ({orders.length})</TabsTrigger>
          <TabsTrigger value="active">
            Activos ({orders.filter((o) => ["pending", "processing", "printing", "shipping"].includes(o.status)).length}
            )
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completados ({orders.filter((o) => ["delivered", "completed"].includes(o.status)).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-white font-medium mb-2">No hay pedidos</h3>
                <p className="text-gray-400">Cuando realices pedidos, aparecerán aquí</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">{filteredOrders.map((order) => renderOrderCard(order))}</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
