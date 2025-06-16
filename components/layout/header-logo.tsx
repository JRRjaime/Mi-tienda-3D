"use client"

import { memo } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"

const HeaderLogo = memo(() => {
  return (
    <Link href="/" className="flex items-center space-x-2 group">
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <span className="text-white font-bold text-sm">3D</span>
        </div>
        <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-pulse" />
      </div>
      <div className="hidden sm:block">
        <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Mi Tienda 3D
        </span>
      </div>
    </Link>
  )
})

HeaderLogo.displayName = "HeaderLogo"

export { HeaderLogo }
