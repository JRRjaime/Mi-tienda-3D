"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Plus, Minus, X, CreditCard, Trash2, Package, Sparkles, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEnhancedCart } from "@/contexts/enhanced-cart-context"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function ColorfulFloatingCart() {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()
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
        title: "🛒 Carrito vacío",
        description: "Agrega productos antes de proceder al checkout",
        variant: "destructive",
      })
      return
    }

    // Cerrar el carrito y redirigir al checkout
    setIsExpanded(false)

    toast({
      title: "🚀 ¡Redirigiendo al checkout!",
      description: "Preparando tu pedido increíble",
    })

    // Redirigir a la página de checkout
    router.push("/checkout")
  }

  return (
    <>
      {/* Overlay con gradiente colorido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Carrito Flotante Súper Colorido */}
      <div className="fixed top-6 right-6 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="relative"
        >
          {/* Botón Principal Súper Colorido */}
          <motion.div
            whileHover={{
              y: -4,
              rotate: [0, -5, 5, 0],
              scale: 1.05,
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={toggleExpanded}
              size="lg"
              className={`
                h-16 w-16 rounded-3xl shadow-2xl transition-all duration-500
                bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500
                hover:from-purple-600 hover:via-pink-600 hover:to-orange-600
                text-white border-4 border-white/20
                ${isExpanded ? "shadow-purple-500/50" : "hover:shadow-purple-500/30"}
                relative overflow-hidden
              `}
            >
              {/* Efecto de brillo animado */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 3,
                }}
              />

              <motion.div
                animate={{
                  rotate: isExpanded ? 180 : 0,
                  scale: isExpanded ? 1.1 : 1,
                }}
                transition={{ duration: 0.4, type: "spring" }}
                className="relative z-10"
              >
                {isExpanded ? <X className="h-6 w-6" /> : <ShoppingBag className="h-6 w-6" />}
              </motion.div>
            </Button>

            {/* Badge de Items Súper Colorido */}
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{
                    scale: 1,
                    rotate: 0,
                    y: [0, -2, 0],
                  }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 25,
                    y: {
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                  }}
                  className="absolute -top-2 -right-2"
                >
                  <Badge className="h-8 w-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-sm font-bold flex items-center justify-center border-3 border-white shadow-lg">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </motion.span>
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Partículas flotantes */}
            {totalItems > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                    animate={{
                      y: [0, -20, 0],
                      x: [0, Math.random() * 10 - 5, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.5,
                    }}
                    style={{
                      left: `${20 + i * 20}%`,
                      top: "10%",
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Panel del Carrito Súper Colorido */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20, rotateX: -15 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20, rotateX: -15 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                className="absolute top-20 right-0 w-96 max-h-[75vh] bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 rounded-3xl shadow-2xl border-2 border-purple-200/50 dark:border-purple-700/50 overflow-hidden backdrop-blur-xl"
              >
                {/* Header Colorido */}
                <div className="p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <motion.h3
                        className="font-bold text-xl flex items-center gap-2"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Sparkles className="h-5 w-5" />
                        Mi Carrito
                      </motion.h3>
                      <p className="text-white/80 text-sm">
                        {totalItems} {totalItems === 1 ? "producto increíble" : "productos increíbles"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-sm">Total</p>
                      <motion.p
                        className="font-bold text-2xl"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        ${total.toFixed(2)}
                      </motion.p>
                    </div>
                  </div>
                </div>

                {/* Lista de Productos Colorida */}
                <div className="max-h-72 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="p-12 text-center">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Package className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-purple-600 font-bold text-lg">¡Tu carrito está esperando!</p>
                      <p className="text-purple-400 mt-2">Agrega productos increíbles para comenzar</p>
                    </div>
                  ) : (
                    <div className="p-6 space-y-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 50, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 200,
                          }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="flex items-center gap-4 p-4 bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/30 rounded-2xl hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/40 dark:hover:to-pink-900/40 transition-all duration-300 shadow-lg border border-purple-100 dark:border-purple-700/30"
                        >
                          <div className="relative">
                            <motion.div whileHover={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.5 }}>
                              <Image
                                src={item.image || "/placeholder.svg?height=50&width=50"}
                                alt={item.name}
                                width={50}
                                height={50}
                                className="rounded-xl object-cover shadow-md"
                              />
                            </motion.div>
                            <motion.div
                              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            >
                              <span className="text-xs text-white font-bold">{item.quantity}</span>
                            </motion.div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-purple-800 dark:text-purple-200 truncate">{item.name}</h4>
                            <p className="text-sm text-purple-600 dark:text-purple-300 truncate flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {item.creatorName}
                            </p>
                            <motion.p
                              className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-1"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              ${(item.price * item.quantity).toFixed(2)}
                            </motion.p>
                          </div>

                          <div className="flex items-center gap-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0 rounded-full bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white border-2 border-white shadow-lg"
                              >
                                {item.quantity === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white border-2 border-white shadow-lg"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resumen y Checkout Colorido */}
                {items.length > 0 && (
                  <>
                    <div className="h-px bg-gradient-to-r from-purple-200 via-pink-200 to-orange-200" />
                    <div className="p-6 space-y-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-purple-700 dark:text-purple-300">
                          <span>Subtotal:</span>
                          <span className="font-semibold">${subtotal.toFixed(2)}</span>
                        </div>
                        {shippingCost > 0 && (
                          <div className="flex justify-between text-blue-600 dark:text-blue-400">
                            <span>Envío:</span>
                            <span className="font-semibold">${shippingCost.toFixed(2)}</span>
                          </div>
                        )}
                        {tax > 0 && (
                          <div className="flex justify-between text-orange-600 dark:text-orange-400">
                            <span>Impuestos:</span>
                            <span className="font-semibold">${tax.toFixed(2)}</span>
                          </div>
                        )}
                        {discount > 0 && (
                          <motion.div
                            className="flex justify-between text-green-600 dark:text-green-400"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <span>🎉 Descuento:</span>
                            <span className="font-bold">-${discount.toFixed(2)}</span>
                          </motion.div>
                        )}
                        <div className="h-px bg-gradient-to-r from-purple-200 to-pink-200" />
                        <motion.div
                          className="flex justify-between font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <span>Total:</span>
                          <span>${total.toFixed(2)}</span>
                        </motion.div>
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handleCheckout}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl border-2 border-white/20 text-lg relative overflow-hidden"
                        >
                          {/* Efecto de brillo en el botón */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{
                              x: ["-100%", "100%"],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatDelay: 2,
                            }}
                          />

                          <div className="relative z-10 flex items-center justify-center gap-3">
                            {isLoading ? (
                              <motion.div
                                className="h-5 w-5 border-3 border-white border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              />
                            ) : (
                              <>
                                <CreditCard className="h-5 w-5" />
                                <span>¡Proceder al Pago!</span>
                                <Sparkles className="h-5 w-5" />
                              </>
                            )}
                          </div>
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
    </>
  )
}
