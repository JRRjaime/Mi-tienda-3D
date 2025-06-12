"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Truck, MapPin, Rocket, Gift } from "lucide-react"

export function UserShipments() {
  // Empezar sin envíos
  const shipments: any[] = []

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Mis Envíos</CardTitle>
          <CardDescription className="text-gray-300">Rastrea el estado de tus pedidos y envíos</CardDescription>
        </CardHeader>
        <CardContent>
          {shipments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <div className="text-4xl mb-4">🌪️</div>
              <h3 className="text-white font-bold text-xl mb-3">¡Zona de Envíos Súper Vacía! 🏜️</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Aquí no hay ni una caja... ¡Pero cuando hagas tu primera compra, este lugar se va a convertir en un
                centro logístico épico! 🚚💨
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-3xl mb-2">🎁</div>
                  <h4 className="text-white font-medium mb-1">Preparando</h4>
                  <p className="text-xs text-gray-500">Tu pedido se está empaquetando con amor</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-3xl mb-2">🚛</div>
                  <h4 className="text-white font-medium mb-1">En Tránsito</h4>
                  <p className="text-xs text-gray-500">Volando hacia ti a velocidad luz</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-3xl mb-2">🎉</div>
                  <h4 className="text-white font-medium mb-1">Entregado</h4>
                  <p className="text-xs text-gray-500">¡Felicidad pura en tu puerta!</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-lg border border-orange-500/30 max-w-md mx-auto">
                <div className="text-3xl mb-3">🛍️</div>
                <h4 className="text-white font-bold mb-2">¡Haz tu Primera Compra! 🎯</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Miles de modelos increíbles te están esperando. ¡Tu primer envío va a ser legendario! ⚡
                </p>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500">
                  <Gift className="h-4 w-4 mr-2" />
                  Explorar Modelos 🚀
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Envío súper rápido</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Empaque premium</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Tracking en tiempo real</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Rocket className="h-4 w-4" />
                  <span>Entrega garantizada</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {shipments.map((shipment) => (
                <Card key={shipment.id} className="bg-white/5 border-white/10">
                  {/* Aquí iría el contenido real de los envíos cuando existan */}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
