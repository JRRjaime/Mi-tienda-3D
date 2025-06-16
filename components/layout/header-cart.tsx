"use client"

import { memo } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEnhancedCart } from "@/contexts/enhanced-cart-context"

const HeaderCart = memo(() => {
  const { items, total } = useEnhancedCart()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const hasItems = itemCount > 0

  return (
    <Link href="/checkout">
      <Button variant="ghost" size="sm" className="relative">
        <ShoppingCart className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Carrito</span>

        {hasItems && (
          <>
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
            >
              {itemCount}
            </Badge>
            <span className="hidden md:inline ml-2 text-sm font-medium">${total.toFixed(2)}</span>
          </>
        )}
      </Button>
    </Link>
  )
})

HeaderCart.displayName = "HeaderCart"

export { HeaderCart }
