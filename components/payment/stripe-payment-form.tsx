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
import { CreditCard, Lock, Shield, CheckCircle, Loader2, AlertCircle, X } from "lucide-react"
import { getStripePublishableKey } from "@/lib/stripe"
import { motion, AnimatePresence } from "framer-motion"

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
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentStep, setPaymentStep] = useState<"idle" | "processing" | "success" | "error">("idle")

  // Crear Payment Intent cuando se monta el componente
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setPaymentStep("processing")

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
        setPaymentStep("idle")

        toast({
          title: "✅ Pago inicializado",
          description: "Puedes proceder con el pago",
        })
      } catch (error) {
        console.error("Error creating payment intent:", error)
        setPaymentError(error instanceof Error ? error.message : "Error desconocido")
        setPaymentStep("error")
        toast({
          title: "❌ Error de inicialización",
          description: "No se pudo inicializar el pago. Inténtalo de nuevo.",
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
      toast({
        title: "⚠️ Sistema no listo",
        description: "El sistema de pagos aún se está cargando",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setPaymentStep("processing")
    setPaymentError(null)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setIsProcessing(false)
      setPaymentStep("error")
      return
    }

    try {
      // Mostrar toast de inicio
      toast({
        title: "🔄 Procesando pago...",
        description: "No cierres esta ventana",
      })

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
        setPaymentStep("processing")

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
          setPaymentStep("success")

          toast({
            title: "🎉 ¡Pago exitoso!",
            description: `Se han añadido $${amount} a tu cartera`,
          })

          // Esperar un momento para mostrar el éxito
          setTimeout(() => {
            onSuccess(amount)
          }, 1500)
        } else {
          throw new Error("Error confirmando el pago en el servidor")
        }
      }
    } catch (error) {
      console.error("Payment error:", error)
      const errorMessage = error instanceof Error ? error.message : "Error procesando el pago"
      setPaymentError(errorMessage)
      setPaymentStep("error")

      toast({
        title: "❌ Error en el pago",
        description: errorMessage,
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

      {/* Estado del pago */}
      <AnimatePresence>
        {paymentStep !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {paymentStep === "processing" && (
              <Card className="bg-blue-500/10 border-blue-400/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    <div>
                      <h4 className="text-blue-400 font-semibold">Procesando pago...</h4>
                      <p className="text-blue-300 text-sm">Por favor no cierres esta ventana</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentStep === "success" && (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                <Card className="bg-green-500/10 border-green-400/30">
                  <CardContent className="p-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-green-400 mb-2">¡Pago Exitoso!</h3>
                    <p className="text-green-300">Tu pago ha sido procesado correctamente</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {paymentStep === "error" && paymentError && (
              <Card className="bg-red-500/10 border-red-400/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-red-400 font-semibold">Error en el pago</h4>
                      <p className="text-red-300 text-sm mt-1">{paymentError}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPaymentError(null)
                          setPaymentStep("idle")
                        }}
                        className="mt-2 text-red-400 hover:text-red-300"
                      >
                        Intentar de nuevo
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPaymentError(null)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
          disabled={!stripe || !clientSecret || isProcessing || paymentStep === "success"}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Procesando...
            </div>
          ) : paymentStep === "success" ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              ¡Completado!
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
