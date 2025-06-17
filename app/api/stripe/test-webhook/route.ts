import { NextResponse } from "next/server"

export async function POST() {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    return NextResponse.json({
      configured: !!webhookSecret && webhookSecret.startsWith("whsec_"),
      secretPrefix: webhookSecret ? webhookSecret.substring(0, 10) + "..." : null,
    })
  } catch (error) {
    console.error("Error checking webhook config:", error)
    return NextResponse.json(
      {
        configured: false,
        error: "Failed to check webhook configuration",
      },
      { status: 500 },
    )
  }
}
