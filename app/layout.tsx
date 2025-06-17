import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { AppProviders } from "@/components/providers/app-providers"
import { ConditionalHeader } from "@/components/layout/conditional-header"
import { OptimizedFooter } from "@/components/layout/optimized-footer"
import { ColorfulFloatingCart } from "@/components/cart/colorful-floating-cart"
import { DualFAB } from "@/components/ui/dual-fab" // Añadir esta importación

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "World 3D - Plataforma de Impresión 3D",
  description: "La plataforma definitiva para creadores, impresores y entusiastas de la impresión 3D",
  keywords: "modelos 3D, impresión 3D, marketplace, STL, OBJ, colaboración",
  authors: [{ name: "World 3D Team" }],
  openGraph: {
    title: "World 3D - Plataforma de Impresión 3D",
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
          <ConditionalHeader />
          {children}
          <ColorfulFloatingCart />
          <DualFAB /> {/* Restaurar el DualFAB con analytics y chat */}
          <OptimizedFooter />
        </AppProviders>
      </body>
    </html>
  )
}
