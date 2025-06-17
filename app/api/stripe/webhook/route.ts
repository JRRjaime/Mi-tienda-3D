import { type NextRequest, NextResponse } from "next/server"
import { getStripe, isStripeConfigured } from "@/lib/stripe"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Verificar si Stripe está configurado
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 })
    }

    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json({ error: "Payment service unavailable" }, { status: 503 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not set")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature provided" }, { status: 400 })
    }

    let event: any

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object
        console.log("💰 Payment succeeded:", paymentIntent.id)

        // Procesar el pago exitoso
        await handlePaymentSuccess(paymentIntent)
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object
        console.log("❌ Payment failed:", failedPayment.id)

        // Manejar pagos fallidos
        await handlePaymentFailure(failedPayment)
        break

      case "charge.dispute.created":
        const dispute = event.data.object
        console.log("⚠️ Dispute created:", dispute.id)

        // Manejar disputas
        await handleDispute(dispute)
        break

      case "invoice.payment_succeeded":
        const invoice = event.data.object
        console.log("📄 Invoice payment succeeded:", invoice.id)

        // Manejar pagos de facturas
        await handleInvoicePayment(invoice)
        break

      case "customer.subscription.created":
        const subscription = event.data.object
        console.log("🔄 Subscription created:", subscription.id)

        // Manejar nuevas suscripciones
        await handleSubscriptionCreated(subscription)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

// Función para manejar pagos exitosos
async function handlePaymentSuccess(paymentIntent: any) {
  try {
    const { id, amount, currency, metadata } = paymentIntent

    console.log("🎉 Processing successful payment:", {
      paymentId: id,
      amount: amount / 100, // Stripe usa centavos
      currency,
      metadata,
    })

    // Extraer información del metadata
    const orderId = metadata?.orderId
    const buyerId = metadata?.buyerId
    const sellerId = metadata?.sellerId
    const buyerName = metadata?.buyerName
    const sellerName = metadata?.sellerName

    if (!orderId || !buyerId || !sellerId) {
      console.error("Missing required metadata in payment intent")
      return
    }

    // 1. Actualizar el estado del pedido a "paid"
    await updateOrderPaymentStatus(orderId, "paid", id)

    // 2. Transferir dinero al vendedor
    await transferToSeller(sellerId, amount / 100, orderId)

    // 3. Crear chat automático entre comprador y vendedor
    await createAutomaticChat(buyerId, sellerId, buyerName, sellerName, orderId)

    // 4. Enviar notificaciones
    await sendPaymentNotifications(buyerId, sellerId, orderId, amount / 100)

    // 5. Disparar eventos de integración
    await triggerIntegrationEvents(orderId, buyerId, sellerId, buyerName, sellerName)

    console.log("✅ Payment processing completed successfully")
  } catch (error) {
    console.error("Error processing successful payment:", error)
  }
}

// Función para manejar pagos fallidos
async function handlePaymentFailure(failedPayment: any) {
  try {
    const { id, last_payment_error, metadata } = failedPayment

    console.log("❌ Processing failed payment:", {
      paymentId: id,
      error: last_payment_error?.message,
      metadata,
    })

    const orderId = metadata?.orderId
    const buyerId = metadata?.buyerId

    if (orderId) {
      // Actualizar el estado del pedido a "payment_failed"
      await updateOrderPaymentStatus(orderId, "payment_failed", id)

      // Enviar notificación de fallo
      await sendPaymentFailureNotification(buyerId, orderId, last_payment_error?.message)
    }
  } catch (error) {
    console.error("Error processing failed payment:", error)
  }
}

// Función para manejar disputas
async function handleDispute(dispute: any) {
  try {
    const { id, amount, reason, status, charge } = dispute

    console.log("⚠️ Processing dispute:", {
      disputeId: id,
      amount: amount / 100,
      reason,
      status,
    })

    // Buscar el pedido relacionado con el charge
    const orderId = await findOrderByChargeId(charge)

    if (orderId) {
      // Actualizar el estado del pedido a "disputed"
      await updateOrderPaymentStatus(orderId, "disputed", id)

      // Notificar a ambas partes sobre la disputa
      await sendDisputeNotifications(orderId, reason)
    }
  } catch (error) {
    console.error("Error processing dispute:", error)
  }
}

// Función para manejar pagos de facturas
async function handleInvoicePayment(invoice: any) {
  try {
    const { id, amount_paid, customer, subscription } = invoice

    console.log("📄 Processing invoice payment:", {
      invoiceId: id,
      amount: amount_paid / 100,
      customer,
      subscription,
    })

    // Manejar pagos de suscripciones o facturas recurrentes
    if (subscription) {
      await updateSubscriptionStatus(subscription, "active")
    }
  } catch (error) {
    console.error("Error processing invoice payment:", error)
  }
}

// Función para manejar nuevas suscripciones
async function handleSubscriptionCreated(subscription: any) {
  try {
    const { id, customer, status, items } = subscription

    console.log("🔄 Processing new subscription:", {
      subscriptionId: id,
      customer,
      status,
    })

    // Activar funcionalidades premium para el usuario
    await activatePremiumFeatures(customer, id)
  } catch (error) {
    console.error("Error processing new subscription:", error)
  }
}

