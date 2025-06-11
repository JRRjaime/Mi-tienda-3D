"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Plus,
  Search,
  Filter,
  GitBranch,
  Clock,
  Star,
  Eye,
  MessageSquare,
  Target,
  Activity,
  Zap,
  Award,
  Settings,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCollaboration } from "@/contexts/collaboration-context"
import { CreateProjectModal } from "./create-project-modal"

export function CollaborationDashboard() {
  const { projects, isLoading, refreshProjects } = useCollaboration()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    refreshProjects()
  }, [])

  // Filtrar proyectos
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesRole = roleFilter === "all" || project.role === roleFilter

    if (activeTab === "my-projects") {
      return matchesSearch && matchesStatus && matchesRole && project.isOwner
    } else if (activeTab === "collaborating") {
      return matchesSearch && matchesStatus && matchesRole && !project.isOwner
    }

    return matchesSearch && matchesStatus && matchesRole
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      case "paused":
        return "bg-yellow-500"
      case "planning":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo"
      case "completed":
        return "Completado"
      case "paused":
        return "Pausado"
      case "planning":
        return "Planificación"
      default:
        return status
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "owner":
        return "Propietario"
      case "admin":
        return "Administrador"
      case "collaborator":
        return "Colaborador"
      case "viewer":
        return "Visualizador"
      default:
        return role
    }
  }

  // Estadísticas generales
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "active").length
  const ownedProjects = projects.filter((p) => p.isOwner).length
  const collaboratingProjects = projects.filter((p) => !p.isOwner).length
  const totalMembers = projects.reduce((acc, project) => acc + project.members.length, 0)
  const avgProgress =
    projects.length > 0 ? Math.round(projects.reduce((acc, project) => acc + project.progress, 0) / projects.length) : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Cargando proyectos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-8">
        <Image src="/images/team-workspace.png" alt="Colaboración" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">Centro de Colaboración</h1>
            <p className="text-gray-200 mb-4">Gestiona todos tus proyectos colaborativos en un solo lugar</p>
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-500">
                <Users className="h-3 w-3 mr-1" />
                {totalProjects} proyectos
              </Badge>
              <Badge className="bg-green-500">
                <Activity className="h-3 w-3 mr-1" />
                {activeProjects} activos
              </Badge>
              <Badge className="bg-purple-500">
                <Award className="h-3 w-3 mr-1" />
                {ownedProjects} propios
              </Badge>
              <Badge className="bg-cyan-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                {avgProgress}% progreso promedio
              </Badge>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Proyectos Totales</CardTitle>
            <Target className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">{totalProjects}</div>
            <p className="text-xs text-gray-400">
              {totalProjects > 0 ? `+${Math.floor(totalProjects * 0.2)} este mes` : "Crea tu primer proyecto"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Proyectos Activos</CardTitle>
            <Zap className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{activeProjects}</div>
            <p className="text-xs text-gray-400">En desarrollo activo</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Colaboradores</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{totalMembers}</div>
            <p className="text-xs text-gray-400">Miembros en total</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Progreso Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{avgProgress}%</div>
            <p className="text-xs text-gray-400">Completado en promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar proyectos por nombre o descripción..."
                  className="pl-9 bg-white/5 border-white/10 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="paused">Pausado</SelectItem>
                  <SelectItem value="planning">Planificación</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="owner">Propietario</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="collaborator">Colaborador</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de proyectos */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Todos los Proyectos ({filteredProjects.length})
          </TabsTrigger>
          <TabsTrigger value="my-projects" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Mis Proyectos ({projects.filter((p) => p.isOwner).length})
          </TabsTrigger>
          <TabsTrigger value="collaborating" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Colaborando ({projects.filter((p) => !p.isOwner).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="relative">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
                      <Badge className={getRoleColor(project.role)}>{getRoleText(project.role)}</Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-black/50 text-white">{project.category}</Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg line-clamp-2 group-hover:text-cyan-400 transition-colors">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="text-gray-300 line-clamp-2 mt-1">
                          {project.description}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Propietario y última actividad */}
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={project.ownerAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{project.owner.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-gray-400 text-sm">{project.owner}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {project.lastActivity}
                      </span>
                    </div>

                    {/* Progreso */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progreso</span>
                        <span className="text-white font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-400">
                          <Users className="h-3 w-3" />
                          <span>{project.members.length}</span>
                        </div>
                        <p className="text-xs text-gray-500">Miembros</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-400">
                          <GitBranch className="h-3 w-3" />
                          <span>{project.versions.length}</span>
                        </div>
                        <p className="text-xs text-gray-500">Versiones</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-400">
                          <MessageSquare className="h-3 w-3" />
                          <span>{project.comments.length}</span>
                        </div>
                        <p className="text-xs text-gray-500">Comentarios</p>
                      </div>
                    </div>

                    {/* Tareas */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Tareas</span>
                        <span className="text-white">
                          {project.tasks.filter((t) => t.status === "completed").length}/{project.tasks.length}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.max(project.tasks.length, 5) }, (_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded ${
                              i < project.tasks.filter((t) => t.status === "completed").length
                                ? "bg-green-500"
                                : i < project.tasks.length
                                  ? "bg-yellow-500"
                                  : "bg-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 pt-2 border-t border-white/10">
                      <Link href={`/collaboration/project/${project.id}`} className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                          <Eye className="h-4 w-4 mr-1" />
                          {project.isOwner ? "Gestionar" : "Colaborar"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-12 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">
                  {searchQuery || statusFilter !== "all" || roleFilter !== "all"
                    ? "No se encontraron proyectos"
                    : "¡Comienza tu primer proyecto colaborativo!"}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {searchQuery || statusFilter !== "all" || roleFilter !== "all"
                    ? "Intenta ajustar los filtros o crear un nuevo proyecto colaborativo"
                    : "Crea un proyecto y comienza a colaborar con otros diseñadores y makers"}
                </p>
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Proyecto
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-projects" className="space-y-6">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="relative">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
                      <Badge className="bg-purple-500">Propietario</Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-black/50 text-white">{project.category}</Badge>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-black/20">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-lg line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300 line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Estadísticas del propietario */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-purple-400">
                          <Users className="h-3 w-3" />
                          <span>{project.members.length}</span>
                        </div>
                        <p className="text-xs text-gray-500">Miembros</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-purple-400">
                          <GitBranch className="h-3 w-3" />
                          <span>{project.versions.length}</span>
                        </div>
                        <p className="text-xs text-gray-500">Versiones</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-purple-400">
                          <Target className="h-3 w-3" />
                          <span>{project.tasks.filter((t) => t.status !== "completed").length}</span>
                        </div>
                        <p className="text-xs text-gray-500">Pendientes</p>
                      </div>
                    </div>

                    {/* Progreso */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progreso del Proyecto</span>
                        <span className="text-white font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Actividad reciente */}
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Última actividad</span>
                        <span className="text-xs text-gray-500">{project.lastActivity}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {project.members.length} miembros activos • {project.tasks.length} tareas totales
                      </div>
                    </div>

                    {/* Acciones del propietario */}
                    <div className="flex gap-2 pt-2 border-t border-white/10">
                      <Link href={`/collaboration/project/${project.id}`} className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                          <Settings className="h-4 w-4 mr-1" />
                          Gestionar
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-12 text-center">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">Aún no tienes proyectos propios</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Crea tu primer proyecto y comienza a liderar equipos de colaboración
                </p>
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Mi Primer Proyecto
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="collaborating" className="space-y-6">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="relative">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
                      <Badge className={getRoleColor(project.role)}>{getRoleText(project.role)}</Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-black/50 text-white">{project.category}</Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-lg line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300 line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Propietario del proyecto */}
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={project.ownerAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{project.owner.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-gray-400 text-sm">Propietario: {project.owner}</span>
                    </div>

                    {/* Mi rol y contribución */}
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Mi rol</span>
                        <Badge className={getRoleColor(project.role)}>{getRoleText(project.role)}</Badge>
                      </div>
                      <div className="text-xs text-gray-500">Última actividad: {project.lastActivity}</div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-1 text-blue-400">
                          <Clock className="h-3 w-3" />
                          <span>{project.progress}%</span>
                        </div>
                        <p className="text-xs text-gray-500">Completado</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-blue-400">
                          <MessageSquare className="h-3 w-3" />
                          <span>{project.comments.length}</span>
                        </div>
                        <p className="text-xs text-gray-500">Comentarios</p>
                      </div>
                    </div>

                    {/* Acciones del colaborador */}
                    <div className="flex gap-2 pt-2 border-t border-white/10">
                      <Link href={`/collaboration/project/${project.id}`} className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                          <Eye className="h-4 w-4 mr-1" />
                          Colaborar
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">No estás colaborando en ningún proyecto</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Únete a proyectos existentes o espera invitaciones de otros creadores
                </p>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  onClick={() => setActiveTab("all")}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Explorar Proyectos
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de creación de proyecto */}
      <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
