"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Printer, Clock, CheckCircle, XCircle, DollarSign, Package } from "lucide-react"

const printerOrders = [
  {
    id: "ORD-001",
    customerName: "María García",
    modelName: "Figura Dragon Ball Z - Vegeta",
    quantity: 2,
    material: "PLA",
    color: "Amarillo",
    status: "in_progress",
    price: 45.0,
    orderDate: "2024-01-15",
    estimatedCompletion: "2024-01-18",
    specifications: {
      infill: "20%",
      layerHeight: "0.2mm",
      supports: "Sí",
    },
  },
  {
    id: "ORD-002",
    customerName: "Carlos Mendez",
    modelName: "Engranaje Industrial",
    quantity: 1,
    material: "PETG",
    color: "Negro",
    status: "pending",
    price: 35.0,
    orderDate: "2024-01-16",
    estimatedCompletion: "2024-01-20",
    specifications: {
      infill: "100%",
      layerHeight: "0.1mm",
      supports: "No",
    },
  },
  {
    id: "ORD-003",
    customerName: "Ana Rodriguez",
    modelName: "Organizador de Escritorio",
    quantity: 3,
    material: "PLA",
    color: "Blanco",
    status: "completed",
    price: 60.0,
    orderDate: "2024-01-12",
    estimatedCompletion: "2024-01-15",
    specifications: {
      infill: "15%",
      layerHeight: "0.3mm",
      supports: "Sí",
    },
  },
  {
    id: "ORD-004",
    customerName: "Luis Torres",
    modelName: "Prototipo Mecánico",
    quantity: 1,
    material: "ABS",
    color: "Gris",
    status: "cancelled",
    price: 25.0,
    orderDate: "2024-01-14",
    estimatedCompletion: "2024-01-17",
    specifications: {
      infill: "50%",
      layerHeight: "0.2mm",
      supports: "Sí",
    },
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-yellow-500">
          <Clock className="h-3 w-3 mr-1" />
          Pendiente
        </Badge>
      )
    case "in_progress":
      return (
        <Badge className="bg-blue-500">
          <Printer className="h-3 w-3 mr-1" />
          En Progreso
        </Badge>
      )
    case "completed":
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completado
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="bg-red-500">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelado
        </Badge>
      )
    default:
      return <Badge variant="secondary">Desconocido</Badge>
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-yellow-400"
    case "in_progress":
      return "text-blue-400"
    case "completed":
      return "text-green-400"
    case "cancelled":
      return "text-red-400"
    default:
      return "text-gray-400"
  }
}

export function PrinterOrders() {
  const totalEarnings = printerOrders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.price, 0)

  const activeOrders = printerOrders.filter(
    (order) => order.status === "pending" || order.status === "in_progress",
  ).length

  const completedOrders = printerOrders.filter((order) => order.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Pedidos Activos</CardTitle>
            <Printer className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeOrders}</div>
            <p className="text-xs text-white/80">En proceso o pendientes</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{completedOrders}</div>
            <p className="text-xs text-gray-400">Este mes</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Ganancias</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-gray-400">Pedidos completados</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de pedidos */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Package className="h-5 w-5" />
            Pedidos de Impresión
          </CardTitle>
          <CardDescription className="text-gray-300">
            Gestiona los pedidos de impresión 3D de tus clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {printerOrders.map((order) => (
              <Card key={order.id} className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{order.modelName}</h3>
                      <p className="text-gray-400">Cliente: {order.customerName}</p>
                      <p className="text-sm text-gray-400">Pedido #{order.id}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <div className="text-2xl font-bold text-cyan-400 mt-2">${order.price.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <h4 className="text-white font-medium">Detalles del Pedido</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cantidad:</span>
                          <span className="text-white">{order.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Material:</span>
                          <span className="text-white">{order.material}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Color:</span>
                          <span className="text-white">{order.color}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-white font-medium">Especificaciones</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Relleno:</span>
                          <span className="text-white">{order.specifications.infill}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Altura de capa:</span>
                          <span className="text-white">{order.specifications.layerHeight}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Soportes:</span>
                          <span className="text-white">{order.specifications.supports}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-white font-medium">Fechas</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pedido:</span>
                          <span className="text-white">{order.orderDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Entrega est.:</span>
                          <span className="text-white">{order.estimatedCompletion}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    {order.status === "pending" && (
                      <>
                        <Button className="bg-gradient-to-r from-green-500 to-emerald-500">Aceptar Pedido</Button>
                        <Button
                          variant="outline"
                          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                    {order.status === "in_progress" && (
                      <>
                        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">Marcar como Completado</Button>
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          Actualizar Estado
                        </Button>
                      </>
                    )}
                    {order.status === "completed" && (
                      <Button
                        variant="outline"
                        className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                      >
                        Ver Detalles
                      </Button>
                    )}
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Contactar Cliente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
