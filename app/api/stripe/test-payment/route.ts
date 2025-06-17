import { type NextRequest, NextResponse } from "next/server"
import { getStripe, isStripeConfigured } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "Stripe is not configured",
        },
        { status: 503 },
      )
    }

    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json(
        {
          success: false,
          error: "Stripe instance not available",
        },
        { status: 503 },
      )
    }

    const { amount = 100 } = await request.json()

    // Crear un Payment Intent de prueba
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        test: "true",
        source: "config_checker",
      },
    })

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
    })
  } catch (error) {
    console.error("Error testing payment:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
