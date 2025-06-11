"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Save,
  Eye,
  Edit,
  Trash2,
  Plus,
  Copy,
  Download,
  Settings,
  Target,
  Users,
  Printer,
  MessageCircle,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"

interface NotificationTemplate {
  id: string
  name: string
  type: "email" | "push" | "sms" | "in-app"
  category: "sales" | "orders" | "messages" | "system" | "marketing" | "social"
  subject?: string
  title: string
  body: string
  icon?: string
  color: string
  variables: string[]
  isActive: boolean
  isDefault: boolean
  createdAt: string
  lastModified: string
}

interface PreviewData {
  modelName: string
  amount: string
  buyerName: string
  customerName: string
  senderName: string
  followerName: string
  totalFollowers: string
  discountPercent: string
  expiryDate: string
  promoCode: string
}

interface NewTemplate extends Partial<NotificationTemplate> {
  name: string
  type: "email" | "push" | "sms" | "in-app"
  category: "sales" | "orders" | "messages" | "system" | "marketing" | "social"
  title: string
  body: string
  color: string
  variables: string[]
  isActive: boolean
  isDefault: boolean
}

interface CategoryIcons {
  [key: string]: any
}

interface TypeIcons {
  [key: string]: any
}

interface NotificationTemplatesProps {
  handleSaveSettings: (section: string) => void
}

