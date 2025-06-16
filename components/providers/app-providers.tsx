import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { CollaborationProvider } from "@/contexts/collaboration-context"
import { FollowProvider } from "@/contexts/follow-context"
import { IntegrationProvider } from "@/contexts/integration-context"
import { PlatformDataProvider } from "@/contexts/platform-data-context"
import { RecommendationsProvider } from "@/contexts/recommendations-context"
import { StatsProvider } from "@/contexts/stats-context"
import { WalletProvider } from "@/contexts/wallet-context"
import { AnalyticsProvider } from "@/contexts/analytics-context"
import { PlatformCommissionProvider } from "@/contexts/platform-commission-context"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Toaster />
      <AuthProvider>
        <PlatformCommissionProvider>
          <FollowProvider>
            <CartProvider>
              <WalletProvider>
                <PlatformDataProvider>
                  <StatsProvider>
                    <CollaborationProvider>
                      <IntegrationProvider>
                        <RecommendationsProvider>
                          <AnalyticsProvider>{children}</AnalyticsProvider>
                        </RecommendationsProvider>
                      </IntegrationProvider>
                    </CollaborationProvider>
                  </StatsProvider>
                </PlatformDataProvider>
              </WalletProvider>
            </CartProvider>
          </FollowProvider>
        </PlatformCommissionProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
