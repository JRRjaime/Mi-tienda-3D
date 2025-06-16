"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@clerk/nextjs"
import { usePlatformCommission } from "@/contexts/platform-commission-context"

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  authorId?: string
  author?: string
}

const EnhancedCartSystem: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: "1", title: "Product A", price: 20, quantity: 2, authorId: "user1", author: "Author One" },
    { id: "2", title: "Product B", price: 30, quantity: 1, authorId: "user2", author: "Author Two" },
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const { user } = useUser()
  const { addCommission } = usePlatformCommission()

  const processPayment = async () => {
    setIsProcessing(true)
    toast({
      title: "Processing Payment",
      description: "Please wait while we process your payment.",
    })

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generar comisiones de plataforma para cada item
    cartItems.forEach((item) => {
      addCommission({
        orderId: `order_${Date.now()}`,
        userId: user?.id || "anonymous",
        userName: user?.name || "Usuario Anónimo",
        amount: item.price * item.quantity,
        productInfo: {
          productId: item.id,
          productName: item.title,
          creatorId: item.authorId || "unknown",
          creatorName: item.author || "Creador Desconocido",
        },
      })
    })

    console.log(`💰 Generated platform commissions for ${cartItems.length} items`)

    setIsProcessing(false)
    toast({
      title: "Payment Successful",
      description: "Your payment was processed successfully!",
    })
  }

  return (
    <div>
      <h2>Enhanced Cart System</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.title} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
          </li>
        ))}
      </ul>
      <button onClick={processPayment} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Process Payment"}
      </button>
    </div>
  )
}

export default EnhancedCartSystem
