"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, FileText, Zap, Eye, Download, RotateCcw } from "lucide-react"

interface ValidationResult {
  isValid: boolean
  score: number
  errors: string[]
  warnings: string[]
  suggestions: string[]
  fileInfo: {
    vertices: number
    faces: number
    materials: string[]
    dimensions: { x: number; y: number; z: number }
    volume: number
    surfaceArea: number
    manifold: boolean
    watertight: boolean
  }
  printability: {
    overhangs: number
    thinWalls: number
    supportNeeded: boolean
    printTime: string
    materialUsage: number
  }
}

export function EnhancedFileValidator() {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [validationProgress, setValidationProgress] = useState(0)

  const runValidation = useCallback(async () => {
    setIsValidating(true)
    setValidationProgress(0)

    const validationSteps = [
      "Leyendo archivo...",
      "Analizando geometría...",
      "Verificando integridad de malla...",
      "Detectando problemas de impresión...",
      "Calculando métricas...",
      "Evaluando printabilidad...",
      "Generando recomendaciones...",
    ]

    for (let i = 0; i < validationSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500))
      setValidationProgress(((i + 1) / validationSteps.length) * 100)
    }

    // Simular resultados de validación
    const mockResult: ValidationResult = {
      isValid: Math.random() > 0.2,
      score: Math.floor(Math.random() * 40) + 60,
      errors: ["Malla no cerrada detectada en la base", "Normales invertidas en 23 caras"].slice(
        0,
        Math.random() > 0.7 ? 2 : 0,
      ),
      warnings: [
        "Paredes muy delgadas (< 0.8mm) detectadas",
        "Voladizos pronunciados sin soporte",
        "Detalles muy pequeños que podrían perderse",
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      suggestions: [
        "Aumentar grosor de paredes a mínimo 1.2mm",
        "Añadir chaflanes a esquinas agudas",
        "Considerar orientación alternativa",
        "Simplificar detalles menores a 0.5mm",
      ].slice(0, Math.floor(Math.random() * 3) + 2),
      fileInfo: {
        vertices: Math.floor(Math.random() * 50000) + 5000,
        faces: Math.floor(Math.random() * 100000) + 10000,
        materials: ["PLA", "ABS"].slice(0, Math.floor(Math.random() * 2) + 1),
        dimensions: {
          x: Math.random() * 200 + 20,
          y: Math.random() * 200 + 20,
          z: Math.random() * 200 + 20,
        },
        volume: Math.random() * 1000 + 100,
        surfaceArea: Math.random() * 5000 + 500,
        manifold: Math.random() > 0.3,
        watertight: Math.random() > 0.2,
      },
      printability: {
        overhangs: Math.floor(Math.random() * 15),
        thinWalls: Math.floor(Math.random() * 8),
        supportNeeded: Math.random() > 0.4,
        printTime: `${Math.floor(Math.random() * 8) + 1}h ${Math.floor(Math.random() * 60)}m`,
        materialUsage: Math.random() * 50 + 10,
      },
    }

    setValidationResult(mockResult)
    setIsValidating(false)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, text: "Excelente" }
    if (score >= 60) return { variant: "secondary" as const, text: "Bueno" }
    return { variant: "destructive" as const, text: "Necesita mejoras" }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Validador Avanzado de Modelos 3D
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={runValidation}
              disabled={isValidating}
              className="bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              {isValidating ? "Validando..." : "Ejecutar Validación Completa"}
            </Button>
            {validationResult && (
              <Button
                onClick={() => setValidationResult(null)}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>

          {isValidating && (
            <div className="space-y-2">
              <Progress value={validationProgress} className="h-3" />
              <p className="text-center text-gray-300 text-sm">{validationProgress.toFixed(0)}% completado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {validationResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resumen de Validación */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Resumen de Validación</span>
                <Badge {...getScoreBadge(validationResult.score)}>{getScoreBadge(validationResult.score).text}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(validationResult.score)}`}>
                  {validationResult.score}/100
                </div>
                <p className="text-gray-400">Puntuación de Calidad</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  {validationResult.fileInfo.manifold ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                  <span className="text-gray-300">Malla Manifold</span>
                </div>
                <div className="flex items-center gap-2">
                  {validationResult.fileInfo.watertight ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                  <span className="text-gray-300">Hermético</span>
                </div>
                <div className="flex items-center gap-2">
                  {validationResult.errors.length === 0 ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                  <span className="text-gray-300">Sin Errores</span>
                </div>
                <div className="flex items-center gap-2">
                  {validationResult.printability.supportNeeded ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  )}
                  <span className="text-gray-300">Soportes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Archivo */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información del Modelo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">Vértices:</span>
                  <span className="text-white ml-2">{validationResult.fileInfo.vertices.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Caras:</span>
                  <span className="text-white ml-2">{validationResult.fileInfo.faces.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Volumen:</span>
                  <span className="text-white ml-2">{validationResult.fileInfo.volume.toFixed(2)} cm³</span>
                </div>
                <div>
                  <span className="text-gray-400">Superficie:</span>
                  <span className="text-white ml-2">{validationResult.fileInfo.surfaceArea.toFixed(2)} cm²</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-medium">Dimensiones:</h4>
                <div className="text-sm text-gray-300 bg-gray-700 p-2 rounded">
                  {validationResult.fileInfo.dimensions.x.toFixed(1)} ×{" "}
                  {validationResult.fileInfo.dimensions.y.toFixed(1)} ×{" "}
                  {validationResult.fileInfo.dimensions.z.toFixed(1)} mm
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-medium">Printabilidad:</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tiempo estimado:</span>
                    <span className="text-white">{validationResult.printability.printTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Material:</span>
                    <span className="text-white">{validationResult.printability.materialUsage.toFixed(1)}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Voladizos:</span>
                    <span className="text-white">{validationResult.printability.overhangs}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Errores y Advertencias */}
          {(validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Problemas Detectados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {validationResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-red-400 font-medium">Errores Críticos:</h4>
                    {validationResult.errors.map((error, index) => (
                      <Alert key={index} className="border-red-500 bg-red-500/10">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-400">{error}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}

                {validationResult.warnings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-yellow-400 font-medium">Advertencias:</h4>
                    {validationResult.warnings.map((warning, index) => (
                      <Alert key={index} className="border-yellow-500 bg-yellow-500/10">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-yellow-400">{warning}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Sugerencias */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {validationResult.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-200">{suggestion}</p>
                </div>
              ))}

              <div className="flex gap-2 mt-4">
                <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600">
                  <Download className="h-3 w-3 mr-1" />
                  Aplicar Correcciones
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                  <Eye className="h-3 w-3 mr-1" />
                  Vista Previa 3D
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
