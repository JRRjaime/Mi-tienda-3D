"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Star, Clock, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PrinterType {
  id: string
  name: string
  avatar: string
  rating: number
  reviews: number
  location: string
  distance: string
  pricePerGram: number
  materials: string[]
  maxSize: string
  turnaround: string
  verified: boolean
  online: boolean
  completedOrders: number
}

interface PrintRequestSystemProps {
  modelId: string
  modelTitle: string
  modelImage: string
}

const samplePrinters: PrinterType[] = [
  {
    id: "1",
    name: "TechPrint Pro",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 4.9,
    reviews: 234,
    location: "Madrid, España",
    distance: "2.3 km",
    pricePerGram: 0.15,
    materials: ["PLA", "ABS", "PETG", "TPU", "Nylon"],
    maxSize: "300x300x400mm",
    turnaround: "2-3 días",
    verified: true,
    online: true,
    completedOrders: 1250,
  },
  {
    id: "2",
    name: "Impresiones Rápidas",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 4.7,
    reviews: 189,
    location: "Barcelona, España",
    distance: "5.1 km",
    pricePerGram: 0.12,
    materials: ["PLA", "ABS", "PETG", "Wood Fill"],
    maxSize: "250x250x300mm",
    turnaround: "1-2 días",
    verified: true,
    online: false,
    completedOrders: 892,
  },
]

const materials = ["PLA", "ABS", "PETG", "TPU", "Nylon"]
const colors = ["Blanco", "Negro", "Rojo", "Azul", "Verde"]
const qualities = [
  { value: "normal", label: "Normal (0.2mm)", multiplier: 1.0 },
  { value: "fine", label: "Fino (0.15mm)", multiplier: 1.3 },
]

export function PrintRequestSystem({ modelId, modelTitle, modelImage }: PrintRequestSystemProps) {
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterType | null>(null)
  const [printSettings, setPrintSettings] = useState({
    material: "",
    color: "",
    quality: "normal",
    quantity: 1,
    notes: "",
  })
  const [estimatedWeight] = useState(25)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculatePrice = (printer: PrinterType) => {
    const basePrice = estimatedWeight * printer.pricePerGram * printSettings.quantity
    const qualityMultiplier = qualities.find((q) => q.value === printSettings.quality)?.multiplier || 1
    return (basePrice * qualityMultiplier).toFixed(2)
  }

  const handleSubmitRequest = () => {
    if (!selectedPrinter || !printSettings.material || !printSettings.color) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      alert(`Solicitud enviada a ${selectedPrinter.name}`)
      setIsSubmitting(false)
    }, 2000)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/modelos">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Solicitar Impresión 3D
          </h1>
          <p className="text-gray-400">Encuentra el impresor perfecto para tu modelo</p>
        </div>
      </div>

      {/* Modelo a imprimir */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <img
              src={modelImage || "/placeholder.svg"}
              alt={modelTitle}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-white font-semibold">{modelTitle}</h3>
              <p className="text-gray-400 text-sm">Peso estimado: {estimatedWeight}g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Impresores */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            {samplePrinters.map((printer) => (
              <Card
                key={printer.id}
                className={`bg-gray-800/50 border-gray-700 cursor-pointer transition-all ${
                  selectedPrinter?.id === printer.id ? "ring-2 ring-cyan-500 bg-gray-800/70" : "hover:bg-gray-800/60"
                }`}
                onClick={() => setSelectedPrinter(printer)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={printer.avatar || "/placeholder.svg"}
                        alt={printer.name}
                        className="w-12 h-12 rounded-full"
                      />
                      {printer.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{printer.name}</h3>
                        {printer.verified && <Badge className="bg-blue-600 text-xs">Verificado</Badge>}
                        {printer.online && <Badge className="bg-green-600 text-xs">En línea</Badge>}
                      </div>

                      <div className="flex items-center gap-4 mb-2 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{printer.rating}</span>
                          <span>({printer.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{printer.location}</span>
                          <span>• {printer.distance}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {printer.materials.slice(0, 3).map((material) => (
                            <Badge key={material} variant="secondary" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-bold">${calculatePrice(printer)}</div>
                          <div className="text-xs text-gray-400">
                            ${printer.pricePerGram}/g • {printer.turnaround}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Configuración de Impresión */}
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="material" className="text-gray-300">
                  Material *
                </Label>
                <Select
                  value={printSettings.material}
                  onValueChange={(value) => setPrintSettings((prev) => ({ ...prev, material: value }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecciona material" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {materials.map((material) => (
                      <SelectItem key={material} value={material} className="text-white hover:bg-gray-700">
                        {material}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color" className="text-gray-300">
                  Color *
                </Label>
                <Select
                  value={printSettings.color}
                  onValueChange={(value) => setPrintSettings((prev) => ({ ...prev, color: value }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecciona color" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {colors.map((color) => (
                      <SelectItem key={color} value={color} className="text-white hover:bg-gray-700">
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity" className="text-gray-300">
                  Cantidad
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="10"
                  value={printSettings.quantity}
                  onChange={(e) =>
                    setPrintSettings((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-gray-300">
                  Notas
                </Label>
                <Textarea
                  id="notes"
                  value={printSettings.notes}
                  onChange={(e) => setPrintSettings((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Instrucciones especiales..."
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumen */}
          {selectedPrinter && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPrinter.avatar || "/placeholder.svg"}
                    alt={selectedPrinter.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">{selectedPrinter.name}</p>
                    <p className="text-gray-400 text-sm">{selectedPrinter.location}</p>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-cyan-400 font-bold text-lg">${calculatePrice(selectedPrinter)}</span>
                </div>

                <Button
                  onClick={handleSubmitRequest}
                  disabled={isSubmitting || !printSettings.material || !printSettings.color}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Enviar Solicitud
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
