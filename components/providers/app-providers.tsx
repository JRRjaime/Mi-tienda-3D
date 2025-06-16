"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { EnhancedCartProvider } from "@/contexts/enhanced-cart-context"
import { WalletProvider } from "@/contexts/wallet-context"
import { PlatformDataProvider } from "@/contexts/platform-data-context"
import { CollaborationProvider } from "@/contexts/collaboration-context"
import { IntegrationProvider } from "@/contexts/integration-context"
import { RecommendationsProvider } from "@/contexts/recommendations-context"
import { AnalyticsProvider } from "@/contexts/analytics-context"
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
        <EnhancedCartProvider>
          <WalletProvider>
            <PlatformDataProvider>
              <CollaborationProvider>
                <IntegrationProvider>
                  <RecommendationsProvider>
                    <AnalyticsProvider>
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
            </PlatformDataProvider>
          </WalletProvider>
        </EnhancedCartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
