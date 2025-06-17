"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, AlertTriangle, Zap, Download, Eye, Settings, BarChart3 } from "lucide-react"
import { ModelOptimizer } from "@/components/printer/model-optimizer"
import { RealFileUploadSystem } from "@/components/upload/real-file-upload-system"

export default function TestUploadPage() {
  const [activeTest, setActiveTest] = useState<string>("basic")
  const [testResults, setTestResults] = useState<any[]>([])

  const runFileTest = async (testType: string) => {
    const results = []

    // Simular diferentes tipos de archivos de test
    const testFiles = [
      { name: "small_model.stl", size: 1024 * 50, type: "model/stl" },
      { name: "medium_model.obj", size: 1024 * 1024 * 5, type: "model/obj" },
      { name: "large_model.3mf", size: 1024 * 1024 * 25, type: "model/3mf" },
      { name: "huge_model.ply", size: 1024 * 1024 * 60, type: "model/ply" },
    ]

    for (const file of testFiles) {
      const startTime = Date.now()

      // Simular procesamiento
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 500))

      const endTime = Date.now()
      const processingTime = endTime - startTime

      results.push({
        fileName: file.name,
        fileSize: file.size,
        processingTime,
        status: file.size > 50 * 1024 * 1024 ? "error" : "success",
        error: file.size > 50 * 1024 * 1024 ? "Archivo muy grande" : null,
        optimizationGain: Math.random() * 30 + 10,
      })
    }

    setTestResults(results)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-4">
            Test de Carga y Optimización de Archivos 3D
          </h1>
          <p className="text-gray-400 text-lg">
            Prueba y optimiza la carga de modelos 3D con validación en tiempo real
          </p>
        </div>

        <Tabs value={activeTest} onValueChange={setActiveTest} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="basic" className="data-[state=active]:bg-cyan-600">
              Test Básico
            </TabsTrigger>
            <TabsTrigger value="optimizer" className="data-[state=active]:bg-blue-600">
              Optimizador
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-purple-600">
              Sistema Avanzado
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-green-600">
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Test Básico */}
          <TabsContent value="basic" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Test de Carga Básico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={() => runFileTest("basic")} className="bg-gradient-to-r from-cyan-500 to-blue-600">
                    <FileText className="h-4 w-4 mr-2" />
                    Ejecutar Test de Archivos
                  </Button>
                  <Button
                    onClick={() => setTestResults([])}
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    Limpiar Resultados
                  </Button>
                </div>

                {testResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold">Resultados del Test:</h3>
                    {testResults.map((result, index) => (
                      <div key={index} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-400" />
                            <div>
                              <p className="text-white font-medium">{result.fileName}</p>
                              <p className="text-gray-400 text-sm">{formatFileSize(result.fileSize)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {result.status === "success" ? (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-red-400" />
                            )}
                            <Badge variant={result.status === "success" ? "default" : "destructive"}>
                              {result.status === "success" ? "Éxito" : "Error"}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Tiempo de procesamiento:</span>
                            <span className="text-white ml-2">{result.processingTime}ms</span>
                          </div>
                          {result.status === "success" && (
                            <div>
                              <span className="text-gray-400">Optimización:</span>
                              <span className="text-green-400 ml-2">-{result.optimizationGain.toFixed(1)}%</span>
                            </div>
                          )}
                        </div>

                        {result.error && (
                          <Alert className="mt-3 border-red-500 bg-red-500/10">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-red-400">{result.error}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Optimizador */}
          <TabsContent value="optimizer" className="space-y-6">
            <ModelOptimizer />
          </TabsContent>

          {/* Sistema Avanzado */}
          <TabsContent value="advanced" className="space-y-6">
            <RealFileUploadSystem />
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Métricas de Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Velocidad de carga promedio</span>
                      <span className="text-green-400 font-bold">2.3 MB/s</span>
                    </div>
                    <Progress value={75} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Tasa de éxito de validación</span>
                      <span className="text-blue-400 font-bold">94.2%</span>
                    </div>
                    <Progress value={94} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Optimización promedio</span>
                      <span className="text-purple-400 font-bold">-23.7%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración de Test
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600">
                      <Zap className="h-4 w-4 mr-2" />
                      Test de Estrés (100 archivos)
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600">
                      <Eye className="h-4 w-4 mr-2" />
                      Test de Validación Completa
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600">
                      <Download className="h-4 w-4 mr-2" />
                      Test de Descarga Masiva
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Estadísticas en Tiempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400">1,247</div>
                    <div className="text-sm text-gray-400">Archivos Procesados</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">98.3%</div>
                    <div className="text-sm text-gray-400">Tasa de Éxito</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">15.2 GB</div>
                    <div className="text-sm text-gray-400">Datos Procesados</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">-27%</div>
                    <div className="text-sm text-gray-400">Optimización Media</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
