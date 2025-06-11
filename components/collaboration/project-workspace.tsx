"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  GitBranch,
  MessageSquare,
  FileText,
  CheckCircle,
  Plus,
  Download,
  Upload,
  Eye,
  Share2,
  Settings,
  Calendar,
  Target,
  Activity,
  Zap,
  UserPlus,
  Send,
  Paperclip,
  MoreHorizontal,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface ProjectMember {
  id: string
  name: string
  email: string
  avatar: string
  role: "owner" | "admin" | "collaborator" | "viewer"
  joinedAt: string
  lastActive: string
  contributions: number
}

interface ProjectVersion {
  id: string
  version: string
  title: string
  description: string
  author: string
  authorAvatar: string
  createdAt: string
  changes: string[]
  fileSize: string
  downloads: number
  status: "draft" | "review" | "approved" | "published"
  comments: number
}

interface ProjectTask {
  id: string
  title: string
  description: string
  assignee: string
  assigneeAvatar: string
  status: "todo" | "in-progress" | "review" | "completed"
  priority: "low" | "medium" | "high" | "urgent"
  dueDate: string
  createdAt: string
  comments: number
  labels: string[]
}

interface ProjectComment {
  id: string
  author: string
  authorAvatar: string
  content: string
  timestamp: string
  type: "general" | "version" | "task"
  targetId?: string
  replies?: ProjectComment[]
}

interface ProjectWorkspaceProps {
  projectId: string
  projectName: string
  projectDescription: string
  isOwner?: boolean
}

