"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

// Tipos para transacciones
export interface Transaction {
  id: string
  type: "income" | "expense" | "pending_income" | "pending_expense" | "blocked" | "refund"
  amount: number
  description: string
  date: string
  status: "completed" | "pending" | "blocked" | "cancelled" | "expired"
  relatedUser?: string
  paymentMethod?: string
  expiresAt?: string
  metadata?: {
    orderId?: string
    productId?: string
    notes?: string
  }
}

// Tipos para el balance
export interface WalletBalance {
  available: number // Dinero disponible para usar
  pending: number // Dinero esperando confirmación
  blocked: number // Dinero bloqueado en transacciones
  total: number // Total de patrimonio
}

// Tipos para el contexto
interface WalletContextType {
  balance: WalletBalance
  transactions: Transaction[]
  isLoading: boolean
  addFunds: (amount: number, method: string) => Promise<void>
  withdrawFunds: (amount: number, method: string) => Promise<void>
  sendPayment: (amount: number, recipientEmail: string, description: string) => Promise<void>
  confirmPayment: (transactionId: string) => Promise<void>
  reportProblem: (transactionId: string, reason: string) => Promise<void>
  refreshBalance: () => Promise<void>
}

// Datos simulados de transacciones
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx_001",
    type: "income",
    amount: 125.0,
    description: "Venta de modelo 3D - Figura de Goku",
    date: "2024-01-15T10:30:00Z",
    status: "completed",
    relatedUser: "usuario@example.com",
    paymentMethod: "wallet",
    metadata: {
      orderId: "ORD_001",
      productId: "goku-figure",
    },
  },
  {
    id: "tx_002",
    type: "pending_income",
    amount: 75.5,
    description: "Pago pendiente - Servicio de impresión",
    date: "2024-01-14T15:45:00Z",
    status: "pending",
    relatedUser: "cliente@example.com",
    paymentMethod: "wallet",
    expiresAt: "2024-01-21T15:45:00Z",
    metadata: {
      orderId: "ORD_002",
      notes: "Esperando confirmación del cliente",
    },
  },
  {
    id: "tx_003",
    type: "blocked",
    amount: 45.0,
    description: "Pago bloqueado - Compra de modelo industrial",
    date: "2024-01-13T09:20:00Z",
    status: "blocked",
    relatedUser: "vendedor@example.com",
    paymentMethod: "wallet",
    expiresAt: "2024-01-20T09:20:00Z",
    metadata: {
      orderId: "ORD_003",
      productId: "industrial-gear",
    },
  },
  {
    id: "tx_004",
    type: "expense",
    amount: -25.0,
    description: "Compra completada - Organizador de escritorio",
    date: "2024-01-12T14:10:00Z",
    status: "completed",
    relatedUser: "creador@example.com",
    paymentMethod: "wallet",
    metadata: {
      orderId: "ORD_004",
      productId: "desk-organizer",
    },
  },
  {
    id: "tx_005",
    type: "income",
    amount: 200.0,
    description: "Recarga de saldo - Tarjeta de crédito",
    date: "2024-01-10T11:00:00Z",
    status: "completed",
    paymentMethod: "credit_card",
  },
]

// Crear el contexto
const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Hook personalizado
export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet debe ser usado dentro de un WalletProvider")
  }
  return context
}

