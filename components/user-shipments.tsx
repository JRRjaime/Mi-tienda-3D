"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, MapPin, Clock } from "lucide-react"

const shipments = [
  {
    id: "ENV-001",
    product: "Figura Dragon Ball Z - Goku",
    status: "en_transito",
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-01-20",
    origin: "Madrid, España",
    destination: "Barcelona, España",
    carrier: "Correos Express",
  },
  {
    id: "ENV-002",
    product: "Engranaje Industrial Personalizado",
    status: "entregado",
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2024-01-15",
    origin: "Valencia, España",
    destination: "Sevilla, España",
    carrier: "SEUR",
  },
  {
    id: "ENV-003",
    product: "Organizador de Escritorio",
    status: "preparando",
    trackingNumber: "TRK456789123",
    estimatedDelivery: "2024-01-25",
    origin: "Bilbao, España",
    destination: "Zaragoza, España",
    carrier: "MRW",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "preparando":
      return <Badge className="bg-yellow-500">Preparando</Badge>
    case "en_transito":
      return <Badge className="bg-blue-500">En Tránsito</Badge>
    case "entregado":
      return <Badge className="bg-green-500">Entregado</Badge>
    default:
      return <Badge variant="secondary">Desconocido</Badge>
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "preparando":
      return <Package className="h-5 w-5 text-yellow-400" />
    case "en_transito":
      return <Truck className="h-5 w-5 text-blue-400" />
    case "entregado":
      return <MapPin className="h-5 w-5 text-green-400" />
    default:
      return <Clock className="h-5 w-5 text-gray-400" />
  }
}

export function UserShipments() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Mis Envíos</CardTitle>
          <CardDescription className="text-gray-300">Rastrea el estado de tus pedidos y envíos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <Card key={shipment.id} className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(shipment.status)}
                      <div>
                        <h3 className="text-white font-semibold">{shipment.product}</h3>
                        <p className="text-sm text-gray-400">Pedido #{shipment.id}</p>
                      </div>
                    </div>
                    {getStatusBadge(shipment.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">Número de seguimiento:</span>
                        <span className="text-cyan-400 font-mono">{shipment.trackingNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">Transportista:</span>
                        <span className="text-white">{shipment.carrier}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">Origen:</span>
                        <span className="text-white">{shipment.origin}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">Destino:</span>
                        <span className="text-white">{shipment.destination}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-400">Entrega estimada: </span>
                      <span className="text-white font-medium">{shipment.estimatedDelivery}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                    >
                      Rastrear Pedido
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