export function ProjectWorkspace({
  projectId,
  projectName,
  projectDescription,
  isOwner = false,
}: ProjectWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [versions, setVersions] = useState<ProjectVersion[]>([])
  const [tasks, setTasks] = useState<ProjectTask[]>([])
  const [comments, setComments] = useState<ProjectComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium" as const,
    dueDate: "",
  })
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("collaborator")

  const { toast } = useToast()

  // Datos de ejemplo
  useEffect(() => {
    // Simular miembros del proyecto
    setMembers([
      {
        id: "1",
        name: "Carlos Mendez",
        email: "carlos@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "owner",
        joinedAt: "2024-01-15",
        lastActive: "2024-03-20",
        contributions: 45,
      },
      {
        id: "2",
        name: "Ana López",
        email: "ana@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "collaborator",
        joinedAt: "2024-02-01",
        lastActive: "2024-03-19",
        contributions: 32,
      },
      {
        id: "3",
        name: "Miguel Ángel",
        email: "miguel@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "collaborator",
        joinedAt: "2024-02-15",
        lastActive: "2024-03-18",
        contributions: 28,
      },
      {
        id: "4",
        name: "Laura Sánchez",
        email: "laura@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "viewer",
        joinedAt: "2024-03-01",
        lastActive: "2024-03-17",
        contributions: 5,
      },
    ])

    // Simular versiones
    setVersions([
      {
        id: "1",
        version: "v2.1.0",
        title: "Mejoras en la estructura base",
        description: "Optimización de la geometría y reducción del tiempo de impresión",
        author: "Carlos Mendez",
        authorAvatar: "/placeholder.svg?height=32&width=32",
        createdAt: "2024-03-20",
        changes: ["Optimización de malla", "Reducción de soportes", "Mejora en detalles"],
        fileSize: "2.4 MB",
        downloads: 156,
        status: "published",
        comments: 8,
      },
      {
        id: "2",
        version: "v2.0.1",
        title: "Corrección de errores menores",
        description: "Fixes en la geometría y ajustes de escala",
        author: "Ana López",
        authorAvatar: "/placeholder.svg?height=32&width=32",
        createdAt: "2024-03-18",
        changes: ["Fix en geometría", "Ajuste de escala", "Corrección de normales"],
        fileSize: "2.3 MB",
        downloads: 89,
        status: "approved",
        comments: 5,
      },
      {
        id: "3",
        version: "v2.0.0",
        title: "Rediseño completo del modelo",
        description: "Nueva versión con mejoras significativas en diseño y funcionalidad",
        author: "Miguel Ángel",
        authorAvatar: "/placeholder.svg?height=32&width=32",
        createdAt: "2024-03-15",
        changes: ["Rediseño completo", "Nuevas características", "Mejor ergonomía"],
        fileSize: "2.8 MB",
        downloads: 234,
        status: "published",
        comments: 12,
      },
      {
        id: "4",
        version: "v1.9.0-beta",
        title: "Versión beta con nuevas características",
        description: "Versión en desarrollo con características experimentales",
        author: "Ana López",
        authorAvatar: "/placeholder.svg?height=32&width=32",
        createdAt: "2024-03-12",
        changes: ["Características experimentales", "Nuevos materiales", "Pruebas de concepto"],
        fileSize: "2.6 MB",
        downloads: 45,
        status: "review",
        comments: 3,
      },
    ])

    // Simular tareas
    setTasks([
      {
        id: "1",
        title: "Optimizar geometría para impresión",
        description: "Reducir el número de triángulos manteniendo la calidad visual",
        assignee: "Ana López",
        assigneeAvatar: "/placeholder.svg?height=32&width=32",
        status: "in-progress",
        priority: "high",
        dueDate: "2024-03-25",
        createdAt: "2024-03-15",
        comments: 4,
        labels: ["optimización", "geometría"],
      },
      {
        id: "2",
        title: "Crear documentación técnica",
        description: "Documentar el proceso de impresión y ensamblaje",
        assignee: "Miguel Ángel",
        assigneeAvatar: "/placeholder.svg?height=32&width=32",
        status: "todo",
        priority: "medium",
        dueDate: "2024-03-30",
        createdAt: "2024-03-18",
        comments: 2,
        labels: ["documentación", "guía"],
      },
      {
        id: "3",
        title: "Pruebas de impresión en diferentes materiales",
        description: "Testear el modelo con PLA, ABS y PETG",
        assignee: "Carlos Mendez",
        assigneeAvatar: "/placeholder.svg?height=32&width=32",
        status: "completed",
        priority: "high",
        dueDate: "2024-03-20",
        createdAt: "2024-03-10",
        comments: 7,
        labels: ["testing", "materiales"],
      },
      {
        id: "4",
        title: "Revisar feedback de la comunidad",
        description: "Analizar comentarios y sugerencias de los usuarios",
        assignee: "Laura Sánchez",
        assigneeAvatar: "/placeholder.svg?height=32&width=32",
        status: "review",
        priority: "low",
        dueDate: "2024-04-01",
        createdAt: "2024-03-19",
        comments: 1,
        labels: ["feedback", "comunidad"],
      },
    ])

    // Simular comentarios
    setComments([
      {
        id: "1",
        author: "Ana López",
        authorAvatar: "/placeholder.svg?height=32&width=32",
        content: "La nueva versión se ve increíble! Las mejoras en la geometría realmente marcan la diferencia.",
        timestamp: "2024-03-20 14:30",
        type: "general",
      },
      {
        id: "2",
        author: "Miguel Ángel",
        authorAvatar: "/placeholder.svg?height=32&width=32",
        content: "¿Podríamos añadir una variante más pequeña? Algunos usuarios han pedido una versión mini.",
        timestamp: "2024-03-20 15:45",
        type: "general",
      },
      {
        id: "3",
        author: "Carlos Mendez",
        authorAvatar: "/placeholder.svg?height=32&width=32",
        content: "Buena idea Miguel. Lo añado a la lista de tareas para la próxima iteración.",
        timestamp: "2024-03-20 16:00",
        type: "general",
      },
    ])
  }, [])

  const handleInviteMember = () => {
    if (!inviteEmail) return

    toast({
      title: "Invitación enviada",
      description: `Se ha enviado una invitación a ${inviteEmail}`,
    })
    setInviteEmail("")
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: ProjectComment = {
      id: Date.now().toString(),
      author: "Usuario Actual",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      content: newComment,
      timestamp: new Date().toLocaleString(),
      type: "general",
    }

    setComments([...comments, comment])
    setNewComment("")
    toast({
      title: "Comentario añadido",
      description: "Tu comentario ha sido publicado",
    })
  }

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return

    const task: ProjectTask = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee || "Sin asignar",
      assigneeAvatar: "/placeholder.svg?height=32&width=32",
      status: "todo",
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString().split("T")[0],
      comments: 0,
      labels: [],
    }

    setTasks([...tasks, task])
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
      dueDate: "",
    })
    toast({
      title: "Tarea creada",
      description: "La nueva tarea ha sido añadida al proyecto",
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-500"
      case "admin":
        return "bg-red-500"
      case "collaborator":
        return "bg-blue-500"
      case "viewer":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "published":
      case "approved":
        return "bg-green-500"
      case "in-progress":
      case "review":
        return "bg-yellow-500"
      case "todo":
      case "draft":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header del proyecto */}
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-8">
        <Image src="/images/collaboration-hero.png" alt="Colaboración" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{projectName}</h1>
            <p className="text-gray-200 mb-4">{projectDescription}</p>
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-500">
                <Users className="h-3 w-3 mr-1" />
                {members.length} miembros
              </Badge>
              <Badge className="bg-green-500">
                <GitBranch className="h-3 w-3 mr-1" />
                {versions.length} versiones
              </Badge>
              <Badge className="bg-purple-500">
                <Target className="h-3 w-3 mr-1" />
                {tasks.filter((t) => t.status !== "completed").length} tareas activas
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-500"
              onClick={() => {
                // En una implementación real, esto abriría un modal de compartir
                alert("Funcionalidad de compartir en desarrollo")
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
            {isOwner && (
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => {
                  // En una implementación real, esto abriría un modal de configuración
                  alert("Funcionalidad de configuración en desarrollo")
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Navegación principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Resumen</span>
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            <span className="hidden sm:inline">Versiones</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Tareas</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Equipo</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Archivos</span>
          </TabsTrigger>
        </TabsList>

        {/* Resumen del proyecto */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Progreso General</CardTitle>
                <Zap className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-400">78%</div>
                <p className="text-xs text-gray-400">+12% desde la semana pasada</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Tareas Completadas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {tasks.filter((t) => t.status === "completed").length}
                </div>
                <p className="text-xs text-gray-400">De {tasks.length} totales</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Última Versión</CardTitle>
                <GitBranch className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{versions[0]?.version}</div>
                <p className="text-xs text-gray-400">{versions[0]?.downloads} descargas</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Actividad</CardTitle>
                <Activity className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">24</div>
                <p className="text-xs text-gray-400">Acciones esta semana</p>
              </CardContent>
            </Card>
          </div>

          {/* Actividad reciente */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    user: "Ana López",
                    action: "subió la versión v2.1.0",
                    time: "hace 2 horas",
                    icon: Upload,
                    color: "text-green-400",
                  },
                  {
                    user: "Miguel Ángel",
                    action: "completó la tarea 'Pruebas de impresión'",
                    time: "hace 4 horas",
                    icon: CheckCircle,
                    color: "text-blue-400",
                  },
                  {
                    user: "Carlos Mendez",
                    action: "comentó en la versión v2.0.1",
                    time: "hace 6 horas",
                    icon: MessageSquare,
                    color: "text-purple-400",
                  },
                  {
                    user: "Laura Sánchez",
                    action: "se unió al proyecto",
                    time: "hace 1 día",
                    icon: UserPlus,
                    color: "text-cyan-400",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Control de versiones */}
        <TabsContent value="versions" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Control de Versiones</h2>
              <p className="text-gray-400">Historial completo de cambios y versiones del proyecto</p>
            </div>
            <Button
              className="bg-gradient-to-r from-green-500 to-emerald-500"
              onClick={() => {
                // En una implementación real, esto abriría un modal para subir una nueva versión
                alert("Funcionalidad de subida de versión en desarrollo")
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Nueva Versión
            </Button>
          </div>

          <div className="space-y-4">
            {versions.map((version) => (
              <Card key={version.id} className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-500">{version.version}</Badge>
                        <Badge className={getStatusColor(version.status)}>{version.status}</Badge>
                      </div>
                      <CardTitle className="text-white">{version.title}</CardTitle>
                      <CardDescription className="text-gray-300">{version.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white"
                        onClick={() => {
                          // En una implementación real, esto abriría una vista previa de la versión
                          alert("Vista previa de la versión en desarrollo")
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white"
                        onClick={() => {
                          // En una implementación real, esto iniciaría la descarga de la versión
                          alert("Descarga de versión en desarrollo")
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={version.authorAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{version.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-300">{version.author}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">{version.createdAt}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">Cambios principales:</p>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {version.changes.map((change, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Tamaño</p>
                          <p className="text-white font-medium">{version.fileSize}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Descargas</p>
                          <p className="text-white font-medium">{version.downloads}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Comentarios</p>
                          <p className="text-white font-medium">{version.comments}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Gestión de tareas */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Gestión de Tareas</h2>
              <p className="text-gray-400">Organiza y asigna tareas del proyecto</p>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-500"
              onClick={() => {
                // En una implementación real, esto abriría un modal para crear una nueva tarea
                alert("Funcionalidad de creación de tarea en desarrollo")
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tarea
            </Button>
          </div>

          {/* Formulario para nueva tarea */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Crear Nueva Tarea</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Título</Label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Título de la tarea"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Asignar a</Label>
                  <Select
                    value={newTask.assignee}
                    onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Seleccionar miembro" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Descripción</Label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Descripción de la tarea"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Prioridad</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: "low" | "medium" | "high" | "urgent") =>
                      setNewTask({ ...newTask, priority: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Fecha límite</Label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <Button onClick={handleCreateTask} className="bg-gradient-to-r from-green-500 to-emerald-500">
                <Plus className="h-4 w-4 mr-2" />
                Crear Tarea
              </Button>
            </CardContent>
          </Card>

          {/* Lista de tareas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["todo", "in-progress", "review", "completed"].map((status) => (
              <Card key={status} className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Badge className={getStatusColor(status)}>
                      {status === "todo" && "Por hacer"}
                      {status === "in-progress" && "En progreso"}
                      {status === "review" && "En revisión"}
                      {status === "completed" && "Completadas"}
                    </Badge>
                    <span className="text-sm">({tasks.filter((t) => t.status === status).length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task) => (
                        <Card key={task.id} className="bg-white/5 border-white/10 p-3">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="text-white font-medium text-sm line-clamp-2">{task.title}</h4>
                              <Badge className={getPriorityColor(task.priority)} size="sm">
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-xs line-clamp-2">{task.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={task.assigneeAvatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">{task.assignee.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-400">{task.assignee}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Calendar className="h-3 w-3" />
                                {task.dueDate}
                              </div>
                            </div>
                            {task.labels.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {task.labels.map((label) => (
                                  <Badge key={label} variant="outline" className="text-xs">
                                    {label}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Gestión del equipo */}
        <TabsContent value="team" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Equipo del Proyecto</h2>
              <p className="text-gray-400">Gestiona los miembros y permisos del proyecto</p>
            </div>
            <Button
              className="bg-gradient-to-r from-green-500 to-emerald-500"
              onClick={() => {
                // En una implementación real, esto abriría un modal para invitar miembros
                alert("Funcionalidad de invitación en desarrollo")
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invitar Miembro
            </Button>
          </div>

          {/* Formulario de invitación */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Invitar Nuevo Miembro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label className="text-white">Email</Label>
                  <Input
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Rol</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                      <SelectItem value="collaborator">Colaborador</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleInviteMember} className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500">
                <Send className="h-4 w-4 mr-2" />
                Enviar Invitación
              </Button>
            </CardContent>
          </Card>

          {/* Lista de miembros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {members.map((member) => (
              <Card key={member.id} className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-white font-medium">{member.name}</h3>
                        <p className="text-gray-400 text-sm">{member.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">{member.contributions} contribuciones</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <Separator className="my-4 bg-white/10" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Se unió</p>
                      <p className="text-white">{member.joinedAt}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Último acceso</p>
                      <p className="text-white">{member.lastActive}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Chat del proyecto */}
        <TabsContent value="chat" className="space-y-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chat del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium text-sm">{comment.author}</span>
                          <span className="text-gray-400 text-xs">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-white/5 border-white/10 text-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleAddComment()
                      }
                    }}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestión de archivos */}
        <TabsContent value="files" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Archivos del Proyecto</h2>
              <p className="text-gray-400">Gestiona todos los archivos y recursos del proyecto</p>
            </div>
            <Button
              className="bg-gradient-to-r from-green-500 to-emerald-500"
              onClick={() => {
                // En una implementación real, esto abriría un modal para subir archivos
                alert("Funcionalidad de subida de archivos en desarrollo")
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir Archivo
            </Button>
          </div>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">Gestión de Archivos</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Aquí podrás gestionar todos los archivos del proyecto, incluyendo modelos 3D, texturas, documentación
                  y más.
                </p>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-purple-500"
                  onClick={() => {
                    // En una implementación real, esto abriría un modal para subir archivos
                    alert("Funcionalidad de subida de archivos en desarrollo")
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Primer Archivo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
