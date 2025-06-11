"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, CreditCard, Wallet, Star, Shield, Clock, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PurchaseItem {
  id: string
  title: string
  price: number
  image: string
  author: string
  files: string[]
  license: string
}

interface PurchaseSystemProps {
  item: PurchaseItem
  onClose?: () => void
}

export function PurchaseSystem({ item, onClose }: PurchaseSystemProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet">("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPurchased, setIsPurchased] = useState(false)
  const { toast } = useToast()

  const handlePurchase = async () => {
    setIsProcessing(true)

    try {
      // Simular procesamiento de pago
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsPurchased(true)
      toast({
        title: "¡Compra exitosa!",
        description: "Ya puedes descargar tus archivos",
      })
    } catch (error) {
      toast({
        title: "Error en la compra",
        description: "Hubo un problema procesando tu pago",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = (fileName: string) => {
    toast({
      title: "Descarga iniciada",
      description: `Descargando ${fileName}...`,
    })
    // Aquí iría la lógica real de descarga
  }

  if (isPurchased) {
    return (
      <Card className="bg-gray-800 border-gray-700 max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-white">¡Compra Completada!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
            />
            <h3 className="text-white font-semibold">{item.title}</h3>
            <p className="text-gray-400 text-sm">por {item.author}</p>
          </div>

          <Separator className="bg-gray-700" />

          <div>
            <h4 className="text-white font-medium mb-3">Archivos Disponibles:</h4>
            <div className="space-y-2">
              {item.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="text-white text-sm">{file}</span>
                  </div>
                  <Button size="sm" onClick={() => handleDownload(file)} className="bg-green-600 hover:bg-green-700">
                    <Download className="h-3 w-3 mr-1" />
                    Descargar
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-900/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 font-medium text-sm">Licencia: {item.license}</span>
            </div>
            <p className="text-gray-300 text-xs">
              Puedes descargar estos archivos las veces que necesites. Revisa los términos de la licencia para conocer
              los usos permitidos.
            </p>
          </div>

          {onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cerrar
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700 max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-white text-center">Completar Compra</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumen del producto */}
        <div className="flex items-center gap-4">
          <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">{item.title}</h3>
            <p className="text-gray-400 text-xs">por {item.author}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-400">4.8 (156)</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {item.license}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <span className="text-cyan-400 font-bold text-lg">${item.price}</span>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Archivos incluidos */}
        <div>
          <h4 className="text-white font-medium mb-2">Archivos Incluidos:</h4>
          <div className="space-y-1">
            {item.files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                <FileText className="h-3 w-3 text-blue-400" />
                <span>{file}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Método de pago */}
        <div>
          <h4 className="text-white font-medium mb-3">Método de Pago:</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={paymentMethod === "card" ? "default" : "outline"}
              onClick={() => setPaymentMethod("card")}
              className={`${
                paymentMethod === "card"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-gray-600 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Tarjeta
            </Button>
            <Button
              variant={paymentMethod === "wallet" ? "default" : "outline"}
              onClick={() => setPaymentMethod("wallet")}
              className={`${
                paymentMethod === "wallet"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-gray-600 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Wallet className="h-4 w-4 mr-2" />
              Cartera ($45.20)
            </Button>
          </div>
        </div>

        {/* Información de seguridad */}
        <div className="bg-green-900/20 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-green-400 font-medium text-sm">Compra Segura</span>
          </div>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Descarga inmediata después del pago</li>
            <li>• Archivos disponibles para siempre</li>
            <li>• Soporte técnico incluido</li>
            <li>• Garantía de satisfacción</li>
          </ul>
        </div>

        {/* Resumen de precio */}
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">Subtotal:</span>
            <span className="text-white">${item.price}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">Comisión de plataforma:</span>
            <span className="text-white">$0.00</span>
          </div>
          <Separator className="bg-gray-600 my-2" />
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold">Total:</span>
            <span className="text-cyan-400 font-bold text-lg">${item.price}</span>
          </div>
        </div>

        {/* Botón de compra */}
        <Button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3"
        >
          {isProcessing ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Comprar Ahora - ${item.price}
            </>
          )}
        </Button>

        {onClose && (
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancelar
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
