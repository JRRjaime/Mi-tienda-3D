"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

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
  weight?: number
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
  isValid?: boolean
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
  calculateShipping: (address?: ShippingAddress) => Promise<number>
  validateCoupon: (code: string) => Promise<CouponCode | null>
  totalItems: number
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Cupones válidos con validación real
const VALID_COUPONS: Record<string, CouponCode> = {
  DESCUENTO10: {
    code: "DESCUENTO10",
    discount: 10,
    type: "percentage",
    minAmount: 20,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
    usageLimit: 100,
    usedCount: 0,
    isValid: true,
  },
  PRIMERA20: {
    code: "PRIMERA20",
    discount: 20,
    type: "percentage",
    minAmount: 50,
    maxDiscount: 30,
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 días
    usageLimit: 50,
    usedCount: 0,
    isValid: true,
  },
  VERANO15: {
    code: "VERANO15",
    discount: 15,
    type: "percentage",
    minAmount: 30,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 días
    isValid: true,
  },
  ENVIOGRATIS: {
    code: "ENVIOGRATIS",
    discount: 100,
    type: "percentage",
    minAmount: 75,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    isValid: true,
  },
  FIJO5: {
    code: "FIJO5",
    discount: 5,
    type: "fixed",
    minAmount: 25,
    isValid: true,
  },
}

