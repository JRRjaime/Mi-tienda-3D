"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Truck, Mail, Home, Sparkles } from "lucide-react"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const [orderNumber] = useState(() => Math.random().toString(36).substr(2, 9).toUpperCase())

  useEffect(() => {
    // Confetti effect
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Simular confetti (en una implementación real usarías canvas-confetti)
      console.log(`🎉 Confetti particles: ${Math.floor(particleCount)}`)
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-200 dark:border-green-700 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle className="h-10 w-10 text-white" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <CardTitle className="text-3xl font-bold text-green-800 dark:text-green-200 mb-2">
                ¡Pedido Confirmado!
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">Tu pedido ha sido procesado exitosamente</p>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Número de Pedido */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Número de Pedido</p>
                  <p className="text-xl font-bold text-blue-800 dark:text-blue-200">#{orderNumber}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </motion.div>

            {/* Próximos Pasos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                ¿Qué sigue?
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <Mail className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">Confirmación por Email</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Recibirás un email con los detalles de tu pedido
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                  <Package className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-800 dark:text-orange-200">Preparación</p>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Comenzaremos a procesar tu pedido en las próximas 24 horas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <Truck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Envío</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Entrega estimada: 3-5 días hábiles</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Botones de Acción */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-3 pt-4"
            >
              <Button
                onClick={() => router.push("/pedidos")}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Package className="h-4 w-4 mr-2" />
                Ver Mis Pedidos
              </Button>

              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Home className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </motion.div>

            {/* Mensaje de Agradecimiento */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-600 dark:text-gray-400">¡Gracias por tu compra! 🎉</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Si tienes alguna pregunta, no dudes en contactarnos
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
