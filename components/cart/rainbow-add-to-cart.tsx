"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, Check, Sparkles, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEnhancedCart } from "@/contexts/enhanced-cart-context"
import type { CartItem } from "@/contexts/enhanced-cart-context"

interface RainbowAddToCartProps {
  product: Omit<CartItem, "quantity">
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  className?: string
}

export function RainbowAddToCart({
  product,
  variant = "default",
  size = "default",
  className = "",
}: RainbowAddToCartProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { addItem } = useEnhancedCart()

  const handleAddToCart = () => {
    console.log("🛒 Adding product to cart:", product)
    addItem(product)
    setIsAdded(true)

    // Crear efecto de partículas
    createParticleEffect()

    setTimeout(() => {
      setIsAdded(false)
    }, 3000)
  }

  const createParticleEffect = () => {
    // Aquí podrías agregar un efecto de partículas más elaborado
    console.log("✨ Particle effect triggered!")
  }

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Button
        onClick={handleAddToCart}
        variant={variant}
        size={size}
        disabled={isAdded}
        className={`
          relative overflow-hidden transition-all duration-500 font-bold
          ${
            isAdded
              ? "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 hover:from-green-500 hover:via-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-green-500/30"
              : "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white shadow-lg shadow-purple-500/30"
          }
          border-2 border-white/20 rounded-xl
          ${className}
        `}
      >
        {/* Efecto de brillo animado */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: isHovered ? ["-100%", "100%"] : "-100%",
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
        />

        {/* Contenido del botón */}
        <motion.div
          className="flex items-center gap-2 relative z-10"
          animate={{
            scale: isAdded ? [1, 1.1, 1] : 1,
            rotate: isAdded ? [0, 5, -5, 0] : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          {isAdded ? (
            <>
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 0.5 }}>
                <Check className="h-4 w-4" />
              </motion.div>
              <span>¡Agregado!</span>
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 1, repeat: 2 }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                animate={{
                  rotate: isHovered ? [0, 10, -10, 0] : 0,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <ShoppingBag className="h-4 w-4" />
              </motion.div>
              <span>Agregar</span>
              {isHovered && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <Heart className="h-4 w-4" />
                </motion.div>
              )}
            </>
          )}
        </motion.div>

        {/* Partículas flotantes cuando se agrega */}
        {isAdded && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                initial={{
                  x: "50%",
                  y: "50%",
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 200}%`,
                  y: `${50 + (Math.random() - 0.5) * 200}%`,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </Button>
    </motion.div>
  )
}
