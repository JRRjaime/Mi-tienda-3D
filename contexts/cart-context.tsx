"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

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
  weight?: number // Para cálculo de envío
  dimensions?: {
    length: number
    width: number
    height: number
  }
  printOptions?: {
    material: string
    color: string
    quality: string
    infill: number
    size: string
  }
  downloadFormat?: string[]
}

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

export interface CouponCode {
  code: string
  discount: number
  type: "percentage" | "fixed"
  minAmount?: number
  maxDiscount?: number
  expiresAt?: Date
  usageLimit?: number
  usedCount?: number
}

interface CartContextType {
  items: CartItem[]
  shippingAddress: ShippingAddress | null
  appliedCoupon: CouponCode | null
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setShippingAddress: (address: ShippingAddress) => void
  applyCoupon: (code: string) => Promise<boolean>
  removeCoupon: () => void
  calculateShipping: (address: ShippingAddress) => Promise<number>
  totalItems: number
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Cupones válidos simulados
const VALID_COUPONS: Record<string, CouponCode> = {
  DESCUENTO10: {
    code: "DESCUENTO10",
    discount: 10,
    type: "percentage",
    minAmount: 20,
  },
  PRIMERA20: {
    code: "PRIMERA20",
    discount: 20,
    type: "percentage",
    minAmount: 50,
    maxDiscount: 30,
  },
  VERANO15: {
    code: "VERANO15",
    discount: 15,
    type: "percentage",
    minAmount: 30,
  },
  ENVIOGRATIS: {
    code: "ENVIOGRATIS",
    discount: 100,
    type: "percentage",
    minAmount: 75,
  },
  FIJO5: {
    code: "FIJO5",
    discount: 5,
    type: "fixed",
    minAmount: 25,
  },
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [shippingAddress, setShippingAddressState] = useState<ShippingAddress | null>(null)
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null)
  const [shippingCost, setShippingCost] = useState(0)

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart-items")
      const savedAddress = localStorage.getItem("shipping-address")
      const savedCoupon = localStorage.getItem("applied-coupon")

      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (error) {
          console.error("Error loading cart from localStorage:", error)
        }
      }

      if (savedAddress) {
        try {
          setShippingAddressState(JSON.parse(savedAddress))
        } catch (error) {
          console.error("Error loading address from localStorage:", error)
        }
      }

      if (savedCoupon) {
        try {
          setAppliedCoupon(JSON.parse(savedCoupon))
        } catch (error) {
          console.error("Error loading coupon from localStorage:", error)
        }
      }
    }
  }, [])

  // Guardar items en localStorage cuando cambien
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart-items", JSON.stringify(items))
    }
  }, [items])

  // Guardar dirección en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (shippingAddress) {
        localStorage.setItem("shipping-address", JSON.stringify(shippingAddress))
      } else {
        localStorage.removeItem("shipping-address")
      }
    }
  }, [shippingAddress])

  // Guardar cupón en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (appliedCoupon) {
        localStorage.setItem("applied-coupon", JSON.stringify(appliedCoupon))
      } else {
        localStorage.removeItem("applied-coupon")
      }
    }
  }, [appliedCoupon])

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
    setAppliedCoupon(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart-items")
      localStorage.removeItem("applied-coupon")
    }
  }, [])

  const setShippingAddress = useCallback((address: ShippingAddress) => {
    setShippingAddressState(address)
  }, [])

  // Calcular costo de envío en tiempo real
  const calculateShipping = useCallback(
    async (address: ShippingAddress): Promise<number> => {
      // Simular llamada a API de envío
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const printedItems = items.filter((item) => item.type === "printed")
      if (printedItems.length === 0) return 0

      // Calcular peso total
      const totalWeight = printedItems.reduce((sum, item) => {
        const weight = item.weight || 0.1 // peso por defecto 100g
        return sum + weight * item.quantity
      }, 0)

      // Calcular volumen total
      const totalVolume = printedItems.reduce((sum, item) => {
        const dimensions = item.dimensions || { length: 10, width: 10, height: 10 }
        const volume = (dimensions.length * dimensions.width * dimensions.height) / 1000 // cm³ a dm³
        return sum + volume * item.quantity
      }, 0)

      // Tarifas base por país
      const baseRates: Record<string, number> = {
        España: 5.99,
        Francia: 12.99,
        Alemania: 14.99,
        Italia: 13.99,
        Portugal: 8.99,
        "Reino Unido": 16.99,
        "Estados Unidos": 24.99,
        México: 19.99,
        Argentina: 22.99,
        Brasil: 25.99,
        Chile: 21.99,
        Colombia: 20.99,
      }

      const baseRate = baseRates[address.country] || 29.99

      // Ajustar por peso (cada kg adicional después del primero)
      const weightSurcharge = Math.max(0, totalWeight - 1) * 3.99

      // Ajustar por volumen (cada dm³ adicional después del primero)
      const volumeSurcharge = Math.max(0, totalVolume - 1) * 2.99

      const calculatedCost = baseRate + weightSurcharge + volumeSurcharge

      setShippingCost(calculatedCost)
      return calculatedCost
    },
    [items],
  )

  // Aplicar cupón
  const applyCoupon = useCallback(
    async (code: string): Promise<boolean> => {
      const coupon = VALID_COUPONS[code.toUpperCase()]
      if (!coupon) return false

      const currentSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      // Verificar monto mínimo
      if (coupon.minAmount && currentSubtotal < coupon.minAmount) {
        return false
      }

      // Verificar fecha de expiración
      if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        return false
      }

      // Verificar límite de uso
      if (coupon.usageLimit && coupon.usedCount && coupon.usedCount >= coupon.usageLimit) {
        return false
      }

      setAppliedCoupon(coupon)
      return true
    },
    [items],
  )

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null)
  }, [])

  // Cálculos
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.21 // IVA 21%

  // Calcular descuento
  let discount = 0
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discount = (subtotal * appliedCoupon.discount) / 100
      if (appliedCoupon.maxDiscount) {
        discount = Math.min(discount, appliedCoupon.maxDiscount)
      }
    } else {
      discount = appliedCoupon.discount
    }
  }

  const total = subtotal + shippingCost + tax - discount

  return (
    <CartContext.Provider
      value={{
        items,
        shippingAddress,
        appliedCoupon,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setShippingAddress,
        applyCoupon,
        removeCoupon,
        calculateShipping,
        totalItems,
        subtotal,
        shippingCost,
        tax,
        discount,
        total,
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