// Funciones auxiliares para interactuar con la base de datos/sistema

async function updateOrderPaymentStatus(orderId: string, status: string, paymentId: string) {
  // Simular actualización en base de datos
  console.log(`📝 Updating order ${orderId} payment status to ${status}`)

  // Aquí iría la lógica real de actualización en base de datos
  // Por ahora, disparamos un evento personalizado para que el frontend lo maneje
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("orderPaymentUpdate", {
        detail: { orderId, status, paymentId },
      }),
    )
  }
}

async function transferToSeller(sellerId: string, amount: number, orderId: string) {
  console.log(`💰 Transferring $${amount} to seller ${sellerId} for order ${orderId}`)

  // Calcular comisión de la plataforma (ejemplo: 5%)
  const platformFee = amount * 0.05
  const sellerAmount = amount - platformFee

  console.log(`📊 Platform fee: $${platformFee}, Seller receives: $${sellerAmount}`)

  // Disparar evento para actualizar wallet del vendedor
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("sellerPayment", {
        detail: {
          sellerId,
          amount: sellerAmount,
          orderId,
          platformFee,
          originalAmount: amount,
        },
      }),
    )
  }
}

async function createAutomaticChat(
  buyerId: string,
  sellerId: string,
  buyerName: string,
  sellerName: string,
  orderId: string,
) {
  console.log(`💬 Creating automatic chat between ${buyerName} and ${sellerName} for order ${orderId}`)

  // Disparar evento para crear chat
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("createAutomaticChat", {
        detail: {
          buyerId,
          sellerId,
          buyerName,
          sellerName,
          orderId,
          initialMessage: `¡Hola! Tu pago para el pedido #${orderId} ha sido procesado exitosamente. ¡Gracias por tu compra!`,
        },
      }),
    )
  }
}

async function sendPaymentNotifications(buyerId: string, sellerId: string, orderId: string, amount: number) {
  console.log(`🔔 Sending payment notifications for order ${orderId}`)

  // Notificación para el comprador
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("paymentNotification", {
        detail: {
          userId: buyerId,
          type: "payment_success",
          title: "✅ Pago Procesado",
          message: `Tu pago de $${amount} para el pedido #${orderId} ha sido procesado exitosamente.`,
          orderId,
        },
      }),
    )

    // Notificación para el vendedor
    window.dispatchEvent(
      new CustomEvent("paymentNotification", {
        detail: {
          userId: sellerId,
          type: "sale_notification",
          title: "💰 Nueva Venta",
          message: `¡Has recibido un pago de $${amount} por el pedido #${orderId}!`,
          orderId,
        },
      }),
    )
  }
}

async function sendPaymentFailureNotification(buyerId: string, orderId: string, errorMessage?: string) {
  console.log(`❌ Sending payment failure notification for order ${orderId}`)

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("paymentNotification", {
        detail: {
          userId: buyerId,
          type: "payment_failed",
          title: "❌ Pago Fallido",
          message: `Tu pago para el pedido #${orderId} no pudo ser procesado. ${errorMessage || "Por favor, intenta nuevamente."}`,
          orderId,
        },
      }),
    )
  }
}

async function sendDisputeNotifications(orderId: string, reason: string) {
  console.log(`⚠️ Sending dispute notifications for order ${orderId}`)

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("disputeNotification", {
        detail: {
          orderId,
          reason,
          title: "⚠️ Disputa Creada",
          message: `Se ha creado una disputa para el pedido #${orderId}. Motivo: ${reason}`,
        },
      }),
    )
  }
}

async function findOrderByChargeId(chargeId: string): Promise<string | null> {
  // Simular búsqueda en base de datos
  console.log(`🔍 Finding order by charge ID: ${chargeId}`)

  // Aquí iría la lógica real de búsqueda en base de datos
  // Por ahora retornamos null
  return null
}

async function updateSubscriptionStatus(subscriptionId: string, status: string) {
  console.log(`🔄 Updating subscription ${subscriptionId} status to ${status}`)

  // Aquí iría la lógica de actualización de suscripción
}

async function activatePremiumFeatures(customerId: string, subscriptionId: string) {
  console.log(`⭐ Activating premium features for customer ${customerId}`)

  // Aquí iría la lógica para activar funcionalidades premium
}

async function triggerIntegrationEvents(
  orderId: string,
  buyerId: string,
  sellerId: string,
  buyerName: string,
  sellerName: string,
) {
  console.log(`🎉 Triggering integration events for order ${orderId}`)

  // Disparar todos los eventos de integración necesarios
  if (typeof window !== "undefined") {
    // Evento principal de compra completada
    window.dispatchEvent(
      new CustomEvent("purchaseComplete", {
        detail: {
          orderId,
          buyerId,
          sellerId,
          buyerName,
          sellerName,
          type: "sales",
          priority: "high",
          title: "🎉 Compra Completada",
          message: `Pago procesado exitosamente para el pedido #${orderId}`,
        },
      }),
    )

    // Evento para crear el pedido en el sistema
    window.dispatchEvent(
      new CustomEvent("createOrder", {
        detail: {
          orderId,
          buyerId,
          buyerName,
          sellerId,
          sellerName,
          status: "paid",
        },
      }),
    )
  }
}
