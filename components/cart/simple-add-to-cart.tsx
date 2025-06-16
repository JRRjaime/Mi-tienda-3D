"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEnhancedCart } from "@/contexts/enhanced-cart-context"
import type { CartItem } from "@/contexts/enhanced-cart-context"

interface SimpleAddToCartProps {
  product: Omit<CartItem, "quantity">
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  className?: string
}

export function SimpleAddToCart({
  product,
  variant = "default",
  size = "default",
  className = "",
}: SimpleAddToCartProps) {
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useEnhancedCart()

  const handleAddToCart = () => {
    console.log("Adding product to cart:", product) // Debug
    addItem(product)
    setIsAdded(true)

    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Button
        onClick={handleAddToCart}
        variant={variant}
        size={size}
        disabled={isAdded}
        className={`
          transition-all duration-200
          ${isAdded ? "bg-green-500 hover:bg-green-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}
          ${className}
        `}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{ scale: isAdded ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.2 }}
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4" />
              ¡Agregado!
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              Agregar
            </>
          )}
        </motion.div>
      </Button>
    </motion.div>
  )
}
