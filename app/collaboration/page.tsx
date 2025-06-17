"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import {
  Users,
  Plus,
  MessageSquare,
  Calendar,
  CheckSquare,
  FolderOpen,
  Send,
  UserPlus,
  Settings,
  BarChart3,
  Target,
  Zap,
} from "lucide-react"

export default function CollaborationPage() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [messages, setMessages] = useState([])
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const { toast } = useToast()

  const handleCreateProject = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newProject = {
      id: Date.now(),
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      status: "active",
      progress: 0,
      members: 1,
      tasks: 0,
      createdAt: new Date().toISOString(),
      deadline: formData.get("deadline"),
    }

    setProjects([...projects, newProject])
    setShowCreateProject(false)
    toast({
      title: "Proyecto creado",
      description: `${newProject.name} ha sido creado exitosamente`,
    })
    e.target.reset()
  }

  const handleCreateTask = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newTask = {
      id: Date.now(),
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      status: "pending",
      assignee: "Tú",
      dueDate: formData.get("dueDate"),
      createdAt: new Date().toISOString(),
    }

    setTasks([...tasks, newTask])
    setShowCreateTask(false)
    toast({
      title: "Tarea creada",
      description: `${newTask.title} ha sido asignada`,
    })
    e.target.reset()
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: "Tú",
      timestamp: new Date().toISOString(),
      avatar: "/placeholder.svg?height=32&width=32",
    }

    setMessages([...messages, message])
    setNewMessage("")
    toast({
      title: "Mensaje enviado",
      description: "Tu mensaje ha sido enviado al equipo",
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Centro de Colaboración
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gestiona proyectos, coordina equipos y colabora en tiempo real
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Proyectos Activos</p>
                  <p className="text-3xl font-bold">{projects.length}</p>
                </div>
                <FolderOpen className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Tareas Pendientes</p>
                  <p className="text-3xl font-bold">{tasks.filter((t) => t.status === "pending").length}</p>
                </div>
                <CheckSquare className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Mensajes</p>
                  <p className="text-3xl font-bold">{messages.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Colaboradores</p>
                  <p className="text-3xl font-bold">1</p>
                </div>
                <Users className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Proyectos
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tareas
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mis Proyectos</h2>
              <Button
                onClick={() => setShowCreateProject(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </div>

            {projects.length === 0 ? (
              <Card className="p-12 text-center">
                <FolderOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay proyectos creados</h3>
                <p className="text-gray-500 mb-6">Crea tu primer proyecto colaborativo para empezar</p>
                <Button
                  onClick={() => setShowCreateProject(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Mi Primer Proyecto
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge variant="secondary">{project.category}</Badge>
                      </div>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progreso</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {project.members} miembros
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckSquare className="h-4 w-4" />
                            {project.tasks} tareas
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Gestionar
                          </Button>
                          <Button variant="outline" size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Invitar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Create Project Modal */}
            {showCreateProject && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Crear Nuevo Proyecto</CardTitle>
                    <CardDescription>Configura tu proyecto colaborativo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateProject} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nombre del Proyecto</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" name="description" required />
                      </div>
                      <div>
                        <Label htmlFor="category">Categoría</Label>
                        <Select name="category" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="diseno">Diseño</SelectItem>
                            <SelectItem value="desarrollo">Desarrollo</SelectItem>
                            <SelectItem value="investigacion">Investigación</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="educacion">Educación</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="deadline">Fecha Límite</Label>
                        <Input id="deadline" name="deadline" type="date" required />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          Crear Proyecto
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowCreateProject(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestión de Tareas</h2>
              <Button
                onClick={() => setShowCreateTask(true)}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Tarea
              </Button>
            </div>

            {tasks.length === 0 ? (
              <Card className="p-12 text-center">
                <CheckSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay tareas asignadas</h3>
                <p className="text-gray-500 mb-6">Crea tu primera tarea para organizar el trabajo</p>
                <Button
                  onClick={() => setShowCreateTask(true)}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Mi Primera Tarea
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{task.title}</h3>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                            </Badge>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status === "completed"
                                ? "Completada"
                                : task.status === "in-progress"
                                  ? "En Progreso"
                                  : "Pendiente"}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {task.assignee}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Editar
                          </Button>
                          <Button size="sm">Completar</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Create Task Modal */}
            {showCreateTask && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Crear Nueva Tarea</CardTitle>
                    <CardDescription>Asigna una nueva tarea al equipo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateTask} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Título de la Tarea</Label>
                        <Input id="title" name="title" required />
                      </div>
                      <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" name="description" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="priority">Prioridad</Label>
                          <Select name="priority" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">Alta</SelectItem>
                              <SelectItem value="medium">Media</SelectItem>
                              <SelectItem value="low">Baja</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="dueDate">Fecha Límite</Label>
                          <Input id="dueDate" name="dueDate" type="date" required />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          Crear Tarea
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowCreateTask(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <h2 className="text-2xl font-bold">Chat de Equipo</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="h-96">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Chat General
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {messages.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-500">No hay mensajes aún</p>
                          <p className="text-sm text-gray-400">Envía el primer mensaje para empezar la conversación</p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div key={message.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{message.sender[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{message.sender}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm">{message.text}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        className="flex-1"
                      />
                      <Button type="submit" size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Miembros del Equipo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>TU</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">Tú</p>
                          <p className="text-xs text-gray-500">Administrador</p>
                        </div>
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      </div>

                      <div className="text-center py-4">
                        <Button variant="outline" size="sm" className="w-full">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invitar Miembros
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics de Colaboración</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Productividad del Equipo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No hay datos suficientes para mostrar gráficos</p>
                    <p className="text-sm text-gray-400 mt-2">Crea proyectos y tareas para ver analytics detallados</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Actividad de Colaboración
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No hay actividad colaborativa</p>
                    <p className="text-sm text-gray-400 mt-2">Invita miembros para ver métricas de colaboración</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
