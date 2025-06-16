"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface OptimizedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "glass" | "gradient" | "bright"
  size?: "sm" | "md" | "lg"
  hover?: boolean
  loading?: boolean
  glow?: boolean
}

const OptimizedCard = forwardRef<HTMLDivElement, OptimizedCardProps>(
  (
    { className, variant = "default", size = "md", hover = false, loading = false, glow = false, children, ...props },
    ref,
  ) => {
    const variants = {
      default: "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700",
      elevated: "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-xl shadow-blue-500/10",
      outlined: "bg-transparent border-2 border-blue-300 dark:border-blue-600",
      glass: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20 dark:border-slate-600/20",
      gradient:
        "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border-blue-200 dark:border-slate-600",
      bright:
        "bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border-cyan-200 dark:border-slate-600",
    }

    const sizes = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    }

    const glowEffects = {
      default: "hover:shadow-lg hover:shadow-blue-500/20",
      elevated: "hover:shadow-2xl hover:shadow-blue-500/30",
      outlined: "hover:shadow-lg hover:shadow-blue-500/40 hover:border-blue-400",
      glass: "hover:shadow-lg hover:shadow-blue-500/20",
      gradient: "hover:shadow-lg hover:shadow-purple-500/30",
      bright: "hover:shadow-lg hover:shadow-cyan-500/30",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border transition-all duration-300",
          variants[variant],
          sizes[size],
          hover && "hover:scale-105 cursor-pointer transform-gpu",
          hover && glow && glowEffects[variant],
          loading && "animate-pulse",
          className,
        )}
        {...props}
      >
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-slate-600 dark:to-slate-700 rounded animate-shimmer" />
            <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-slate-600 dark:to-slate-700 rounded animate-shimmer w-3/4" />
            <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-slate-600 dark:to-slate-700 rounded animate-shimmer w-1/2" />
          </div>
        ) : (
          children
        )}
      </div>
    )
  },
)

OptimizedCard.displayName = "OptimizedCard"

export { OptimizedCard }
