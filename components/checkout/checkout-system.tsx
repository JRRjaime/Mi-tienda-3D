"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEnhancedCart } from "@/contexts/enhanced-cart-context"
import { useIntegration } from "@/contexts/integration-context"
import { ShippingForm } from "./shipping-form"
import { PaymentMethods } from "./payment-methods"
import { OrderSummary } from "./order-summary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Truck, CreditCard, Package, Sparkles } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { ShippingAddress } from "@/contexts/enhanced-cart-context"

type CheckoutStep = "shipping" | "payment" | "review"

interface PaymentMethod {
  type: "stripe" | "paypal" | "wallet"
  data?: any
}

export function CheckoutSystem() {
  const router = useRouter()
  const { items, total, shippingAddress, setShippingAddress, clearCart } = useEnhancedCart()
  const { triggerPurchaseComplete } = useIntegration()

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const steps = [
    { id: "shipping", label: "Envío", icon: Truck, completed: !!shippingAddress },
    { id: "payment", label: "Pago", icon: CreditCard, completed: !!paymentMethod },
    { id: "review", label: "Revisar", icon: Package, completed: false },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address)
    setCurrentStep("payment")
    toast({
      title: "✅ Dirección guardada",
      description: "Información de envío actualizada correctamente",
    })
  }

  const handlePaymentSelect = (method: PaymentMethod) => {
    setPaymentMethod(method)
    setCurrentStep("review")
    toast({
      title: "💳 Método seleccionado",
      description: `Pago con ${method.type === "stripe" ? "tarjeta" : method.type === "paypal" ? "PayPal" : "wallet"} configurado`,
    })
  }

  const handlePlaceOrder = async () => {
    if (!shippingAddress || !paymentMethod) {
      toast({
        title: "❌ Información incompleta",
        description: "Por favor completa todos los pasos",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Generar ID único para el pedido
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Simular procesamiento del pago con Stripe
      const paymentData = {
        amount: Math.round(total * 100), // Stripe usa centavos
        currency: "usd",
        orderId,
        buyerId: "user_123", // En producción, obtener del contexto de auth
        sellerId: "seller_456", // En producción, obtener de los items
        buyerName: shippingAddress.fullName,
        sellerName: "Vendedor Demo", // En producción, obtener de los items
        items,
        shippingAddress,
        paymentMethod,
      }

      console.log("🔄 Processing payment with data:", paymentData)

      // Simular llamada a Stripe
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simular respuesta exitosa de Stripe
      const paymentResult = {
        success: true,
        paymentIntentId: `pi_${Date.now()}`,
        orderId,
      }

      if (paymentResult.success) {
        // 🎉 Disparar evento de compra completada
        triggerPurchaseComplete({
          orderId: paymentResult.orderId,
          buyerId: paymentData.buyerId,
          buyerName: paymentData.buyerName,
          sellerId: paymentData.sellerId,
          sellerName: paymentData.sellerName,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || "/placeholder.svg",
          })),
          total,
          shippingAddress,
        })

        // Limpiar carrito
        clearCart()

        toast({
          title: "🎉 ¡Pedido realizado!",
          description: `Tu pedido #${paymentResult.orderId} ha sido procesado exitosamente`,
        })

        // Redirigir a página de éxito
        router.push(`/checkout/success?orderId=${paymentResult.orderId}`)
      } else {
        throw new Error("Payment failed")
      }
    } catch (error) {
      console.error("Error processing order:", error)
      toast({
        title: "❌ Error en el pedido",
        description: "Hubo un problema procesando tu pedido. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulario Principal */}
      <div className="lg:col-span-2 space-y-6">
        {/* Indicador de Progreso */}
        <Card className="bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 border-purple-200 dark:border-purple-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Progreso del Checkout
              </CardTitle>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Paso {currentStepIndex + 1} de {steps.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = step.id === currentStep
                const isCompleted = step.completed
                const isPast = index < currentStepIndex

                return (
                  <motion.div
                    key={step.id}
                    className={`flex flex-col items-center gap-2 ${
                      isActive ? "text-purple-600" : isCompleted || isPast ? "text-green-600" : "text-gray-400"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isActive ? Number.POSITIVE_INFINITY : 0, repeatDelay: 2 }}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        isActive
                          ? "border-purple-500 bg-purple-100 dark:bg-purple-900/50"
                          : isCompleted || isPast
                            ? "border-green-500 bg-green-100 dark:bg-green-900/50"
                            : "border-gray-300 bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      {isCompleted || isPast ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <span className="text-sm font-medium">{step.label}</span>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Contenido del Paso Actual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === "shipping" && (
              <ShippingForm initialData={shippingAddress} onSubmit={handleShippingSubmit} />
            )}

            {currentStep === "payment" && (
              <PaymentMethods onSelect={handlePaymentSelect} selectedMethod={paymentMethod} />
            )}

            {currentStep === "review" && (
              <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
                <CardHeader>
                  <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Revisar Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Resumen de Envío */}
                  {shippingAddress && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Dirección de Envío</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {shippingAddress.fullName}
                        <br />
                        {shippingAddress.address}
                        <br />
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                        <br />
                        {shippingAddress.country}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep("shipping")}
                        className="mt-2 text-blue-600 hover:text-blue-700"
                      >
                        Editar
                      </Button>
                    </div>
                  )}

                  {/* Resumen de Pago */}
                  {paymentMethod && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Método de Pago</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {paymentMethod.type === "stripe" && "Tarjeta de Crédito/Débito"}
                        {paymentMethod.type === "paypal" && "PayPal"}
                        {paymentMethod.type === "wallet" && "Cartera Digital"}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep("payment")}
                        className="mt-2 text-green-600 hover:text-green-700"
                      >
                        Cambiar
                      </Button>
                    </div>
                  )}

                  {/* Botón de Confirmar Pedido */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-bold py-4 text-lg relative overflow-hidden"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                          Procesando Pedido...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5" />
                          Confirmar Pedido - ${total.toFixed(2)}
                          <Sparkles className="h-5 w-5" />
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Resumen del Pedido */}
      <div className="lg:col-span-1">
        <OrderSummary />
      </div>
    </div>
  )
}
