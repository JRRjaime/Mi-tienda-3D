"use client"

import { memo } from "react"
import Link from "next/link"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"

const HeaderUserMenu = memo(() => {
  return (
    <Link href="/perfil">
      <Button variant="ghost" size="sm">
        <User className="w-4 h-4" />
        <span className="hidden sm:inline ml-2">Perfil</span>
      </Button>
    </Link>
  )
})

HeaderUserMenu.displayName = "HeaderUserMenu"

export { HeaderUserMenu }