// Proveedor del contexto
export function WalletProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Calcular balance dinámicamente
  const calculateBalance = (): WalletBalance => {
    let available = 0
    let pending = 0
    let blocked = 0

    transactions.forEach((tx) => {
      switch (tx.type) {
        case "income":
          if (tx.status === "completed") available += tx.amount
          break
        case "expense":
          if (tx.status === "completed") available += tx.amount // tx.amount ya es negativo
          break
        case "pending_income":
          if (tx.status === "pending") pending += tx.amount
          break
        case "blocked":
          if (tx.status === "blocked") blocked += Math.abs(tx.amount)
          break
      }
    })

    return {
      available: Math.max(0, available),
      pending,
      blocked,
      total: available + pending,
    }
  }

  const [balance, setBalance] = useState<WalletBalance>(calculateBalance())

  // Actualizar balance cuando cambien las transacciones
  useEffect(() => {
    setBalance(calculateBalance())
  }, [transactions])

  // Añadir fondos
  const addFunds = async (amount: number, method: string): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: "income",
        amount,
        description: `Recarga de saldo - ${method === "credit_card" ? "Tarjeta de crédito" : "Transferencia bancaria"}`,
        date: new Date().toISOString(),
        status: "completed",
        paymentMethod: method,
      }

      setTransactions((prev) => [newTransaction, ...prev])

      toast({
        title: "Fondos añadidos",
        description: `Se han añadido $${amount.toFixed(2)} a tu cartera`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron añadir los fondos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Retirar fondos
  const withdrawFunds = async (amount: number, method: string): Promise<void> => {
    setIsLoading(true)
    try {
      const currentBalance = calculateBalance()
      if (amount > currentBalance.available) {
        throw new Error("Saldo insuficiente")
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: "expense",
        amount: -amount,
        description: `Retiro de fondos - ${method === "bank_transfer" ? "Transferencia bancaria" : "PayPal"}`,
        date: new Date().toISOString(),
        status: "completed",
        paymentMethod: method,
      }

      setTransactions((prev) => [newTransaction, ...prev])

      toast({
        title: "Retiro procesado",
        description: `Se han retirado $${amount.toFixed(2)} de tu cartera`,
      })
    } catch (error) {
      toast({
        title: "Error en el retiro",
        description: error instanceof Error ? error.message : "No se pudo procesar el retiro",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Enviar pago (bloquea el dinero)
  const sendPayment = async (amount: number, recipientEmail: string, description: string): Promise<void> => {
    setIsLoading(true)
    try {
      const currentBalance = calculateBalance()
      if (amount > currentBalance.available) {
        throw new Error("Saldo insuficiente")
      }

      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Crear transacción bloqueada para el emisor
      const blockedTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: "blocked",
        amount: -amount,
        description: `Pago enviado - ${description}`,
        date: new Date().toISOString(),
        status: "blocked",
        relatedUser: recipientEmail,
        paymentMethod: "wallet",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días
        metadata: {
          notes: "Esperando confirmación del destinatario",
        },
      }

      setTransactions((prev) => [blockedTransaction, ...prev])

      toast({
        title: "Pago enviado",
        description: `Pago de $${amount.toFixed(2)} enviado a ${recipientEmail}. Esperando confirmación.`,
      })
    } catch (error) {
      toast({
        title: "Error en el pago",
        description: error instanceof Error ? error.message : "No se pudo enviar el pago",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Confirmar pago recibido
  const confirmPayment = async (transactionId: string): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === transactionId
            ? {
                ...tx,
                status: "completed" as const,
                type: "income" as const,
                amount: Math.abs(tx.amount),
                description: tx.description.replace("Pago pendiente", "Pago confirmado"),
              }
            : tx,
        ),
      )

      toast({
        title: "Pago confirmado",
        description: "El pago ha sido confirmado y los fondos han sido liberados",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo confirmar el pago",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Reportar problema
  const reportProblem = async (transactionId: string, reason: string): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === transactionId
            ? {
                ...tx,
                status: "cancelled" as const,
                description: `${tx.description} - CANCELADO: ${reason}`,
              }
            : tx,
        ),
      )

      toast({
        title: "Problema reportado",
        description: "La transacción ha sido cancelada y los fondos serán devueltos",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo reportar el problema",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Refrescar balance
  const refreshBalance = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setBalance(calculateBalance())
      toast({
        title: "Balance actualizado",
        description: "El balance se ha actualizado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el balance",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        addFunds,
        withdrawFunds,
        sendPayment,
        confirmPayment,
        reportProblem,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