export function EnhancedCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [shippingAddress, setShippingAddressState] = useState<ShippingAddress | null>(null)
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null)
  const [shippingCost, setShippingCost] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem("enhanced-cart-items")
        const savedAddress = localStorage.getItem("enhanced-shipping-address")
        const savedCoupon = localStorage.getItem("enhanced-applied-coupon")

        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          setItems(parsedCart)
        }

        if (savedAddress) {
          const parsedAddress = JSON.parse(savedAddress)
          setShippingAddressState(parsedAddress)
          // Calcular envío automáticamente si hay dirección
          calculateShipping(parsedAddress)
        }

        if (savedCoupon) {
          const parsedCoupon = JSON.parse(savedCoupon)
          // Validar cupón al cargar
          validateCoupon(parsedCoupon.code).then((validCoupon) => {
            if (validCoupon) {
              setAppliedCoupon(validCoupon)
            } else {
              localStorage.removeItem("enhanced-applied-coupon")
            }
          })
        }
      } catch (error) {
        console.error("Error loading cart data:", error)
        // Limpiar datos corruptos
        localStorage.removeItem("enhanced-cart-items")
        localStorage.removeItem("enhanced-shipping-address")
        localStorage.removeItem("enhanced-applied-coupon")
      }
    }
  }, [])

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("enhanced-cart-items", JSON.stringify(items))
    }
  }, [items])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (shippingAddress) {
        localStorage.setItem("enhanced-shipping-address", JSON.stringify(shippingAddress))
      } else {
        localStorage.removeItem("enhanced-shipping-address")
      }
    }
  }, [shippingAddress])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (appliedCoupon) {
        localStorage.setItem("enhanced-applied-coupon", JSON.stringify(appliedCoupon))
      } else {
        localStorage.removeItem("enhanced-applied-coupon")
      }
    }
  }, [appliedCoupon])

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id)
      if (existingItem) {
        toast({
          title: "Producto actualizado",
          description: `${newItem.name} - Cantidad: ${existingItem.quantity + 1}`,
        })
        return prev.map((item) => (item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      toast({
        title: "Producto agregado",
        description: `${newItem.name} se agregó al carrito`,
      })
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((item) => item.id === id)
      if (item) {
        toast({
          title: "Producto eliminado",
          description: `${item.name} se eliminó del carrito`,
          variant: "destructive",
        })
      }
      return prev.filter((item) => item.id !== id)
    })
  }, [])

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id)
      } else {
        setItems((prev) =>
          prev.map((item) => {
            if (item.id === id) {
              toast({
                title: "Cantidad actualizada",
                description: `${item.name} - Nueva cantidad: ${quantity}`,
              })
              return { ...item, quantity }
            }
            return item
          }),
        )
      }
    },
    [removeItem],
  )

  const clearCart = useCallback(() => {
    setItems([])
    setAppliedCoupon(null)
    setShippingCost(0)
    if (typeof window !== "undefined") {
      localStorage.removeItem("enhanced-cart-items")
      localStorage.removeItem("enhanced-applied-coupon")
    }
    toast({
      title: "Carrito vaciado",
      description: "Todos los productos fueron eliminados",
    })
  }, [])

  const setShippingAddress = useCallback((address: ShippingAddress) => {
    setShippingAddressState(address)
    // Calcular envío automáticamente
    calculateShipping(address)
  }, [])

  // Validar cupón
  const validateCoupon = useCallback(async (code: string): Promise<CouponCode | null> => {
    setIsLoading(true)
    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const coupon = VALID_COUPONS[code.toUpperCase()]
      if (!coupon) return null

      // Verificar si está expirado
      if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        return { ...coupon, isValid: false }
      }

      // Verificar límite de uso
      if (coupon.usageLimit && coupon.usedCount && coupon.usedCount >= coupon.usageLimit) {
        return { ...coupon, isValid: false }
      }

      return { ...coupon, isValid: true }
    } catch (error) {
      console.error("Error validating coupon:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Calcular costo de envío real
  const calculateShipping = useCallback(
    async (address?: ShippingAddress): Promise<number> => {
      const targetAddress = address || shippingAddress
      if (!targetAddress) return 0

      setIsLoading(true)
      try {
        // Simular llamada a API de envío
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const printedItems = items.filter((item) => item.type === "printed")
        if (printedItems.length === 0) {
          setShippingCost(0)
          return 0
        }

        // Calcular peso total
        const totalWeight = printedItems.reduce((sum, item) => {
          const weight = item.weight || 0.1
          return sum + weight * item.quantity
        }, 0)

        // Calcular volumen total
        const totalVolume = printedItems.reduce((sum, item) => {
          const dimensions = item.dimensions || { length: 10, width: 10, height: 10 }
          const volume = (dimensions.length * dimensions.width * dimensions.height) / 1000
          return sum + volume * item.quantity
        }, 0)

        // Tarifas base por país (más realistas)
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

        const baseRate = baseRates[targetAddress.country] || 29.99
        const weightSurcharge = Math.max(0, totalWeight - 1) * 3.99
        const volumeSurcharge = Math.max(0, totalVolume - 1) * 2.99

        // Descuento por volumen
        const volumeDiscount = totalVolume > 5 ? baseRate * 0.1 : 0

        const calculatedCost = Math.max(0, baseRate + weightSurcharge + volumeSurcharge - volumeDiscount)

        setShippingCost(calculatedCost)
        return calculatedCost
      } catch (error) {
        console.error("Error calculating shipping:", error)
        setShippingCost(0)
        return 0
      } finally {
        setIsLoading(false)
      }
    },
    [items, shippingAddress],
  )

  // Aplicar cupón con validación completa
  const applyCoupon = useCallback(
    async (code: string): Promise<boolean> => {
      const coupon = await validateCoupon(code)
      if (!coupon || !coupon.isValid) {
        toast({
          title: "Cupón inválido",
          description: "El cupón no existe, está expirado o ya fue usado",
          variant: "destructive",
        })
        return false
      }

      const currentSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      // Verificar monto mínimo
      if (coupon.minAmount && currentSubtotal < coupon.minAmount) {
        toast({
          title: "Monto mínimo no alcanzado",
          description: `Necesitas al menos $${coupon.minAmount} para usar este cupón`,
          variant: "destructive",
        })
        return false
      }

      setAppliedCoupon(coupon)
      toast({
        title: "¡Cupón aplicado!",
        description: `Descuento de ${coupon.type === "percentage" ? `${coupon.discount}%` : `$${coupon.discount}`} aplicado`,
      })
      return true
    },
    [items, validateCoupon],
  )

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null)
    toast({
      title: "Cupón removido",
      description: "El descuento fue eliminado",
    })
  }, [])

  // Cálculos mejorados
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Calcular impuestos (IVA variable por país)
  const getTaxRate = (country: string) => {
    const taxRates: Record<string, number> = {
      España: 0.21,
      Francia: 0.2,
      Alemania: 0.19,
      Italia: 0.22,
      Portugal: 0.23,
      "Estados Unidos": 0.08,
      México: 0.16,
      Argentina: 0.21,
      Brasil: 0.17,
    }
    return taxRates[country] || 0.15
  }

  const taxRate = shippingAddress ? getTaxRate(shippingAddress.country) : 0.21
  const tax = subtotal * taxRate

  // Calcular descuento
  let discount = 0
  if (appliedCoupon && appliedCoupon.isValid) {
    if (appliedCoupon.type === "percentage") {
      discount = (subtotal * appliedCoupon.discount) / 100
      if (appliedCoupon.maxDiscount) {
        discount = Math.min(discount, appliedCoupon.maxDiscount)
      }
    } else {
      discount = appliedCoupon.discount
    }
  }

  const total = Math.max(0, subtotal + shippingCost + tax - discount)

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
        validateCoupon,
        totalItems,
        subtotal,
        shippingCost,
        tax,
        discount,
        total,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useEnhancedCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useEnhancedCart must be used within an EnhancedCartProvider")
  }
  return context
}
