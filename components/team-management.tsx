"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
  Trash2,
  Edit,
  Eye,
  EyeOff,
} from "lucide-react"
import Image from "next/image"

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  status: "active" | "pending" | "inactive"
  joinedAt: string
  lastActive: string
  permissions: string[]
}

interface TeamInvite {
  id: string
  email: string
  role: string
  sentAt: string
  expiresAt: string
  status: "pending" | "expired" | "accepted" | "rejected"
}

export function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Carlos Rodríguez",
      email: "carlos@example.com",
      role: "admin",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "active",
      joinedAt: "2023-10-15",
      lastActive: "2024-03-20",
      permissions: ["all"],
    },
    {
      id: "2",
      name: "Ana Martínez",
      email: "ana@example.com",
      role: "editor",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "active",
      joinedAt: "2023-11-05",
      lastActive: "2024-03-19",
      permissions: ["create", "edit", "publish"],
    },
    {
      id: "3",
      name: "Miguel López",
      email: "miguel@example.com",
      role: "viewer",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "active",
      joinedAt: "2024-01-20",
      lastActive: "2024-03-15",
      permissions: ["view"],
    },
    {
      id: "4",
      name: "Laura Sánchez",
      email: "laura@example.com",
      role: "editor",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "inactive",
      joinedAt: "2023-12-10",
      lastActive: "2024-02-28",
      permissions: ["create", "edit"],
    },
  ])

  const [invites, setInvites] = useState<TeamInvite[]>([
    {
      id: "1",
      email: "pedro@example.com",
      role: "editor",
      sentAt: "2024-03-15",
      expiresAt: "2024-03-22",
      status: "pending",
    },
    {
      id: "2",
      email: "sofia@example.com",
      role: "viewer",
      sentAt: "2024-03-10",
      expiresAt: "2024-03-17",
      status: "expired",
    },
  ])

  const [newInvite, setNewInvite] = useState({
    email: "",
    role: "viewer",
  })

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleSendInvite = () => {
    const invite: TeamInvite = {
      id: Date.now().toString(),
      email: newInvite.email,
      role: newInvite.role,
      sentAt: new Date().toISOString().split("T")[0],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "pending",
    }
    setInvites([...invites, invite])
    setNewInvite({ email: "", role: "viewer" })
  }

  const handleResendInvite = (id: string) => {
    setInvites(
      invites.map((invite) =>
        invite.id === id
          ? {
              ...invite,
              sentAt: new Date().toISOString().split("T")[0],
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: "pending",
            }
          : invite,
      ),
    )
  }

  const handleCancelInvite = (id: string) => {
    setInvites(invites.filter((invite) => invite.id !== id))
  }

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member)
    setIsEditing(true)
  }

  const handleSaveMember = () => {
    if (selectedMember) {
      setTeamMembers(teamMembers.map((member) => (member.id === selectedMember.id ? selectedMember : member)))
      setIsEditing(false)
      setSelectedMember(null)
    }
  }

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setTeamMembers(
      teamMembers.map((member) =>
        member.id === id ? { ...member, status: member.status === "active" ? "inactive" : "active" } : member,
      ),
    )
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500"
      case "editor":
        return "bg-blue-500"
      case "viewer":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-400" />
      case "inactive":
        return <EyeOff className="h-4 w-4 text-gray-400" />
      case "expired":
        return <AlertTriangle className="h-4 w-4 text-orange-400" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-8">
        <Image src="/images/team-collaboration.png" alt="Gestión de equipos" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Gestión de Equipos</h1>
            <p className="text-gray-200">Administra los miembros de tu equipo y sus permisos</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="members">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Miembros
          </TabsTrigger>
          <TabsTrigger value="invites" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invitaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Miembros del Equipo
              </CardTitle>
              <CardDescription className="text-gray-300">Gestiona los miembros actuales y sus permisos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      member.status === "active" ? "bg-white/5 border-white/10" : "bg-white/2 border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-white">{member.name}</div>
                          <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(member.status)}
                            <span className="text-xs text-gray-400 capitalize">{member.status}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">{member.email}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Miembro desde {member.joinedAt} • Último acceso {member.lastActive}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(member.id)}
                        className="h-8 w-8 text-gray-400 hover:text-white"
                      >
                        {member.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditMember(member)}
                        className="h-8 w-8 text-gray-400 hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {member.role !== "admin" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(member.id)}
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invites" className="space-y-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Invitar Nuevos Miembros
              </CardTitle>
              <CardDescription className="text-gray-300">Envía invitaciones para unirse a tu equipo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label className="text-white">Email</Label>
                  <Input
                    value={newInvite.email}
                    onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Rol</Label>
                  <Select value={newInvite.role} onValueChange={(value) => setNewInvite({ ...newInvite, role: value })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleSendInvite}
                disabled={!newInvite.email}
                className="bg-gradient-to-r from-blue-500 to-purple-500"
              >
                <Mail className="h-4 w-4 mr-2" />
                Enviar Invitación
              </Button>

              <Separator className="bg-white/10" />

              <div className="space-y-4">
                <h3 className="text-white font-medium">Invitaciones Pendientes</h3>
                {invites.length > 0 ? (
                  invites.map((invite) => (
                    <div
                      key={invite.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        invite.status === "pending" ? "bg-white/5 border-white/10" : "bg-white/2 border-white/5"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-white">{invite.email}</div>
                          <Badge className={getRoleColor(invite.role)}>{invite.role}</Badge>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(invite.status)}
                            <span className="text-xs text-gray-400 capitalize">{invite.status}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Enviado el {invite.sentAt} • Expira el {invite.expiresAt}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {invite.status === "pending" || invite.status === "expired" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResendInvite(invite.id)}
                              className="border-white/20 text-white"
                            >
                              Reenviar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelInvite(invite.id)}
                              className="border-red-400 text-red-400"
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCancelInvite(invite.id)}
                            className="h-8 w-8 text-gray-400 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">No hay invitaciones pendientes</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de edición de miembro */}
      {selectedMember && isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Editar Miembro</CardTitle>
              <CardDescription className="text-gray-300">Modifica los detalles y permisos del miembro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src={selectedMember.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{selectedMember.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-white">{selectedMember.name}</div>
                  <div className="text-sm text-gray-400">{selectedMember.email}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Rol</Label>
                  <Select
                    value={selectedMember.role}
                    onValueChange={(value) => setSelectedMember({ ...selectedMember, role: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Estado</Label>
                  <Select
                    value={selectedMember.status}
                    onValueChange={(value: "active" | "inactive") =>
                      setSelectedMember({ ...selectedMember, status: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Permisos
                  </Label>
                  {selectedMember.role === "admin" ? (
                    <div className="text-sm text-gray-300 p-2 bg-white/5 rounded-md">
                      Los administradores tienen acceso completo a todas las funciones
                    </div>
                  ) : (
                    <div className="space-y-2 p-2 bg-white/5 rounded-md">
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300 text-sm">Ver modelos</Label>
                        <input
                          type="checkbox"
                          checked={selectedMember.permissions.includes("view")}
                          onChange={(e) => {
                            const newPermissions = e.target.checked
                              ? [...selectedMember.permissions, "view"]
                              : selectedMember.permissions.filter((p) => p !== "view")
                            setSelectedMember({ ...selectedMember, permissions: newPermissions })
                          }}
                          className="rounded bg-white/10 border-white/20"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300 text-sm">Crear modelos</Label>
                        <input
                          type="checkbox"
                          checked={selectedMember.permissions.includes("create")}
                          onChange={(e) => {
                            const newPermissions = e.target.checked
                              ? [...selectedMember.permissions, "create"]
                              : selectedMember.permissions.filter((p) => p !== "create")
                            setSelectedMember({ ...selectedMember, permissions: newPermissions })
                          }}
                          className="rounded bg-white/10 border-white/20"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300 text-sm">Editar modelos</Label>
                        <input
                          type="checkbox"
                          checked={selectedMember.permissions.includes("edit")}
                          onChange={(e) => {
                            const newPermissions = e.target.checked
                              ? [...selectedMember.permissions, "edit"]
                              : selectedMember.permissions.filter((p) => p !== "edit")
                            setSelectedMember({ ...selectedMember, permissions: newPermissions })
                          }}
                          className="rounded bg-white/10 border-white/20"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300 text-sm">Publicar modelos</Label>
                        <input
                          type="checkbox"
                          checked={selectedMember.permissions.includes("publish")}
                          onChange={(e) => {
                            const newPermissions = e.target.checked
                              ? [...selectedMember.permissions, "publish"]
                              : selectedMember.permissions.filter((p) => p !== "publish")
                            setSelectedMember({ ...selectedMember, permissions: newPermissions })
                          }}
                          className="rounded bg-white/10 border-white/20"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <div className="flex justify-between p-6 pt-0">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="border-white/20 text-white">
                Cancelar
              </Button>
              <Button onClick={handleSaveMember} className="bg-gradient-to-r from-green-500 to-emerald-500">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Button
        onClick={() => console.log("Guardando configuración de equipo")}
        className="bg-gradient-to-r from-blue-500 to-purple-500"
      >
        <Save className="h-4 w-4 mr-2" />
        Guardar Configuración de Equipo
      </Button>
    </div>
  )
}
