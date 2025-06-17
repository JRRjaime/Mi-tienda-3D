"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, MapPin, User, Mail } from "lucide-react"
import type { ShippingAddress } from "@/contexts/enhanced-cart-context"

interface ShippingFormProps {
  initialData?: ShippingAddress | null
  onSubmit: (address: ShippingAddress) => void
}

export function ShippingForm({ initialData, onSubmit }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zipCode: initialData?.zipCode || "",
    country: initialData?.country || "México",
  })

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({})

  const validateForm = () => {
    const newErrors: Partial<ShippingAddress> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Nombre completo requerido"
    if (!formData.email.trim()) newErrors.email = "Email requerido"
    if (!formData.phone.trim()) newErrors.phone = "Teléfono requerido"
    if (!formData.address.trim()) newErrors.address = "Dirección requerida"
    if (!formData.city.trim()) newErrors.city = "Ciudad requerida"
    if (!formData.state.trim()) newErrors.state = "Estado requerido"
    if (!formData.zipCode.trim()) newErrors.zipCode = "Código postal requerido"

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-blue-200 dark:border-blue-700">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Información de Envío
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                <User className="h-4 w-4" />
                Información Personal
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre Completo *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Juan Pérez"
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+52 55 1234 5678"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="juan@ejemplo.com"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
            </div>

            {/* Dirección */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                <MapPin className="h-4 w-4" />
                Dirección de Entrega
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección Completa *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Calle, número, colonia"
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Ciudad de México"
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">Código Postal *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    placeholder="01000"
                    className={errors.zipCode ? "border-red-500" : ""}
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {/* España */}
                    <SelectItem value="España">🇪🇸 España</SelectItem>

                    {/* Norteamérica */}
                    <SelectItem value="Estados Unidos">🇺🇸 Estados Unidos</SelectItem>
                    <SelectItem value="Canadá">🇨🇦 Canadá</SelectItem>
                    <SelectItem value="México">🇲🇽 México</SelectItem>

                    {/* Unión Europea */}
                    <SelectItem value="Alemania">🇩🇪 Alemania</SelectItem>
                    <SelectItem value="Francia">🇫🇷 Francia</SelectItem>
                    <SelectItem value="Italia">🇮🇹 Italia</SelectItem>
                    <SelectItem value="Países Bajos">🇳🇱 Países Bajos</SelectItem>
                    <SelectItem value="Polonia">🇵🇱 Polonia</SelectItem>
                    <SelectItem value="Bélgica">🇧🇪 Bélgica</SelectItem>
                    <SelectItem value="Austria">🇦🇹 Austria</SelectItem>
                    <SelectItem value="Suecia">🇸🇪 Suecia</SelectItem>
                    <SelectItem value="Dinamarca">🇩🇰 Dinamarca</SelectItem>
                    <SelectItem value="Finlandia">🇫🇮 Finlandia</SelectItem>
                    <SelectItem value="Irlanda">🇮🇪 Irlanda</SelectItem>
                    <SelectItem value="Portugal">🇵🇹 Portugal</SelectItem>
                    <SelectItem value="República Checa">🇨🇿 República Checa</SelectItem>
                    <SelectItem value="Hungría">🇭🇺 Hungría</SelectItem>
                    <SelectItem value="Grecia">🇬🇷 Grecia</SelectItem>
                    <SelectItem value="Rumania">🇷🇴 Rumania</SelectItem>
                    <SelectItem value="Bulgaria">🇧🇬 Bulgaria</SelectItem>
                    <SelectItem value="Croacia">🇭🇷 Croacia</SelectItem>
                    <SelectItem value="Eslovaquia">🇸🇰 Eslovaquia</SelectItem>
                    <SelectItem value="Eslovenia">🇸🇮 Eslovenia</SelectItem>
                    <SelectItem value="Estonia">🇪🇪 Estonia</SelectItem>
                    <SelectItem value="Letonia">🇱🇻 Letonia</SelectItem>
                    <SelectItem value="Lituania">🇱🇹 Lituania</SelectItem>
                    <SelectItem value="Luxemburgo">🇱🇺 Luxemburgo</SelectItem>
                    <SelectItem value="Malta">🇲🇹 Malta</SelectItem>
                    <SelectItem value="Chipre">🇨🇾 Chipre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nota informativa */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Los envíos físicos están disponibles para estos países. Los productos digitales se entregan
                  instantáneamente sin restricciones geográficas.
                </p>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3"
              >
                Continuar al Pago
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
