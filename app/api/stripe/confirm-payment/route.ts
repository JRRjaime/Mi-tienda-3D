import { type NextRequest, NextResponse } from "next/server"
import { getStripe, isStripeConfigured } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    // Verificar si Stripe está configurado
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: "Stripe is not configured. Please contact support." }, { status: 503 })
    }

    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json({ error: "Payment service unavailable" }, { status: 503 })
    }

    const { paymentIntentId } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment Intent ID is required" }, { status: 400 })
    }

    // Obtener el Payment Intent de Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === "succeeded") {
      // Aquí puedes agregar lógica adicional como:
      // - Actualizar base de datos
      // - Enviar emails de confirmación
      // - Actualizar saldo del usuario

      return NextResponse.json({
        success: true,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      })
    } else {
      return NextResponse.json({ error: "Payment not completed", status: paymentIntent.status }, { status: 400 })
    }
  } catch (error) {
    console.error("Error confirming payment:", error)
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}
