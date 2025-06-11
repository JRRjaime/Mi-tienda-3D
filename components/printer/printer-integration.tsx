"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Printer,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Square,
  Settings,
  Monitor,
  Thermometer,
  Activity,
  AlertTriangle,
  CheckCircle,
  Upload,
  RefreshCw,
  Camera,
  Gauge,
  Zap,
  Package,
  FileText,
} from "lucide-react"
import Image from "next/image"

interface ConnectedPrinter {
  id: string
  name: string
  model: string
  ipAddress: string
  status: "connected" | "disconnected" | "printing" | "idle" | "error"
  firmware: string
  capabilities: {
    hasCamera: boolean
    hasFilamentSensor: boolean
    hasPowerRecovery: boolean
    hasAutoLeveling: boolean
  }
  currentJob?: {
    fileName: string
    progress: number
    timeElapsed: number
    timeRemaining: number
    layerCurrent: number
    layerTotal: number
  }
  sensors: {
    hotendTemp: number
    hotendTarget: number
    bedTemp: number
    bedTarget: number
    fanSpeed: number
    filamentDetected: boolean
  }
  lastUpdate: Date
}

const mockPrinters: ConnectedPrinter[] = [
  {
    id: "octoprint-001",
    name: "Ender 3 Pro #1",
    model: "Creality Ender 3 Pro",
    ipAddress: "192.168.1.101",
    status: "printing",
    firmware: "Marlin 2.1.2",
    capabilities: {
      hasCamera: true,
      hasFilamentSensor: true,
      hasPowerRecovery: true,
      hasAutoLeveling: false,
    },
    currentJob: {
      fileName: "dragon_ball_goku.gcode",
      progress: 67,
      timeElapsed: 4.5,
      timeRemaining: 2.3,
      layerCurrent: 134,
      layerTotal: 200,
    },
    sensors: {
      hotendTemp: 210,
      hotendTarget: 210,
      bedTemp: 60,
      bedTarget: 60,
      fanSpeed: 80,
      filamentDetected: true,
    },
    lastUpdate: new Date(),
  },
  {
    id: "prusa-connect-002",
    name: "Prusa i3 MK3S+",
    model: "Prusa Research i3 MK3S+",
    ipAddress: "192.168.1.102",
    status: "idle",
    firmware: "Prusa Firmware 3.11.0",
    capabilities: {
      hasCamera: true,
      hasFilamentSensor: true,
      hasPowerRecovery: true,
      hasAutoLeveling: true,
    },
    sensors: {
      hotendTemp: 25,
      hotendTarget: 0,
      bedTemp: 23,
      bedTarget: 0,
      fanSpeed: 0,
      filamentDetected: true,
    },
    lastUpdate: new Date(Date.now() - 30000),
  },
]

