"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Printer, Clock, CheckCircle, XCircle, Download, Eye, MessageCircle } from "lucide-react"

const receivedModels = [
  {
    id: "MOD-001",
    modelName: "Figura Dragon Ball Z - Goku",
    description: "Figura coleccionable de Goku en pose de combate",
    image: "/placeholder.svg?height=200&width=200",
    clientName: "María García",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    requestDate: "2024-01-15",
    deadline: "2024-01-20",
    status: "pending",
    quantity: 2,
    material: "PLA",
    color: "Amarillo",
    price: 45.0,
    specifications: {
      infill: "20%",
      layerHeight: "0.2mm",
      supports: "Sí",
      printTime: "8 horas",
    },
    files: ["modelo.stl", "instrucciones.pdf"],
    complexity: "Intermedio",
  },
  {
    id: "MOD-002",
    modelName: "Engranaje Industrial",
    description: "Engranaje de precisión para maquinaria industrial",
    image: "/placeholder.svg?height=200&width=200",
    clientName: "Carlos Mendez",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    requestDate: "2024-01-14",
    deadline: "2024-01-18",
    status: "in_progress",
    quantity: 1,
    material: "PETG",
    color: "Negro",
    price: 35.0,
    specifications: {
      infill: "100%",
      layerHeight: "0.1mm",
      supports: "No",
      printTime: "6 horas",
    },
    files: ["engranaje.stl", "planos.pdf"],
    complexity: "Avanzado",
  },
  {
    id: "MOD-003",
    modelName: "Organizador de Escritorio",
    description: "Sistema modular de organización para escritorio",
    image: "/placeholder.svg?height=200&width=200",
    clientName: "Ana Rodriguez",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    requestDate: "2024-01-12",
    deadline: "2024-01-16",
    status: "completed",
    quantity: 3,
    material: "PLA",
    color: "Blanco",
    price: 60.0,
    specifications: {
      infill: "15%",
      layerHeight: "0.3mm",
      supports: "Sí",
      printTime: "12 horas",
    },
    files: ["organizador_parte1.stl", "organizador_parte2.stl", "organizador_parte3.stl"],
    complexity: "Fácil",
  },
  {
    id: "MOD-004",
    modelName: "Prototipo Mecánico",
    description: "Prototipo de componente mecánico para testing",
    image: "/placeholder.svg?height=200&width=200",
    clientName: "Luis Torres",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    requestDate: "2024-01-13",
    deadline: "2024-01-17",
    status: "rejected",
    quantity: 1,
    material: "ABS",
    color: "Gris",
    price: 25.0,
    specifications: {
      infill: "50%",
      layerHeight: "0.2mm",
      supports: "Sí",
      printTime: "4 horas",
    },
    files: ["prototipo.stl"],
    complexity: "Avanzado",
    rejectionReason: "Modelo con errores de geometría",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-yellow-500">
          <Clock className="h-3 w-3 mr-1" />
          Pendiente
        </Badge>
      )
    case "in_progress":
      return (
        <Badge className="bg-blue-500">
          <Printer className="h-3 w-3 mr-1" />
          En Progreso
        </Badge>
      )
    case "completed":
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completado
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-500">
          <XCircle className="h-3 w-3 mr-1" />
          Rechazado
        </Badge>
      )
    default:
      return <Badge variant="secondary">Desconocido</Badge>
  }
}

const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case "Fácil":
      return "text-green-400"
    case "Intermedio":
      return "text-yellow-400"
    case "Avanzado":
      return "text-red-400"
    default:
      return "text-gray-400"
  }
}

export function PrinterReceivedModels() {
  const pendingModels = receivedModels.filter((model) => model.status === "pending").length
  const inProgressModels = receivedModels.filter((model) => model.status === "in_progress").length
  const completedModels = receivedModels.filter((model) => model.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pendingModels}</div>
            <p className="text-xs text-white/80">Esperando revisión</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">En Progreso</CardTitle>
            <Printer className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{inProgressModels}</div>
            <p className="text-xs text-gray-400">Imprimiendo ahora</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{completedModels}</div>
            <p className="text-xs text-gray-400">Este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de modelos recibidos */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="h-5 w-5" />
            Modelos Recibidos para Impresión
          </CardTitle>
          <CardDescription className="text-gray-300">Solicitudes de impresión de tus clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {receivedModels.map((model) => (
              <Card key={model.id} className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Imagen del modelo */}
                    <div className="flex-shrink-0">
                      <img
                        src={model.image || "/placeholder.svg"}
                        alt={model.modelName}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Información principal */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{model.modelName}</h3>
                          <p className="text-gray-400 text-sm">{model.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={getComplexityColor(model.complexity)}>
                              {model.complexity}
                            </Badge>
                            <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                              {model.quantity} unidad{model.quantity > 1 ? "es" : ""}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(model.status)}
                          <div className="text-2xl font-bold text-cyan-400 mt-2">${model.price.toFixed(2)}</div>
                        </div>
                      </div>

                      {/* Información del cliente */}
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={model.clientAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{model.clientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-white font-medium">{model.clientName}</div>
                          <div className="text-gray-400 text-sm">
                            Solicitado: {model.requestDate} • Entrega: {model.deadline}
                          </div>
                        </div>
                      </div>

                      {/* Especificaciones */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Material:</span>
                          <div className="text-white font-medium">{model.material}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Color:</span>
                          <div className="text-white font-medium">{model.color}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Relleno:</span>
                          <div className="text-white font-medium">{model.specifications.infill}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Tiempo est.:</span>
                          <div className="text-white font-medium">{model.specifications.printTime}</div>
                        </div>
                      </div>

                      {/* Archivos */}
                      <div className="space-y-2">
                        <span className="text-gray-400 text-sm">Archivos adjuntos:</span>
                        <div className="flex flex-wrap gap-2">
                          {model.files.map((file, index) => (
                            <Badge key={index} variant="outline" className="text-blue-400 border-blue-400/30">
                              <Download className="h-3 w-3 mr-1" />
                              {file}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Razón de rechazo si aplica */}
                      {model.status === "rejected" && model.rejectionReason && (
                        <div className="p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
                          <div className="text-red-400 text-sm font-medium">Motivo del rechazo:</div>
                          <div className="text-red-300 text-sm">{model.rejectionReason}</div>
                        </div>
                      )}

                      {/* Acciones */}
                      <div className="flex gap-2 pt-4 border-t border-white/10">
                        {model.status === "pending" && (
                          <>
                            <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Aceptar Trabajo
                            </Button>
                            <Button
                              variant="outline"
                              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Rechazar
                            </Button>
                          </>
                        )}
                        {model.status === "in_progress" && (
                          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">
                            <Printer className="h-4 w-4 mr-2" />
                            Marcar como Completado
                          </Button>
                        )}
                        {model.status === "completed" && (
                          <Button
                            variant="outline"
                            className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        )}
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contactar Cliente
                        </Button>
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar Archivos
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
