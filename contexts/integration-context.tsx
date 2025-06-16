"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

// Tipos para la integración
interface PurchaseData {
  orderId: string
  buyerId: string
  buyerName: string
  sellerId: string
  sellerName: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  shippingAddress: {
    fullName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
  }
}

interface IntegrationContextType {
  triggerPurchaseComplete: (purchaseData: PurchaseData) => void
  triggerNewMessage: (senderId: string, receiverId: string, message: string) => void
  triggerOrderUpdate: (orderId: string, status: string) => void
}

// Crear el contexto
const IntegrationContext = createContext<IntegrationContextType | undefined>(undefined)

// Hook personalizado
export const useIntegration = () => {
  const context = useContext(IntegrationContext)
  if (context === undefined) {
    throw new Error("useIntegration debe ser usado dentro de un IntegrationProvider")
  }
  return context
}

// Proveedor del contexto
export function IntegrationProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()

  const triggerPurchaseComplete = (purchaseData: PurchaseData) => {
    // Disparar evento personalizado para notificaciones
    window.dispatchEvent(
      new CustomEvent("purchaseComplete", {
        detail: {
          type: "sales",
          priority: "high",
          title: "¡Nueva Compra Realizada!",
          message: `Has comprado ${purchaseData.items.length} artículo(s) por $${purchaseData.total.toFixed(2)}`,
          buyerId: purchaseData.buyerId,
          sellerId: purchaseData.sellerId,
          orderId: purchaseData.orderId,
          sellerName: purchaseData.sellerName,
        },
      }),
    )

    // Disparar evento para el vendedor
    window.dispatchEvent(
      new CustomEvent("newSale", {
        detail: {
          type: "sales",
          priority: "high",
          title: "¡Nueva Venta!",
          message: `${purchaseData.buyerName} ha comprado tus productos por $${purchaseData.total.toFixed(2)}`,
          buyerId: purchaseData.buyerId,
          sellerId: purchaseData.sellerId,
          orderId: purchaseData.orderId,
          buyerName: purchaseData.buyerName,
        },
      }),
    )

    // Disparar evento para crear chat
    window.dispatchEvent(
      new CustomEvent("createChat", {
        detail: {
          contactId: purchaseData.sellerId,
          contactName: purchaseData.sellerName,
          contactType: "creator",
          initialMessage: `¡Hola! Acabo de comprar tus productos (Pedido #${purchaseData.orderId}). ¿Cuándo podrás enviarlo?`,
        },
      }),
    )

    // Disparar evento para crear pedido
    window.dispatchEvent(
      new CustomEvent("createOrder", {
        detail: purchaseData,
      }),
    )

    console.log("🎉 Purchase integration triggered:", purchaseData.orderId)
  }

  const triggerNewMessage = (senderId: string, receiverId: string, message: string) => {
    window.dispatchEvent(
      new CustomEvent("newMessage", {
        detail: {
          senderId,
          receiverId,
          message,
          timestamp: new Date(),
        },
      }),
    )
  }

  const triggerOrderUpdate = (orderId: string, status: string) => {
    window.dispatchEvent(
      new CustomEvent("orderStatusUpdate", {
        detail: {
          orderId,
          status,
          timestamp: new Date(),
        },
      }),
    )

    // Crear notificación de actualización
    const statusMessages = {
      shipped: "Tu pedido ha sido enviado",
      delivered: "Tu pedido ha sido entregado",
      completed: "Tu pedido se ha completado",
    }

    if (statusMessages[status as keyof typeof statusMessages]) {
      window.dispatchEvent(
        new CustomEvent("orderNotification", {
          detail: {
            type: "orders",
            priority: "normal",
            title: "Actualización de Pedido",
            message: `${statusMessages[status as keyof typeof statusMessages]} - #${orderId}`,
            orderId,
          },
        }),
      )
    }
  }

  return (
    <IntegrationContext.Provider
      value={{
        triggerPurchaseComplete,
        triggerNewMessage,
        triggerOrderUpdate,
      }}
    >
      {children}
    </IntegrationContext.Provider>
  )
}