export function PrinterIntegration() {
  const [connectedPrinters, setConnectedPrinters] = useState<ConnectedPrinter[]>(mockPrinters)
  const [selectedPrinter, setSelectedPrinter] = useState<ConnectedPrinter | null>(mockPrinters[0])
  const [isScanning, setIsScanning] = useState(false)
  const [newPrinterIP, setNewPrinterIP] = useState("")
  const [newPrinterKey, setNewPrinterKey] = useState("")

  // Simular actualizaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectedPrinters((prev) =>
        prev.map((printer) => {
          if (printer.status === "printing" && printer.currentJob) {
            const newProgress = Math.min(printer.currentJob.progress + 0.5, 100)
            const timeElapsed = printer.currentJob.timeElapsed + 0.1
            const timeRemaining = Math.max(printer.currentJob.timeRemaining - 0.1, 0)
            const layerCurrent = Math.floor((newProgress / 100) * printer.currentJob.layerTotal)

            return {
              ...printer,
              currentJob: {
                ...printer.currentJob,
                progress: newProgress,
                timeElapsed,
                timeRemaining,
                layerCurrent,
              },
              lastUpdate: new Date(),
            }
          }
          return printer
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "idle":
        return "bg-green-500"
      case "printing":
        return "bg-blue-500"
      case "error":
        return "bg-red-500"
      case "disconnected":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "idle":
        return <CheckCircle className="h-4 w-4" />
      case "printing":
        return <Play className="h-4 w-4" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      case "disconnected":
        return <WifiOff className="h-4 w-4" />
      default:
        return <Printer className="h-4 w-4" />
    }
  }

  const formatTime = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.floor((hours - h) * 60)
    return `${h}h ${m}m`
  }

  const scanForPrinters = async () => {
    setIsScanning(true)
    // Simular escaneo de red
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsScanning(false)
  }

  const connectPrinter = async () => {
    if (!newPrinterIP) return

    // Simular conexión
    const newPrinter: ConnectedPrinter = {
      id: `manual-${Date.now()}`,
      name: `Impresora ${newPrinterIP}`,
      model: "Modelo Desconocido",
      ipAddress: newPrinterIP,
      status: "connected",
      firmware: "Desconocido",
      capabilities: {
        hasCamera: false,
        hasFilamentSensor: false,
        hasPowerRecovery: false,
        hasAutoLeveling: false,
      },
      sensors: {
        hotendTemp: 25,
        hotendTarget: 0,
        bedTemp: 23,
        bedTarget: 0,
        fanSpeed: 0,
        filamentDetected: true,
      },
      lastUpdate: new Date(),
    }

    setConnectedPrinters([...connectedPrinters, newPrinter])
    setNewPrinterIP("")
    setNewPrinterKey("")
  }

  const sendCommand = async (printerId: string, command: string) => {
    console.log(`Enviando comando ${command} a impresora ${printerId}`)
    // Aquí iría la lógica real para enviar comandos a la impresora
  }

  return (
    <div className="space-y-6">
      {/* Header con imagen */}
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-8">
        <Image
          src="/images/printer-integration-hero.png"
          alt="Integración con impresoras"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Monitor className="h-8 w-8" />
              Integración con Impresoras 3D
            </h1>
            <p className="text-gray-200">Controla y monitorea tus impresoras en tiempo real</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de impresoras conectadas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controles de conexión */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Gestión de Conexiones
              </CardTitle>
              <CardDescription className="text-gray-300">Conecta y gestiona tus impresoras 3D</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="scan" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="scan">Escanear Red</TabsTrigger>
                  <TabsTrigger value="manual">Conexión Manual</TabsTrigger>
                </TabsList>

                <TabsContent value="scan" className="space-y-4">
                  <div className="text-center">
                    <Button
                      onClick={scanForPrinters}
                      disabled={isScanning}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500"
                    >
                      {isScanning ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Wifi className="h-4 w-4 mr-2" />
                      )}
                      {isScanning ? "Escaneando..." : "Escanear Red"}
                    </Button>
                  </div>
                  {isScanning && (
                    <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                      <p className="text-blue-400 text-sm text-center">
                        Buscando impresoras compatibles en la red local...
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="manual" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Dirección IP</Label>
                      <Input
                        value={newPrinterIP}
                        onChange={(e) => setNewPrinterIP(e.target.value)}
                        placeholder="192.168.1.100"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Clave API (opcional)</Label>
                      <Input
                        value={newPrinterKey}
                        onChange={(e) => setNewPrinterKey(e.target.value)}
                        placeholder="API Key"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                  <Button onClick={connectPrinter} className="w-full bg-gradient-to-r from-green-500 to-emerald-500">
                    Conectar Impresora
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Lista de impresoras conectadas */}
          <div className="space-y-4">
            {connectedPrinters.map((printer) => (
              <Card
                key={printer.id}
                className={`bg-white/5 backdrop-blur-sm border-white/10 cursor-pointer transition-all hover:bg-white/10 ${
                  selectedPrinter?.id === printer.id ? "border-cyan-400 bg-cyan-400/10" : ""
                }`}
                onClick={() => setSelectedPrinter(printer)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Printer className="h-8 w-8 text-cyan-400" />
                        <div
                          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(printer.status)}`}
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{printer.name}</h3>
                        <p className="text-gray-400 text-sm">{printer.model}</p>
                        <p className="text-gray-500 text-xs">{printer.ipAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(printer.status)} text-white`}>
                        {getStatusIcon(printer.status)}
                        <span className="ml-1 capitalize">{printer.status}</span>
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Última actualización</div>
                        <div className="text-white text-xs">{printer.lastUpdate.toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Trabajo actual */}
                  {printer.currentJob && (
                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-400 font-medium">{printer.currentJob.fileName}</span>
                        <span className="text-white text-sm">
                          Capa {printer.currentJob.layerCurrent}/{printer.currentJob.layerTotal}
                        </span>
                      </div>
                      <Progress value={printer.currentJob.progress} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{printer.currentJob.progress.toFixed(1)}% completado</span>
                        <span>{formatTime(printer.currentJob.timeRemaining)} restante</span>
                      </div>
                    </div>
                  )}

                  {/* Sensores */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-red-400" />
                      <div>
                        <div className="text-xs text-gray-400">Hotend</div>
                        <div className="text-white font-medium">
                          {printer.sensors.hotendTemp}°C
                          {printer.sensors.hotendTarget > 0 && (
                            <span className="text-gray-400 text-xs"> / {printer.sensors.hotendTarget}°C</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-orange-400" />
                      <div>
                        <div className="text-xs text-gray-400">Cama</div>
                        <div className="text-white font-medium">
                          {printer.sensors.bedTemp}°C
                          {printer.sensors.bedTarget > 0 && (
                            <span className="text-gray-400 text-xs"> / {printer.sensors.bedTarget}°C</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-400" />
                      <div>
                        <div className="text-xs text-gray-400">Ventilador</div>
                        <div className="text-white font-medium">{printer.sensors.fanSpeed}%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-green-400" />
                      <div>
                        <div className="text-xs text-gray-400">Filamento</div>
                        <div
                          className={`font-medium ${printer.sensors.filamentDetected ? "text-green-400" : "text-red-400"}`}
                        >
                          {printer.sensors.filamentDetected ? "OK" : "Falta"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Capacidades */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {printer.capabilities.hasCamera && (
                      <Badge variant="outline" className="border-blue-400 text-blue-400">
                        <Camera className="h-3 w-3 mr-1" />
                        Cámara
                      </Badge>
                    )}
                    {printer.capabilities.hasFilamentSensor && (
                      <Badge variant="outline" className="border-green-400 text-green-400">
                        <Package className="h-3 w-3 mr-1" />
                        Sensor Filamento
                      </Badge>
                    )}
                    {printer.capabilities.hasPowerRecovery && (
                      <Badge variant="outline" className="border-purple-400 text-purple-400">
                        <Zap className="h-3 w-3 mr-1" />
                        Recuperación
                      </Badge>
                    )}
                    {printer.capabilities.hasAutoLeveling && (
                      <Badge variant="outline" className="border-cyan-400 text-cyan-400">
                        <Gauge className="h-3 w-3 mr-1" />
                        Auto-nivelado
                      </Badge>
                    )}
                  </div>

                  {/* Controles rápidos */}
                  <div className="flex gap-2">
                    {printer.status === "printing" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-400 text-yellow-400"
                          onClick={() => sendCommand(printer.id, "pause")}
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-400 text-red-400"
                          onClick={() => sendCommand(printer.id, "cancel")}
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {printer.status === "idle" && (
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => sendCommand(printer.id, "start")}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white"
                      onClick={() => sendCommand(printer.id, "refresh")}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Panel de control detallado */}
        <div className="space-y-6">
          {selectedPrinter ? (
            <>
              {/* Información detallada */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    {selectedPrinter.name}
                  </CardTitle>
                  <CardDescription className="text-gray-300">{selectedPrinter.model}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estado:</span>
                      <Badge className={`${getStatusColor(selectedPrinter.status)} text-white`}>
                        {getStatusIcon(selectedPrinter.status)}
                        <span className="ml-1 capitalize">{selectedPrinter.status}</span>
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">IP:</span>
                      <span className="text-white">{selectedPrinter.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Firmware:</span>
                      <span className="text-white">{selectedPrinter.firmware}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Última actualización:</span>
                      <span className="text-white">{selectedPrinter.lastUpdate.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cámara en vivo */}
              {selectedPrinter.capabilities.hasCamera && (
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Cámara en Vivo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">Vista en vivo de la impresora</p>
                        <p className="text-sm text-gray-500">Actualizándose cada 5 segundos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Control de temperatura */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    Control de Temperatura
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Hotend</span>
                        <span className="text-white">
                          {selectedPrinter.sensors.hotendTemp}°C / {selectedPrinter.sensors.hotendTarget}°C
                        </span>
                      </div>
                      <Progress value={(selectedPrinter.sensors.hotendTemp / 250) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Cama caliente</span>
                        <span className="text-white">
                          {selectedPrinter.sensors.bedTemp}°C / {selectedPrinter.sensors.bedTarget}°C
                        </span>
                      </div>
                      <Progress value={(selectedPrinter.sensors.bedTemp / 100) * 100} className="h-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Temp. Hotend</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="210"
                          className="bg-white/5 border-white/10 text-white text-sm"
                        />
                        <Button size="sm" className="bg-red-500 hover:bg-red-600">
                          Set
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Temp. Cama</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="60"
                          className="bg-white/5 border-white/10 text-white text-sm"
                        />
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          Set
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Controles manuales */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Controles Manuales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPrinter.status === "printing" && (
                    <>
                      <Button
                        className="w-full bg-yellow-500 hover:bg-yellow-600"
                        onClick={() => sendCommand(selectedPrinter.id, "pause")}
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar Impresión
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-red-400 text-red-400"
                        onClick={() => sendCommand(selectedPrinter.id, "cancel")}
                      >
                        <Square className="h-4 w-4 mr-2" />
                        Cancelar Trabajo
                      </Button>
                    </>
                  )}
                  {selectedPrinter.status === "idle" && (
                    <Button
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={() => sendCommand(selectedPrinter.id, "start")}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar Trabajo
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white"
                    onClick={() => sendCommand(selectedPrinter.id, "home")}
                  >
                    Home All Axes
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white"
                    onClick={() => sendCommand(selectedPrinter.id, "disable_motors")}
                  >
                    Desactivar Motores
                  </Button>
                </CardContent>
              </Card>

              {/* Subir archivo */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Enviar Archivo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir G-Code
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Archivos
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-8 text-center">
                <Printer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Selecciona una impresora para ver los controles</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
