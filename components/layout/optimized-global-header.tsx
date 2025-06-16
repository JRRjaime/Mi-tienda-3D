"use client"

import { memo, lazy } from "react"
import { useOptimizedHeader } from "@/hooks/use-optimized-header"
import { useEnhancedCart } from "@/contexts/enhanced-cart-context"

// Lazy load non-critical components
const ThemeToggle = lazy(() => import("@/components/theme-toggle").then((mod) => ({ default: mod.ThemeToggle })))

// Memoized header component
const GlobalHeader = memo(() => {
  const { isScrolled, isMobile } = useOptimizedHeader()
  const { items } = useEnhancedCart()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header
      className={`
        bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50 
        transition-all duration-200 ease-in-out
        ${isScrolled ? "shadow-md bg-background/98" : ""}
      `}
    ></header>
  )
})

GlobalHeader.displayName = "GlobalHeader"

export default GlobalHeader
