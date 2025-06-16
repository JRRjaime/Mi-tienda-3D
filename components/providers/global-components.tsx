"use client"

import { OptimizedFooter } from "@/components/layout/optimized-footer"
import { DualFAB } from "@/components/ui/dual-fab"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/ui/error-boundary"

export function GlobalComponents() {
  return (
    <ErrorBoundary>
      {/* Solo componentes globales, SIN HEADER */}
      <DualFAB />
      <Toaster />
      <OptimizedFooter />
    </ErrorBoundary>
  )
}
