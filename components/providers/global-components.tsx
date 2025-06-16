"use client"

import { memo, Suspense } from "react"
import dynamic from "next/dynamic"
import { Toaster } from "@/components/ui/toaster"

// Lazy load del ChatSystem para mejor rendimiento inicial
const ChatSystem = dynamic(() => import("@/components/chat/chat-system").then((mod) => ({ default: mod.ChatSystem })), {
  ssr: false,
  loading: () => null, // No mostrar loader para el chat
})

// Componentes globales optimizados
export const GlobalComponents = memo(() => (
  <>
    <Suspense fallback={null}>
      <ChatSystem />
    </Suspense>
    <Toaster />
  </>
))
GlobalComponents.displayName = "GlobalComponents"
