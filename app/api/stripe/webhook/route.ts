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
        console.log("Payment succeeded:", paymentIntent.id)

        // Aquí puedes agregar lógica para:
        // - Actualizar el saldo del usuario en la base de datos
        // - Enviar notificaciones
        // - Registrar la transacción

        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object
        console.log("Payment failed:", failedPayment.id)

        // Manejar pagos fallidos
        break

      case "charge.dispute.created":
        const dispute = event.data.object
        console.log("Dispute created:", dispute.id)

        // Manejar disputas
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
