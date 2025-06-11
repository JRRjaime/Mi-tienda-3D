"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Plus, Palette, Home, Wrench, Gamepad2, Heart, Zap } from "lucide-react"
import { useCollaboration } from "@/contexts/collaboration-context"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const [step, setStep] = useState(1)
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    category: "",
    visibility: "private",
    tags: [] as string[],
    image: "",
  })
  const [newTag, setNewTag] = useState("")
  const { createProject, isLoading } = useCollaboration()

  const categories = [
    { id: "figuras", name: "Figuras", icon: Gamepad2, color: "bg-purple-500" },
    { id: "hogar", name: "Hogar", icon: Home, color: "bg-blue-500" },
    { id: "industrial", name: "Industrial", icon: Wrench, color: "bg-orange-500" },
    { id: "arte", name: "Arte", icon: Palette, color: "bg-pink-500" },
    { id: "joyeria", name: "Joyería", icon: Heart, color: "bg-red-500" },
    { id: "prototipo", name: "Prototipo", icon: Zap, color: "bg-green-500" },
  ]

  const handleAddTag = () => {
    if (newTag.trim() && !projectData.tags.includes(newTag.trim())) {
      setProjectData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setProjectData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    try {
      await createProject(projectData)
      onClose()
      resetForm()
    } catch (error) {
      console.error("Error creating project:", error)
    }
  }

  const resetForm = () => {
    setStep(1)
    setProjectData({
      name: "",
      description: "",
      category: "",
      visibility: "private",
      tags: [],
      image: "",
    })
    setNewTag("")
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return projectData.name.trim() !== "" && projectData.description.trim() !== ""
      case 2:
        return projectData.category !== ""
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Crear Nuevo Proyecto Colaborativo</DialogTitle>
          <DialogDescription className="text-gray-400">
            Paso {step} de 3: {step === 1 && "Información básica"}
            {step === 2 && "Categoría y configuración"}
            {step === 3 && "Revisión y creación"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Indicador de progreso */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNumber <= step ? "bg-cyan-500 text-white" : "bg-gray-600 text-gray-400"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${stepNumber < step ? "bg-cyan-500" : "bg-gray-600"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Paso 1: Información básica */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nombre del Proyecto *
                </Label>
                <Input
                  id="name"
                  value={projectData.name}
                  onChange={(e) => setProjectData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Figura Dragon Ball Z - Goku Ultra Instinct"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Descripción *
                </Label>
                <Textarea
                  id="description"
                  value={projectData.description}
                  onChange={(e) => setProjectData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe tu proyecto colaborativo, objetivos y lo que esperas lograr..."
                  className="bg-slate-800 border-slate-600 text-white min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Imagen del Proyecto</Label>
                <Card className="bg-slate-800 border-slate-600 border-dashed">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Arrastra una imagen aquí o haz clic para seleccionar</p>
                      <p className="text-gray-500 text-xs mt-1">PNG, JPG hasta 5MB</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Paso 2: Categoría y configuración */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Categoría del Proyecto *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <Card
                      key={category.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        projectData.category === category.id
                          ? "bg-cyan-500/20 border-cyan-500"
                          : "bg-slate-800 border-slate-600 hover:border-slate-500"
                      }`}
                      onClick={() => setProjectData((prev) => ({ ...prev, category: category.id }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${category.color}`}>
                            <category.icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-white font-medium">{category.name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Visibilidad</Label>
                <Select
                  value={projectData.visibility}
                  onValueChange={(value) => setProjectData((prev) => ({ ...prev, visibility: value }))}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Privado - Solo miembros invitados</SelectItem>
                    <SelectItem value="public">Público - Cualquiera puede unirse</SelectItem>
                    <SelectItem value="unlisted">No listado - Solo con enlace</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Etiquetas</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {projectData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-slate-700 text-white">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-red-400">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Añadir etiqueta..."
                    className="bg-slate-800 border-slate-600 text-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Revisión */}
          {step === 3 && (
            <div className="space-y-4">
              <Card className="bg-slate-800 border-slate-600">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4">Resumen del Proyecto</h3>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-400 text-sm">Nombre</Label>
                      <p className="text-white">{projectData.name}</p>
                    </div>

                    <div>
                      <Label className="text-gray-400 text-sm">Descripción</Label>
                      <p className="text-white text-sm">{projectData.description}</p>
                    </div>

                    <div>
                      <Label className="text-gray-400 text-sm">Categoría</Label>
                      <p className="text-white">
                        {categories.find((c) => c.id === projectData.category)?.name || "No seleccionada"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-gray-400 text-sm">Visibilidad</Label>
                      <p className="text-white">
                        {projectData.visibility === "private" && "Privado"}
                        {projectData.visibility === "public" && "Público"}
                        {projectData.visibility === "unlisted" && "No listado"}
                      </p>
                    </div>

                    {projectData.tags.length > 0 && (
                      <div>
                        <Label className="text-gray-400 text-sm">Etiquetas</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {projectData.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-slate-700 text-white">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                <p className="text-cyan-400 text-sm">
                  🎉 ¡Tu proyecto está listo para ser creado! Una vez creado, podrás invitar colaboradores, gestionar
                  tareas y versiones, y trabajar en equipo de manera eficiente.
                </p>
              </div>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex justify-between pt-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={step === 1 ? handleClose : handleBack}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              {step === 1 ? "Cancelar" : "Anterior"}
            </Button>

            <Button
              onClick={step === 3 ? handleSubmit : handleNext}
              disabled={!isStepValid() || isLoading}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              {isLoading ? "Creando..." : step === 3 ? "Crear Proyecto" : "Siguiente"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
