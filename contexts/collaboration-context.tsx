"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface CollaborationProject {
  id: string
  name: string
  description: string
  image: string
  owner: string
  ownerAvatar: string
  members: ProjectMember[]
  status: "active" | "completed" | "paused" | "planning"
  progress: number
  lastActivity: string
  category: string
  isOwner: boolean
  role: "owner" | "admin" | "collaborator" | "viewer"
  tasks: ProjectTask[]
  versions: ProjectVersion[]
  comments: ProjectComment[]
  createdAt: string
  updatedAt: string
}

interface ProjectMember {
  id: string
  name: string
  email: string
  avatar: string
  role: "owner" | "admin" | "collaborator" | "viewer"
  joinedAt: string
  lastActive: string
  contributions: number
  permissions: string[]
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
  attachments: string[]
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
  files: ProjectFile[]
}

interface ProjectFile {
  id: string
  name: string
  type: string
  size: string
  url: string
  uploadedBy: string
  uploadedAt: string
}

interface ProjectComment {
  id: string
  author: string
  authorAvatar: string
  content: string
  timestamp: string
  type: "general" | "version" | "task" | "file"
  targetId?: string
  replies?: ProjectComment[]
  attachments?: string[]
}

interface CollaborationContextType {
  projects: CollaborationProject[]
  currentProject: CollaborationProject | null
  isLoading: boolean
  createProject: (projectData: Partial<CollaborationProject>) => Promise<void>
  updateProject: (projectId: string, updates: Partial<CollaborationProject>) => Promise<void>
  deleteProject: (projectId: string) => Promise<void>
  joinProject: (projectId: string, inviteCode?: string) => Promise<void>
  leaveProject: (projectId: string) => Promise<void>
  inviteMember: (projectId: string, email: string, role: string) => Promise<void>
  removeMember: (projectId: string, memberId: string) => Promise<void>
  updateMemberRole: (projectId: string, memberId: string, newRole: string) => Promise<void>
  createTask: (projectId: string, taskData: Partial<ProjectTask>) => Promise<void>
  updateTask: (projectId: string, taskId: string, updates: Partial<ProjectTask>) => Promise<void>
  deleteTask: (projectId: string, taskId: string) => Promise<void>
  createVersion: (projectId: string, versionData: Partial<ProjectVersion>) => Promise<void>
  updateVersion: (projectId: string, versionId: string, updates: Partial<ProjectVersion>) => Promise<void>
  deleteVersion: (projectId: string, versionId: string) => Promise<void>
  addComment: (projectId: string, commentData: Partial<ProjectComment>) => Promise<void>
  updateComment: (projectId: string, commentId: string, content: string) => Promise<void>
  deleteComment: (projectId: string, commentId: string) => Promise<void>
  uploadFile: (projectId: string, file: File, type: "model" | "texture" | "document") => Promise<void>
  deleteFile: (projectId: string, fileId: string) => Promise<void>
  setCurrentProject: (project: CollaborationProject | null) => void
  refreshProjects: () => Promise<void>
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined)

