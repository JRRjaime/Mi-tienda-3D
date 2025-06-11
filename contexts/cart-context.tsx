"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  type: "download" | "printed"
  image: string
  creatorName: string
  creatorId: string
  category: string
  tags: string[]
  printOptions?: {
    material: string
    color: string
    quality: string
    infill: number
    size: string
  }
  downloadFormat?: string[]
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([
    // Datos simulados iniciales
    {
      id: "1",
      name: "Dragón Articulado",
      description: "Figura de dragón con articulaciones móviles",
      price: 25,
      quantity: 1,
      type: "download",
      image: "/placeholder.svg?height=80&width=80",
      creatorName: "Carlos Mendez",
      creatorId: "creator1",
      category: "Figuras de Acción",
      tags: ["dragón", "articulado", "fantasía"],
      downloadFormat: ["STL", "OBJ", "3MF"],
    },
    {
      id: "2",
      name: "Miniatura Guerrero",
      description: "Guerrero medieval para juegos de mesa",
      price: 15,
      quantity: 2,
      type: "printed",
      image: "/placeholder.svg?height=80&width=80",
      creatorName: "Ana García",
      creatorId: "creator2",
      category: "Gaming",
      tags: ["miniatura", "guerrero", "medieval"],
      printOptions: {
        material: "PLA",
        color: "Gris",
        quality: "Alta (0.1mm)",
        infill: 20,
        size: "28mm",
      },
    },
  ])

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id)
      if (existingItem) {
        return prev.map((item) => (item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id)
      } else {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
      }
    },
    [removeItem],
  )

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
