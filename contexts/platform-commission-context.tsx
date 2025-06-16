"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { useToast } from "@/hooks/use-toast"

// Tipos para las comisiones
export interface Commission {
  id: string
  orderId: string
  userId: string
  userName: string
  originalAmount: number
  commissionAmount: number
  commissionPercentage: number
  date: string
  status: "pending" | "processed" | "paid"
  productInfo: {
    productId: string
    productName: string
    creatorId: string
    creatorName: string
  }
}

// Configuración de comisiones
export const PLATFORM_COMMISSION_RATE = 0.05 // 5%
export const ADMIN_USER_ID = "admin-001"

interface PlatformCommissionContextType {
  commissions: Commission[]
  totalEarnings: number
  pendingEarnings: number
  processedEarnings: number
  addCommission: (orderData: {
    orderId: string
    userId: string
    userName: string
    amount: number
    productInfo: {
      productId: string
      productName: string
      creatorId: string
      creatorName: string
    }
  }) => void
  processCommission: (commissionId: string) => void
  getCommissionsByDateRange: (startDate: string, endDate: string) => Commission[]
  getTotalCommissionsToday: () => number
  getTotalCommissionsThisMonth: () => number
}

const PlatformCommissionContext = createContext<PlatformCommissionContextType | undefined>(undefined)

export const usePlatformCommission = () => {
  const context = useContext(PlatformCommissionContext)
  if (context === undefined) {
    throw new Error("usePlatformCommission debe ser usado dentro de un PlatformCommissionProvider")
  }
  return context
}

export function PlatformCommissionProvider({ children }: { children: ReactNode }) {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const { toast } = useToast()

  // Use useAuth safely with error handling
  const auth = useAuth()
  const user = auth.user

  // Cargar comisiones del localStorage
  useEffect(() => {
    const storedCommissions = localStorage.getItem("platformCommissions")
    if (storedCommissions) {
      try {
        setCommissions(JSON.parse(storedCommissions))
      } catch (error) {
        console.error("Error parsing stored commissions:", error)
        setCommissions([])
      }
    }
  }, [])

  // Guardar comisiones en localStorage
  useEffect(() => {
    localStorage.setItem("platformCommissions", JSON.stringify(commissions))
  }, [commissions])

  // Calcular totales
  const totalEarnings = commissions.reduce((sum, commission) => sum + commission.commissionAmount, 0)
  const pendingEarnings = commissions
    .filter((c) => c.status === "pending")
    .reduce((sum, commission) => sum + commission.commissionAmount, 0)
  const processedEarnings = commissions
    .filter((c) => c.status === "processed" || c.status === "paid")
    .reduce((sum, commission) => sum + commission.commissionAmount, 0)

  // Agregar nueva comisión
  const addCommission = (orderData: {
    orderId: string
    userId: string
    userName: string
    amount: number
    productInfo: {
      productId: string
      productName: string
      creatorId: string
      creatorName: string
    }
  }) => {
    const commissionAmount = orderData.amount * PLATFORM_COMMISSION_RATE

    const newCommission: Commission = {
      id: `comm_${Date.now()}`,
      orderId: orderData.orderId,
      userId: orderData.userId,
      userName: orderData.userName,
      originalAmount: orderData.amount,
      commissionAmount,
      commissionPercentage: PLATFORM_COMMISSION_RATE * 100,
      date: new Date().toISOString(),
      status: "pending",
      productInfo: orderData.productInfo,
    }

    setCommissions((prev) => [newCommission, ...prev])

    // Solo mostrar notificación si es el admin
    if (user?.id === ADMIN_USER_ID) {
      toast({
        title: "💰 Nueva Comisión Generada",
        description: `+$${commissionAmount.toFixed(2)} de ${orderData.userName}`,
      })
    }

    console.log(`💰 Platform commission generated: $${commissionAmount.toFixed(2)} from order ${orderData.orderId}`)
  }

  // Procesar comisión
  const processCommission = (commissionId: string) => {
    setCommissions((prev) =>
      prev.map((commission) =>
        commission.id === commissionId ? { ...commission, status: "processed" as const } : commission,
      ),
    )

    if (user?.id === ADMIN_USER_ID) {
      toast({
        title: "✅ Comisión Procesada",
        description: "La comisión ha sido marcada como procesada",
      })
    }
  }

  // Obtener comisiones por rango de fechas
  const getCommissionsByDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    return commissions.filter((commission) => {
      const commissionDate = new Date(commission.date)
      return commissionDate >= start && commissionDate <= end
    })
  }

  // Obtener total de comisiones de hoy
  const getTotalCommissionsToday = () => {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

    return commissions
      .filter((commission) => {
        const commissionDate = new Date(commission.date)
        return commissionDate >= startOfDay && commissionDate < endOfDay
      })
      .reduce((sum, commission) => sum + commission.commissionAmount, 0)
  }

  // Obtener total de comisiones de este mes
  const getTotalCommissionsThisMonth = () => {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)

    return commissions
      .filter((commission) => {
        const commissionDate = new Date(commission.date)
        return commissionDate >= startOfMonth && commissionDate < endOfMonth
      })
      .reduce((sum, commission) => sum + commission.commissionAmount, 0)
  }

  return (
    <PlatformCommissionContext.Provider
      value={{
        commissions,
        totalEarnings,
        pendingEarnings,
        processedEarnings,
        addCommission,
        processCommission,
        getCommissionsByDateRange,
        getTotalCommissionsToday,
        getTotalCommissionsThisMonth,
      }}
    >
      {children}
    </PlatformCommissionContext.Provider>
  )
}
