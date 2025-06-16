import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProviders } from "@/components/providers/app-providers"
import { GlobalComponents } from "@/components/providers/global-components"
import { CartIntegration } from "@/components/cart/cart-integration"
import { GlobalHeader } from "@/components/layout/optimized-global-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PrintVerse - Plataforma de Impresión 3D",
  description: "La plataforma definitiva para creadores, impresores y entusiastas de la impresión 3D",
  keywords: "modelos 3D, impresión 3D, marketplace, STL, OBJ, colaboración",
  authors: [{ name: "PrintVerse Team" }],
  openGraph: {
    title: "PrintVerse - Plataforma de Impresión 3D",
    description: "La plataforma definitiva para creadores, impresores y entusiastas de la impresión 3D",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders>
          {children}
          <GlobalHeader />
          <GlobalComponents />
          <CartIntegration />
        </AppProviders>
      </body>
    </html>
  )
}
