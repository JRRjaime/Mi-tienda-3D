"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Plus, Minus, X, CreditCard, Trash2, Package, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useEnhancedCart } from "@/contexts/enhanced-cart-context"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

export function FloatingCart() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
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
      title: "🚀 Redirigiendo al checkout...",
      description: "Preparando tu pedido",
    })

    // Aquí iría la redirección al checkout
    console.log("Proceeding to checkout with:", { items, total })
  }

  return (
    <>
      {/* Overlay cuando está expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Carrito Flotante */}
      <div className="fixed top-4 right-4 z-50">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="relative"
        >
          {/* Botón Principal del Carrito */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
            <Button
              onClick={toggleExpanded}
              size="lg"
              className={`
                h-16 w-16 rounded-full shadow-2xl transition-all duration-300
                bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
                hover:from-purple-600 hover:via-pink-600 hover:to-red-600
                border-2 border-white/20 backdrop-blur-sm
                ${isExpanded ? "ring-4 ring-purple-300/50" : ""}
                ${isHovered ? "shadow-purple-500/50" : ""}
              `}
            >
              <motion.div
                animate={{
                  rotate: isExpanded ? 180 : 0,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {isExpanded ? <X className="h-6 w-6 text-white" /> : <ShoppingCart className="h-6 w-6 text-white" />}
              </motion.div>
            </Button>

            {/* Badge de Items */}
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-2 -right-2"
                >
                  <Badge className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold text-sm flex items-center justify-center border-2 border-white shadow-lg">
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </motion.span>
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Efecto de Brillo */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              animate={{
                x: isHovered ? ["-100%", "100%"] : "-100%",
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
                repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                repeatDelay: 1,
              }}
            />
          </motion.div>

          {/* Panel Expandido del Carrito */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-20 right-0 w-96 max-h-[80vh] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
              >
                {/* Header del Carrito */}
                <div className="p-6 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Mi Carrito</h3>
                        <p className="text-sm text-gray-500">
                          {totalItems} {totalItems === 1 ? "producto" : "productos"}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                    >
                      <Sparkles className="h-6 w-6 text-purple-500" />
                    </motion.div>
                  </div>
                </div>

                {/* Lista de Productos */}
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {items.length === 0 ? (
                    <div className="p-8 text-center">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-gray-500 font-medium">Tu carrito está vacío</p>
                      <p className="text-sm text-gray-400 mt-1">¡Agrega productos increíbles!</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-white/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200"
                        >
                          <div className="relative">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="rounded-lg object-cover"
                            />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-bold">{item.quantity}</span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{item.creatorName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold text-purple-600">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              {item.type === "printed" && (
                                <Badge variant="outline" className="text-xs">
                                  Impreso
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
                            >
                              <Plus className="h-3 w-3 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                            >
                              {item.quantity === 1 ? (
                                <Trash2 className="h-3 w-3 text-red-600" />
                              ) : (
                                <Minus className="h-3 w-3 text-red-600" />
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resumen de Precios */}
                {items.length > 0 && (
                  <>
                    <Separator />
                    <div className="p-4 space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {shippingCost > 0 && (
                          <div className="flex justify-between">
                            <span>Envío:</span>
                            <span>${shippingCost.toFixed(2)}</span>
                          </div>
                        )}
                        {tax > 0 && (
                          <div className="flex justify-between">
                            <span>Impuestos:</span>
                            <span>${tax.toFixed(2)}</span>
                          </div>
                        )}
                        {discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Descuento {appliedCoupon?.code}:</span>
                            <span>-${discount.toFixed(2)}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span className="text-purple-600">${total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Botón de Checkout */}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handleCheckout}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg"
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <>
                              <CreditCard className="h-5 w-5 mr-2" />
                              Proceder al Pago
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Estilos para scrollbar personalizada */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #ec4899);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #db2777);
        }
      `}</style>
    </>
  )
}
