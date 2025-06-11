import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { CollaborationProvider } from "@/contexts/collaboration-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "World 3D - Marketplace de Modelos 3D",
  description:
    "Descubre, compra y vende modelos 3D únicos. La plataforma líder para creadores y entusiastas de la impresión 3D.",
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <CollaborationProvider>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                  {children}
                </div>
                <Toaster />
              </CollaborationProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
