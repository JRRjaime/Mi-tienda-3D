import { useEnhancedCart } from "@/contexts/enhanced-cart-context"

export function GlobalHeader() {
  const { items } = useEnhancedCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="bg-background border-b sticky top-0 z-50">
