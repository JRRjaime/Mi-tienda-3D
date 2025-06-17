import { NextResponse } from "next/server"
import { getStripe, isStripeConfigured, getStripePublishableKey } from "@/lib/stripe"

export async function GET() {
  try {
    const configured = isStripeConfigured()
    const stripe = getStripe()
    const publicKey = getStripePublishableKey()

    return NextResponse.json({
      configured,
      publicKeyValid: !!publicKey && publicKey.startsWith("pk_"),
      secretKeyValid: !!stripe && !!process.env.STRIPE_SECRET_KEY?.startsWith("sk_"),
      publicKeyPrefix: publicKey ? publicKey.substring(0, 8) + "..." : null,
      secretKeyPrefix: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 8) + "..." : null,
    })
  } catch (error) {
    console.error("Error checking Stripe config:", error)
    return NextResponse.json(
      {
        configured: false,
        error: "Failed to check configuration",
      },
      { status: 500 },
    )
  }
}
