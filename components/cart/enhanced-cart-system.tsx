"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Download,
  Printer,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Truck,
  Mail,
  MapPin,
  Clock,
  Tag,
  Calculator,
  Loader2,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart, type ShippingAddress } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useIntegration } from "@/contexts/integration-context"
import { useToast } from "@/hooks/use-toast"

interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "wallet"
  name: string
  details: string
  isDefault: boolean
}

export function EnhancedCartSystem() {
  const {
    items,
    updateQuantity,
    removeItem,
    totalItems,
    clearCart,
    shippingAddress,
    setShippingAddress,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    calculateShipping,
    subtotal,
    shippingCost,
    tax,
    discount,
    total,
  } = useCart()

  const { user } = useAuth()
  const { triggerPurchaseComplete } = useIntegration()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<"cart" | "checkout" | "confirmation">("cart")
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<string>("")
  const [orderNotes, setOrderNotes] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  const [localShippingAddress, setLocalShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "España",
    phone: "",
  })

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card1",
      type: "card",
      name: "Tarjeta de Crédito/Débito",
      details: "**** **** **** 1234",
      isDefault: true,
    },
    {
      id: "paypal1",
      type: "paypal",
      name: "PayPal",
      details: "usuario@email.com",
      isDefault: false,
    },
    {
      id: "wallet1",
      type: "wallet",
      name: "Cartera Digital",
      details: "Saldo disponible: $150.00",
      isDefault: false,
    },
  ]

  // Cargar dirección guardada al abrir
  useEffect(() => {
    if (shippingAddress) {
      setLocalShippingAddress(shippingAddress)
    }
  }, [shippingAddress])

  // Calcular envío automáticamente cuando cambie la dirección
  useEffect(() => {
    if (
      localShippingAddress.country &&
      localShippingAddress.city &&
      localShippingAddress.zipCode &&
      items.some((item) => item.type === "printed")
    ) {
      handleCalculateShipping()
    }
  }, [localShippingAddress.country, localShippingAddress.city, localShippingAddress.zipCode])

  const handleCalculateShipping = useCallback(async () => {
    if (!localShippingAddress.country || !localShippingAddress.city) return

    setIsCalculatingShipping(true)
    try {
      await calculateShipping(localShippingAddress)
    } catch (error) {
      toast({
        title: "Error al calcular envío",
        description: "No se pudo calcular el costo de envío. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsCalculatingShipping(false)
    }
  }, [localShippingAddress, calculateShipping, toast])

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) return

    setIsApplyingCoupon(true)
    try {
      const success = await applyCoupon(couponCode.trim())
      if (success) {
        toast({
          title: "¡Cupón aplicado!",
          description: `Descuento aplicado correctamente`,
        })
        setCouponCode("")
      } else {
        toast({
          title: "Cupón inválido",
          description: "El código de cupón no es válido o no cumple los requisitos mínimos",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo aplicar el cupón. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsApplyingCoupon(false)
    }
  }, [couponCode, applyCoupon, toast])

  const handleRemoveCoupon = useCallback(() => {
    removeCoupon()
    toast({
      title: "Cupón removido",
      description: "El descuento ha sido eliminado",
    })
  }, [removeCoupon, toast])

  const sendOrderConfirmation = useCallback(
    async (orderNum: string) => {
      // Simular envío de email
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const emailData = {
        to: user?.email || "usuario@email.com",
        subject: `Confirmación de pedido #${orderNum}`,
        orderNumber: orderNum,
        items: items,
        total: total,
        shippingAddress: localShippingAddress,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("es-ES"),
      }

      console.log("Enviando confirmación por email:", emailData)

      toast({
        title: "Email enviado",
        description: "Te hemos enviado la confirmación del pedido por email",
      })
    },
    [items, total, localShippingAddress, toast, user],
  )

  const processOrder = useCallback(async () => {
    if (!acceptTerms) {
      toast({
        title: "Términos requeridos",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive",
      })
      return
    }

    if (!selectedPayment) {
      toast({
        title: "Método de pago requerido",
        description: "Selecciona un método de pago",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Usuario requerido",
        description: "Debes iniciar sesión para completar la compra",
        variant: "destructive",
      })
      return
    }

    setIsProcessingOrder(true)

    try {
      // Simular procesamiento del pedido
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const newOrderNumber = `ORD-${Date.now()}`
      setOrderNumber(newOrderNumber)

      // Guardar dirección de envío
      setShippingAddress(localShippingAddress)

      // 🎉 INTEGRACIÓN AUTOMÁTICA - Disparar todos los eventos
      const purchaseData = {
        orderId: newOrderNumber,
        buyerId: user.id,
        buyerName: user.name,
        sellerId: items[0]?.creatorId || "seller1", // En un caso real, cada item tendría su vendedor
        sellerName: items[0]?.creatorName || "Vendedor",
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || "/placeholder.svg",
        })),
        total: total,
        shippingAddress: localShippingAddress,
      }

      // 🚀 Disparar integración completa
      triggerPurchaseComplete(purchaseData)

      // Enviar confirmación por email
      await sendOrderConfirmation(newOrderNumber)

      // Limpiar carrito
      clearCart()

      setCurrentStep("confirmation")

      toast({
        title: "¡Pedido confirmado!",
        description:
          "Tu pedido ha sido procesado exitosamente. Se han creado las notificaciones y chat automáticamente.",
        duration: 5000,
      })
    } catch (error) {
      toast({
        title: "Error en el pedido",
        description: "Hubo un problema al procesar tu pedido. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingOrder(false)
    }
  }, [
    acceptTerms,
    selectedPayment,
    user,
    localShippingAddress,
    setShippingAddress,
    items,
    total,
    triggerPurchaseComplete,
    sendOrderConfirmation,
    clearCart,
    toast,
  ])

  const renderCartStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Tu Carrito ({totalItems} artículos)</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-white truncate">{item.name}</h4>
                          <p className="text-sm text-gray-400">por {item.creatorName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={
                                item.type === "download"
                                  ? "text-blue-400 border-blue-400/30"
                                  : "text-green-400 border-green-400/30"
                              }
                            >
                              {item.type === "download" ? (
                                <>
                                  <Download className="h-3 w-3 mr-1" />
                                  Descarga
                                </>
                              ) : (
                                <>
                                  <Printer className="h-3 w-3 mr-1" />
                                  Impreso
                                </>
                              )}
                            </Badge>
                            <span className="text-sm font-semibold text-cyan-400">${item.price}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0 border-white/20 text-white hover:bg-white/10"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0 border-white/20 text-white hover:bg-white/10"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {items.length > 0 && (
        <div className="space-y-4 border-t border-white/10 pt-4">
          {/* Sistema de cupones mejorado */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Código de cupón"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="bg-white/5 border-white/20 text-white"
                disabled={isApplyingCoupon}
              />
              <Button
                variant="outline"
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon || !couponCode.trim()}
                className="border-white/20 text-white hover:bg-white/10"
              >
                {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tag className="h-4 w-4" />}
              </Button>
            </div>

            {appliedCoupon && (
              <div className="flex items-center justify-between bg-green-500/10 border border-green-400/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">
                    Cupón {appliedCoupon.code} aplicado
                    {appliedCoupon.type === "percentage"
                      ? ` (-${appliedCoupon.discount}%)`
                      : ` (-$${appliedCoupon.discount})`}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveCoupon}
                  className="text-green-400 hover:bg-green-400/10"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Cupones sugeridos */}
            <div className="flex flex-wrap gap-2">
              {["DESCUENTO10", "PRIMERA20", "ENVIOGRATIS"].map((code) => (
                <Button
                  key={code}
                  variant="outline"
                  size="sm"
                  onClick={() => setCouponCode(code)}
                  className="text-xs border-white/20 text-gray-300 hover:bg-white/10"
                  disabled={appliedCoupon?.code === code}
                >
                  {code}
                </Button>
              ))}
            </div>
          </div>

          {/* Resumen de precios */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {shippingCost > 0 && (
              <div className="flex justify-between text-gray-300">
                <span className="flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  Envío:
                </span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-300">
              <span>IVA (21%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Descuento:</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <Separator className="bg-white/20" />
            <div className="flex justify-between text-white font-semibold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={() => setCurrentStep("checkout")}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            Checkout en Un Paso
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )

  const renderCheckoutStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Checkout Rápido</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentStep("cart")}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información de envío */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Información de Envío
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="text-white">
                  Nombre completo
                </Label>
                <Input
                  id="fullName"
                  value={localShippingAddress.fullName}
                  onChange={(e) => setLocalShippingAddress((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  value={localShippingAddress.phone}
                  onChange={(e) => setLocalShippingAddress((prev) => ({ ...prev, phone: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-white">
                Dirección
              </Label>
              <Input
                id="address"
                value={localShippingAddress.address}
                onChange={(e) => setLocalShippingAddress((prev) => ({ ...prev, address: e.target.value }))}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="text-white">
                  Ciudad
                </Label>
                <Input
                  id="city"
                  value={localShippingAddress.city}
                  onChange={(e) => setLocalShippingAddress((prev) => ({ ...prev, city: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-white">
                  Provincia
                </Label>
                <Input
                  id="state"
                  value={localShippingAddress.state}
                  onChange={(e) => setLocalShippingAddress((prev) => ({ ...prev, state: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-white">
                  Código Postal
                </Label>
                <Input
                  id="zipCode"
                  value={localShippingAddress.zipCode}
                  onChange={(e) => setLocalShippingAddress((prev) => ({ ...prev, zipCode: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="country" className="text-white">
                País
              </Label>
              <select
                id="country"
                value={localShippingAddress.country}
                onChange={(e) => setLocalShippingAddress((prev) => ({ ...prev, country: e.target.value }))}
                className="w-full p-2 bg-white/5 border border-white/20 text-white rounded-md"
              >
                <option value="España">España</option>
                <option value="Francia">Francia</option>
                <option value="Alemania">Alemania</option>
                <option value="Italia">Italia</option>
                <option value="Portugal">Portugal</option>
                <option value="Reino Unido">Reino Unido</option>
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="México">México</option>
                <option value="Argentina">Argentina</option>
                <option value="Brasil">Brasil</option>
                <option value="Chile">Chile</option>
                <option value="Colombia">Colombia</option>
              </select>
            </div>

            {/* Calculadora de envío en tiempo real */}
            {items.some((item) => item.type === "printed") && (
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-medium text-sm">Cálculo de Envío</span>
                </div>
                {isCalculatingShipping ? (
                  <div className="flex items-center gap-2 text-blue-300 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Calculando costo de envío...
                  </div>
                ) : shippingCost > 0 ? (
                  <div className="text-blue-300 text-sm">
                    <p>Costo de envío: ${shippingCost.toFixed(2)}</p>
                    <p className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      Entrega estimada: 7-10 días hábiles
                    </p>
                  </div>
                ) : (
                  <p className="text-blue-300 text-sm">Completa la dirección para calcular el envío</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Método de pago y resumen */}
        <div className="space-y-6">
          {/* Método de pago */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Método de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                      <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                              <CreditCard className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">{method.name}</p>
                              <p className="text-gray-400 text-xs">{method.details}</p>
                            </div>
                            {method.isDefault && (
                              <Badge className="ml-auto bg-green-500/20 text-green-400 text-xs">Por defecto</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Notas del pedido */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-sm">Notas del Pedido (Opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Instrucciones especiales para tu pedido..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="bg-white/5 border-white/20 text-white resize-none"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Resumen del pedido */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-gray-300 text-sm">
                <span>Subtotal ({totalItems} artículos):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {shippingCost > 0 && (
                <div className="flex justify-between text-gray-300 text-sm">
                  <span>Envío:</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-300 text-sm">
                <span>IVA (21%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400 text-sm">
                  <span>Descuento:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <Separator className="bg-white/20" />
              <div className="flex justify-between text-white font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Términos y condiciones */}
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(checked as boolean)} />
        <Label htmlFor="terms" className="text-white text-sm">
          Acepto los{" "}
          <a href="#" className="text-cyan-400 hover:underline">
            términos y condiciones
          </a>{" "}
          y la{" "}
          <a href="#" className="text-cyan-400 hover:underline">
            política de privacidad
          </a>
        </Label>
      </div>

      {/* Botón de confirmar pedido */}
      <Button
        onClick={processOrder}
        disabled={
          isProcessingOrder ||
          !acceptTerms ||
          !selectedPayment ||
          !localShippingAddress.fullName ||
          !localShippingAddress.address ||
          !localShippingAddress.city
        }
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 h-12"
      >
        {isProcessingOrder ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Procesando pedido...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Confirmar Pedido - ${total.toFixed(2)}
          </div>
        )}
      </Button>
    </div>
  )

  const renderConfirmationStep = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-8 w-8 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">¡Pedido Confirmado!</h3>
        <p className="text-gray-300">Tu pedido ha sido procesado exitosamente</p>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Número de pedido:</span>
              <span className="text-white font-mono">{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total pagado:</span>
              <span className="text-white font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Entrega estimada:</span>
              <span className="text-white">7-10 días hábiles</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300 flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Confirmación enviada:
              </span>
              <span className="text-white">{user?.email || "usuario@email.com"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="text-left">
            <h4 className="text-blue-400 font-semibold text-sm">🎉 Integración Automática Activada</h4>
            <p className="text-blue-300 text-xs mt-1">
              ✅ Notificación de compra creada
              <br />✅ Chat con vendedor iniciado
              <br />✅ Pedido registrado en el sistema
              <br />✅ Email de confirmación enviado
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setCurrentStep("cart")
            setIsOpen(false)
          }}
          className="flex-1 border-white/20 text-white hover:bg-white/10"
        >
          Continuar Comprando
        </Button>
        <Button
          onClick={() => {
            setCurrentStep("cart")
            setIsOpen(false)
          }}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500"
        >
          Ver Mis Pedidos
        </Button>
      </div>
    </div>
  )

  return (
    <div className="relative">
      {/* Botón del carrito */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="relative text-white hover:bg-white/10"
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-cyan-500 text-xs flex items-center justify-center p-0">
            {totalItems > 99 ? "99+" : totalItems}
          </Badge>
        )}
      </Button>

      {/* Modal del carrito */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-sm border-white/10">
          <DialogHeader className="sr-only">
            <DialogTitle>Carrito de Compras</DialogTitle>
            <DialogDescription>Gestiona tu carrito y procede al checkout</DialogDescription>
          </DialogHeader>

          {currentStep === "cart" && renderCartStep()}
          {currentStep === "checkout" && renderCheckoutStep()}
          {currentStep === "confirmation" && renderConfirmationStep()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
