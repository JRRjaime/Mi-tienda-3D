"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context" // Necesario para Analytics y otros
import { EnhancedCartProvider } from "@/contexts/enhanced-cart-context" // Para el carrito
import { CartProvider } from "@/contexts/cart-context" // Añadir esta importación
import { WalletProvider } from "@/contexts/wallet-context"
import { PlatformDataProvider } from "@/contexts/platform-data-context" // Necesario para Analytics
import { CollaborationProvider } from "@/contexts/collaboration-context"
import { IntegrationProvider } from "@/contexts/integration-context"
import { RecommendationsProvider } from "@/contexts/recommendations-context"
import { AnalyticsProvider } from "@/contexts/analytics-context" // Para analytics
import { PlatformCommissionProvider } from "@/contexts/platform-commission-context"
import { SmartBundlesProvider } from "@/contexts/smart-bundles-context"
import { AuctionSystemProvider } from "@/contexts/auction-system-context"
import { StatsProvider } from "@/contexts/stats-context"
import { FollowProvider } from "@/contexts/follow-context"
import { Toaster } from "@/components/ui/toaster"

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        {" "}
        {/* AuthProvider primero si otros dependen de él */}
        <PlatformDataProvider>
          {" "}
          {/* PlatformDataProvider después de Auth si depende de él, o antes si Analytics depende de ambos */}
          <CartProvider>
            {" "}
            {/* Añadir CartProvider */}
            <EnhancedCartProvider>
              {" "}
              {/* Carrito puede ser independiente o depender de Auth/PlatformData */}
              <WalletProvider>
                <CollaborationProvider>
                  <IntegrationProvider>
                    <RecommendationsProvider>
                      <AnalyticsProvider>
                        {" "}
                        {/* AnalyticsProvider aquí, asegurando que Auth y PlatformData estén disponibles */}
                        <PlatformCommissionProvider>
                          <SmartBundlesProvider>
                            <AuctionSystemProvider>
                              <StatsProvider>
                                <FollowProvider>
                                  {children}
                                  <Toaster />
                                </FollowProvider>
                              </StatsProvider>
                            </AuctionSystemProvider>
                          </SmartBundlesProvider>
                        </PlatformCommissionProvider>
                      </AnalyticsProvider>
                    </RecommendationsProvider>
                  </IntegrationProvider>
                </CollaborationProvider>
              </WalletProvider>
            </EnhancedCartProvider>
          </CartProvider>
        </PlatformDataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
