"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  Calculator,
  Clock,
  Zap,
  Wrench,
  DollarSign,
  TrendingUp,
  Settings,
  Save,
  Download,
  Share2,
  AlertCircle,
  CheckCircle,
  Info,
  Printer,
  Package,
} from "lucide-react"
import Image from "next/image"

interface Material {
  id: string
  name: string
  type: string
  density: number // g/cm³
  pricePerKg: number
  color: string
  properties: {
    strength: number
    flexibility: number
    detail: number
    temperature: number
  }
}

interface PrinterProfile {
  id: string
  name: string
  model: string
  powerConsumption: number // watts
  maxBuildVolume: { x: number; y: number; z: number }
  nozzleDiameter: number
  layerHeight: { min: number; max: number }
  printSpeed: { min: number; max: number }
  maintenanceCostPerHour: number
  depreciationPerHour: number
}

interface CostBreakdown {
  material: number
  electricity: number
  maintenance: number
  depreciation: number
  labor: number
  profit: number
  total: number
}

const materials: Material[] = [
  {
    id: "pla",
    name: "PLA",
    type: "Termoplástico",
    density: 1.24,
    pricePerKg: 25,
    color: "#4CAF50",
    properties: { strength: 6, flexibility: 4, detail: 8, temperature: 5 },
  },
  {
    id: "abs",
    name: "ABS",
    type: "Termoplástico",
    density: 1.04,
    pricePerKg: 28,
    color: "#FF9800",
    properties: { strength: 8, flexibility: 7, detail: 6, temperature: 8 },
  },
  {
    id: "petg",
    name: "PETG",
    type: "Termoplástico",
    density: 1.27,
    pricePerKg: 32,
    color: "#2196F3",
    properties: { strength: 7, flexibility: 6, detail: 7, temperature: 7 },
  },
  {
    id: "tpu",
    name: "TPU",
    type: "Flexible",
    density: 1.2,
    pricePerKg: 45,
    color: "#9C27B0",
    properties: { strength: 5, flexibility: 10, detail: 5, temperature: 6 },
  },
  {
    id: "wood",
    name: "Wood Fill",
    type: "Compuesto",
    density: 1.28,
    pricePerKg: 38,
    color: "#8D6E63",
    properties: { strength: 5, flexibility: 3, detail: 7, temperature: 4 },
  },
  {
    id: "carbon",
    name: "Carbon Fiber",
    type: "Compuesto",
    density: 1.3,
    pricePerKg: 85,
    color: "#424242",
    properties: { strength: 10, flexibility: 2, detail: 8, temperature: 9 },
  },
]

const printerProfiles: PrinterProfile[] = [
  {
    id: "ender3",
    name: "Ender 3 V2",
    model: "Creality",
    powerConsumption: 270,
    maxBuildVolume: { x: 220, y: 220, z: 250 },
    nozzleDiameter: 0.4,
    layerHeight: { min: 0.1, max: 0.3 },
    printSpeed: { min: 30, max: 100 },
    maintenanceCostPerHour: 0.15,
    depreciationPerHour: 0.08,
  },
  {
    id: "prusa",
    name: "Prusa i3 MK3S+",
    model: "Prusa Research",
    powerConsumption: 120,
    maxBuildVolume: { x: 250, y: 210, z: 210 },
    nozzleDiameter: 0.4,
    layerHeight: { min: 0.05, max: 0.35 },
    printSpeed: { min: 20, max: 200 },
    maintenanceCostPerHour: 0.12,
    depreciationPerHour: 0.15,
  },
  {
    id: "ultimaker",
    name: "Ultimaker S3",
    model: "Ultimaker",
    powerConsumption: 221,
    maxBuildVolume: { x: 230, y: 190, z: 200 },
    nozzleDiameter: 0.4,
    layerHeight: { min: 0.06, max: 0.2 },
    printSpeed: { min: 20, max: 300 },
    maintenanceCostPerHour: 0.25,
    depreciationPerHour: 0.35,
  },
]

