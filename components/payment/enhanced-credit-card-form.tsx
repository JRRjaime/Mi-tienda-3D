"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Building2 } from "lucide-react"
import { StripePaymentForm } from "./stripe-payment-form"

interface EnhancedCreditCardFormProps {
  onSuccess: (amount: number) => void
  onCancel: () => void
}

export function EnhancedCreditCardForm({ onSuccess, onCancel }: EnhancedCreditCardFormProps) {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "bank_transfer" | "">("")
  const { toast } = useToast()

  const handleBankTransfer = async () => {
    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum < 5 || amountNum > 1000) {
      toast({
        title: "Cantidad inválida",
        description: "La cantidad debe estar entre $5 y $1000",
        variant: "destructive",
      })
      return
    }

    // Simular transferencia bancaria
    toast({
      title: "Transferencia iniciada",
      description: "Te hemos enviado las instrucciones por email. Los fondos estarán disponibles en 1-3 días hábiles.",
    })

    // En una implementación real, aquí generarías las instrucciones de transferencia
    onCancel()
  }

  const amountNum = Number.parseFloat(amount)
  const isValidAmount = !isNaN(amountNum) && amountNum >= 5 && amountNum <= 1000

  return (
    <div className="space-y-6">
      {/* Selección de cantidad */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Cantidad a Añadir</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount" className="text-white">
              Cantidad (USD)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 bg-white/5 border-white/20 text-white"
                min="5"
                max="1000"
                step="0.01"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Mínimo $5.00, máximo $1,000.00</p>
          </div>

          {/* Cantidades sugeridas */}
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 100, 250].map((suggestedAmount) => (
              <Button
                key={suggestedAmount}
                variant="outline"
                size="sm"
                onClick={() => setAmount(suggestedAmount.toString())}
                className="border-white/20 text-white hover:bg-white/10"
              >
                ${suggestedAmount}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métodos de pago */}
      {isValidAmount && (
        <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stripe">Tarjeta</TabsTrigger>
            <TabsTrigger value="bank_transfer">Transferencia</TabsTrigger>
          </TabsList>

          <TabsContent value="stripe" className="space-y-4">
            <StripePaymentForm amount={amountNum} onSuccess={onSuccess} onCancel={onCancel} />
          </TabsContent>

          <TabsContent value="bank_transfer" className="space-y-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Transferencia Bancaria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold text-sm mb-2">Información Importante</h4>
                  <ul className="text-blue-300 text-xs space-y-1">
                    <li>• Los fondos estarán disponibles en 1-3 días hábiles</li>
                    <li>• Recibirás las instrucciones por email</li>
                    <li>• Sin comisiones adicionales</li>
                    <li>• Transferencia segura y verificada</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleBankTransfer} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500">
                    Continuar con Transferencia
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
