"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEnhancedCart } from "@/contexts/enhanced-cart-context"
import type { CartItem } from "@/contexts/enhanced-cart-context"

interface AddToCartButtonProps {
  product: Omit<CartItem, "quantity">
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AddToCartButton({ product, variant = "default", size = "md", className = "" }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useEnhancedCart()

  const handleAddToCart = () => {
    addItem(product)
    setIsAdded(true)

    // Reset después de 2 segundos
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={handleAddToCart}
        variant={variant}
        size={size}
        disabled={isAdded}
        className={`
          relative overflow-hidden transition-all duration-300
          ${
            isAdded
              ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          }
          ${className}
        `}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{
            scale: isAdded ? [1, 1.1, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4" />
              ¡Agregado!
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Agregar al Carrito
            </>
          )}
        </motion.div>

        {/* Efecto de confetti cuando se agrega */}
        {isAdded && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  x: "50%",
                  y: "50%",
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                  scale: [0, 1, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                }}
              >
                <Sparkles className="h-3 w-3 text-yellow-400" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Button>
    </motion.div>
  )
}