export function CostCalculator() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(materials[0])
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterProfile>(printerProfiles[0])
  const [modelSpecs, setModelSpecs] = useState({
    volume: 15, // cm³
    weight: 18.6, // gramos
    printTime: 4.5, // horas
    infill: 20, // porcentaje
    layerHeight: 0.2, // mm
    supports: false,
    quantity: 1,
  })
  const [costSettings, setCostSettings] = useState({
    electricityCostPerKwh: 0.15, // €/kWh
    laborCostPerHour: 12, // €/hora
    profitMargin: 25, // porcentaje
    rushOrderMultiplier: 1.5,
    isRushOrder: false,
  })
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown>({
    material: 0,
    electricity: 0,
    maintenance: 0,
    depreciation: 0,
    labor: 0,
    profit: 0,
    total: 0,
  })

  // Calcular costos automáticamente cuando cambien los parámetros
  useEffect(() => {
    calculateCosts()
  }, [selectedMaterial, selectedPrinter, modelSpecs, costSettings])

  const calculateCosts = () => {
    const { volume, weight, printTime, infill, quantity } = modelSpecs
    const { electricityCostPerKwh, laborCostPerHour, profitMargin, rushOrderMultiplier, isRushOrder } = costSettings

    // Costo de material
    const materialWeight = weight * (infill / 100) * quantity
    const materialCost = (materialWeight / 1000) * selectedMaterial.pricePerKg

    // Costo de electricidad
    const powerConsumptionKw = selectedPrinter.powerConsumption / 1000
    const electricityCost = powerConsumptionKw * printTime * electricityCostPerKwh * quantity

    // Costo de mantenimiento
    const maintenanceCost = selectedPrinter.maintenanceCostPerHour * printTime * quantity

    // Depreciación del equipo
    const depreciationCost = selectedPrinter.depreciationPerHour * printTime * quantity

    // Costo de mano de obra (tiempo de preparación + supervisión)
    const laborTime = printTime * 0.2 + 0.5 // 20% del tiempo de impresión + 30 min setup
    const laborCost = laborTime * laborCostPerHour * quantity

    // Subtotal antes de ganancia
    const subtotal = materialCost + electricityCost + maintenanceCost + depreciationCost + laborCost

    // Ganancia
    const profit = subtotal * (profitMargin / 100)

    // Total
    let total = subtotal + profit

    // Aplicar multiplicador de urgencia si es necesario
    if (isRushOrder) {
      total *= rushOrderMultiplier
    }

    setCostBreakdown({
      material: materialCost,
      electricity: electricityCost,
      maintenance: maintenanceCost,
      depreciation: depreciationCost,
      labor: laborCost,
      profit: profit,
      total: total,
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const getPropertyColor = (value: number) => {
    if (value >= 8) return "text-green-400"
    if (value >= 6) return "text-yellow-400"
    return "text-red-400"
  }

  const exportCalculation = () => {
    const data = {
      material: selectedMaterial.name,
      printer: selectedPrinter.name,
      specs: modelSpecs,
      costs: costBreakdown,
      settings: costSettings,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `calculo-costos-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header con imagen */}
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-8">
        <Image src="/images/cost-calculator-hero.png" alt="Calculadora de costos" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Calculator className="h-8 w-8" />
              Calculadora de Costos Avanzada
            </h1>
            <p className="text-gray-200">Calcula el costo exacto de tus impresiones 3D</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de configuración */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="model" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="model">Modelo</TabsTrigger>
              <TabsTrigger value="material">Material</TabsTrigger>
              <TabsTrigger value="printer">Impresora</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>

            {/* Especificaciones del modelo */}
            <TabsContent value="model">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Especificaciones del Modelo
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Define las características del modelo a imprimir
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Volumen (cm³)</Label>
                      <Input
                        type="number"
                        value={modelSpecs.volume}
                        onChange={(e) => setModelSpecs({ ...modelSpecs, volume: Number(e.target.value) })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Peso estimado (g)</Label>
                      <Input
                        type="number"
                        value={modelSpecs.weight}
                        onChange={(e) => setModelSpecs({ ...modelSpecs, weight: Number(e.target.value) })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Tiempo de impresión (horas)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={modelSpecs.printTime}
                        onChange={(e) => setModelSpecs({ ...modelSpecs, printTime: Number(e.target.value) })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Cantidad</Label>
                      <Input
                        type="number"
                        min="1"
                        value={modelSpecs.quantity}
                        onChange={(e) => setModelSpecs({ ...modelSpecs, quantity: Number(e.target.value) })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Relleno: {modelSpecs.infill}%</Label>
                      <Slider
                        value={[modelSpecs.infill]}
                        onValueChange={(value) => setModelSpecs({ ...modelSpecs, infill: value[0] })}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Altura de capa: {modelSpecs.layerHeight}mm</Label>
                      <Slider
                        value={[modelSpecs.layerHeight]}
                        onValueChange={(value) => setModelSpecs({ ...modelSpecs, layerHeight: value[0] })}
                        min={0.1}
                        max={0.3}
                        step={0.05}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>0.1mm (Alta calidad)</span>
                        <span>0.3mm (Rápido)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <Label className="text-white">Requiere soportes</Label>
                      <p className="text-sm text-gray-400">Añade material y tiempo adicional</p>
                    </div>
                    <Button
                      variant={modelSpecs.supports ? "default" : "outline"}
                      onClick={() => setModelSpecs({ ...modelSpecs, supports: !modelSpecs.supports })}
                      className={modelSpecs.supports ? "bg-cyan-500" : "border-white/20 text-white"}
                    >
                      {modelSpecs.supports ? "Sí" : "No"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Selección de material */}
            <TabsContent value="material">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Selección de Material</CardTitle>
                  <CardDescription className="text-gray-300">
                    Elige el material más adecuado para tu proyecto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {materials.map((material) => (
                      <div
                        key={material.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedMaterial.id === material.id
                            ? "border-cyan-400 bg-cyan-400/10"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                        onClick={() => setSelectedMaterial(material)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: material.color }} />
                            <div>
                              <h3 className="text-white font-medium">{material.name}</h3>
                              <p className="text-sm text-gray-400">{material.type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold">{formatCurrency(material.pricePerKg)}</div>
                            <div className="text-sm text-gray-400">por kg</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Resistencia</span>
                            <span className={getPropertyColor(material.properties.strength)}>
                              {material.properties.strength}/10
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Flexibilidad</span>
                            <span className={getPropertyColor(material.properties.flexibility)}>
                              {material.properties.flexibility}/10
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Detalle</span>
                            <span className={getPropertyColor(material.properties.detail)}>
                              {material.properties.detail}/10
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Temperatura</span>
                            <span className={getPropertyColor(material.properties.temperature)}>
                              {material.properties.temperature}/10
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">Material seleccionado: {selectedMaterial.name}</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      <p>Densidad: {selectedMaterial.density} g/cm³</p>
                      <p>Precio: {formatCurrency(selectedMaterial.pricePerKg)} por kg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Selección de impresora */}
            <TabsContent value="printer">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Printer className="h-5 w-5" />
                    Perfil de Impresora
                  </CardTitle>
                  <CardDescription className="text-gray-300">Selecciona la impresora que utilizarás</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {printerProfiles.map((printer) => (
                      <div
                        key={printer.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedPrinter.id === printer.id
                            ? "border-cyan-400 bg-cyan-400/10"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                        onClick={() => setSelectedPrinter(printer)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-white font-medium">{printer.name}</h3>
                            <p className="text-sm text-gray-400">{printer.model}</p>
                          </div>
                          <Badge className="bg-purple-500">{printer.powerConsumption}W</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Volumen de construcción:</span>
                            <div className="text-white">
                              {printer.maxBuildVolume.x} × {printer.maxBuildVolume.y} × {printer.maxBuildVolume.z} mm
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Diámetro de boquilla:</span>
                            <div className="text-white">{printer.nozzleDiameter}mm</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Altura de capa:</span>
                            <div className="text-white">
                              {printer.layerHeight.min} - {printer.layerHeight.max}mm
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Velocidad:</span>
                            <div className="text-white">
                              {printer.printSpeed.min} - {printer.printSpeed.max} mm/s
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium">Impresora seleccionada: {selectedPrinter.name}</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      <p>Consumo: {selectedPrinter.powerConsumption}W</p>
                      <p>Mantenimiento: {formatCurrency(selectedPrinter.maintenanceCostPerHour)}/hora</p>
                      <p>Depreciación: {formatCurrency(selectedPrinter.depreciationPerHour)}/hora</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuración de costos */}
            <TabsContent value="settings">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración de Costos
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Ajusta los parámetros económicos para tu negocio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Costo electricidad (€/kWh)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={costSettings.electricityCostPerKwh}
                        onChange={(e) =>
                          setCostSettings({ ...costSettings, electricityCostPerKwh: Number(e.target.value) })
                        }
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Costo mano de obra (€/hora)</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={costSettings.laborCostPerHour}
                        onChange={(e) => setCostSettings({ ...costSettings, laborCostPerHour: Number(e.target.value) })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Margen de ganancia: {costSettings.profitMargin}%</Label>
                    <Slider
                      value={[costSettings.profitMargin]}
                      onValueChange={(value) => setCostSettings({ ...costSettings, profitMargin: value[0] })}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">
                      Multiplicador pedido urgente: {costSettings.rushOrderMultiplier}x
                    </Label>
                    <Slider
                      value={[costSettings.rushOrderMultiplier]}
                      onValueChange={(value) => setCostSettings({ ...costSettings, rushOrderMultiplier: value[0] })}
                      min={1}
                      max={3}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>1x</span>
                      <span>2x</span>
                      <span>3x</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <Label className="text-white">Pedido urgente</Label>
                      <p className="text-sm text-gray-400">Aplicar recargo por urgencia</p>
                    </div>
                    <Button
                      variant={costSettings.isRushOrder ? "default" : "outline"}
                      onClick={() => setCostSettings({ ...costSettings, isRushOrder: !costSettings.isRushOrder })}
                      className={costSettings.isRushOrder ? "bg-orange-500" : "border-white/20 text-white"}
                    >
                      {costSettings.isRushOrder ? "Sí" : "No"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Panel de resultados */}
        <div className="space-y-6">
          {/* Resumen de costos */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Desglose de Costos
              </CardTitle>
              <CardDescription className="text-gray-300">Análisis detallado del costo total</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Material
                  </span>
                  <span className="text-white font-medium">{formatCurrency(costBreakdown.material)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Electricidad
                  </span>
                  <span className="text-white font-medium">{formatCurrency(costBreakdown.electricity)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Mantenimiento
                  </span>
                  <span className="text-white font-medium">{formatCurrency(costBreakdown.maintenance)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Depreciación
                  </span>
                  <span className="text-white font-medium">{formatCurrency(costBreakdown.depreciation)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Mano de obra
                  </span>
                  <span className="text-white font-medium">{formatCurrency(costBreakdown.labor)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Ganancia ({costSettings.profitMargin}%)
                  </span>
                  <span className="text-green-400 font-medium">{formatCurrency(costBreakdown.profit)}</span>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="flex justify-between items-center text-lg">
                <span className="text-white font-bold">Total</span>
                <span className="text-cyan-400 font-bold text-xl">{formatCurrency(costBreakdown.total)}</span>
              </div>

              {costSettings.isRushOrder && (
                <div className="p-3 bg-orange-500/10 border border-orange-400/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-400" />
                    <span className="text-orange-400 text-sm font-medium">
                      Recargo por urgencia aplicado ({costSettings.rushOrderMultiplier}x)
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-sm text-gray-400">Precio por unidad:</div>
                <div className="text-cyan-400 font-bold text-lg">
                  {formatCurrency(costBreakdown.total / modelSpecs.quantity)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de distribución */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Distribución de Costos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { label: "Material", value: costBreakdown.material, color: "bg-blue-500" },
                  { label: "Electricidad", value: costBreakdown.electricity, color: "bg-yellow-500" },
                  { label: "Mantenimiento", value: costBreakdown.maintenance, color: "bg-red-500" },
                  { label: "Depreciación", value: costBreakdown.depreciation, color: "bg-purple-500" },
                  { label: "Mano de obra", value: costBreakdown.labor, color: "bg-orange-500" },
                  { label: "Ganancia", value: costBreakdown.profit, color: "bg-green-500" },
                ].map((item) => {
                  const percentage = costBreakdown.total > 0 ? (item.value / costBreakdown.total) * 100 : 0
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="text-white">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Button onClick={exportCalculation} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Cálculo
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Plantilla
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir Presupuesto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
