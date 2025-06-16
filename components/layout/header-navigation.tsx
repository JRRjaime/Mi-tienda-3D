"use client"

import { memo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Package } from "lucide-react"
import { useOptimizedHeader } from "@/hooks/use-optimized-header"

const HeaderNavigation = memo(() => {
  const { navigationItems, isMobile } = useOptimizedHeader()

  if (isMobile) return null

  const iconMap = {
    "/": Package,
    "/productos": Package,
    "/analytics": BarChart3,
    "/collaboration": Users,
  }

  return (
    <>
      {navigationItems.map((item) => {
        const Icon = iconMap[item.href as keyof typeof iconMap]

        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={item.active ? "default" : "ghost"}
              size="sm"
              className={item.active ? "bg-primary text-primary-foreground" : ""}
            >
              {Icon && <Icon className="w-4 h-4 mr-2" />}
              {item.name}
            </Button>
          </Link>
        )
      })}
    </>
  )
})

HeaderNavigation.displayName = "HeaderNavigation"

export { HeaderNavigation }
