"use client"

import { memo } from "react"
import { Toaster } from "@/components/ui/toaster"
import { DualFAB } from "@/components/ui/dual-fab"

// Componentes globales optimizados
export const GlobalComponents = memo(() => (
  <>
    <DualFAB />
    <Toaster />
  </>
))
GlobalComponents.displayName = "GlobalComponents"
