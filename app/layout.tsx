import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { FollowProvider } from "@/contexts/follow-context"
import { IntegrationProvider } from "@/contexts/integration-context"
import { WalletProvider } from "@/contexts/wallet-context"
import { PlatformDataProvider } from "@/contexts/platform-data-context"
import { CollaborationProvider } from "@/contexts/collaboration-context"
import { StatsProvider } from "@/contexts/stats-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PrintVerse - Plataforma de Impresión 3D",
  description: "La plataforma definitiva para creadores, impresores y entusiastas de la impresión 3D",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PlatformDataProvider>
            <WalletProvider>
              <IntegrationProvider>
                <FollowProvider>
                  <CartProvider>
                    <CollaborationProvider>
                      <StatsProvider>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                          {children}
                          <Toaster />
                        </ThemeProvider>
                      </StatsProvider>
                    </CollaborationProvider>
                  </CartProvider>
                </FollowProvider>
              </IntegrationProvider>
            </WalletProvider>
          </PlatformDataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
