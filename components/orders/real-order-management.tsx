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
  Printer,
  Eye,
  MessageSquare,
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
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  user_id: string
  printer_id?: string
  model_id: string
  model_name: string
  model_image?: string
  quantity: number
  total_price: number
  status: "pending" | "accepted" | "rejected" | "printing" | "completed" | "shipped" | "delivered" | "cancelled"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  print_specifications?: any
  shipping_address?: any
  notes?: string
  estimated_completion?: string
  actual_completion?: string
  tracking_number?: string
  created_at: string
  updated_at: string
}

interface RealOrderManagementProps {
  userType: "buyer" | "printer"
  userId: string
}

export function RealOrderManagement({ userType, userId }: RealOrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [userType])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders?userType=${userType}`)
      const data = await response.json()

      if (response.ok) {
        setOrders(data.orders || [])
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los pedidos",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string, additionalData?: any) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          ...additionalData,
        }),
      })

      if (response.ok) {
        await fetchOrders() // Recargar pedidos
        toast({
          title: "Éxito",
          description: `Pedido ${getStatusText(newStatus).toLowerCase()}`,
        })
      } else {
        throw new Error("Failed to update order")
      }
    } catch (error) {
      console.error("Error updating order:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el pedido",
        variant: "destructive",
      })
    }
  }

  const acceptOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, "accepted", {
      printer_id: userId,
      estimated_completion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  const rejectOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, "rejected")
  }

  const startPrinting = async (orderId: string) => {
    await updateOrderStatus(orderId, "printing")
  }

  const completeOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, "completed", {
      actual_completion: new Date().toISOString(),
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
      case "accepted":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30"
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-400/30"
      case "printing":
        return "bg-purple-500/20 text-purple-400 border-purple-400/30"
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-400/30"
      case "shipped":
        return "bg-orange-500/20 text-orange-400 border-orange-400/30"
      case "delivered":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-400/30"
      case "cancelled":
        return "bg-gray-500/20 text-gray-400 border-gray-400/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-400/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <AlertCircle className="h-4 w-4" />
      case "printing":
        return <Printer className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "accepted":
        return "Aceptado"
      case "rejected":
        return "Rechazado"
      case "printing":
        return "Imprimiendo"
      case "completed":
        return "Completado"
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

  const getProgress = (status: string) => {
    switch (status) {
      case "pending":
        return 10
      case "accepted":
        return 25
      case "printing":
        return 60
      case "completed":
        return 85
      case "shipped":
        return 95
      case "delivered":
        return 100
      default:
        return 0
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return ["pending", "accepted", "printing", "shipped"].includes(order.status)
    if (activeTab === "completed") return ["completed", "delivered"].includes(order.status)
    return true
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    )
  }

  const renderOrderCard = (order: Order) => (
    <Card key={order.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-lg">{order.model_name}</CardTitle>
            <p className="text-gray-400 text-sm">
              {new Date(order.created_at).toLocaleDateString()} • Cantidad: {order.quantity}
            </p>
          </div>
          <div className="text-right">
            <Badge className={cn("mb-2", getStatusColor(order.status))}>
              {getStatusIcon(order.status)}
              <span className="ml-1">{getStatusText(order.status)}</span>
            </Badge>
            <p className="text-white font-semibold">${order.total_price.toFixed(2)}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progreso */}
        {order.status !== "cancelled" && order.status !== "rejected" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progreso</span>
              <span className="text-white">{getProgress(order.status)}%</span>
            </div>
            <Progress value={getProgress(order.status)} className="h-2" />
          </div>
        )}

        {/* Imagen del modelo */}
        {order.model_image && (
          <div className="flex items-center gap-3">
            <img
              src={order.model_image || "/placeholder.svg"}
              alt={order.model_name}
              className="w-16 h-16 rounded-lg object-cover bg-gray-700"
            />
            <div className="flex-1">
              <p className="text-white font-medium">{order.model_name}</p>
              <p className="text-gray-400 text-sm">ID: {order.id.slice(0, 8)}...</p>
            </div>
          </div>
        )}

        {/* Información adicional */}
        {order.estimated_completion && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>Entrega estimada: {new Date(order.estimated_completion).toLocaleDateString()}</span>
          </div>
        )}

        {order.tracking_number && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>Tracking: {order.tracking_number}</span>
          </div>
        )}

        {order.notes && (
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
            <p className="text-blue-400 text-sm">{order.notes}</p>
          </div>
        )}

        {/* Acciones según el tipo de usuario */}
        <div className="flex gap-2 pt-2">
          {userType === "printer" && order.status === "pending" && (
            <>
              <Button
                onClick={() => acceptOrder(order.id)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aceptar
              </Button>
              <Button
                onClick={() => rejectOrder(order.id)}
                variant="outline"
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white flex-1"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Rechazar
              </Button>
            </>
          )}

          {userType === "printer" && order.status === "accepted" && (
            <Button
              onClick={() => startPrinting(order.id)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 flex-1"
            >
              <Printer className="h-4 w-4 mr-2" />
              Iniciar Impresión
            </Button>
          )}

          {userType === "printer" && order.status === "printing" && (
            <Button
              onClick={() => completeOrder(order.id)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar Completado
            </Button>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(order)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalles
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-gray-900/95 backdrop-blur-sm border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Detalles del Pedido</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Información completa del pedido #{selectedOrder?.id.slice(0, 8)}
                </DialogDescription>
              </DialogHeader>
              {selectedOrder && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Estado del Pedido</h4>
                      <Badge className={cn("text-base px-3 py-1", getStatusColor(selectedOrder.status))}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-2">{getStatusText(selectedOrder.status)}</span>
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Total</h4>
                      <p className="text-2xl font-bold text-cyan-400">${selectedOrder.total_price.toFixed(2)}</p>
                    </div>
                  </div>

                  {selectedOrder.print_specifications && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Especificaciones de Impresión</h4>
                      <div className="bg-white/5 rounded-lg p-4 space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Material:</span>
                            <span className="text-white">{selectedOrder.print_specifications.material || "PLA"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Color:</span>
                            <span className="text-white">{selectedOrder.print_specifications.color || "Blanco"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Relleno:</span>
                            <span className="text-white">
                              {selectedOrder.print_specifications.infill_percentage || 20}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Soportes:</span>
                            <span className="text-white">
                              {selectedOrder.print_specifications.supports ? "Sí" : "No"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedOrder.shipping_address && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Dirección de Envío</h4>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-white">{selectedOrder.shipping_address.fullName}</p>
                        <p className="text-gray-300">{selectedOrder.shipping_address.address}</p>
                        <p className="text-gray-300">
                          {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}{" "}
                          {selectedOrder.shipping_address.zipCode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          {userType === "printer" ? "Pedidos de Impresión" : "Mis Pedidos"}
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Package className="h-4 w-4" />
          <span>{orders.length} pedidos totales</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todos ({orders.length})</TabsTrigger>
          <TabsTrigger value="active">
            Activos ({orders.filter((o) => ["pending", "accepted", "printing", "shipped"].includes(o.status)).length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completados ({orders.filter((o) => ["completed", "delivered"].includes(o.status)).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-white font-medium mb-2">No hay pedidos</h3>
                <p className="text-gray-400">
                  {userType === "printer"
                    ? "Cuando recibas pedidos de impresión, aparecerán aquí"
                    : "Cuando realices pedidos, aparecerán aquí"}
                </p>
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
