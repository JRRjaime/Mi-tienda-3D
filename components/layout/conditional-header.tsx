"use client"

import { usePathname } from "next/navigation"
import { OptimizedHeader } from "@/components/layout/optimized-header"

export function ConditionalHeader() {
  const pathname = usePathname()

  // No mostrar OptimizedHeader en la página principal
  if (pathname === "/") {
    return null
  }

  // Mostrar OptimizedHeader en todas las demás páginas
  return <OptimizedHeader />
}
