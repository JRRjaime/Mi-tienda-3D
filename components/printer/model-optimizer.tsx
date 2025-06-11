"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Upload,
  Download,
  Zap,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  RotateCcw,
  Layers,
  Package,
  Clock,
  DollarSign,
  TrendingDown,
  FileText,
  Eye,
  Play,
} from "lucide-react"
import Image from "next/image"

interface OptimizationSettings {
  quality: "draft" | "normal" | "high" | "ultra"
  infill: number
  layerHeight: number
  printSpeed: number
  supports: "auto" | "manual" | "none"
  orientation: "auto" | "manual"
  hollowing: {
    enabled: boolean
    wallThickness: number
    drainHoles: boolean
  }
  scaling: {
    enabled: boolean
    factor: number
    maintainAspectRatio: boolean
  }
}

interface OptimizationResult {
  originalStats: {
    volume: number
    weight: number
    printTime: number
    materialCost: number
    supportMaterial: number
  }
  optimizedStats: {
    volume: number
    weight: number
    printTime: number
    materialCost: number
    supportMaterial: number
  }
  improvements: {
    timeSaved: number
    materialSaved: number
    costSaved: number
    qualityScore: number
  }
  warnings: string[]
  recommendations: string[]
}

const qualityPresets = {
  draft: { layerHeight: 0.3, infill: 10, printSpeed: 80 },
  normal: { layerHeight: 0.2, infill: 20, printSpeed: 60 },
  high: { layerHeight: 0.15, infill: 25, printSpeed: 40 },
  ultra: { layerHeight: 0.1, infill: 30, printSpeed: 30 },
}

