"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  MapPin,
  User,
  Calendar,
  Shield,
  FileText,
  ShoppingBag,
  Plus,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/contexts/wallet-context"

interface OrderAddress {
  fullName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  sellerId: string
  sellerName: string
  image: string
}

interface Order {
  id: string
  buyerId: string
  buyerName: string
  sellerId: string
  sellerName: string
  items: OrderItem[]
  total: number
  status: "paid" | "shipped" | "in_transit" | "delivered" | "completed" | "disputed"
  shippingAddress: OrderAddress
  createdAt: Date
  shippedAt?: Date
  deliveredAt?: Date
  completedAt?: Date
  autoCompleteAt: Date // 10 días después del envío
  trackingNumber?: string
  notes?: string
  disputeReason?: string
  disputeStatus?: "pending" | "resolved" | "escalated"
}

interface DisputeResolution {
  type: "full_refund" | "partial_refund" | "no_refund"
  amount?: number
  reason: string
}

export function OrderTrackingSystem({ userType, userId }: { userType: string[]; userId: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false)
  const [disputeReason, setDisputeReason] = useState("")
  const [resolutionType, setResolutionType] = useState<DisputeResolution["type"]>("full_refund")
  const [partialAmount, setPartialAmount] = useState("")
  const [resolutionReason, setResolutionReason] = useState("")
  const { toast } = useToast()
  const { sendPayment, confirmPayment } = useWallet()

  // Inicializar con array vacío (sin datos de ejemplo)
  useEffect(() => {
    // Cargar pedidos desde localStorage si existen
    const savedOrders = localStorage.getItem("user_orders")
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders)
        // Convertir strings de fecha a objetos Date
        const ordersWithDates = parsedOrders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          shippedAt: order.shippedAt ? new Date(order.shippedAt) : undefined,
          deliveredAt: order.deliveredAt ? new Date(order.deliveredAt) : undefined,
          completedAt: order.completedAt ? new Date(order.completedAt) : undefined,
          autoCompleteAt: new Date(order.autoCompleteAt),
        }))
        setOrders(ordersWithDates)
      } catch (error) {
        console.error("Error parsing saved orders:", error)
        setOrders([])
      }
    } else {
      setOrders([])
    }
  }, [userId])

  // Guardar pedidos en localStorage cuando cambien
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("user_orders", JSON.stringify(orders))
    }
  }, [orders])

  // Auto-completar pedidos después de 10 días
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.status === "delivered" && new Date() > order.autoCompleteAt) {
            // Liberar fondos automáticamente
            toast({
              title: "Pedido completado automáticamente",
              description: `El pedido ${order.id} se ha completado y los fondos han sido liberados`,
            })
            return {
              ...order,
              status: "completed" as const,
              completedAt: new Date(),
            }
          }
          return order
        }),
      )
    }, 60000) // Verificar cada minuto

    return () => clearInterval(interval)
  }, [toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30"
      case "shipped":
        return "bg-purple-500/20 text-purple-400 border-purple-400/30"
      case "in_transit":
        return "bg-orange-500/20 text-orange-400 border-orange-400/30"
      case "delivered":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-400/30"
      case "disputed":
        return "bg-red-500/20 text-red-400 border-red-400/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-400/30"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pagado"
      case "shipped":
        return "Enviado"
      case "in_transit":
        return "En Tránsito"
      case "delivered":
        return "Entregado"
      case "completed":
        return "Completado"
      case "disputed":
        return "En Disputa"
      default:
        return "Desconocido"
    }
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "paid":
        return 25
      case "shipped":
        return 50
      case "in_transit":
        return 75
      case "delivered":
        return 90
      case "completed":
        return 100
      case "disputed":
        return 0
      default:
        return 0
    }
  }

  const handleMarkAsShipped = useCallback(
    async (orderId: string, trackingNumber?: string) => {
      try {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: "shipped" as const,
                  shippedAt: new Date(),
                  trackingNumber,
                  autoCompleteAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                }
              : order,
          ),
        )

        toast({
          title: "Pedido marcado como enviado",
          description: "El comprador ha sido notificado del envío",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado del pedido",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleMarkAsDelivered = useCallback(
    async (orderId: string) => {
      try {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: "delivered" as const,
                  deliveredAt: new Date(),
                }
              : order,
          ),
        )

        toast({
          title: "Pedido marcado como entregado",
          description: "Los fondos se liberarán automáticamente en 10 días si no hay problemas",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado del pedido",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleConfirmReceived = useCallback(
    async (orderId: string) => {
      try {
        const order = orders.find((o) => o.id === orderId)
        if (!order) return

        // Liberar fondos al vendedor
        await confirmPayment(`payment_${orderId}`)

        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: "completed" as const,
                  completedAt: new Date(),
                }
              : o,
          ),
        )

        toast({
          title: "Pedido confirmado",
          description: "Los fondos han sido liberados al vendedor",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo confirmar la recepción",
          variant: "destructive",
        })
      }
    },
    [orders, confirmPayment, toast],
  )

  const handleOpenDispute = useCallback(
    (orderId: string, reason: string) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: "disputed" as const,
                disputeReason: reason,
                disputeStatus: "pending" as const,
              }
            : order,
        ),
      )

      toast({
        title: "Disputa abierta",
        description: "Se ha iniciado el proceso de resolución de disputa",
      })
    },
    [toast],
  )

  const handleResolveDispute = useCallback(
    async (orderId: string, resolution: DisputeResolution) => {
      try {
        const order = orders.find((o) => o.id === orderId)
        if (!order) return

        let refundAmount = 0
        switch (resolution.type) {
          case "full_refund":
            refundAmount = order.total
            break
          case "partial_refund":
            refundAmount = resolution.amount || 0
            break
          case "no_refund":
            refundAmount = 0
            break
        }

        // Procesar reembolso si es necesario
        if (refundAmount > 0) {
          // Aquí iría la lógica de reembolso real
          console.log(`Reembolsando $${refundAmount} para el pedido ${orderId}`)
        }

        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: refundAmount === order.total ? "completed" : "completed",
                  disputeStatus: "resolved" as const,
                  completedAt: new Date(),
                }
              : o,
          ),
        )

        toast({
          title: "Disputa resuelta",
          description: `${
            resolution.type === "full_refund"
              ? "Reembolso completo procesado"
              : resolution.type === "partial_refund"
                ? `Reembolso parcial de $${refundAmount} procesado`
                : "No se procesó reembolso"
          }`,
        })

        setDisputeDialogOpen(false)
        setSelectedOrder(null)
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo resolver la disputa",
          variant: "destructive",
        })
      }
    },
    [orders, toast],
  )

  const getDaysUntilAutoComplete = (order: Order) => {
    if (order.status !== "delivered") return null
    const now = new Date()
    const diff = order.autoCompleteAt.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return Math.max(0, days)
  }

  const renderSellerActions = (order: Order) => {
    if (order.sellerId !== userId) return null

    return (
      <div className="space-y-2">
        {order.status === "paid" && (
          <Button
            onClick={() => handleMarkAsShipped(order.id)}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
          >
            <Package className="h-4 w-4 mr-2" />
            Marcar como Enviado
          </Button>
        )}

        {order.status === "shipped" && (
          <Button
            onClick={() => handleMarkAsDelivered(order.id)}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500"
          >
            <Truck className="h-4 w-4 mr-2" />
            Marcar como Entregado
          </Button>
        )}
      </div>
    )
  }

  const renderBuyerActions = (order: Order) => {
    if (order.buyerId !== userId) return null

    return (
      <div className="space-y-2">
        {order.status === "delivered" && (
          <>
            <Button
              onClick={() => handleConfirmReceived(order.id)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Recibido
            </Button>

            <Button
              onClick={() => {
                setSelectedOrder(order)
                setDisputeDialogOpen(true)
              }}
              variant="outline"
              className="w-full border-red-400/30 text-red-400 hover:bg-red-400/10"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Reportar Problema
            </Button>

            <div className="text-center text-xs text-gray-400">
              <Clock className="h-3 w-3 inline mr-1" />
              Auto-completar en {getDaysUntilAutoComplete(order)} días
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gestión de Pedidos</h2>
        <Badge className="bg-blue-500/20 text-blue-400">
          {orders.length} pedido{orders.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {orders.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-full mb-4">
              <ShoppingBag className="h-12 w-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No tienes pedidos todavía</h3>
            <p className="text-gray-400 text-center max-w-md mb-6">
              Cuando realices o recibas pedidos, aparecerán aquí. Podrás hacer seguimiento de tus compras y ventas en un
              solo lugar.
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
              <Plus className="h-4 w-4 mr-2" />
              Explorar Productos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{order.id}</CardTitle>
                    <p className="text-gray-400 text-sm">
                      {order.createdAt.toLocaleDateString()} • ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progreso del pedido */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progreso</span>
                    <span className="text-white">{getProgressPercentage(order.status)}%</span>
                  </div>
                  <Progress value={getProgressPercentage(order.status)} className="h-2" />
                </div>

                {/* Información de envío */}
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-cyan-400 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">Dirección de Envío</h4>
                        <div className="text-gray-300 text-sm space-y-1">
                          <p className="font-medium">{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                          <p className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {order.shippingAddress.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Número de seguimiento */}
                {order.trackingNumber && (
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400 font-medium text-sm">Número de seguimiento:</span>
                      <span className="text-blue-300 font-mono text-sm">{order.trackingNumber}</span>
                    </div>
                  </div>
                )}

                {/* Información de tiempo */}
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                  {order.shippedAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Enviado: {order.shippedAt.toLocaleDateString()}</span>
                    </div>
                  )}
                  {order.deliveredAt && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Entregado: {order.deliveredAt.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="space-y-2">
                  {renderSellerActions(order)}
                  {renderBuyerActions(order)}
                </div>

                {/* Estado de disputa */}
                {order.status === "disputed" && (
                  <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="text-red-400 font-medium">Disputa en Proceso</span>
                    </div>
                    <p className="text-red-300 text-sm">{order.disputeReason}</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Chat de Soporte
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                        <FileText className="h-3 w-3 mr-1" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de resolución de disputas */}
      <Dialog open={disputeDialogOpen} onOpenChange={setDisputeDialogOpen}>
        <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-sm border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Resolver Disputa</DialogTitle>
            <DialogDescription className="text-gray-400">
              Selecciona cómo quieres resolver este problema
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-white">Motivo del problema</Label>
              <Textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Describe el problema..."
                className="bg-white/5 border-white/20 text-white"
              />
            </div>

            <div>
              <Label className="text-white">Resolución</Label>
              <RadioGroup value={resolutionType} onValueChange={(value) => setResolutionType(value as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full_refund" id="full_refund" />
                  <Label htmlFor="full_refund" className="text-gray-300">
                    Reembolso completo al comprador
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partial_refund" id="partial_refund" />
                  <Label htmlFor="partial_refund" className="text-gray-300">
                    Reembolso parcial
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no_refund" id="no_refund" />
                  <Label htmlFor="no_refund" className="text-gray-300">
                    Sin reembolso - Entregar al vendedor
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {resolutionType === "partial_refund" && (
              <div>
                <Label className="text-white">Cantidad a reembolsar</Label>
                <input
                  type="number"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 bg-white/5 border border-white/20 rounded text-white"
                  step="0.01"
                  min="0"
                  max={selectedOrder?.total || 0}
                />
              </div>
            )}

            <div>
              <Label className="text-white">Razón de la resolución</Label>
              <Textarea
                value={resolutionReason}
                onChange={(e) => setResolutionReason(e.target.value)}
                placeholder="Explica la resolución..."
                className="bg-white/5 border-white/20 text-white"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setDisputeDialogOpen(false)}
                variant="outline"
                className="flex-1 border-white/20 text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (selectedOrder) {
                    handleResolveDispute(selectedOrder.id, {
                      type: resolutionType,
                      amount: resolutionType === "partial_refund" ? Number.parseFloat(partialAmount) : undefined,
                      reason: resolutionReason,
                    })
                  }
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
              >
                <Shield className="h-4 w-4 mr-2" />
                Resolver
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