export function NotificationTemplates({ handleSaveSettings }: NotificationTemplatesProps) {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: "1",
      name: "Nueva Venta",
      type: "push",
      category: "sales",
      title: "¡Nueva venta! 🎉",
      body: "Has vendido {modelName} por ${amount}. ¡Felicidades!",
      icon: "💰",
      color: "#10B981",
      variables: ["modelName", "amount", "buyerName", "date"],
      isActive: true,
      isDefault: true,
      createdAt: "2024-01-15",
      lastModified: "2024-03-10",
    },
    {
      id: "2",
      name: "Pedido de Impresión",
      type: "email",
      category: "orders",
      subject: "Nuevo pedido de impresión - {modelName}",
      title: "Nuevo trabajo de impresión",
      body: "Tienes un nuevo pedido de impresión para {modelName}. Cliente: {customerName}. Fecha límite: {deadline}.",
      icon: "🖨️",
      color: "#3B82F6",
      variables: ["modelName", "customerName", "deadline", "material", "quantity"],
      isActive: true,
      isDefault: true,
      createdAt: "2024-01-15",
      lastModified: "2024-03-10",
    },
    {
      id: "3",
      name: "Mensaje Privado",
      type: "in-app",
      category: "messages",
      title: "Nuevo mensaje",
      body: '{senderName} te ha enviado un mensaje: "{preview}"',
      icon: "💬",
      color: "#8B5CF6",
      variables: ["senderName", "preview", "timestamp"],
      isActive: true,
      isDefault: true,
      createdAt: "2024-01-15",
      lastModified: "2024-03-10",
    },
    {
      id: "4",
      name: "Nuevo Seguidor",
      type: "push",
      category: "social",
      title: "¡Nuevo seguidor!",
      body: "{followerName} ahora te sigue. ¡Ya tienes {totalFollowers} seguidores!",
      icon: "👥",
      color: "#F59E0B",
      variables: ["followerName", "totalFollowers"],
      isActive: true,
      isDefault: false,
      createdAt: "2024-02-01",
      lastModified: "2024-03-05",
    },
    {
      id: "5",
      name: "Modelo Aprobado",
      type: "email",
      category: "system",
      subject: "Tu modelo {modelName} ha sido aprobado",
      title: "¡Modelo aprobado! ✅",
      body: "Tu modelo {modelName} ha sido revisado y aprobado. Ya está disponible en el marketplace.",
      icon: "✅",
      color: "#059669",
      variables: ["modelName", "approvalDate", "reviewerNotes"],
      isActive: true,
      isDefault: true,
      createdAt: "2024-01-20",
      lastModified: "2024-02-28",
    },
    {
      id: "6",
      name: "Oferta Especial",
      type: "email",
      category: "marketing",
      subject: "🎁 Oferta especial: {discountPercent}% de descuento",
      title: "¡Oferta limitada!",
      body: "Aprovecha nuestro descuento del {discountPercent}% en todos los modelos. Válido hasta {expiryDate}. Código: {promoCode}",
      icon: "🎁",
      color: "#DC2626",
      variables: ["discountPercent", "expiryDate", "promoCode"],
      isActive: false,
      isDefault: false,
      createdAt: "2024-03-01",
      lastModified: "2024-03-15",
    },
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewData>({
    modelName: "Dragón Épico",
    amount: "25.99",
    buyerName: "Juan Pérez",
    customerName: "María García",
    senderName: "Carlos López",
    followerName: "Ana Martín",
    totalFollowers: "127",
    discountPercent: "20",
    expiryDate: "31 de Marzo",
    promoCode: "SPRING20",
  })

  const [newTemplate, setNewTemplate] = useState<NewTemplate>({
    name: "",
    type: "push",
    category: "sales",
    title: "",
    body: "",
    color: "#3B82F6",
    variables: [],
    isActive: true,
    isDefault: false,
  })

  const categoryIcons: CategoryIcons = {
    sales: TrendingUp,
    orders: Printer,
    messages: MessageCircle,
    system: Settings,
    marketing: Target,
    social: Users,
  }

  const typeIcons: TypeIcons = {
    email: Mail,
    push: Smartphone,
    sms: MessageSquare,
    "in-app": Bell,
  }

  const handleEditTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template)
    setIsEditing(true)
  }

  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      setTemplates(
        templates.map((t) =>
          t.id === selectedTemplate.id
            ? { ...selectedTemplate, lastModified: new Date().toISOString().split("T")[0] }
            : t,
        ),
      )
      setIsEditing(false)
      setSelectedTemplate(null)
    }
  }

  const handleCreateTemplate = () => {
    const template: NotificationTemplate = {
      ...(newTemplate as NotificationTemplate),
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
    }
    setTemplates([...templates, template])
    setNewTemplate({
      name: "",
      type: "push",
      category: "sales",
      title: "",
      body: "",
      color: "#3B82F6",
      variables: [],
      isActive: true,
      isDefault: false,
    })
  }

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id))
  }

  const handleToggleActive = (id: string) => {
    setTemplates(templates.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)))
  }

  const renderPreview = (template: NotificationTemplate) => {
    let content = template.body
    template.variables.forEach((variable) => {
      const value = previewData[variable as keyof typeof previewData] || `{${variable}}`
      content = content.replace(`{${variable}}`, value)
    })

    let title = template.title
    template.variables.forEach((variable) => {
      const value = previewData[variable as keyof typeof previewData] || `{${variable}}`
      title = title.replace(`{${variable}}`, value)
    })

    if (template.type === "push" || template.type === "in-app") {
      return (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4 max-w-sm mx-auto">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: template.color }}
              >
                {template.icon || "📱"}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-white">{title}</div>
                  <div className="text-xs text-gray-400">ahora</div>
                </div>
                <div className="text-sm text-gray-300 mt-1">{content}</div>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (template.type === "email") {
      return (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: template.color, color: "white" }}
                >
                  {template.icon || "📧"}
                </div>
                <div className="font-medium text-gray-900">World 3D</div>
              </div>
              <div className="text-lg font-bold text-gray-900">{template.subject || title}</div>
              <div className="text-gray-700">{content}</div>
              <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
                © 2024 World 3D. Todos los derechos reservados.
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4 max-w-sm mx-auto">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: template.color }}
              >
                {template.icon || "📱"}
              </div>
              <div className="flex-1">
                <div className="text-white">{content}</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-8">
        <Image
          src="/images/notification-templates.png"
          alt="Plantillas de notificaciones"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Plantillas de Notificaciones</h1>
            <p className="text-gray-200">Personaliza tus notificaciones para diferentes canales</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="push">Push</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="in-app">In-App</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>
          <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Plantilla
          </Button>
        </div>

        <TabsContent value="all" className="space-y-6">
          {/* Categorías de plantillas */}
          {Object.entries(categoryIcons).map(([category, Icon]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-white" />
                <h3 className="text-lg font-medium text-white capitalize">{category}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates
                  .filter((template) => template.category === category)
                  .map((template) => (
                    <Card
                      key={template.id}
                      className={`bg-white/5 backdrop-blur-sm border-white/10 ${!template.isActive ? "opacity-60" : ""}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-white flex items-center gap-2">
                              {template.icon && <span>{template.icon}</span>}
                              {template.name}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-gray-700 text-white">
                                <div className="flex items-center gap-1">
                                  {typeIcons[template.type] &&
                                    React.createElement(typeIcons[template.type], { className: "h-3 w-3 mr-1" })}
                                  {template.type}
                                </div>
                              </Badge>
                              {template.isDefault && <Badge className="bg-blue-600">Por defecto</Badge>}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditTemplate(template)}
                              className="h-8 w-8 text-gray-400 hover:text-white"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleActive(template.id)}
                              className="h-8 w-8 text-gray-400 hover:text-white"
                            >
                              {template.isActive ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            {!template.isDefault && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-red-500/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-300 line-clamp-2 mb-3">{template.body}</div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {template.variables.map((variable) => (
                            <Badge key={variable} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                              {variable}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <div>Modificado: {template.lastModified}</div>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            Vista previa
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="push" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates
              .filter((template) => template.type === "push")
              .map((template) => (
                <Card
                  key={template.id}
                  className={`bg-white/5 backdrop-blur-sm border-white/10 ${!template.isActive ? "opacity-60" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-white flex items-center gap-2">
                          {template.icon && <span>{template.icon}</span>}
                          {template.name}
                        </CardTitle>
                        <Badge className="bg-gray-700 text-white">
                          <div className="flex items-center gap-1">
                            <Smartphone className="h-3 w-3 mr-1" />
                            Push
                          </div>
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTemplate(template)}
                          className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(template.id)}
                          className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                          {template.isActive ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        {!template.isDefault && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-300 line-clamp-2 mb-3">{template.body}</div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.variables.map((variable) => (
                        <Badge key={variable} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <div>Modificado: {template.lastModified}</div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Vista previa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates
              .filter((template) => template.type === "email")
              .map((template) => (
                <Card
                  key={template.id}
                  className={`bg-white/5 backdrop-blur-sm border-white/10 ${!template.isActive ? "opacity-60" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-white flex items-center gap-2">
                          {template.icon && <span>{template.icon}</span>}
                          {template.name}
                        </CardTitle>
                        <Badge className="bg-gray-700 text-white">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </div>
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTemplate(template)}
                          className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(template.id)}
                          className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                          {template.isActive ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        {!template.isDefault && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-300 line-clamp-2 mb-3">{template.body}</div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.variables.map((variable) => (
                        <Badge key={variable} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <div>Modificado: {template.lastModified}</div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Vista previa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="in-app" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates
              .filter((template) => template.type === "in-app")
              .map((template) => (
                <Card
                  key={template.id}
                  className={`bg-white/5 backdrop-blur-sm border-white/10 ${!template.isActive ? "opacity-60" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-white flex items-center gap-2">
                          {template.icon && <span>{template.icon}</span>}
                          {template.name}
                        </CardTitle>
                        <Badge className="bg-gray-700 text-white">
                          <div className="flex items-center gap-1">
                            <Bell className="h-3 w-3 mr-1" />
                            In-App
                          </div>
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTemplate(template)}
                          className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(template.id)}
                          className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                          {template.isActive ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        {!template.isDefault && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-300 line-clamp-2 mb-3">{template.body}</div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.variables.map((variable) => (
                        <Badge key={variable} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <div>Modificado: {template.lastModified}</div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Vista previa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="sms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates
              .filter((template) => template.type === "sms")
              .map((template) => (
                <Card
                  key={template.id}
                  className={`bg-white/5 backdrop-blur-sm border-white/10 ${!template.isActive ? "opacity-60" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-white flex items-center gap-2">
                          {template.icon && <span>{template.icon}</span>}
                          {template.name}
                        </CardTitle>
                        <Badge className="bg-gray-700 text-white">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            SMS
                          </div>
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTemplate(template)}
                          className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(template.id)}
                          className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                          {template.isActive ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        {!template.isDefault && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-300 line-clamp-2 mb-3">{template.body}</div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.variables.map((variable) => (
                        <Badge key={variable} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <div>Modificado: {template.lastModified}</div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Vista previa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de edición */}
      {selectedTemplate && isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white">Editar Plantilla</CardTitle>
              <CardDescription className="text-gray-300">
                Personaliza el contenido y apariencia de la notificación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Nombre de la plantilla</Label>
                    <Input
                      value={selectedTemplate.name}
                      onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Tipo</Label>
                    <Select
                      value={selectedTemplate.type}
                      onValueChange={(value: "email" | "push" | "sms" | "in-app") =>
                        setSelectedTemplate({ ...selectedTemplate, type: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="push">Push</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="in-app">In-App</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Categoría</Label>
                    <Select
                      value={selectedTemplate.category}
                      onValueChange={(value: "sales" | "orders" | "messages" | "system" | "marketing" | "social") =>
                        setSelectedTemplate({ ...selectedTemplate, category: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Ventas</SelectItem>
                        <SelectItem value="orders">Pedidos</SelectItem>
                        <SelectItem value="messages">Mensajes</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTemplate.type === "email" && (
                    <div className="space-y-2">
                      <Label className="text-white">Asunto</Label>
                      <Input
                        value={selectedTemplate.subject || ""}
                        onChange={(e) => setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-white">Título</Label>
                    <Input
                      value={selectedTemplate.title}
                      onChange={(e) => setSelectedTemplate({ ...selectedTemplate, title: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Contenido</Label>
                    <Textarea
                      value={selectedTemplate.body}
                      onChange={(e) => setSelectedTemplate({ ...selectedTemplate, body: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Icono</Label>
                    <Input
                      value={selectedTemplate.icon || ""}
                      onChange={(e) => setSelectedTemplate({ ...selectedTemplate, icon: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Emoji o código de icono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={selectedTemplate.color}
                        onChange={(e) => setSelectedTemplate({ ...selectedTemplate, color: e.target.value })}
                        className="w-12 h-10 p-1 bg-white/5 border-white/10"
                      />
                      <Input
                        value={selectedTemplate.color}
                        onChange={(e) => setSelectedTemplate({ ...selectedTemplate, color: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Variables</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.variables.map((variable, index) => (
                        <Badge key={index} className="bg-blue-500/20 text-blue-300 flex items-center gap-1">
                          {variable}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 ml-1 hover:bg-blue-500/20"
                            onClick={() => {
                              const newVariables = [...selectedTemplate.variables]
                              newVariables.splice(index, 1)
                              setSelectedTemplate({ ...selectedTemplate, variables: newVariables })
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-dashed border-white/20 text-white"
                        onClick={() => {
                          const variable = prompt("Nombre de la variable:")
                          if (variable && !selectedTemplate.variables.includes(variable)) {
                            setSelectedTemplate({
                              ...selectedTemplate,
                              variables: [...selectedTemplate.variables, variable],
                            })
                          }
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Añadir
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-4">Vista Previa</h3>
                    {renderPreview(selectedTemplate)}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Datos de prueba</Label>
                    <div className="space-y-2">
                      {selectedTemplate.variables.map((variable) => (
                        <div key={variable} className="grid grid-cols-3 gap-2 items-center">
                          <Label className="text-gray-300 text-sm">{variable}</Label>
                          <Input
                            value={previewData[variable as keyof typeof previewData] || ""}
                            onChange={(e) => setPreviewData({ ...previewData, [variable]: e.target.value })}
                            className="col-span-2 bg-white/5 border-white/10 text-white h-8 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Activa</Label>
                        <p className="text-sm text-gray-400">Esta plantilla está en uso</p>
                      </div>
                      <Switch
                        checked={selectedTemplate.isActive}
                        onCheckedChange={(checked) => setSelectedTemplate({ ...selectedTemplate, isActive: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Por defecto</Label>
                        <p className="text-sm text-gray-400">Plantilla predeterminada para este tipo</p>
                      </div>
                      <Switch
                        checked={selectedTemplate.isDefault}
                        onCheckedChange={(checked) => setSelectedTemplate({ ...selectedTemplate, isDefault: checked })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="border-white/20 text-white flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="flex justify-between p-6 pt-0">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="border-white/20 text-white">
                Cancelar
              </Button>
              <Button onClick={handleSaveTemplate} className="bg-gradient-to-r from-green-500 to-emerald-500">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Button onClick={() => handleSaveSettings("templates")} className="bg-gradient-to-r from-purple-500 to-pink-500">
        <Save className="h-4 w-4 mr-2" />
        Guardar Configuración de Plantillas
      </Button>
    </div>
  )
}
