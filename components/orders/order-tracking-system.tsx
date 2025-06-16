"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  MessageSquare,
  Download,
  Printer,
  AlertTriangle,
  RefreshCw,
  Eye,
  Search,
  Calendar,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useIntegration } from "@/contexts/integration-context"
import { useToast } from "@/hooks/use-toast"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  type: "download" | "printed"
  downloadUrl?: string
  printSpecs?: {
    material: string
    color: string
    infill: number
    layerHeight: number
  }
}

interface ShippingAddress {
  fullName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

interface Order {
  id: string
  orderNumber: string
  buyerId: string
  buyerName: string
  sellerId: string
  sellerName: string
  items: OrderItem[]
  total: number
  status:
    | "pending"
    | "confirmed"
    | "printing"
    | "printed"
    | "shipped"
    | "delivered"
    | "completed"
    | "cancelled"
    | "disputed"
  paymentStatus: "pending" | "paid" | "refunded"
  shippingAddress: ShippingAddress
  trackingNumber?: string
  estimatedDelivery?: Date
  actualDelivery?: Date
  createdAt: Date
  updatedAt: Date
  notes?: string
  timeline: Array<{
    status: string
    timestamp: Date
    note?: string
    updatedBy: string
  }>
  rating?: number
  review?: string
  dispute?: {
    reason: string
    description: string
    status: "open" | "resolved" | "closed"
    createdAt: Date
  }
}

interface OrderTrackingSystemProps {
  userType: string[]
}

export function OrderTrackingSystem({ userType }: OrderTrackingSystemProps) {
  const { user } = useAuth()
  const { triggerOrderUpdate } = useIntegration()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "active" | "completed" | "cancelled">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [newStatusNote, setNewStatusNote] = useState("")
  const [showStatusUpdate, setShowStatusUpdate] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  // Cargar pedidos guardados
  useEffect(() => {
    if (!user) return

    const savedOrders = localStorage.getItem(`orders_${user.id}`)
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders)
        const ordersWithDates = parsed.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
          estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
          actualDelivery: order.actualDelivery ? new Date(order.actualDelivery) : undefined,
          timeline: order.timeline.map((t: any) => ({
            ...t,
            timestamp: new Date(t.timestamp),
          })),
        }))
        setOrders(ordersWithDates)
      } catch (error) {
        console.error("Error parsing orders:", error)
      }
    }
  }, [user])

  // 🎉 ESCUCHAR EVENTOS DE INTEGRACIÓN PARA CREAR PEDIDOS AUTOMÁTICAMENTE
  useEffect(() => {
    const handleCreateOrder = (event: CustomEvent) => {
      const purchaseData = event.detail

      if (!user) return

      const newOrder: Order = {
        id: `order-${Date.now()}`,
        orderNumber: purchaseData.orderId,
        buyerId: purchaseData.buyerId,
        buyerName: purchaseData.buyerName,
        sellerId: purchaseData.sellerId,
        sellerName: purchaseData.sellerName,
        items: purchaseData.items.map((item: any) => ({
          ...item,
          type: Math.random() > 0.5 ? "printed" : "download", // Simular tipos
          printSpecs:
            Math.random() > 0.5
              ? {
                  material: "PLA",
                  color: "Blanco",
                  infill: 20,
                  layerHeight: 0.2,
                }
              : undefined,
        })),
        total: purchaseData.total,
        status: "pending",
        paymentStatus: "paid",
        shippingAddress: purchaseData.shippingAddress,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        createdAt: new Date(),
        updatedAt: new Date(),
        timeline: [
          {
            status: "pending",
            timestamp: new Date(),
            note: "Pedido recibido y en proceso de confirmación",
            updatedBy: "system",
          },
        ],
      }

      setOrders((prev) => [newOrder, ...prev])

      console.log("🎉 Order created automatically:", newOrder.orderNumber)

      toast({
        title: "¡Pedido registrado!",
        description: `Pedido ${newOrder.orderNumber} creado automáticamente`,
      })
    }

    window.addEventListener("createOrder", handleCreateOrder as EventListener)

    return () => {
      window.removeEventListener("createOrder", handleCreateOrder as EventListener)
    }
  }, [user, toast])

  // Guardar pedidos cuando cambien
  useEffect(() => {
    if (user && orders.length > 0) {
      localStorage.setItem(`orders_${user.id}`, JSON.stringify(orders))
    }
  }, [orders, user])

  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: string, note?: string) => {
      setIsUpdatingStatus(true)

      try {
        // Simular actualización
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setOrders((prev) =>
          prev.map((order) => {
            if (order.id === orderId) {
              const updatedOrder = {
                ...order,
                status: newStatus as Order["status"],
                updatedAt: new Date(),
                timeline: [
                  ...order.timeline,
                  {
                    status: newStatus,
                    timestamp: new Date(),
                    note: note || `Estado actualizado a ${newStatus}`,
                    updatedBy: user?.id || "system",
                  },
                ],
              }

              // Actualizar fecha de entrega si se marca como entregado
              if (newStatus === "delivered") {
                updatedOrder.actualDelivery = new Date()
              }

              return updatedOrder
            }
            return order
          }),
        )

        // 🎉 Disparar evento de integración
        triggerOrderUpdate(orderId, newStatus)

        toast({
          title: "Estado actualizado",
          description: `El pedido ha sido marcado como ${newStatus}`,
        })

        setShowStatusUpdate(false)
        setNewStatusNote("")
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado del pedido",
          variant: "destructive",
        })
      } finally {
        setIsUpdatingStatus(false)
      }
    },
    [user, triggerOrderUpdate, toast],
  )

  const getFilteredOrders = () => {
    let filtered = orders

    // Filtrar por usuario según el tipo
    if (userType.includes("creator") || userType.includes("printer")) {
      // Mostrar pedidos donde el usuario es vendedor
      filtered = filtered.filter((order) => order.sellerId === user?.id)
    } else {
      // Mostrar pedidos donde el usuario es comprador
      filtered = filtered.filter((order) => order.buyerId === user?.id)
    }

    // Filtrar por estado
    switch (filter) {
      case "pending":
        filtered = filtered.filter((order) => ["pending", "confirmed"].includes(order.status))
        break
      case "active":
        filtered = filtered.filter((order) => ["printing", "printed", "shipped"].includes(order.status))
        break
      case "completed":
        filtered = filtered.filter((order) => ["delivered", "completed"].includes(order.status))
        break
      case "cancelled":
        filtered = filtered.filter((order) => ["cancelled", "disputed"].includes(order.status))
        break
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.sellerName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "confirmed":
        return "bg-blue-500"
      case "printing":
        return "bg-purple-500"
      case "printed":
        return "bg-indigo-500"
      case "shipped":
        return "bg-cyan-500"
      case "delivered":
        return "bg-green-500"
      case "completed":
        return "bg-emerald-500"
      case "cancelled":
        return "bg-red-500"
      case "disputed":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "printing":
        return <Printer className="h-4 w-4" />
      case "printed":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <MapPin className="h-4 w-4" />
      case "completed":
        return <Star className="h-4 w-4" />
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />
      case "disputed":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "pending":
        return 10
      case "confirmed":
        return 25
      case "printing":
        return 50
      case "printed":
        return 70
      case "shipped":
        return 85
      case "delivered":
        return 95
      case "completed":
        return 100
      default:
        return 0
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getNextStatuses = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return ["confirmed", "cancelled"]
      case "confirmed":
        return ["printing", "cancelled"]
      case "printing":
        return ["printed", "cancelled"]
      case "printed":
        return ["shipped"]
      case "shipped":
        return ["delivered"]
      case "delivered":
        return ["completed"]
      default:
        return []
    }
  }

  return (
    <div className="space-y-6">
      {/* Header y filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de Pedidos</h2>
          <p className="text-gray-400">
            {userType.includes("creator") || userType.includes("printer")
              ? "Gestiona los pedidos de tus clientes"
              : "Rastrea el estado de tus pedidos"}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar pedidos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white w-64"
            />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "active", "completed", "cancelled"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(f as any)}
            className={cn(filter === f ? "bg-cyan-500 text-white" : "text-gray-300 hover:bg-white/10")}
          >
            {f === "all"
              ? "Todos"
              : f === "pending"
                ? "Pendientes"
                : f === "active"
                  ? "Activos"
                  : f === "completed"
                    ? "Completados"
                    : "Cancelados"}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de pedidos */}
        <div className="lg:col-span-2">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="h-5 w-5" />
                Pedidos ({getFilteredOrders().length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {getFilteredOrders().length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-white font-bold text-lg mb-2">¡Zona de Pedidos Vacía! 📭</h3>
                    <p className="text-gray-400 mb-4">
                      {userType.includes("creator") || userType.includes("printer")
                        ? "Aún no tienes pedidos de clientes..."
                        : "Aún no has hecho ningún pedido..."}
                      <br />
                      ¡Pero esto está a punto de cambiar! 🚀
                    </p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <span>🛒</span>
                        <span>Haz tu primera compra</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span>🎯</span>
                        <span>Rastrea el progreso en tiempo real</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span>📱</span>
                        <span>Recibe notificaciones automáticas</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {getFilteredOrders().map((order) => (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={cn(
                          "p-4 border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors",
                          selectedOrder?.id === order.id && "bg-white/10",
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-white font-medium">#{order.orderNumber}</h4>
                              <Badge className={cn("text-white text-xs", getStatusColor(order.status))}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(order.status)}
                                  {order.status}
                                </div>
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">
                              {userType.includes("creator") || userType.includes("printer")
                                ? `Cliente: ${order.buyerName}`
                                : `Vendedor: ${order.sellerName}`}
                            </p>
                            <p className="text-gray-400 text-sm mb-2">
                              {order.items.length} artículo(s) • ${order.total.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(order.createdAt)}
                              </span>
                              {order.estimatedDelivery && (
                                <span className="flex items-center gap-1">
                                  <Truck className="h-3 w-3" />
                                  Est. {order.estimatedDelivery.toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Progress value={getProgressPercentage(order.status)} className="w-20 h-2 mb-2" />
                            <span className="text-xs text-gray-400">{getProgressPercentage(order.status)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Detalles del pedido */}
        <div>
          {selectedOrder ? (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Detalles del Pedido</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver completo
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Descargar factura
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contactar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-400">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Reportar problema
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Estado actual */}
                <div className="text-center">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3",
                      getStatusColor(selectedOrder.status),
                    )}
                  >
                    {getStatusIcon(selectedOrder.status)}
                  </div>
                  <h3 className="text-white font-semibold mb-1">
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </h3>
                  <Progress value={getProgressPercentage(selectedOrder.status)} className="w-full h-2 mb-2" />
                  <span className="text-sm text-gray-400">
                    {getProgressPercentage(selectedOrder.status)}% completado
                  </span>
                </div>

                <Separator className="bg-white/20" />

                {/* Información básica */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Número de pedido:</span>
                    <span className="text-white font-mono">#{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white font-semibold">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Fecha:</span>
                    <span className="text-white">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  {selectedOrder.estimatedDelivery && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Entrega estimada:</span>
                      <span className="text-white">{selectedOrder.estimatedDelivery.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <Separator className="bg-white/20" />

                {/* Artículos */}
                <div>
                  <h4 className="text-white font-medium mb-3">Artículos ({selectedOrder.items.length})</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-10 h-10 rounded object-cover bg-gray-700"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.name}</p>
                          <p className="text-gray-400 text-xs">
                            {item.quantity}x ${item.price} • {item.type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones para vendedores */}
                {(userType.includes("creator") || userType.includes("printer")) && (
                  <>
                    <Separator className="bg-white/20" />
                    <div>
                      <h4 className="text-white font-medium mb-3">Acciones</h4>
                      <div className="space-y-2">
                        {getNextStatuses(selectedOrder.status).map((status) => (
                          <Button
                            key={status}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setNewStatus(status)
                              setShowStatusUpdate(true)
                            }}
                            className="w-full border-white/20 text-white hover:bg-white/10"
                          >
                            Marcar como {status}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Timeline */}
                <Separator className="bg-white/20" />
                <div>
                  <h4 className="text-white font-medium mb-3">Historial</h4>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {selectedOrder.timeline.map((event, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className={cn("w-2 h-2 rounded-full mt-2", getStatusColor(event.status))} />
                          <div className="flex-1">
                            <p className="text-white">{event.status}</p>
                            {event.note && <p className="text-gray-400 text-xs">{event.note}</p>}
                            <p className="text-gray-500 text-xs">{formatDate(event.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">👆</div>
                <h3 className="text-white font-bold text-lg mb-2">¡Selecciona un Pedido! 🎯</h3>
                <p className="text-gray-400">
                  Haz clic en cualquier pedido de la lista
                  <br />
                  para ver todos sus detalles épicos
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal para actualizar estado */}
      {showStatusUpdate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 bg-gray-900 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Actualizar Estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Nuevo estado: {newStatus}</Label>
              </div>
              <div>
                <Label htmlFor="note" className="text-white">
                  Nota (opcional)
                </Label>
                <Textarea
                  id="note"
                  placeholder="Agregar una nota sobre esta actualización..."
                  value={newStatusNote}
                  onChange={(e) => setNewStatusNote(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowStatusUpdate(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => selectedOrder && updateOrderStatus(selectedOrder.id, newStatus, newStatusNote)}
                  disabled={isUpdatingStatus}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500"
                >
                  {isUpdatingStatus ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Actualizar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
