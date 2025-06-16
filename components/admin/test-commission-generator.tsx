"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePlatformCommission } from "@/contexts/platform-commission-context"
import { ShoppingCart, Plus } from "lucide-react"

export function TestCommissionGenerator() {
  const { addCommission } = usePlatformCommission()
  const [isGenerating, setIsGenerating] = useState(false)

  const generateTestCommission = async () => {
    setIsGenerating(true)

    // Datos de prueba aleatorios
    const testUsers = ["Juan Pérez", "María García", "Carlos López", "Ana Martínez", "Luis Rodríguez"]
    const testProducts = [
      { name: "Figura de Goku", creator: "AnimeCreator3D" },
      { name: "Vaso Geométrico", creator: "DesignMaster" },
      { name: "Engranaje Industrial", creator: "TechParts3D" },
      { name: "Organizador de Escritorio", creator: "OfficeDesigns" },
      { name: "Anillo Personalizado", creator: "JewelryArt" },
    ]

    const randomUser = testUsers[Math.floor(Math.random() * testUsers.length)]
    const randomProduct = testProducts[Math.floor(Math.random() * testProducts.length)]
    const randomAmount = Math.floor(Math.random() * 100) + 20 // Entre $20 y $120

    const testCommission = {
      orderId: `order_${Date.now()}`,
      userId: `user_${Math.floor(Math.random() * 1000)}`,
      userName: randomUser,
      amount: randomAmount,
      productInfo: {
        productId: `prod_${Math.floor(Math.random() * 1000)}`,
        productName: randomProduct.name,
        creatorId: `creator_${Math.floor(Math.random() * 100)}`,
        creatorName: randomProduct.creator,
      },
    }

    addCommission(testCommission)

    setTimeout(() => {
      setIsGenerating(false)
    }, 1000)
  }

  const generateMultipleCommissions = async () => {
    setIsGenerating(true)

    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      await generateTestCommission()
    }

    setIsGenerating(false)
  }

  return (
    <Card className="bg-gray-800 border-gray-700 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Generador de Comisiones de Prueba
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-400 text-sm">Genera comisiones de prueba para ver cómo funciona el sistema</p>
        <div className="flex gap-3">
          <Button onClick={generateTestCommission} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            {isGenerating ? "Generando..." : "Generar 1 Comisión"}
          </Button>
          <Button onClick={generateMultipleCommissions} disabled={isGenerating} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Generar 5 Comisiones
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
