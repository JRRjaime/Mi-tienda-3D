"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Save, Plus, Edit, Trash2, Copy, Type, Bell, Mail, Smartphone, MessageSquare } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NotificationTemplate {
  id: string
  name: string
  type: "sales" | "orders" | "messages" | "followers" | "system" | "marketing"
  channel: "email" | "push" | "sms" | "inApp"
  title: string
  body: string
  icon: string
  color: string
  variables: string[]
  isDefault: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export function NotificationTemplates() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: "1",
      name: "Venta Completada",
      type: "sales",
      channel: "push",
      title: "¡Nueva venta! 🎉",
      body: "Has vendido {modelName} por ${amount}. ¡Felicidades!",
      icon: "💰",
      color: "#10B981",
      variables: ["modelName", "amount", "buyerName", "date"],
      isDefault: true,
      isActive: true,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Nuevo Pedido",
      type: "orders",
      channel: "email",
      title: "Nuevo pedido de impresión",
      body: "{customerName} ha solicitado imprimir {modelName}. Material: {material}, Cantidad: {quantity}",
      icon: "🖨️",
      color: "#3B82F6",
      variables: ["customerName", "modelName", "material", "quantity", "deadline"],
      isDefault: true,
      isActive: true,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "3",
      name: "Mensaje Recibido",
      type: "messages",
      channel: "push",
      title: "Nuevo mensaje",
      body: "{senderName}: {preview}",
      icon: "💬",
      color: "#8B5CF6",
      variables: ["senderName", "preview", "timestamp"],
      isDefault: true,
      isActive: true,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [previewData, setPreviewData] = useState<Record<string, string>>({})

  const createNewTemplate = () => {
    const newTemplate: NotificationTemplate = {
      id: Date.now().toString(),
      name: "Nueva Plantilla",
      type: "system",
      channel: "push",
      title: "Título de la notificación",
      body: "Cuerpo del mensaje",
      icon: "🔔",
      color: "#6366F1",
      variables: [],
      isDefault: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTemplates([...templates, newTemplate])
    setSelectedTemplate(newTemplate)
    setIsEditing(true)
  }

  const updateTemplate = (updatedTemplate: NotificationTemplate) => {
    setTemplates(
      templates.map((t) => (t.id === updatedTemplate.id ? { ...updatedTemplate, updatedAt: new Date() } : t)),
    )
    setSelectedTemplate(updatedTemplate)
  }

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id))
    if (selectedTemplate?.id === id) {
      setSelectedTemplate(null)
    }
  }

  const duplicateTemplate = (template: NotificationTemplate) => {
    const duplicated: NotificationTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copia)`,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTemplates([...templates, duplicated])
  }

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{([^}]+)\}/g)
    return matches ? matches.map((match) => match.slice(1, -1)) : []
  }

  const renderPreview = (template: NotificationTemplate) => {
    let title = template.title
    let body = template.body

    // Reemplazar variables con datos de preview
    template.variables.forEach((variable) => {
      const value = previewData[variable] || `{${variable}}`
      title = title.replace(new RegExp(`\\{${variable}\\}`, "g"), value)
      body = body.replace(new RegExp(`\\{${variable}\\}`, "g"), value)
    })

    return { title, body }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "push":
        return <Smartphone className="h-4 w-4" />
      case "sms":
        return <MessageSquare className="h-4 w-4" />
      case "inApp":
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "sales":
        return "bg-green-500"
      case "orders":
        return "bg-blue-500"
      case "messages":
        return "bg-purple-500"
      case "followers":
        return "bg-yellow-500"
      case "system":
        return "bg-red-500"
      case "marketing":
        return "bg-pink-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Type className="h-5 w-5" />
                Plantillas de Notificaciones
              </CardTitle>
              <CardDescription className="text-gray-300">
                Personaliza el contenido y diseño de tus notificaciones
              </CardDescription>
            </div>
            <Button onClick={createNewTemplate} className="bg-gradient-to-r from-cyan-500 to-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Plantilla
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista de plantillas */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">Plantillas Disponibles</h3>
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{template.icon}</span>
                        <h4 className="text-white font-medium">{template.name}</h4>
                        {template.isDefault && <Badge className="bg-blue-500 text-xs">Por defecto</Badge>}
                      </div>
                      <div className="flex items-center gap-1">
                        {getChannelIcon(template.channel)}
                        <Badge className={`${getTypeColor(template.type)} text-xs`}>{template.type}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{template.body}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{template.variables.length} variables</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedTemplate(template)
                            setIsEditing(true)
                          }}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateTemplate(template)
                          }}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {!template.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteTemplate(template.id)
                            }}
                            className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editor/Preview de plantilla */}
            <div className="space-y-4">
              {selectedTemplate ? (
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview">Vista Previa</TabsTrigger>
                    <TabsTrigger value="edit">Editar</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-white font-medium">Vista Previa</h3>

                      {/* Datos de prueba para preview */}
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Datos de prueba:</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedTemplate.variables.map((variable) => (
                            <Input
                              key={variable}
                              placeholder={variable}
                              value={previewData[variable] || ""}
                              onChange={(e) =>
                                setPreviewData({
                                  ...previewData,
                                  [variable]: e.target.value,
                                })
                              }
                              className="bg-white/5 border-white/10 text-white text-xs"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Preview de la notificación */}
                      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: selectedTemplate.color }}
                          >
                            <span>{selectedTemplate.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium text-sm">{renderPreview(selectedTemplate).title}</h4>
                            <p className="text-gray-300 text-sm mt-1">{renderPreview(selectedTemplate).body}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={`${getTypeColor(selectedTemplate.type)} text-xs`}>
                                {selectedTemplate.type}
                              </Badge>
                              <span className="text-xs text-gray-500">{getChannelIcon(selectedTemplate.channel)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="edit" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-white font-medium">Editar Plantilla</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">Nombre</Label>
                          <Input
                            value={selectedTemplate.name}
                            onChange={(e) =>
                              updateTemplate({
                                ...selectedTemplate,
                                name: e.target.value,
                              })
                            }
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Tipo</Label>
                          <Select
                            value={selectedTemplate.type}
                            onValueChange={(value) =>
                              updateTemplate({
                                ...selectedTemplate,
                                type: value as any,
                              })
                            }
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sales">Ventas</SelectItem>
                              <SelectItem value="orders">Pedidos</SelectItem>
                              <SelectItem value="messages">Mensajes</SelectItem>
                              <SelectItem value="followers">Seguidores</SelectItem>
                              <SelectItem value="system">Sistema</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">Canal</Label>
                          <Select
                            value={selectedTemplate.channel}
                            onValueChange={(value) =>
                              updateTemplate({
                                ...selectedTemplate,
                                channel: value as any,
                              })
                            }
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="push">Push</SelectItem>
                              <SelectItem value="sms">SMS</SelectItem>
                              <SelectItem value="inApp">En la app</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={selectedTemplate.color}
                              onChange={(e) =>
                                updateTemplate({
                                  ...selectedTemplate,
                                  color: e.target.value,
                                })
                              }
                              className="w-12 h-10 bg-white/5 border-white/10"
                            />
                            <Input
                              value={selectedTemplate.color}
                              onChange={(e) =>
                                updateTemplate({
                                  ...selectedTemplate,
                                  color: e.target.value,
                                })
                              }
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Título</Label>
                        <Input
                          value={selectedTemplate.title}
                          onChange={(e) => {
                            const newTitle = e.target.value
                            const variables = extractVariables(newTitle + selectedTemplate.body)
                            updateTemplate({
                              ...selectedTemplate,
                              title: newTitle,
                              variables,
                            })
                          }}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Cuerpo del mensaje</Label>
                        <Textarea
                          value={selectedTemplate.body}
                          onChange={(e) => {
                            const newBody = e.target.value
                            const variables = extractVariables(selectedTemplate.title + newBody)
                            updateTemplate({
                              ...selectedTemplate,
                              body: newBody,
                              variables,
                            })
                          }}
                          className="bg-white/5 border-white/10 text-white"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Icono (emoji)</Label>
                        <Input
                          value={selectedTemplate.icon}
                          onChange={(e) =>
                            updateTemplate({
                              ...selectedTemplate,
                              icon: e.target.value,
                            })
                          }
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="🔔"
                        />
                      </div>

                      {selectedTemplate.variables.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-white">Variables detectadas</Label>
                          <div className="flex flex-wrap gap-2">
                            {selectedTemplate.variables.map((variable) => (
                              <Badge key={variable} className="bg-purple-500">
                                {variable}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={() => setIsEditing(false)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <Type className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Selecciona una plantilla para ver o editar</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