export function ModelOptimizer() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [settings, setSettings] = useState<OptimizationSettings>({
    quality: "normal",
    infill: 20,
    layerHeight: 0.2,
    printSpeed: 60,
    supports: "auto",
    orientation: "auto",
    hollowing: {
      enabled: false,
      wallThickness: 2,
      drainHoles: true,
    },
    scaling: {
      enabled: false,
      factor: 100,
      maintainAspectRatio: true,
    },
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setOptimizationResult(null)
    }
  }

  const handleQualityChange = (quality: string) => {
    const preset = qualityPresets[quality as keyof typeof qualityPresets]
    setSettings({
      ...settings,
      quality: quality as OptimizationSettings["quality"],
      layerHeight: preset.layerHeight,
      infill: preset.infill,
      printSpeed: preset.printSpeed,
    })
  }

  const startOptimization = async () => {
    if (!uploadedFile) return

    setIsOptimizing(true)
    setOptimizationProgress(0)

    // Simular proceso de optimización
    const steps = [
      "Analizando geometría del modelo...",
      "Calculando orientación óptima...",
      "Optimizando soportes...",
      "Ajustando configuración de impresión...",
      "Generando estadísticas...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOptimizationProgress(((i + 1) / steps.length) * 100)
    }

    // Simular resultados
    const mockResult: OptimizationResult = {
      originalStats: {
        volume: 15.6,
        weight: 19.3,
        printTime: 4.5,
        materialCost: 0.48,
        supportMaterial: 2.1,
      },
      optimizedStats: {
        volume: 12.8,
        weight: 15.8,
        printTime: 3.2,
        materialCost: 0.32,
        supportMaterial: 1.2,
      },
      improvements: {
        timeSaved: 28.9,
        materialSaved: 18.1,
        costSaved: 33.3,
        qualityScore: 92,
      },
      warnings: [
        "El modelo tiene paredes muy delgadas que podrían causar problemas de impresión",
        "Se recomienda añadir soportes manuales en la parte inferior",
      ],
      recommendations: [
        "Rotar el modelo 15° para reducir la necesidad de soportes",
        "Aumentar el grosor de pared a 1.2mm para mejor resistencia",
        "Usar relleno hexagonal para mejor relación resistencia/peso",
      ],
    }

    setOptimizationResult(mockResult)
    setIsOptimizing(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header con imagen */}
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-8">
        <Image src="/images/model-optimizer-hero.png" alt="Optimizador de modelos" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Zap className="h-8 w-8" />
              Optimizador de Modelos 3D
            </h1>
            <p className="text-gray-200">Mejora automáticamente tus modelos para impresión 3D</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de configuración */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subida de archivo */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Subir Modelo 3D
              </CardTitle>
              <CardDescription className="text-gray-300">
                Soporta archivos STL, OBJ, 3MF y PLY (máx. 50MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                {uploadedFile ? (
                  <div>
                    <p className="text-white font-medium">{uploadedFile.name}</p>
                    <p className="text-gray-400 text-sm">{formatFileSize(uploadedFile.size)}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white mb-2">Arrastra tu archivo aquí o haz clic para seleccionar</p>
                    <p className="text-gray-400 text-sm">STL, OBJ, 3MF, PLY</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".stl,.obj,.3mf,.ply"
                onChange={handleFileUpload}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Configuración de optimización */}
          {uploadedFile && (
            <Tabs defaultValue="quality" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="quality">Calidad</TabsTrigger>
                <TabsTrigger value="supports">Soportes</TabsTrigger>
                <TabsTrigger value="advanced">Avanzado</TabsTrigger>
                <TabsTrigger value="preview">Vista Previa</TabsTrigger>
              </TabsList>

              {/* Configuración de calidad */}
              <TabsContent value="quality">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Configuración de Calidad
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Ajusta la calidad y velocidad de impresión
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-white">Preset de calidad</Label>
                      <Select value={settings.quality} onValueChange={handleQualityChange}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Borrador (Rápido)</SelectItem>
                          <SelectItem value="normal">Normal (Equilibrado)</SelectItem>
                          <SelectItem value="high">Alta (Detallado)</SelectItem>
                          <SelectItem value="ultra">Ultra (Máxima calidad)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white">Altura de capa: {settings.layerHeight}mm</Label>
                        <Slider
                          value={[settings.layerHeight]}
                          onValueChange={(value) => setSettings({ ...settings, layerHeight: value[0] })}
                          min={0.1}
                          max={0.3}
                          step={0.05}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>0.1mm (Detalle)</span>
                          <span>0.3mm (Rápido)</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Relleno: {settings.infill}%</Label>
                        <Slider
                          value={[settings.infill]}
                          onValueChange={(value) => setSettings({ ...settings, infill: value[0] })}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>0% (Hueco)</span>
                          <span>100% (Sólido)</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Velocidad de impresión: {settings.printSpeed}mm/s</Label>
                        <Slider
                          value={[settings.printSpeed]}
                          onValueChange={(value) => setSettings({ ...settings, printSpeed: value[0] })}
                          min={20}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>20mm/s (Lento)</span>
                          <span>100mm/s (Rápido)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Configuración de soportes */}
              <TabsContent value="supports">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Configuración de Soportes</CardTitle>
                    <CardDescription className="text-gray-300">
                      Optimiza la generación de soportes para tu modelo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-white">Tipo de soportes</Label>
                      <Select
                        value={settings.supports}
                        onValueChange={(value) =>
                          setSettings({ ...settings, supports: value as OptimizationSettings["supports"] })
                        }
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Automático (Recomendado)</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="none">Sin soportes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Orientación del modelo</Label>
                      <Select
                        value={settings.orientation}
                        onValueChange={(value) =>
                          setSettings({ ...settings, orientation: value as OptimizationSettings["orientation"] })
                        }
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Optimización automática</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {settings.supports === "auto" && (
                      <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="h-4 w-4 text-blue-400" />
                          <span className="text-blue-400 font-medium">Optimización automática</span>
                        </div>
                        <p className="text-sm text-gray-300">
                          El sistema analizará tu modelo y generará soportes solo donde sean necesarios, minimizando el
                          material y tiempo de impresión.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Configuración avanzada */}
              <TabsContent value="advanced">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Configuración Avanzada
                    </CardTitle>
                    <CardDescription className="text-gray-300">Opciones avanzadas de optimización</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Vaciado */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Vaciado automático</Label>
                          <p className="text-sm text-gray-400">Reduce el material creando un interior hueco</p>
                        </div>
                        <Switch
                          checked={settings.hollowing.enabled}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              hollowing: { ...settings.hollowing, enabled: checked },
                            })
                          }
                        />
                      </div>

                      {settings.hollowing.enabled && (
                        <div className="space-y-4 pl-4 border-l-2 border-cyan-400/30">
                          <div className="space-y-2">
                            <Label className="text-white">Grosor de pared: {settings.hollowing.wallThickness}mm</Label>
                            <Slider
                              value={[settings.hollowing.wallThickness]}
                              onValueChange={(value) =>
                                setSettings({
                                  ...settings,
                                  hollowing: { ...settings.hollowing, wallThickness: value[0] },
                                })
                              }
                              min={1}
                              max={5}
                              step={0.1}
                              className="w-full"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-white">Agujeros de drenaje</Label>
                              <p className="text-sm text-gray-400">Permite que escape la resina no curada</p>
                            </div>
                            <Switch
                              checked={settings.hollowing.drainHoles}
                              onCheckedChange={(checked) =>
                                setSettings({
                                  ...settings,
                                  hollowing: { ...settings.hollowing, drainHoles: checked },
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Escalado */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Escalado automático</Label>
                          <p className="text-sm text-gray-400">Ajusta el tamaño para optimizar la impresión</p>
                        </div>
                        <Switch
                          checked={settings.scaling.enabled}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              scaling: { ...settings.scaling, enabled: checked },
                            })
                          }
                        />
                      </div>

                      {settings.scaling.enabled && (
                        <div className="space-y-4 pl-4 border-l-2 border-purple-400/30">
                          <div className="space-y-2">
                            <Label className="text-white">Factor de escala: {settings.scaling.factor}%</Label>
                            <Slider
                              value={[settings.scaling.factor]}
                              onValueChange={(value) =>
                                setSettings({
                                  ...settings,
                                  scaling: { ...settings.scaling, factor: value[0] },
                                })
                              }
                              min={50}
                              max={200}
                              step={5}
                              className="w-full"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-white">Mantener proporción</Label>
                              <p className="text-sm text-gray-400">Escala uniformemente en todos los ejes</p>
                            </div>
                            <Switch
                              checked={settings.scaling.maintainAspectRatio}
                              onCheckedChange={(checked) =>
                                setSettings({
                                  ...settings,
                                  scaling: { ...settings.scaling, maintainAspectRatio: checked },
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Vista previa */}
              <TabsContent value="preview">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Vista Previa del Modelo
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Visualiza cómo se verá tu modelo optimizado
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">Vista previa del modelo 3D</p>
                        <p className="text-sm text-gray-500">Se mostrará después de la optimización</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Botón de optimización */}
          {uploadedFile && !isOptimizing && !optimizationResult && (
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-6">
                <Button
                  onClick={startOptimization}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-lg py-6"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Optimizar Modelo
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Progreso de optimización */}
          {isOptimizing && (
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 animate-spin" />
                  Optimizando Modelo...
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={optimizationProgress} className="h-3" />
                <p className="text-center text-gray-300">{optimizationProgress.toFixed(0)}% completado</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel de resultados */}
        <div className="space-y-6">
          {optimizationResult && (
            <>
              {/* Resumen de mejoras */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Optimización Completada
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Puntuación de calidad: {optimizationResult.improvements.qualityScore}/100
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-500/10 rounded-lg">
                      <Clock className="h-6 w-6 text-green-400 mx-auto mb-2" />
                      <div className="text-green-400 font-bold text-lg">
                        {optimizationResult.improvements.timeSaved.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">Tiempo ahorrado</div>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                      <Package className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-blue-400 font-bold text-lg">
                        {optimizationResult.improvements.materialSaved.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">Material ahorrado</div>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-purple-400 font-bold text-lg">
                      {optimizationResult.improvements.costSaved.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">Costo reducido</div>
                  </div>
                </CardContent>
              </Card>

              {/* Comparación antes/después */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Comparación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Tiempo de impresión</span>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 line-through">
                          {optimizationResult.originalStats.printTime.toFixed(1)}h
                        </span>
                        <TrendingDown className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 font-bold">
                          {optimizationResult.optimizedStats.printTime.toFixed(1)}h
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Material</span>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 line-through">
                          {optimizationResult.originalStats.weight.toFixed(1)}g
                        </span>
                        <TrendingDown className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 font-bold">
                          {optimizationResult.optimizedStats.weight.toFixed(1)}g
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Costo</span>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 line-through">
                          {formatCurrency(optimizationResult.originalStats.materialCost)}
                        </span>
                        <TrendingDown className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 font-bold">
                          {formatCurrency(optimizationResult.optimizedStats.materialCost)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Soportes</span>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 line-through">
                          {optimizationResult.originalStats.supportMaterial.toFixed(1)}g
                        </span>
                        <TrendingDown className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 font-bold">
                          {optimizationResult.optimizedStats.supportMaterial.toFixed(1)}g
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Advertencias */}
              {optimizationResult.warnings.length > 0 && (
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      Advertencias
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {optimizationResult.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-200">{warning}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Recomendaciones */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-400" />
                    Recomendaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {optimizationResult.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-200">{recommendation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Acciones */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-4 space-y-3">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Modelo Optimizado
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white">
                    <Play className="h-4 w-4 mr-2" />
                    Enviar a Impresora
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-400 text-gray-400"
                    onClick={() => {
                      setOptimizationResult(null)
                      setUploadedFile(null)
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Optimizar Otro Modelo
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {!uploadedFile && (
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-8 text-center">
                <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Sube un modelo 3D para comenzar la optimización</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
