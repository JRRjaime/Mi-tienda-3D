"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Wallet, DollarSign, CheckCircle } from "lucide-react"

interface PaymentMethod {
  type: "stripe" | "paypal" | "wallet"
  data?: any
}

interface PaymentMethodsProps {
  onSelect: (method: PaymentMethod) => void
  selectedMethod?: PaymentMethod | null
}

export function PaymentMethods({ onSelect, selectedMethod }: PaymentMethodsProps) {
  const [selected, setSelected] = useState<string>(selectedMethod?.type || "")

  const paymentOptions = [
    {
      id: "stripe",
      name: "Tarjeta de Crédito/Débito",
      description: "Visa, Mastercard, American Express",
      icon: CreditCard,
      color: "from-blue-500 to-indigo-600",
      popular: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Paga con tu cuenta de PayPal",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-600",
      popular: false,
    },
    {
      id: "wallet",
      name: "Cartera Digital",
      description: "Usa tu saldo de la plataforma",
      icon: Wallet,
      color: "from-green-500 to-emerald-600",
      popular: false,
    },
  ]

  const handleSelect = (methodType: string) => {
    setSelected(methodType)
    onSelect({ type: methodType as "stripe" | "paypal" | "wallet" })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-green-200 dark:border-green-700">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Método de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selected} onValueChange={handleSelect} className="space-y-4">
            {paymentOptions.map((option) => {
              const Icon = option.icon
              const isSelected = selected === option.id

              return (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-green-300"
                  }`}
                  onClick={() => handleSelect(option.id)}
                >
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value={option.id} id={option.id} />

                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center text-white`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={option.id} className="font-semibold cursor-pointer">
                          {option.name}
                        </Label>
                        {option.popular && (
                          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">Popular</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{option.description}</p>
                    </div>

                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500">
                        <CheckCircle className="h-6 w-6" />
                      </motion.div>
                    )}
                  </div>

                  {/* Información adicional para cada método */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-green-200 dark:border-green-700"
                    >
                      {option.id === "stripe" && (
                        <div className="space-y-2">
                          <p className="text-sm text-green-700 dark:text-green-300">
                            ✅ Pago seguro con encriptación SSL
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">✅ Procesamiento instantáneo</p>
                          <p className="text-sm text-green-700 dark:text-green-300">✅ Soporte para 3D Secure</p>
                        </div>
                      )}

                      {option.id === "paypal" && (
                        <div className="space-y-2">
                          <p className="text-sm text-green-700 dark:text-green-300">✅ Protección del comprador</p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            ✅ No compartimos tu información financiera
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">✅ Pago rápido con un clic</p>
                        </div>
                      )}

                      {option.id === "wallet" && (
                        <div className="space-y-2">
                          <p className="text-sm text-green-700 dark:text-green-300">✅ Saldo disponible: $150.00</p>
                          <p className="text-sm text-green-700 dark:text-green-300">✅ Sin comisiones adicionales</p>
                          <p className="text-sm text-green-700 dark:text-green-300">✅ Transacción instantánea</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </RadioGroup>

          {selected && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <Button
                onClick={() => onSelect({ type: selected as "stripe" | "paypal" | "wallet" })}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3"
              >
                Continuar con {paymentOptions.find((p) => p.id === selected)?.name}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
