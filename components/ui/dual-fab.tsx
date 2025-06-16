"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, BarChart3, TrendingUp, MessageCircle, X, ShoppingCart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEnhancedCart } from "@/contexts/enhanced-cart-context"

export function DualFAB() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)

  // Simular datos de chat (esto vendría del contexto real)
  // const unreadMessages = 3

  const { items } = useEnhancedCart()
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleChatClick = () => {
    setIsChatOpen(true)
    setIsExpanded(false)
    setUnreadMessages(0) // Clear unread messages when opening chat
  }

  const handleAnalyticsClick = () => {
    setIsExpanded(false)
  }

  const closeChatSystem = () => {
    setIsChatOpen(false)
  }

  const simulateNewMessage = () => {
    setUnreadMessages((prev) => prev + 1)
  }

  return (
    <>
      {/* Sistema de Chat Integrado */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
          <div className="fixed bottom-6 right-6 w-[420px] h-[600px] bg-gray-900/95 backdrop-blur-sm border border-white/10 shadow-xl rounded-xl overflow-hidden">
            {/* Header del Chat */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-500 to-blue-500">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-white" />
                <span className="font-medium text-white">Chat Sistema</span>
                {unreadMessages > 0 && (
                  <Badge className="bg-red-500 text-white">{unreadMessages > 99 ? "99+" : unreadMessages}</Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeChatSystem}
                className="text-white hover:bg-white/10 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Contenido del Chat */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-white font-bold text-lg mb-2">¡Sistema de Chat! 🎉</h3>
                <p className="text-gray-400 mb-4">
                  El chat está funcionando perfectamente.
                  <br />
                  ¡Conecta con otros usuarios ahora! 🚀
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <span>🛒</span>
                    <span>Chatea con vendedores</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>👥</span>
                    <span>Conecta con creadores</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>🎨</span>
                    <span>Colabora en proyectos</span>
                  </div>
                </div>
                <Button
                  className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500"
                  onClick={() => {
                    // Aquí se integraría con el sistema de chat real
                    console.log("🎉 Iniciando nuevo chat...")
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Iniciar Chat
                </Button>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    closeChatSystem()
                    setTimeout(() => simulateNewMessage(), 1000) // Simulate new message after closing
                  }}
                >
                  Simular Mensaje Nuevo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón Principal Flotante */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Botones Secundarios */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col gap-3"
            >
              {/* Botón Analytics */}
              <motion.div
                initial={{ scale: 0, x: 20 }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0, x: 20 }}
                transition={{ delay: 0.15 }}
              >
                <Link href="/checkout">
                  <Button
                    size="lg"
                    onClick={handleAnalyticsClick}
                    className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 group relative"
                  >
                    <ShoppingCart className="h-5 w-5" />

                    {/* Badge del carrito */}
                    {cartItemCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center p-0 border-2 border-white">
                        {cartItemCount > 99 ? "99+" : cartItemCount}
                      </Badge>
                    )}

                    {/* Tooltip */}
                    <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      🛒 Carrito ({cartItemCount})
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-black/80 rotate-45" />
                    </div>
                  </Button>
                </Link>
              </motion.div>
              <Link href="/analytics">
                <motion.div
                  initial={{ scale: 0, x: 20 }}
                  animate={{ scale: 1, x: 0 }}
                  exit={{ scale: 0, x: 20 }}
                  transition={{ delay: 0.1 }}
                  onClick={handleAnalyticsClick}
                >
                  <Button
                    size="lg"
                    className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 group relative"
                  >
                    <BarChart3 className="h-5 w-5" />

                    {/* Tooltip */}
                    <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      📊 Analytics
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-black/80 rotate-45" />
                    </div>
                  </Button>
                </motion.div>
              </Link>

              {/* Botón Chat */}
              <motion.div
                initial={{ scale: 0, x: 20 }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0, x: 20 }}
                transition={{ delay: 0.05 }}
              >
                <Button
                  size="lg"
                  onClick={handleChatClick}
                  className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 group relative"
                >
                  <MessageSquare className="h-5 w-5" />

                  {/* Badge de mensajes no leídos */}
                  {unreadMessages > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center p-0 border-2 border-white">
                      {unreadMessages > 99 ? "99+" : unreadMessages}
                    </Badge>
                  )}

                  {/* Tooltip */}
                  <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    💬 Chat ({unreadMessages})
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-black/80 rotate-45" />
                  </div>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón Principal */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          <Button
            size="lg"
            onClick={toggleExpanded}
            className={`h-16 w-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group relative ${
              isExpanded
                ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            }`}
          >
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Badge combinado */}
            {!isExpanded && unreadMessages > 0 && (
              <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-xs flex items-center justify-center p-0 border-2 border-white">
                {unreadMessages > 99 ? "99+" : unreadMessages}
              </Badge>
            )}

            {/* Tooltip Principal */}
            {!isExpanded && (
              <div className="absolute right-18 top-1/2 -translate-y-1/2 bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                💬📊 Chat & Analytics
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-black/80 rotate-45" />
              </div>
            )}
          </Button>
        </motion.div>
      </div>
    </>
  )
}
