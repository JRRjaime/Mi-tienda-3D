"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

// Loading para tarjetas de productos
export function ProductCardSkeleton() {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <Skeleton className="h-48 w-full bg-white/10" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-3/4 bg-white/10" />
        <Skeleton className="h-4 w-1/2 bg-white/10" />
        <div className="flex justify-between">
          <Skeleton className="h-6 w-16 bg-white/10" />
          <Skeleton className="h-8 w-20 bg-white/10" />
        </div>
      </CardContent>
    </Card>
  )
}

// Loading para lista de productos
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Loading para dashboard
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <Skeleton className="h-8 w-8 bg-white/10 mb-2" />
              <Skeleton className="h-6 w-16 bg-white/10 mb-1" />
              <Skeleton className="h-4 w-24 bg-white/10" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <Skeleton className="h-6 w-48 bg-white/10" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full bg-white/10" />
        </CardContent>
      </Card>
    </div>
  )
}

// Loading spinner global
export function GlobalLoader() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 flex items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
        <span className="text-white font-medium">Cargando...</span>
      </div>
    </div>
  )
}

// Loading para formularios
export function FormLoader() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full bg-white/10" />
      <Skeleton className="h-10 w-full bg-white/10" />
      <Skeleton className="h-24 w-full bg-white/10" />
      <Skeleton className="h-10 w-32 bg-white/10" />
    </div>
  )
}
