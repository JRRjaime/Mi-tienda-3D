"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Smartphone,
  Glasses,
  Move3D,
  Settings,
  Download,
  Share2,
  Info,
  Maximize,
  Eye,
  Camera,
  Video,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ARVRViewerProps {
  modelId: string
  modelName: string
  modelUrl?: string
  thumbnailUrl?: string
  creatorName: string
  category: string
}

export function ARVRViewer({
  modelId,
  modelName,
  modelUrl = "/placeholder.svg?height=400&width=400",
  thumbnailUrl = "/placeholder.svg?height=200&width=200",
  creatorName,
  category,
}: ARVRViewerProps) {
  const [isARSupported, setIsARSupported] = useState(false)
  const [isVRSupported, setIsVRSupported] = useState(false)
  const [viewerMode, setViewerMode] = useState<"3d" | "ar" | "vr">("3d")
  const [isLoading, setIsLoading] = useState(false)
  const [modelScale, setModelScale] = useState([1])
  const [autoRotate, setAutoRotate] = useState(true)
  const [showWireframe, setShowWireframe] = useState(false)
  const [lightingIntensity, setLightingIntensity] = useState([0.8])
  const [backgroundColor, setBackgroundColor] = useState("#1a1a2e")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const viewerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Simular detección de capacidades AR/VR
  useEffect(() => {
    // Verificar soporte AR (WebXR)
    if ("xr" in navigator) {
      // @ts-ignore
      navigator.xr
        ?.isSessionSupported("immersive-ar")
        .then((supported: boolean) => {
          setIsARSupported(supported)
        })
        .catch(() => setIsARSupported(false))

      // @ts-ignore
      navigator.xr
        ?.isSessionSupported("immersive-vr")
        .then((supported: boolean) => {
          setIsVRSupported(supported)
        })
        .catch(() => setIsVRSupported(false))
    } else {
      // Fallback: detectar dispositivos móviles para AR
      setIsARSupported(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
      setIsVRSupported(false)
    }
  }, [])

  const handleARView = async () => {
    setIsLoading(true)
    try {
      if (isARSupported) {
        setViewerMode("ar")
        toast({
          title: "Modo AR Activado",
          description: "Apunta tu cámara hacia una superficie plana para colocar el modelo",
        })

        // Simular carga del modelo AR
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } else {
        toast({
          title: "AR no disponible",
          description: "Tu dispositivo no soporta realidad aumentada. Intenta desde un dispositivo móvil compatible.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error al cargar AR",
        description: "No se pudo inicializar la realidad aumentada",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVRView = async () => {
    setIsLoading(true)
    try {
      if (isVRSupported) {
        setViewerMode("vr")
        toast({
          title: "Modo VR Activado",
          description: "Usa tu visor VR o mueve tu dispositivo para explorar el modelo",
        })

        // Simular carga del modelo VR
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } else {
        toast({
          title: "VR no disponible",
          description: "Tu navegador no soporta WebXR. Intenta con Chrome o Firefox en un dispositivo compatible.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error al cargar VR",
        description: "No se pudo inicializar la realidad virtual",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${modelName} - Modelo 3D`,
          text: `Mira este increíble modelo 3D de ${creatorName}`,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback a copiar al portapapeles
        navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Enlace copiado",
          description: "El enlace del modelo se ha copiado al portapapeles",
        })
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Enlace copiado",
        description: "El enlace del modelo se ha copiado al portapapeles",
      })
    }
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      viewerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    toast({
      title: "Grabación iniciada",
      description: "Se está grabando la vista del modelo 3D",
    })

    // Simular grabación por 10 segundos
    setTimeout(() => {
      setIsRecording(false)
      toast({
        title: "Grabación completada",
        description: "El video se ha guardado en tu dispositivo",
      })
    }, 10000)
  }

  const takeScreenshot = () => {
    toast({
      title: "Captura realizada",
      description: "La imagen se ha guardado en tu dispositivo",
    })
  }

  return (
    <div className="space-y-6">
      {/* Visor principal */}
      <Card className="overflow-hidden bg-gradient-to-br from-slate-900/50 to-purple-900/50 backdrop-blur-sm border-white/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="h-5 w-5 text-cyan-400" />
                Visor 3D Avanzado
              </CardTitle>
              <CardDescription className="text-gray-300">Explora el modelo en 3D, AR o VR</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                {viewerMode.toUpperCase()}
              </Badge>
              {isRecording && (
                <Badge className="bg-red-500 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-1" />
                  REC
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Visor 3D */}
          <div
            ref={viewerRef}
            className="relative w-full h-96 bg-gradient-to-br from-slate-800 to-purple-800 rounded-lg overflow-hidden border border-white/10"
            style={{ backgroundColor }}
          >
            {/* Simulación del visor 3D */}
            <div className="absolute inset-0 flex items-center justify-center">
              {viewerMode === "3d" && (
                <div className="relative">
                  <img
                    src={modelUrl || "/placeholder.svg"}
                    alt={modelName}
                    className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
                      autoRotate ? "animate-spin" : ""
                    }`}
                    style={{
                      transform: `scale(${modelScale[0]})`,
                      filter: showWireframe ? "invert(1) contrast(2)" : "none",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
              )}

              {viewerMode === "ar" && (
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center animate-pulse">
                    <Smartphone className="h-16 w-16 text-cyan-400" />
                  </div>
                  <div className="text-white">
                    <p className="font-semibold">Modo AR Activo</p>
                    <p className="text-sm text-gray-300">Apunta hacia una superficie plana</p>
                  </div>
                </div>
              )}

              {viewerMode === "vr" && (
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center animate-pulse">
                    <Glasses className="h-16 w-16 text-purple-400" />
                  </div>
                  <div className="text-white">
                    <p className="font-semibold">Modo VR Activo</p>
                    <p className="text-sm text-gray-300">Mueve tu dispositivo para explorar</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controles superpuestos */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={takeScreenshot}
                className="bg-black/50 hover:bg-black/70 text-white"
              >
                <Camera className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={isRecording ? () => setIsRecording(false) : startRecording}
                className={`bg-black/50 hover:bg-black/70 text-white ${isRecording ? "bg-red-500/50" : ""}`}
              >
                <Video className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleFullscreen}
                className="bg-black/50 hover:bg-black/70 text-white"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>

            {/* Información del modelo */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
              <p className="font-semibold text-sm">{modelName}</p>
              <p className="text-xs text-gray-300">por {creatorName}</p>
            </div>

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-white text-sm">Cargando...</p>
                </div>
              </div>
            )}
          </div>

          {/* Botones principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => setViewerMode("3d")}
              variant={viewerMode === "3d" ? "default" : "outline"}
              className={`h-16 ${
                viewerMode === "3d"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                  : "border-white/20 text-white hover:bg-white/10"
              }`}
            >
              <div className="text-center">
                <Move3D className="h-6 w-6 mx-auto mb-1" />
                <span className="text-sm">Vista 3D</span>
              </div>
            </Button>

            <Button
              onClick={handleARView}
              disabled={!isARSupported || isLoading}
              variant={viewerMode === "ar" ? "default" : "outline"}
              className={`h-16 ${
                viewerMode === "ar"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "border-white/20 text-white hover:bg-white/10"
              }`}
            >
              <div className="text-center">
                <Smartphone className="h-6 w-6 mx-auto mb-1" />
                <span className="text-sm">Realidad Aumentada</span>
                {!isARSupported && <span className="text-xs block text-gray-400">(No disponible)</span>}
              </div>
            </Button>

            <Button
              onClick={handleVRView}
              disabled={!isVRSupported || isLoading}
              variant={viewerMode === "vr" ? "default" : "outline"}
              className={`h-16 ${
                viewerMode === "vr"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : "border-white/20 text-white hover:bg-white/10"
              }`}
            >
              <div className="text-center">
                <Glasses className="h-6 w-6 mx-auto mb-1" />
                <span className="text-sm">Realidad Virtual</span>
                {!isVRSupported && <span className="text-xs block text-gray-400">(No disponible)</span>}
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Panel de controles avanzados */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400" />
            Controles Avanzados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="display" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="display">Visualización</TabsTrigger>
              <TabsTrigger value="lighting">Iluminación</TabsTrigger>
              <TabsTrigger value="animation">Animación</TabsTrigger>
              <TabsTrigger value="export">Exportar</TabsTrigger>
            </TabsList>

            <TabsContent value="display" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white mb-2 block">Escala del modelo</Label>
                    <Slider
                      value={modelScale}
                      onValueChange={setModelScale}
                      max={3}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-400">{modelScale[0]}x</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="wireframe" checked={showWireframe} onCheckedChange={setShowWireframe} />
                    <Label htmlFor="wireframe" className="text-white">
                      Mostrar wireframe
                    </Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white mb-2 block">Color de fondo</Label>
                    <div className="flex gap-2">
                      {["#1a1a2e", "#16213e", "#0f3460", "#533483", "#7209b7"].map((color) => (
                        <button
                          key={color}
                          onClick={() => setBackgroundColor(color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            backgroundColor === color ? "border-white" : "border-gray-600"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lighting" className="space-y-6 mt-6">
              <div>
                <Label className="text-white mb-2 block">Intensidad de iluminación</Label>
                <Slider
                  value={lightingIntensity}
                  onValueChange={setLightingIntensity}
                  max={2}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
                <span className="text-sm text-gray-400">{lightingIntensity[0]}x</span>
              </div>
            </TabsContent>

            <TabsContent value="animation" className="space-y-6 mt-6">
              <div className="flex items-center space-x-2">
                <Switch id="autorotate" checked={autoRotate} onCheckedChange={setAutoRotate} />
                <Label htmlFor="autorotate" className="text-white">
                  Rotación automática
                </Label>
              </div>
            </TabsContent>

            <TabsContent value="export" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={handleShare} className="bg-gradient-to-r from-blue-500 to-purple-500">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir modelo
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar vista
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Información de compatibilidad */}
      <Card className="bg-blue-500/10 border-blue-400/30">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Información de Compatibilidad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-white font-semibold">Realidad Aumentada (AR):</p>
              <ul className="text-gray-300 space-y-1">
                <li>• Android: Chrome 81+, Samsung Internet</li>
                <li>• iOS: Safari 14+ (iPhone/iPad)</li>
                <li>• Requiere cámara y sensores de movimiento</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-white font-semibold">Realidad Virtual (VR):</p>
              <ul className="text-gray-300 space-y-1">
                <li>• Chrome/Firefox con WebXR</li>
                <li>• Oculus Browser, Firefox Reality</li>
                <li>• Compatible con visores VR</li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2 border-t border-blue-400/20">
            <Badge
              variant="outline"
              className={isARSupported ? "text-green-400 border-green-400/30" : "text-red-400 border-red-400/30"}
            >
              AR: {isARSupported ? "Disponible" : "No disponible"}
            </Badge>
            <Badge
              variant="outline"
              className={isVRSupported ? "text-green-400 border-green-400/30" : "text-red-400 border-red-400/30"}
            >
              VR: {isVRSupported ? "Disponible" : "No disponible"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
