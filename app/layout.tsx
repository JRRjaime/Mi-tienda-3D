import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { StatsProvider } from "@/contexts/stats-context"
import { CartProvider } from "@/contexts/cart-context"
import { WalletProvider } from "@/contexts/wallet-context"
import { CollaborationProvider } from "@/contexts/collaboration-context"
import { PlatformDataProvider } from "@/contexts/platform-data-context"
import { GlobalHeader } from "@/components/global-header"
import { Toaster } from "@/components/ui/toaster"
import { FollowProvider } from "@/contexts/follow-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Marketplace 3D - Plataforma de Modelos e Impresión 3D",
  description:
    "La plataforma líder para comprar, vender y colaborar en modelos 3D. Conecta creadores, impresores y usuarios en un solo lugar.",
  keywords: "modelos 3D, impresión 3D, marketplace, STL, OBJ, colaboración",
  authors: [{ name: "Marketplace 3D Team" }],
  openGraph: {
    title: "Marketplace 3D - Plataforma de Modelos e Impresión 3D",
    description: "La plataforma líder para comprar, vender y colaborar en modelos 3D",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <AuthProvider>
            <FollowProvider>
              <PlatformDataProvider>
                <StatsProvider>
                  <CartProvider>
                    <WalletProvider>
                      <CollaborationProvider>
                        <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900">
                          <GlobalHeader />
                          <main>{children}</main>
                          <Toaster />
                        </div>
                      </CollaborationProvider>
                    </WalletProvider>
                  </CartProvider>
                </StatsProvider>
              </PlatformDataProvider>
            </FollowProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
