"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

interface ShippingAddress {
  fullName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "wallet"
  name: string
  details: string
  isDefault: boolean
}

export function CartSystem() {
  const { items, updateQuantity, removeItem, totalItems, clearCart } = useCart()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<"cart" | "checkout" | "payment" | "confirmation">("cart")
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "España",
    phone: "",
  })
  const [selectedPayment, setSelectedPayment] = useState<string>("")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card1",
      type: "card",
      name: "Tarjeta de Crédito",
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
      name: "Wallet Digital",
      details: "Saldo: $150.00",
      isDefault: false,
    },
  ]

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = items.some((item) => item.type === "printed") ? 5.99 : 0
  const tax = subtotal * 0.21 // IVA 21%
  const discount = appliedCoupon ? subtotal * (appliedCoupon.discount / 100) : 0
  const total = subtotal + shippingCost + tax - discount

  const applyCoupon = useCallback(() => {
    const validCoupons = {
      DESCUENTO10: 10,
      PRIMERA20: 20,
      VERANO15: 15,
    }

    if (validCoupons[couponCode as keyof typeof validCoupons]) {
      setAppliedCoupon({
        code: couponCode,
        discount: validCoupons[couponCode as keyof typeof validCoupons],
      })
      toast({
        title: "Cupón aplicado",
        description: `Descuento del ${validCoupons[couponCode as keyof typeof validCoupons]}% aplicado`,
      })
    } else {
      toast({
        title: "Cupón inválido",
        description: "El código de cupón no es válido",
        variant: "destructive",
      })
    }
  }, [couponCode, toast])

  const processOrder = useCallback(() => {
    clearCart()
    setCurrentStep("confirmation")
    toast({
      title: "¡Pedido confirmado!",
      description: "Tu pedido ha sido procesado exitosamente",
    })
  }, [clearCart, toast])

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

                      {item.printOptions && (
                        <div className="mt-2 text-xs text-gray-400">
                          <p>
                            Material: {item.printOptions.material} | Color: {item.printOptions.color}
                          </p>
                          <p>
                            Calidad: {item.printOptions.quality} | Relleno: {item.printOptions.infill}%
                          </p>
                        </div>
                      )}

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
          {/* Cupón de descuento */}
          <div className="flex gap-2">
            <Input
              placeholder="Código de cupón"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
            <Button variant="outline" onClick={applyCoupon} className="border-white/20 text-white hover:bg-white/10">
              Aplicar
            </Button>
          </div>

          {appliedCoupon && (
            <div className="flex items-center justify-between text-green-400 text-sm">
              <span>Cupón {appliedCoupon.code} aplicado</span>
              <span>-{appliedCoupon.discount}%</span>
            </div>
          )}

          {/* Resumen de precios */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {shippingCost > 0 && (
              <div className="flex justify-between text-gray-300">
                <span>Envío:</span>
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
            Proceder al Checkout
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )

  const renderCheckoutStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Información de Envío</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentStep("cart")}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName" className="text-white">
            Nombre completo
          </Label>
          <Input
            id="fullName"
            value={shippingAddress.fullName}
            onChange={(e) => setShippingAddress((prev) => ({ ...prev, fullName: e.target.value }))}
            className="bg-white/5 border-white/20 text-white"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-white">
            Teléfono
          </Label>
          <Input
            id="phone"
            value={shippingAddress.phone}
            onChange={(e) => setShippingAddress((prev) => ({ ...prev, phone: e.target.value }))}
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
          value={shippingAddress.address}
          onChange={(e) => setShippingAddress((prev) => ({ ...prev, address: e.target.value }))}
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
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress((prev) => ({ ...prev, city: e.target.value }))}
            className="bg-white/5 border-white/20 text-white"
          />
        </div>
        <div>
          <Label htmlFor="state" className="text-white">
            Provincia
          </Label>
          <Input
            id="state"
            value={shippingAddress.state}
            onChange={(e) => setShippingAddress((prev) => ({ ...prev, state: e.target.value }))}
            className="bg-white/5 border-white/20 text-white"
          />
        </div>
        <div>
          <Label htmlFor="zipCode" className="text-white">
            Código Postal
          </Label>
          <Input
            id="zipCode"
            value={shippingAddress.zipCode}
            onChange={(e) => setShippingAddress((prev) => ({ ...prev, zipCode: e.target.value }))}
            className="bg-white/5 border-white/20 text-white"
          />
        </div>
      </div>

      <Button
        onClick={() => setCurrentStep("payment")}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        disabled={!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city}
      >
        Continuar al Pago
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Método de Pago</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentStep("checkout")}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center space-x-2">
            <RadioGroupItem value={method.id} id={method.id} />
            <Label htmlFor={method.id} className="flex-1 cursor-pointer">
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{method.name}</p>
                      <p className="text-gray-400 text-sm">{method.details}</p>
                    </div>
                    {method.isDefault && <Badge className="ml-auto bg-green-500/20 text-green-400">Por defecto</Badge>}
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {/* Resumen del pedido */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {shippingCost > 0 && (
            <div className="flex justify-between text-gray-300">
              <span>Envío:</span>
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
        </CardContent>
      </Card>

      <Button
        onClick={processOrder}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        disabled={!selectedPayment}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        Confirmar Pedido
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
        <CardContent className="p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Número de pedido:</span>
              <span className="text-white font-mono">ORD-{Date.now()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total pagado:</span>
              <span className="text-white font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Entrega estimada:</span>
              <span className="text-white">7-10 días hábiles</span>
            </div>
          </div>
        </CardContent>
      </Card>
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
        <DialogContent className="sm:max-w-2xl bg-gray-900/95 backdrop-blur-sm border-white/10">
          <DialogHeader className="sr-only">
            <DialogTitle>Carrito de Compras</DialogTitle>
            <DialogDescription>Gestiona tu carrito y procede al checkout</DialogDescription>
          </DialogHeader>

          {currentStep === "cart" && renderCartStep()}
          {currentStep === "checkout" && renderCheckoutStep()}
          {currentStep === "payment" && renderPaymentStep()}
          {currentStep === "confirmation" && renderConfirmationStep()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
