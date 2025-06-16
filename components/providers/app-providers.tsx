"use client"

import { memo, type ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { PlatformDataProvider } from "@/contexts/platform-data-context"
import { WalletProvider } from "@/contexts/wallet-context"
import { StatsProvider } from "@/contexts/stats-context"
import { CartProvider } from "@/contexts/cart-context"
import { FollowProvider } from "@/contexts/follow-context"
import { CollaborationProvider } from "@/contexts/collaboration-context"
import { IntegrationProvider } from "@/contexts/integration-context"
import { RecommendationsProvider } from "@/contexts/recommendations-context"
import { AnalyticsProvider } from "@/contexts/analytics-context"

// Provider para temas (independiente, va primero)
const ThemeProviderWrapper = memo(({ children }: { children: ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    {children}
  </ThemeProvider>
))
ThemeProviderWrapper.displayName = "ThemeProviderWrapper"

// Providers de datos base (dependen de auth)
const DataProviders = memo(({ children }: { children: ReactNode }) => (
  <PlatformDataProvider>
    <StatsProvider>
      <AnalyticsProvider>
        <WalletProvider>{children}</WalletProvider>
      </AnalyticsProvider>
    </StatsProvider>
  </PlatformDataProvider>
))
DataProviders.displayName = "DataProviders"

// Providers de funcionalidades (dependen de auth y datos)
const FeatureProviders = memo(({ children }: { children: ReactNode }) => (
  <CartProvider>
    <FollowProvider>
      <CollaborationProvider>
        <RecommendationsProvider>{children}</RecommendationsProvider>
      </CollaborationProvider>
    </FollowProvider>
  </CartProvider>
))
FeatureProviders.displayName = "FeatureProviders"

// Provider principal optimizado
export const AppProviders = memo(({ children }: { children: ReactNode }) => (
  <ThemeProviderWrapper>
    <AuthProvider>
      <DataProviders>
        <FeatureProviders>
          <IntegrationProvider>{children}</IntegrationProvider>
        </FeatureProviders>
      </DataProviders>
    </AuthProvider>
  </ThemeProviderWrapper>
))
AppProviders.displayName = "AppProviders"
