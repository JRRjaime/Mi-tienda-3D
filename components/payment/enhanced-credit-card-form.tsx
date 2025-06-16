"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Building2, Smartphone, Shield, CheckCircle, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { isStripeConfigured, getStripePublishableKey } from "@/lib/stripe"

interface EnhancedCreditCardFormProps {
  onSuccess: (amount: number) => void
  onCancel: () => void
}

export function EnhancedCreditCardForm({ onSuccess, onCancel }: EnhancedCreditCardFormProps) {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Verificar si Stripe está configurado
  const stripeConfigured = isStripeConfigured()
  const publishableKey = getStripePublishableKey()

  const handleSubmit = async () => {
    if (!stripeConfigured) {
      toast({
        title: "Servicio no disponible",
        description: "El sistema de pagos no está configurado. Contacta al soporte.",
        variant: "destructive",
      })
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Cantidad inválida",
        description: "Por favor ingresa una cantidad válida",
        variant: "destructive",
      })
      return
    }

    if (!paymentMethod) {
      toast({
        title: "Método requerido",
        description: "Por favor selecciona un método de pago",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simular procesamiento de pago cuando Stripe no está configurado
      if (!stripeConfigured) {
        // Simular delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        toast({
          title: "Pago simulado exitoso",
          description: `Se han añadido $${amount} a tu cartera (modo demo)`,
        })

        onSuccess(Number.parseFloat(amount))
        return
      }

      // Aquí iría la lógica real de Stripe cuando esté configurado
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(Number.parseFloat(amount) * 100), // Convertir a centavos
          metadata: {
            paymentMethod,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al procesar el pago")
      }

      toast({
        title: "Pago exitoso",
        description: `Se han añadido $${amount} a tu cartera`,
      })

      onSuccess(Number.parseFloat(amount))
    } catch (error) {
      console.error("Error processing payment:", error)
      toast({
        title: "Error en el pago",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Alerta de configuración */}
      {!stripeConfigured && (
        <Alert className="border-yellow-500/20 bg-yellow-500/10">
          <Info className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-200">
            <strong>Modo Demo:</strong> Stripe no está configurado. Los pagos serán simulados.
          </AlertDescription>
        </Alert>
      )}

      {/* Selector de cantidad */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount" className="text-white">
            Cantidad a añadir
          </Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-white/5 border-white/20 text-white text-lg"
            min="0.50"
            step="0.01"
          />
          <p className="text-xs text-gray-400 mt-1">Mínimo: $0.50</p>
        </div>

        {/* Métodos de pago */}
        <div className="space-y-3">
          <Label className="text-white">Método de pago</Label>

          <div className="grid gap-3">
            {/* Tarjeta de Crédito/Débito */}
            <Card
              className={`cursor-pointer transition-all ${
                paymentMethod === "credit_card"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              }`}
              onClick={() => setPaymentMethod("credit_card")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">Tarjeta de Crédito/Débito</div>
                      <div className="text-xs text-gray-400">Visa, Mastercard, Amex</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-green-400/30 text-green-400">
                      <Shield className="h-3 w-3 mr-1" />
                      Seguro
                    </Badge>
                    <Badge variant="outline" className="border-blue-400/30 text-blue-400">
                      Instantáneo
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transferencia Bancaria */}
            <Card
              className={`cursor-pointer transition-all ${
                paymentMethod === "bank_transfer"
                  ? "border-green-500 bg-green-500/10"
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              }`}
              onClick={() => setPaymentMethod("bank_transfer")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-green-400" />
                    <div>
                      <div className="text-white font-medium">Transferencia Bancaria</div>
                      <div className="text-xs text-gray-400">1-3 días hábiles</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-green-400/30 text-green-400">
                      <Shield className="h-3 w-3 mr-1" />
                      Seguro
                    </Badge>
                    <Badge variant="outline" className="border-yellow-400/30 text-yellow-400">
                      1-3 días
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Digital */}
            <Card
              className={`cursor-pointer transition-all ${
                paymentMethod === "digital_wallet"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              }`}
              onClick={() => setPaymentMethod("digital_wallet")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-purple-400" />
                    <div>
                      <div className="text-white font-medium">Wallet Digital</div>
                      <div className="text-xs text-gray-400">Apple Pay, Google Pay, PayPal</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-purple-400/30 text-purple-400">
                      <Smartphone className="h-3 w-3 mr-1" />
                      Móvil
                    </Badge>
                    <Badge variant="outline" className="border-blue-400/30 text-blue-400">
                      Rápido
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Información de seguridad */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <h4 className="text-green-400 font-medium mb-1">Pago 100% Seguro</h4>
              <p className="text-xs text-gray-300">
                Tus datos están protegidos con encriptación de nivel bancario. No almacenamos información de tarjetas.
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !amount || !paymentMethod}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                {stripeConfigured ? "Procesar Pago" : "Simular Pago"}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Cancelar
          </Button>
        </div>

        {/* Información adicional */}
        <div className="text-xs text-gray-400 text-center">
          <p>Al proceder, aceptas nuestros términos de servicio y política de privacidad.</p>
        </div>
      </div>
    </div>
  )
}
