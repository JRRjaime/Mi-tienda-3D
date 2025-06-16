"use client"

import { motion } from "framer-motion"
import { useEnhancedCart } from "@/contexts/enhanced-cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Tag, Truck, Calculator, Gift } from "lucide-react"
import { useState } from "react"

export function OrderSummary() {
  const { items, subtotal, tax, shippingCost, total, discount, appliedCoupon, applyCoupon, removeCoupon } =
    useEnhancedCart()

  const [couponCode, setCouponCode] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const handleApplyCoupon = async () => {
    if (couponCode.trim()) {
      setIsApplyingCoupon(true)
      await applyCoupon(couponCode)
      setIsApplyingCoupon(false)
      setCouponCode("")
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-4"
    >
      <Card className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/20 border-orange-200 dark:border-orange-700">
        <CardHeader>
          <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Resumen del Pedido ({items.length} {items.length === 1 ? "producto" : "productos"})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Items del Carrito */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-orange-100 dark:border-orange-800"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {item.creatorName} • Cantidad: {item.quantity}
                  </p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {item.type === "printed" ? "🖨️ Impreso" : "📥 Descarga"}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">${item.price.toFixed(2)} c/u</p>
                </div>
              </motion.div>
            ))}
          </div>

          <Separator />

          {/* Cupón de Descuento */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-orange-700 dark:text-orange-300">
              <Gift className="h-4 w-4" />
              Cupón de Descuento
            </div>

            {!appliedCoupon ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Ingresa tu código"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
                />
                <Button
                  onClick={handleApplyCoupon}
                  variant="outline"
                  size="sm"
                  disabled={!couponCode.trim() || isApplyingCoupon}
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  {isApplyingCoupon ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Tag className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Tag className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    🎉 {appliedCoupon.code}
                  </span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    -{appliedCoupon.type === "percentage" ? `${appliedCoupon.discount}%` : `$${appliedCoupon.discount}`}
                  </Badge>
                </div>
                <Button
                  onClick={handleRemoveCoupon}
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:text-green-700 h-6 w-6 p-0"
                >
                  ✕
                </Button>
              </motion.div>
            )}
          </div>

          <Separator />

          {/* Cálculos */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-orange-700 dark:text-orange-300">
              <Calculator className="h-4 w-4" />
              Desglose de Costos
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <motion.div
                  className="flex justify-between text-green-600"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <span>🎉 Descuento</span>
                  <span className="font-medium">-${discount.toFixed(2)}</span>
                </motion.div>
              )}

              {shippingCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    Envío
                  </span>
                  <span className="font-medium">${shippingCost.toFixed(2)}</span>
                </div>
              )}

              {tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Impuestos</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-orange-800 dark:text-orange-200">Total</span>
              <motion.span
                className="text-orange-600 dark:text-orange-400 text-xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
              >
                ${total.toFixed(2)}
              </motion.span>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <Truck className="h-4 w-4" />
              <span className="font-medium">Envío estimado: 3-5 días hábiles</span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Recibirás un email con el tracking una vez que se procese tu pedido
            </p>
          </div>

          {/* Cupones disponibles */}
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
            <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-2">💡 Cupones disponibles:</p>
            <div className="flex flex-wrap gap-1">
              {["DESCUENTO10", "PRIMERA20", "VERANO15"].map((code) => (
                <Badge
                  key={code}
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-800"
                  onClick={() => setCouponCode(code)}
                >
                  {code}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
