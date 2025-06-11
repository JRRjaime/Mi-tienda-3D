"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, Lock, Eye, EyeOff, Shield, CheckCircle } from "lucide-react"

interface CreditCardFormProps {
  onSuccess: (amount: number) => void
  onCancel: () => void
}

interface CardData {
  number: string
  name: string
  expiry: string
  cvv: string
  zipCode: string
}

export function CreditCardForm({ onSuccess, onCancel }: CreditCardFormProps) {
  const [amount, setAmount] = useState("")
  const [cardData, setCardData] = useState<CardData>({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    zipCode: "",
  })
  const [showCvv, setShowCvv] = useState(false)
  const [saveCard, setSaveCard] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Partial<CardData>>({})
  const { toast } = useToast()

  // Detectar tipo de tarjeta
  const getCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, "")
    if (cleanNumber.startsWith("4")) return { type: "visa", color: "bg-blue-600" }
    if (cleanNumber.startsWith("5") || cleanNumber.startsWith("2")) return { type: "mastercard", color: "bg-red-600" }
    if (cleanNumber.startsWith("3")) return { type: "amex", color: "bg-green-600" }
    if (cleanNumber.startsWith("6")) return { type: "discover", color: "bg-orange-600" }
    return { type: "unknown", color: "bg-gray-600" }
  }

  // Validar número de tarjeta usando algoritmo de Luhn
  const validateCardNumber = (number: string) => {
    const cleanNumber = number.replace(/\s/g, "")
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return false

    let sum = 0
    let isEven = false

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = Number.parseInt(cleanNumber[i])

      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  }

  // Formatear número de tarjeta
  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\s/g, "")
    const groups = cleanValue.match(/.{1,4}/g) || []
    return groups.join(" ").substr(0, 19)
  }

  // Formatear fecha de expiración
  const formatExpiry = (value: string) => {
    const cleanValue = value.replace(/\D/g, "")
    if (cleanValue.length >= 2) {
      return cleanValue.substr(0, 2) + "/" + cleanValue.substr(2, 2)
    }
    return cleanValue
  }

  // Validar fecha de expiración
  const validateExpiry = (expiry: string) => {
    const [month, year] = expiry.split("/")
    if (!month || !year || month.length !== 2 || year.length !== 2) return false

    const monthNum = Number.parseInt(month)
    const yearNum = Number.parseInt("20" + year)
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    if (monthNum < 1 || monthNum > 12) return false
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) return false

    return true
  }

  // Manejar cambios en los inputs
  const handleInputChange = (field: keyof CardData, value: string) => {
    let formattedValue = value

    if (field === "number") {
      formattedValue = formatCardNumber(value)
    } else if (field === "expiry") {
      formattedValue = formatExpiry(value)
    } else if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").substr(0, 4)
    } else if (field === "zipCode") {
      formattedValue = value.replace(/\D/g, "").substr(0, 5)
    }

    setCardData((prev) => ({ ...prev, [field]: formattedValue }))

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors: Partial<CardData> = {}

    if (!validateCardNumber(cardData.number)) {
      newErrors.number = "Número de tarjeta inválido"
    }

    if (cardData.name.length < 2) {
      newErrors.name = "Nombre requerido"
    }

    if (!validateExpiry(cardData.expiry)) {
      newErrors.expiry = "Fecha de expiración inválida"
    }

    if (cardData.cvv.length < 3) {
      newErrors.cvv = "CVV inválido"
    }

    if (cardData.zipCode.length !== 5) {
      newErrors.zipCode = "Código postal inválido"
    }

    const amountNum = Number.parseFloat(amount)
    if (!amountNum || amountNum < 5 || amountNum > 1000) {
      toast({
        title: "Cantidad inválida",
        description: "La cantidad debe estar entre $5 y $1000",
        variant: "destructive",
      })
      return false
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Procesar pago
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsProcessing(true)

    try {
      // Simular procesamiento de pago
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simular 90% de éxito
      if (Math.random() > 0.1) {
        toast({
          title: "¡Pago exitoso!",
          description: `Se han añadido $${amount} a tu cartera`,
        })
        onSuccess(Number.parseFloat(amount))
      } else {
        throw new Error("Pago rechazado")
      }
    } catch (error) {
      toast({
        title: "Error en el pago",
        description: "Tu tarjeta fue rechazada. Intenta con otra tarjeta.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const cardType = getCardType(cardData.number)

  return (
    <div className="space-y-6">
      {/* Vista previa de la tarjeta */}
      <div className="relative">
        <div className={`w-full h-48 rounded-xl ${cardType.color} text-white p-6 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <CreditCard className="w-8 h-8" />
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {cardType.type.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="text-xl font-mono tracking-wider">{cardData.number || "•••• •••• •••• ••••"}</div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs opacity-70">TITULAR</div>
                  <div className="font-medium">{cardData.name || "NOMBRE APELLIDO"}</div>
                </div>
                <div>
                  <div className="text-xs opacity-70">VENCE</div>
                  <div className="font-medium">{cardData.expiry || "MM/YY"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cantidad a añadir */}
        <div className="space-y-2">
          <Label htmlFor="amount">Cantidad a añadir</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-8"
              min="5"
              max="1000"
              step="0.01"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">Mínimo $5, máximo $1000</p>
        </div>

        <Separator />

        {/* Información de la tarjeta */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Información de la tarjeta</span>
          </div>

          {/* Número de tarjeta */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número de tarjeta</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardData.number}
              onChange={(e) => handleInputChange("number", e.target.value)}
              className={errors.number ? "border-red-500" : ""}
              maxLength={19}
            />
            {errors.number && <p className="text-xs text-red-500">{errors.number}</p>}
          </div>

          {/* Nombre del titular */}
          <div className="space-y-2">
            <Label htmlFor="cardName">Nombre del titular</Label>
            <Input
              id="cardName"
              placeholder="Juan Pérez"
              value={cardData.name}
              onChange={(e) => handleInputChange("name", e.target.value.toUpperCase())}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Fecha y CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Fecha de expiración</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={cardData.expiry}
                onChange={(e) => handleInputChange("expiry", e.target.value)}
                className={errors.expiry ? "border-red-500" : ""}
                maxLength={5}
              />
              {errors.expiry && <p className="text-xs text-red-500">{errors.expiry}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <div className="relative">
                <Input
                  id="cvv"
                  type={showCvv ? "text" : "password"}
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value)}
                  className={errors.cvv ? "border-red-500" : ""}
                  maxLength={4}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowCvv(!showCvv)}
                >
                  {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
            </div>
          </div>

          {/* Código postal */}
          <div className="space-y-2">
            <Label htmlFor="zipCode">Código postal</Label>
            <Input
              id="zipCode"
              placeholder="12345"
              value={cardData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              className={errors.zipCode ? "border-red-500" : ""}
              maxLength={5}
            />
            {errors.zipCode && <p className="text-xs text-red-500">{errors.zipCode}</p>}
          </div>

          {/* Guardar tarjeta */}
          <div className="flex items-center space-x-2">
            <Switch id="saveCard" checked={saveCard} onCheckedChange={setSaveCard} />
            <Label htmlFor="saveCard" className="text-sm">
              Guardar esta tarjeta para futuros pagos
            </Label>
          </div>
        </div>

        <Separator />

        {/* Información de seguridad */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Pago seguro</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Tu información está protegida con encriptación SSL de 256 bits. No almacenamos los datos de tu tarjeta.
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isProcessing}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={isProcessing}>
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Añadir ${amount || "0.00"}
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
