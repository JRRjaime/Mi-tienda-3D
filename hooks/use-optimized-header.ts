"use client"

import { useState, useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"
import { debounce } from "lodash"

export function useOptimizedHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Debounced scroll handler to prevent excessive re-renders
  const debouncedScrollHandler = useMemo(
    () =>
      debounce(() => {
        setIsScrolled(window.scrollY > 10)
      }, 10),
    [],
  )

  // Debounced resize handler
  const debouncedResizeHandler = useMemo(
    () =>
      debounce(() => {
        setIsMobile(window.innerWidth < 768)
      }, 100),
    [],
  )

  useEffect(() => {
    // Initial checks
    setIsScrolled(window.scrollY > 10)
    setIsMobile(window.innerWidth < 768)

    // Add event listeners
    window.addEventListener("scroll", debouncedScrollHandler, { passive: true })
    window.addEventListener("resize", debouncedResizeHandler, { passive: true })

    return () => {
      window.removeEventListener("scroll", debouncedScrollHandler)
      window.removeEventListener("resize", debouncedResizeHandler)
      debouncedScrollHandler.cancel()
      debouncedResizeHandler.cancel()
    }
  }, [debouncedScrollHandler, debouncedResizeHandler])

  // Memoized navigation items based on pathname
  const navigationItems = useMemo(
    () => [
      { name: "Inicio", href: "/", active: pathname === "/" },
      { name: "Productos", href: "/productos", active: pathname.startsWith("/productos") },
      { name: "Analytics", href: "/analytics", active: pathname.startsWith("/analytics") },
      { name: "Colaboración", href: "/collaboration", active: pathname.startsWith("/collaboration") },
    ],
    [pathname],
  )

  return {
    isScrolled,
    isMobile,
    navigationItems,
    pathname,
  }
}
