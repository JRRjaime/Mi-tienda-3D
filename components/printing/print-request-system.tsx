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
import { MapPin, Star, Clock, Package, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  {
    id: "3",
    name: "3D Solutions",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 4.8,
    reviews: 156,
    location: "Valencia, España",
    distance: "8.7 km",
    pricePerGram: 0.18,
    materials: ["PLA", "ABS", "PETG", "TPU", "Resina", "Metal Fill"],
    maxSize: "400x400x500mm",
    turnaround: "3-5 días",
    verified: true,
    online: true,
    completedOrders: 567,
  },
  {
    id: "4",
    name: "PrintMaster",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 4.6,
    reviews: 98,
    location: "Sevilla, España",
    distance: "12.4 km",
    pricePerGram: 0.1,
    materials: ["PLA", "ABS"],
    maxSize: "200x200x250mm",
    turnaround: "4-6 días",
    verified: false,
    online: true,
    completedOrders: 234,
  },
]

const materials = ["PLA", "ABS", "PETG", "TPU", "Nylon", "ASA", "PC", "Wood Fill", "Metal Fill", "Resina"]
const colors = ["Blanco", "Negro", "Rojo", "Azul", "Verde", "Amarillo", "Naranja", "Morado", "Rosa", "Gris"]
const qualities = [
  { value: "draft", label: "Borrador (0.3mm)", multiplier: 0.8 },
  { value: "normal", label: "Normal (0.2mm)", multiplier: 1.0 },
  { value: "fine", label: "Fino (0.15mm)", multiplier: 1.3 },
  { value: "ultra", label: "Ultra Fino (0.1mm)", multiplier: 1.6 },
]

export function PrintRequestSystem({ modelId, modelTitle, modelImage }: PrintRequestSystemProps) {
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterType | null>(null)
  const [printSettings, setPrintSettings] = useState({
    material: "",
    color: "",
    quality: "normal",
    quantity: 1,
    infill: 20,
    supports: false,
    notes: "",
  })
  const [estimatedWeight, setEstimatedWeight] = useState(25) // gramos estimados
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState("distance")
  const { toast } = useToast()

  const sortedPrinters = [...samplePrinters].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.pricePerGram - b.pricePerGram
      case "rating":
        return b.rating - a.rating
      case "turnaround":
        return Number.parseInt(a.turnaround) - Number.parseInt(b.turnaround)
      default: // distance
        return Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
    }
  })

  const calculatePrice = (printer: PrinterType) => {
    const basePrice = estimatedWeight * printer.pricePerGram * printSettings.quantity
    const qualityMultiplier = qualities.find((q) => q.value === printSettings.quality)?.multiplier || 1
    return (basePrice * qualityMultiplier).toFixed(2)
  }

  const handleSubmitRequest = async () => {
    if (!selectedPrinter || !printSettings.material || !printSettings.color) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "¡Solicitud enviada!",
        description: `Tu solicitud fue enviada a ${selectedPrinter.name}. Te contactarán pronto.`,
      })

      // Reset form
      setSelectedPrinter(null)
      setPrintSettings({
        material: "",
        color: "",
        quality: "normal",
        quantity: 1,
        infill: 20,
        supports: false,
        notes: "",
      })
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: "Hubo un problema enviando tu solicitud",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
          Solicitar Impresión 3D
        </h1>
        <p className="text-gray-400">Encuentra el impresor perfecto para tu modelo</p>
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
          {/* Filtros */}
          <div className="flex gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="distance" className="text-white hover:bg-gray-700">
                  Más Cercano
                </SelectItem>
                <SelectItem value="price" className="text-white hover:bg-gray-700">
                  Menor Precio
                </SelectItem>
                <SelectItem value="rating" className="text-white hover:bg-gray-700">
                  Mejor Valorado
                </SelectItem>
                <SelectItem value="turnaround" className="text-white hover:bg-gray-700">
                  Más Rápido
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Impresores */}
          <div className="space-y-4">
            {sortedPrinters.map((printer) => (
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
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          <span>{printer.completedOrders} pedidos</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {printer.materials.slice(0, 4).map((material) => (
                            <Badge key={material} variant="secondary" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                          {printer.materials.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{printer.materials.length - 4}
                            </Badge>
                          )}
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
              <CardTitle className="text-white">Configuración de Impresión</CardTitle>
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
                <Label htmlFor="quality" className="text-gray-300">
                  Calidad
                </Label>
                <Select
                  value={printSettings.quality}
                  onValueChange={(value) => setPrintSettings((prev) => ({ ...prev, quality: value }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {qualities.map((quality) => (
                      <SelectItem key={quality.value} value={quality.value} className="text-white hover:bg-gray-700">
                        {quality.label}
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
                  max="100"
                  value={printSettings.quantity}
                  onChange={(e) =>
                    setPrintSettings((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="infill" className="text-gray-300">
                  Relleno (%)
                </Label>
                <Input
                  id="infill"
                  type="number"
                  min="0"
                  max="100"
                  value={printSettings.infill}
                  onChange={(e) =>
                    setPrintSettings((prev) => ({ ...prev, infill: Number.parseInt(e.target.value) || 20 }))
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="supports"
                  checked={printSettings.supports}
                  onChange={(e) => setPrintSettings((prev) => ({ ...prev, supports: e.target.checked }))}
                  className="rounded border-gray-600 bg-gray-700"
                />
                <Label htmlFor="supports" className="text-gray-300">
                  Requiere soportes
                </Label>
              </div>

              <div>
                <Label htmlFor="notes" className="text-gray-300">
                  Notas adicionales
                </Label>
                <Textarea
                  id="notes"
                  value={printSettings.notes}
                  onChange={(e) => setPrintSettings((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Instrucciones especiales, preferencias de acabado, etc."
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumen */}
          {selectedPrinter && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Resumen del Pedido</CardTitle>
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

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Material:</span>
                    <span className="text-white">{printSettings.material || "No seleccionado"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Color:</span>
                    <span className="text-white">{printSettings.color || "No seleccionado"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Calidad:</span>
                    <span className="text-white">
                      {qualities.find((q) => q.value === printSettings.quality)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Cantidad:</span>
                    <span className="text-white">{printSettings.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tiempo estimado:</span>
                    <span className="text-white">{selectedPrinter.turnaround}</span>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Precio Total:</span>
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
