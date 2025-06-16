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

    const { amount, currency = "usd", metadata = {} } = await request.json()

    // Validar cantidad mínima (50 centavos)
    if (amount < 50) {
      return NextResponse.json({ error: "Amount must be at least $0.50" }, { status: 400 })
    }

    // Crear Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Stripe usa centavos
      currency,
      metadata: {
        ...metadata,
        source: "marketplace_3d",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
