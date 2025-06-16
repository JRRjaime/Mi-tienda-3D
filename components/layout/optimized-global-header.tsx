"use client"

import { memo, Suspense, lazy } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useOptimizedHeader } from "@/hooks/use-optimized-header"
import { HeaderLogo } from "./header-logo"
import { HeaderSearch } from "./header-search"
import { HeaderNavigation } from "./header-navigation"

// Lazy load non-critical components
const ThemeToggle = lazy(() => import("@/components/theme-toggle").then((mod) => ({ default: mod.ThemeToggle })))
const UserMenu = lazy(() => import("./header-user-menu").then((mod) => ({ default: mod.HeaderUserMenu })))

// Memoized header component
const OptimizedGlobalHeader = memo(() => {
  const { isScrolled, isMobile } = useOptimizedHeader()

  return (
    <header
      className={`
        bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50 
        transition-all duration-200 ease-in-out
        ${isScrolled ? "shadow-md bg-background/98" : ""}
      `}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo - Always visible, optimized */}
          <HeaderLogo />

          {/* Search - Hidden on mobile, lazy loaded */}
          {!isMobile && (
            <Suspense fallback={<Skeleton className="h-10 flex-1 max-w-md" />}>
              <HeaderSearch />
            </Suspense>
          )}

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            <HeaderNavigation />

            {/* Cart removido - ahora está en el FAB */}

            {/* User Menu - Lazy loaded */}
            <Suspense fallback={<Skeleton className="h-9 w-9 rounded-md" />}>
              <UserMenu />
            </Suspense>

            {/* Theme Toggle - Lazy loaded */}
            <Suspense fallback={<Skeleton className="h-9 w-9 rounded-md" />}>
              <ThemeToggle />
            </Suspense>
          </nav>
        </div>

        {/* Mobile Search - Only on mobile */}
        {isMobile && (
          <div className="mt-3">
            <Suspense fallback={<Skeleton className="h-10 w-full" />}>
              <HeaderSearch />
            </Suspense>
          </div>
        )}
      </div>
    </header>
  )
})

OptimizedGlobalHeader.displayName = "OptimizedGlobalHeader"

export { OptimizedGlobalHeader as GlobalHeader }