export function CollaborationProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<CollaborationProject[]>([])
  const [currentProject, setCurrentProject] = useState<CollaborationProject | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Inicializar con datos de ejemplo
  useEffect(() => {
    initializeProjects()
  }, [])

  const initializeProjects = async () => {
    setIsLoading(true)

    // Simular datos de ejemplo
    const sampleProjects: CollaborationProject[] = [
      {
        id: "1",
        name: "Figura Dragon Ball Z - Goku Ultra Instinct",
        description:
          "Proyecto colaborativo para crear la figura más detallada de Goku en su forma Ultra Instinct con articulaciones móviles y efectos especiales.",
        image: "/images/goku-figure.png",
        owner: "Carlos Mendez",
        ownerAvatar: "/placeholder.svg?height=40&width=40",
        members: [
          {
            id: "1",
            name: "Carlos Mendez",
            email: "carlos@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "owner",
            joinedAt: "2024-01-15",
            lastActive: "2024-03-20",
            contributions: 45,
            permissions: ["all"],
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
            permissions: ["edit", "comment", "upload"],
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
            permissions: ["edit", "comment", "upload"],
          },
        ],
        status: "active",
        progress: 78,
        lastActivity: "hace 2 horas",
        category: "Figuras",
        isOwner: true,
        role: "owner",
        tasks: [],
        versions: [],
        comments: [],
        createdAt: "2024-01-15",
        updatedAt: "2024-03-20",
      },
      {
        id: "2",
        name: "Sistema de Organización Modular",
        description:
          "Conjunto de piezas modulares para organización de escritorio y hogar con sistema de conexión magnética.",
        image: "/images/desk-organizer.png",
        owner: "Ana López",
        ownerAvatar: "/placeholder.svg?height=40&width=40",
        members: [
          {
            id: "2",
            name: "Ana López",
            email: "ana@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "owner",
            joinedAt: "2024-01-20",
            lastActive: "2024-03-19",
            contributions: 38,
            permissions: ["all"],
          },
          {
            id: "1",
            name: "Carlos Mendez",
            email: "carlos@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "collaborator",
            joinedAt: "2024-02-05",
            lastActive: "2024-03-18",
            contributions: 22,
            permissions: ["edit", "comment"],
          },
        ],
        status: "active",
        progress: 45,
        lastActivity: "hace 1 día",
        category: "Hogar",
        isOwner: false,
        role: "collaborator",
        tasks: [],
        versions: [],
        comments: [],
        createdAt: "2024-01-20",
        updatedAt: "2024-03-19",
      },
    ]

    setProjects(sampleProjects)
    setIsLoading(false)
  }

  const createProject = async (projectData: Partial<CollaborationProject>) => {
    setIsLoading(true)
    try {
      const newProject: CollaborationProject = {
        id: Date.now().toString(),
        name: projectData.name || "",
        description: projectData.description || "",
        image: projectData.image || "/placeholder.svg?height=200&width=300",
        owner: "Usuario Actual",
        ownerAvatar: "/placeholder.svg?height=40&width=40",
        members: [
          {
            id: "current-user",
            name: "Usuario Actual",
            email: "usuario@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "owner",
            joinedAt: new Date().toISOString().split("T")[0],
            lastActive: new Date().toISOString().split("T")[0],
            contributions: 0,
            permissions: ["all"],
          },
        ],
        status: "planning",
        progress: 0,
        lastActivity: "ahora",
        category: projectData.category || "General",
        isOwner: true,
        role: "owner",
        tasks: [],
        versions: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setProjects((prev) => [...prev, newProject])
      toast({
        title: "Proyecto creado",
        description: `El proyecto "${newProject.name}" ha sido creado exitosamente.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el proyecto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateProject = async (projectId: string, updates: Partial<CollaborationProject>) => {
    setIsLoading(true)
    try {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId ? { ...project, ...updates, updatedAt: new Date().toISOString() } : project,
        ),
      )

      if (currentProject?.id === projectId) {
        setCurrentProject((prev) => (prev ? { ...prev, ...updates } : null))
      }

      toast({
        title: "Proyecto actualizado",
        description: "Los cambios han sido guardados exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el proyecto.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProject = async (projectId: string) => {
    setIsLoading(true)
    try {
      setProjects((prev) => prev.filter((project) => project.id !== projectId))

      if (currentProject?.id === projectId) {
        setCurrentProject(null)
      }

      toast({
        title: "Proyecto eliminado",
        description: "El proyecto ha sido eliminado exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el proyecto.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const inviteMember = async (projectId: string, email: string, role: string) => {
    setIsLoading(true)
    try {
      const newMember: ProjectMember = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email,
        avatar: "/placeholder.svg?height=40&width=40",
        role: role as "owner" | "admin" | "collaborator" | "viewer",
        joinedAt: new Date().toISOString().split("T")[0],
        lastActive: new Date().toISOString().split("T")[0],
        contributions: 0,
        permissions: role === "admin" ? ["edit", "comment", "upload", "manage"] : ["edit", "comment"],
      }

      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId ? { ...project, members: [...project.members, newMember] } : project,
        ),
      )

      toast({
        title: "Invitación enviada",
        description: `Se ha enviado una invitación a ${email}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la invitación.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createTask = async (projectId: string, taskData: Partial<ProjectTask>) => {
    setIsLoading(true)
    try {
      const newTask: ProjectTask = {
        id: Date.now().toString(),
        title: taskData.title || "",
        description: taskData.description || "",
        assignee: taskData.assignee || "Sin asignar",
        assigneeAvatar: "/placeholder.svg?height=32&width=32",
        status: "todo",
        priority: taskData.priority || "medium",
        dueDate: taskData.dueDate || "",
        createdAt: new Date().toISOString().split("T")[0],
        comments: 0,
        labels: taskData.labels || [],
        attachments: [],
      }

      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId ? { ...project, tasks: [...project.tasks, newTask] } : project,
        ),
      )

      toast({
        title: "Tarea creada",
        description: "La nueva tarea ha sido añadida al proyecto.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la tarea.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateTask = async (projectId: string, taskId: string, updates: Partial<ProjectTask>) => {
    setIsLoading(true)
    try {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
              }
            : project,
        ),
      )

      toast({
        title: "Tarea actualizada",
        description: "Los cambios han sido guardados.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la tarea.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addComment = async (projectId: string, commentData: Partial<ProjectComment>) => {
    setIsLoading(true)
    try {
      const newComment: ProjectComment = {
        id: Date.now().toString(),
        author: "Usuario Actual",
        authorAvatar: "/placeholder.svg?height=32&width=32",
        content: commentData.content || "",
        timestamp: new Date().toLocaleString(),
        type: commentData.type || "general",
        targetId: commentData.targetId,
        replies: [],
        attachments: commentData.attachments || [],
      }

      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId ? { ...project, comments: [...project.comments, newComment] } : project,
        ),
      )

      toast({
        title: "Comentario añadido",
        description: "Tu comentario ha sido publicado.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo añadir el comentario.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProjects = async () => {
    await initializeProjects()
  }

  // Funciones placeholder para otras operaciones
  const joinProject = async (projectId: string, inviteCode?: string) => {
    toast({ title: "Funcionalidad en desarrollo", description: "Unirse a proyecto próximamente." })
  }

  const leaveProject = async (projectId: string) => {
    toast({ title: "Funcionalidad en desarrollo", description: "Abandonar proyecto próximamente." })
  }

  const removeMember = async (projectId: string, memberId: string) => {
    toast({ title: "Funcionalidad en desarrollo", description: "Remover miembro próximamente." })
  }

  const updateMemberRole = async (projectId: string, memberId: string, newRole: string) => {
    toast({ title: "Funcionalidad en desarrollo", description: "Actualizar rol próximamente." })
  }

  const deleteTask = async (projectId: string, taskId: string) => {
    toast({ title: "Funcionalidad en desarrollo", description: "Eliminar tarea próximamente." })
  }

  const createVersion = async (projectId: string, versionData: Partial<ProjectVersion>) => {
    toast({ title: "Funcionalidad en desarrollo", description: "Crear versión próximamente." })
  }

  const updateVersion = async (projectId: string, versionId: string, updates: Partial<ProjectVersion>) => {
    toast({ title: "Funcionalidad en desarrollo", description: "Actualizar versión próximamente." })
  }

  const deleteVersion = async (projectId: string, versionId: string) => {
    toast({ title: "Funcionalidad en desarrollo", description: "Eliminar versión próximamente." })
  }

  const updateComment = async (projectId: string, commentId: string, content: string) => {
    toast({ title: "Funcionalidad en desarrollo", description: "Editar comentario próximamente." })
  }

  const deleteComment = async (projectId: string, commentId: string) => {
    toast({ title: "Funcionalidad en desarrollo", description: "Eliminar comentario próximamente." })
  }

  const uploadFile = async (projectId: string, file: File, type: "model" | "texture" | "document") => {
    toast({ title: "Funcionalidad en desarrollo", description: "Subir archivo próximamente." })
  }

  const deleteFile = async (projectId: string, fileId: string) => {
    toast({ title: "Funcionalidad en desarrollo", description: "Eliminar archivo próximamente." })
  }

  const value: CollaborationContextType = {
    projects,
    currentProject,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    joinProject,
    leaveProject,
    inviteMember,
    removeMember,
    updateMemberRole,
    createTask,
    updateTask,
    deleteTask,
    createVersion,
    updateVersion,
    deleteVersion,
    addComment,
    updateComment,
    deleteComment,
    uploadFile,
    deleteFile,
    setCurrentProject,
    refreshProjects,
  }

  return <CollaborationContext.Provider value={value}>{children}</CollaborationContext.Provider>
}

export function useCollaboration() {
  const context = useContext(CollaborationContext)
  if (context === undefined) {
    throw new Error("useCollaboration must be used within a CollaborationProvider")
  }
  return context
}
