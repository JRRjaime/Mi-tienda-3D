"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Lock, Shield, CheckCircle, Loader2 } from "lucide-react"
import { getStripePublishableKey } from "@/lib/stripe"

// Inicializar Stripe
const stripePromise = loadStripe(getStripePublishableKey())

interface StripePaymentFormProps {
  amount: number
  onSuccess: (amount: number) => void
  onCancel: () => void
}

function PaymentForm({ amount, onSuccess, onCancel }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()

  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState("")
  const [paymentIntentId, setPaymentIntentId] = useState("")

  // Crear Payment Intent cuando se monta el componente
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Convertir a centavos
            currency: "usd",
            metadata: {
              type: "wallet_topup",
              amount: amount.toString(),
            },
          }),
        })

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setClientSecret(data.clientSecret)
        setPaymentIntentId(data.paymentIntentId)
      } catch (error) {
        console.error("Error creating payment intent:", error)
        toast({
          title: "Error",
          description: "No se pudo inicializar el pago",
          variant: "destructive",
        })
      }
    }

    if (amount > 0) {
      createPaymentIntent()
    }
  }, [amount, toast])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsProcessing(true)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setIsProcessing(false)
      return
    }

    try {
      // Confirmar el pago
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      if (paymentIntent?.status === "succeeded") {
        // Confirmar en el backend
        const confirmResponse = await fetch("/api/stripe/confirm-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
          }),
        })

        const confirmData = await confirmResponse.json()

        if (confirmData.success) {
          toast({
            title: "¡Pago exitoso!",
            description: `Se han añadido $${amount} a tu cartera`,
          })
          onSuccess(amount)
        } else {
          throw new Error("Error confirmando el pago")
        }
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Error en el pago",
        description: error instanceof Error ? error.message : "Error procesando el pago",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#ffffff",
        "::placeholder": {
          color: "#9ca3af",
        },
        backgroundColor: "transparent",
      },
      invalid: {
        color: "#ef4444",
      },
    },
    hidePostalCode: false,
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resumen del pago */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Resumen del Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Cantidad a añadir:</span>
            <span className="text-2xl font-bold text-white">${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Comisión de procesamiento:</span>
            <span className="text-gray-400">$0.00</span>
          </div>
          <Separator className="bg-white/20" />
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Total a pagar:</span>
            <span className="text-xl font-bold text-cyan-400">${amount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Información de la tarjeta */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Información de Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Tarjeta de Crédito o Débito</Label>
            <div className="p-4 border border-white/20 rounded-lg bg-white/5">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          {/* Badges de seguridad */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-green-400/30 text-green-400">
              <Shield className="h-3 w-3 mr-1" />
              SSL Seguro
            </Badge>
            <Badge variant="outline" className="border-blue-400/30 text-blue-400">
              <CreditCard className="h-3 w-3 mr-1" />
              Stripe
            </Badge>
            <Badge variant="outline" className="border-purple-400/30 text-purple-400">
              <Lock className="h-3 w-3 mr-1" />
              Encriptado
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Información de seguridad */}
      <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-blue-400 font-semibold text-sm">Pago 100% Seguro</h4>
            <p className="text-blue-300 text-xs mt-1">
              Procesado por Stripe con encriptación de nivel bancario. No almacenamos información de tarjetas.
            </p>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-white/20 text-white hover:bg-white/10"
          disabled={isProcessing}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          disabled={!stripe || !clientSecret || isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Procesando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Pagar ${amount.toFixed(2)}
            </div>
          )}
        </Button>
      </div>
    </form>
  )
}

export function StripePaymentForm({ amount, onSuccess, onCancel }: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  )
}
