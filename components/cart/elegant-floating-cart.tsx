"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Plus, Minus, X, CreditCard, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useEnhancedCart } from "@/contexts/enhanced-cart-context"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

export function ElegantFloatingCart() {
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    items,
    totalItems,
    subtotal,
    shippingCost,
    tax,
    discount,
    total,
    updateQuantity,
    removeItem,
    appliedCoupon,
    isLoading,
  } = useEnhancedCart()

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos antes de proceder al checkout",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Redirigiendo al checkout...",
      description: "Preparando tu pedido",
    })

    // Aquí iría la redirección al checkout
    console.log("Proceeding to checkout with:", { items, total })
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Carrito Flotante */}
      <div className="fixed top-6 right-6 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="relative"
        >
          {/* Botón Principal */}
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
            <Button
              onClick={toggleExpanded}
              size="lg"
              className={`
                h-14 w-14 rounded-2xl shadow-lg transition-all duration-300
                bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                hover:bg-gray-50 dark:hover:bg-gray-800
                border border-gray-200 dark:border-gray-700
                ${isExpanded ? "shadow-xl" : "hover:shadow-xl"}
              `}
            >
              <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                {isExpanded ? <X className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
              </motion.div>
            </Button>

            {/* Badge de Items */}
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge className="h-6 w-6 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium flex items-center justify-center border-2 border-white dark:border-gray-900">
                    {totalItems > 99 ? "99+" : totalItems}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Panel del Carrito */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-16 right-0 w-80 max-h-[70vh] bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Carrito</h3>
                      <p className="text-sm text-gray-500">
                        {totalItems} {totalItems === 1 ? "producto" : "productos"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-semibold text-lg">${total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Lista de Productos */}
                <div className="max-h-64 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="p-8 text-center">
                      <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">Tu carrito está vacío</p>
                      <p className="text-sm text-gray-400 mt-1">Agrega productos para comenzar</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors duration-200"
                        >
                          <div className="relative">
                            <Image
                              src={item.image || "/placeholder.svg?height=40&width=40"}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="rounded-lg object-cover"
                            />
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-medium">{item.quantity}</span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{item.creatorName}</p>
                            <p className="text-sm font-semibold text-blue-600 mt-1">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-7 w-7 p-0 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              {item.quantity === 1 ? (
                                <Trash2 className="h-3 w-3 text-red-500" />
                              ) : (
                                <Minus className="h-3 w-3 text-gray-600" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-7 w-7 p-0 hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                              <Plus className="h-3 w-3 text-green-600" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resumen y Checkout */}
                {items.length > 0 && (
                  <>
                    <Separator />
                    <div className="p-4 space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {shippingCost > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Envío:</span>
                            <span>${shippingCost.toFixed(2)}</span>
                          </div>
                        )}
                        {tax > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Impuestos:</span>
                            <span>${tax.toFixed(2)}</span>
                          </div>
                        )}
                        {discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Descuento:</span>
                            <span>-${discount.toFixed(2)}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-semibold text-base">
                          <span>Total:</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>

                      <Button
                        onClick={handleCheckout}
                        disabled={isLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-xl transition-colors duration-200"
                      >
                        {isLoading ? (
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Proceder al Pago
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}
