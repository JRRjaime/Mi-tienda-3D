"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Printer,
  Activity,
  AlertTriangle,
  CheckCircle,
  Settings,
  Wrench,
  Thermometer,
  Gauge,
  Calendar,
  BarChart3,
  Plus,
  Edit,
  Play,
  Pause,
  Square,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react"
import Image from "next/image"

interface PrinterStatus {
  id: string
  name: string
  model: string
  status: "idle" | "printing" | "paused" | "error" | "maintenance" | "offline"
  currentJob?: {
    id: string
    name: string
    progress: number
    timeRemaining: number
    startTime: Date
  }
  specs: {
    buildVolume: { x: number; y: number; z: number }
    nozzleDiameter: number
    maxTemp: { hotend: number; bed: number }
    connectivity: "usb" | "wifi" | "ethernet"
  }
  sensors: {
    hotendTemp: number
    bedTemp: number
    chamberTemp?: number
    humidity?: number
  }
  maintenance: {
    lastService: Date
    nextService: Date
    hoursUntilService: number
    totalPrintHours: number
  }
  location: string
  ipAddress?: string
  firmwareVersion: string
  utilization: {
    daily: number
    weekly: number
    monthly: number
  }
}

const mockPrinters: PrinterStatus[] = [
  {
    id: "printer-001",
    name: "Ender 3 Pro #1",
    model: "Creality Ender 3 Pro",
    status: "printing",
    currentJob: {
      id: "job-123",
      name: "Dragon Ball Z - Goku Figure",
      progress: 67,
      timeRemaining: 2.5,
      startTime: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
    },
    specs: {
      buildVolume: { x: 220, y: 220, z: 250 },
      nozzleDiameter: 0.4,
      maxTemp: { hotend: 260, bed: 100 },
      connectivity: "wifi",
    },
    sensors: {
      hotendTemp: 210,
      bedTemp: 60,
      chamberTemp: 28,
    },
    maintenance: {
      lastService: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      nextService: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      hoursUntilService: 45,
      totalPrintHours: 1250,
    },
    location: "Taller Principal",
    ipAddress: "192.168.1.101",
    firmwareVersion: "2.1.2",
    utilization: {
      daily: 85,
      weekly: 72,
      monthly: 68,
    },
  },
  {
    id: "printer-002",
    name: "Prusa i3 MK3S+",
    model: "Prusa Research i3 MK3S+",
    status: "idle",
    specs: {
      buildVolume: { x: 250, y: 210, z: 210 },
      nozzleDiameter: 0.4,
      maxTemp: { hotend: 300, bed: 120 },
      connectivity: "ethernet",
    },
    sensors: {
      hotendTemp: 25,
      bedTemp: 23,
      chamberTemp: 24,
      humidity: 45,
    },
    maintenance: {
      lastService: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      nextService: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      hoursUntilService: 120,
      totalPrintHours: 890,
    },
    location: "Taller Principal",
    ipAddress: "192.168.1.102",
    firmwareVersion: "3.11.0",
    utilization: {
      daily: 45,
      weekly: 58,
      monthly: 62,
    },
  },
  {
    id: "printer-003",
    name: "Ultimaker S3",
    model: "Ultimaker S3",
    status: "error",
    specs: {
      buildVolume: { x: 230, y: 190, z: 200 },
      nozzleDiameter: 0.4,
      maxTemp: { hotend: 280, bed: 100 },
      connectivity: "wifi",
    },
    sensors: {
      hotendTemp: 25,
      bedTemp: 22,
      chamberTemp: 25,
    },
    maintenance: {
      lastService: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      nextService: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      hoursUntilService: -25,
      totalPrintHours: 2100,
    },
    location: "Taller Secundario",
    ipAddress: "192.168.1.103",
    firmwareVersion: "6.3.1",
    utilization: {
      daily: 0,
      weekly: 15,
      monthly: 35,
    },
  },
  {
    id: "printer-004",
    name: "Bambu Lab X1 Carbon",
    model: "Bambu Lab X1 Carbon",
    status: "maintenance",
    specs: {
      buildVolume: { x: 256, y: 256, z: 256 },
      nozzleDiameter: 0.4,
      maxTemp: { hotend: 300, bed: 120 },
      connectivity: "wifi",
    },
    sensors: {
      hotendTemp: 24,
      bedTemp: 23,
      chamberTemp: 26,
      humidity: 42,
    },
    maintenance: {
      lastService: new Date(),
      nextService: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      hoursUntilService: 200,
      totalPrintHours: 750,
    },
    location: "Taller Principal",
    ipAddress: "192.168.1.104",
    firmwareVersion: "1.7.0.0",
    utilization: {
      daily: 0,
      weekly: 0,
      monthly: 45,
    },
  },
]

