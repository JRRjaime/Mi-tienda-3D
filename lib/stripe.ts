import Stripe from "stripe"

// Función para verificar si Stripe está configurado
export const isStripeConfigured = () => {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
}

// Inicialización lazy de Stripe
let stripeInstance: Stripe | null = null

export const getStripe = (): Stripe | null => {
  if (!isStripeConfigured()) {
    console.warn("Stripe is not configured. Please set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
    return null
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
      typescript: true,
    })
  }

  return stripeInstance
}

// Export para compatibilidad
export const stripe = getStripe()

export const getStripePublishableKey = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    console.warn("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set")
    return null
  }
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
}