export function FleetManagement() {
  const [printers, setPrinters] = useState<PrinterStatus[]>(mockPrinters)
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterStatus | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "printing":
        return "bg-blue-500"
      case "idle":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      case "maintenance":
        return "bg-purple-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "printing":
        return <Play className="h-4 w-4" />
      case "idle":
        return <CheckCircle className="h-4 w-4" />
      case "paused":
        return <Pause className="h-4 w-4" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      case "maintenance":
        return <Wrench className="h-4 w-4" />
      case "offline":
        return <WifiOff className="h-4 w-4" />
      default:
        return <Printer className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "printing":
        return "Imprimiendo"
      case "idle":
        return "Disponible"
      case "paused":
        return "Pausada"
      case "error":
        return "Error"
      case "maintenance":
        return "Mantenimiento"
      case "offline":
        return "Desconectada"
      default:
        return "Desconocido"
    }
  }

  const formatTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`
    }
    return `${hours.toFixed(1)} h`
  }

  const filteredPrinters = printers.filter((printer) => {
    if (filterStatus === "all") return true
    return printer.status === filterStatus
  })

  const sortedPrinters = [...filteredPrinters].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "status":
        return a.status.localeCompare(b.status)
      case "utilization":
        return b.utilization.daily - a.utilization.daily
      case "maintenance":
        return a.maintenance.hoursUntilService - b.maintenance.hoursUntilService
      default:
        return 0
    }
  })

  const fleetStats = {
    total: printers.length,
    active: printers.filter((p) => p.status === "printing").length,
    idle: printers.filter((p) => p.status === "idle").length,
    errors: printers.filter((p) => p.status === "error").length,
    maintenance: printers.filter((p) => p.status === "maintenance").length,
    avgUtilization: printers.reduce((acc, p) => acc + p.utilization.daily, 0) / printers.length,
  }

  return (
    <div className="space-y-6">
      {/* Header con imagen */}
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-8">
        <Image src="/images/fleet-management-hero.png" alt="Gestión de flota" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Activity className="h-8 w-8" />
              Gestión de Flota de Impresoras
            </h1>
            <p className="text-gray-200">Monitorea y controla todas tus impresoras 3D desde un solo lugar</p>
          </div>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Total</p>
                <p className="text-2xl font-bold text-white">{fleetStats.total}</p>
              </div>
              <Printer className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Activas</p>
                <p className="text-2xl font-bold text-white">{fleetStats.active}</p>
              </div>
              <Play className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Disponibles</p>
                <p className="text-2xl font-bold text-white">{fleetStats.idle}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-pink-500 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Errores</p>
                <p className="text-2xl font-bold text-white">{fleetStats.errors}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Mantenimiento</p>
                <p className="text-2xl font-bold text-white">{fleetStats.maintenance}</p>
              </div>
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-gray-600 to-gray-700 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Utilización</p>
                <p className="text-2xl font-bold text-white">{fleetStats.avgUtilization.toFixed(0)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de impresoras */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controles de filtrado */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label className="text-white text-sm">Filtrar por estado</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="printing">Imprimiendo</SelectItem>
                      <SelectItem value="idle">Disponibles</SelectItem>
                      <SelectItem value="error">Con errores</SelectItem>
                      <SelectItem value="maintenance">En mantenimiento</SelectItem>
                      <SelectItem value="offline">Desconectadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="text-white text-sm">Ordenar por</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nombre</SelectItem>
                      <SelectItem value="status">Estado</SelectItem>
                      <SelectItem value="utilization">Utilización</SelectItem>
                      <SelectItem value="maintenance">Mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Impresora
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de impresoras */}
          <div className="space-y-4">
            {sortedPrinters.map((printer) => (
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
                        {printer.specs.connectivity === "wifi" ? (
                          <Wifi className="h-3 w-3 text-green-400 absolute -top-1 -right-1" />
                        ) : (
                          <div className="h-3 w-3 bg-blue-400 rounded-full absolute -top-1 -right-1" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{printer.name}</h3>
                        <p className="text-gray-400 text-sm">{printer.model}</p>
                        <p className="text-gray-500 text-xs">{printer.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(printer.status)} text-white`}>
                        {getStatusIcon(printer.status)}
                        <span className="ml-1">{getStatusText(printer.status)}</span>
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Utilización</div>
                        <div className="text-white font-bold">{printer.utilization.daily}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Trabajo actual */}
                  {printer.currentJob && (
                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-400 font-medium">{printer.currentJob.name}</span>
                        <span className="text-white text-sm">
                          {formatTime(printer.currentJob.timeRemaining)} restante
                        </span>
                      </div>
                      <Progress value={printer.currentJob.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{printer.currentJob.progress}% completado</span>
                        <span>Iniciado: {printer.currentJob.startTime.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Sensores */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-red-400" />
                      <div>
                        <div className="text-xs text-gray-400">Hotend</div>
                        <div className="text-white font-medium">{printer.sensors.hotendTemp}°C</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-orange-400" />
                      <div>
                        <div className="text-xs text-gray-400">Cama</div>
                        <div className="text-white font-medium">{printer.sensors.bedTemp}°C</div>
                      </div>
                    </div>
                    {printer.sensors.chamberTemp && (
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-blue-400" />
                        <div>
                          <div className="text-xs text-gray-400">Cámara</div>
                          <div className="text-white font-medium">{printer.sensors.chamberTemp}°C</div>
                        </div>
                      </div>
                    )}
                    {printer.sensors.humidity && (
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-cyan-400" />
                        <div>
                          <div className="text-xs text-gray-400">Humedad</div>
                          <div className="text-white font-medium">{printer.sensors.humidity}%</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mantenimiento */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <div>
                        <div className="text-xs text-gray-400">Próximo mantenimiento</div>
                        <div
                          className={`text-sm font-medium ${
                            printer.maintenance.hoursUntilService < 0
                              ? "text-red-400"
                              : printer.maintenance.hoursUntilService < 24
                                ? "text-yellow-400"
                                : "text-green-400"
                          }`}
                        >
                          {printer.maintenance.hoursUntilService < 0
                            ? `Atrasado ${Math.abs(printer.maintenance.hoursUntilService)}h`
                            : `En ${printer.maintenance.hoursUntilService}h`}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-white/20 text-white">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {printer.status === "printing" && (
                        <Button size="sm" variant="outline" className="border-yellow-400 text-yellow-400">
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      {printer.status === "idle" && (
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Panel de detalles */}
        <div className="space-y-6">
          {selectedPrinter ? (
            <>
              {/* Información detallada */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Printer className="h-5 w-5" />
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
                        <span className="ml-1">{getStatusText(selectedPrinter.status)}</span>
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">IP:</span>
                      <span className="text-white">{selectedPrinter.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Firmware:</span>
                      <span className="text-white">{selectedPrinter.firmwareVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Horas totales:</span>
                      <span className="text-white">{selectedPrinter.maintenance.totalPrintHours}h</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Especificaciones</h4>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Volumen:</span>
                        <span className="text-white">
                          {selectedPrinter.specs.buildVolume.x} × {selectedPrinter.specs.buildVolume.y} ×{" "}
                          {selectedPrinter.specs.buildVolume.z} mm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Boquilla:</span>
                        <span className="text-white">{selectedPrinter.specs.nozzleDiameter}mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Temp. máx. hotend:</span>
                        <span className="text-white">{selectedPrinter.specs.maxTemp.hotend}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Temp. máx. cama:</span>
                        <span className="text-white">{selectedPrinter.specs.maxTemp.bed}°C</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Utilización */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Utilización
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Diaria</span>
                        <span className="text-white">{selectedPrinter.utilization.daily}%</span>
                      </div>
                      <Progress value={selectedPrinter.utilization.daily} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Semanal</span>
                        <span className="text-white">{selectedPrinter.utilization.weekly}%</span>
                      </div>
                      <Progress value={selectedPrinter.utilization.weekly} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Mensual</span>
                        <span className="text-white">{selectedPrinter.utilization.monthly}%</span>
                      </div>
                      <Progress value={selectedPrinter.utilization.monthly} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Controles */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Controles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedPrinter.status === "printing" && (
                    <>
                      <Button className="w-full bg-yellow-500 hover:bg-yellow-600">
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar Impresión
                      </Button>
                      <Button variant="outline" className="w-full border-red-400 text-red-400">
                        <Square className="h-4 w-4 mr-2" />
                        Cancelar Trabajo
                      </Button>
                    </>
                  )}
                  {selectedPrinter.status === "idle" && (
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar Trabajo
                    </Button>
                  )}
                  {selectedPrinter.status === "paused" && (
                    <>
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        <Play className="h-4 w-4 mr-2" />
                        Reanudar
                      </Button>
                      <Button variant="outline" className="w-full border-red-400 text-red-400">
                        <Square className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  )}
                  <Button variant="outline" className="w-full border-white/20 text-white">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualizar Estado
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </Button>
                  <Button variant="outline" className="w-full border-purple-400 text-purple-400">
                    <Wrench className="h-4 w-4 mr-2" />
                    Programar Mantenimiento
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-8 text-center">
                <Printer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Selecciona una impresora para ver los detalles</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
