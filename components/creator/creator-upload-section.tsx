"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, X, FileText, ImageIcon, Plus, DollarSign, Tag, Info, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useStats } from "@/contexts/stats-context"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  preview?: string
}

export function CreatorUploadSection() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [images, setImages] = useState<UploadedFile[]>([])
  const [modelData, setModelData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    price: "",
    materials: [] as string[],
    difficulty: "",
    printTime: "",
    supports: false,
    license: "personal",
  })
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { incrementStat, updateStats } = useStats()

  const categories = [
    "Figuras y Coleccionables",
    "Herramientas y Utilidades",
    "Decoración y Arte",
    "Juguetes y Juegos",
    "Joyería y Accesorios",
    "Prototipos Industriales",
    "Educación y Ciencia",
    "Hogar y Cocina",
    "Automotriz",
    "Médico y Salud",
  ]

  const materials = ["PLA", "ABS", "PETG", "TPU", "ASA", "PC", "Nylon", "Wood Fill", "Metal Fill", "Resina"]

  const difficulties = [
    { value: "beginner", label: "Principiante" },
    { value: "intermediate", label: "Intermedio" },
    { value: "advanced", label: "Avanzado" },
    { value: "expert", label: "Experto" },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "model" | "image") => {
    const selectedFiles = Array.from(event.target.files || [])

    selectedFiles.forEach((file) => {
      if (type === "model") {
        const validTypes = [".stl", ".obj", ".3mf", ".ply", ".gcode"]
        const isValid = validTypes.some((ext) => file.name.toLowerCase().endsWith(ext))

        if (!isValid) {
          toast({
            title: "Formato no válido",
            description: "Solo se permiten archivos STL, OBJ, 3MF, PLY y GCODE",
            variant: "destructive",
          })
          return
        }

        if (file.size > 50 * 1024 * 1024) {
          toast({
            title: "Archivo muy grande",
            description: "El archivo no puede superar los 50MB",
            variant: "destructive",
          })
          return
        }

        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        }

        setFiles((prev) => [...prev, newFile])
      } else {
        const validTypes = ["image/jpeg", "image/png", "image/webp"]

        if (!validTypes.includes(file.type)) {
          toast({
            title: "Formato no válido",
            description: "Solo se permiten imágenes JPG, PNG y WebP",
            variant: "destructive",
          })
          return
        }

        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Imagen muy grande",
            description: "La imagen no puede superar los 5MB",
            variant: "destructive",
          })
          return
        }

        const newImage: UploadedFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          preview: URL.createObjectURL(file),
        }

        setImages((prev) => [...prev, newImage])
      }
    })

    if (event.target) {
      event.target.value = ""
    }
  }

  const removeFile = (id: string, type: "model" | "image") => {
    if (type === "model") {
      setFiles((prev) => prev.filter((f) => f.id !== id))
    } else {
      setImages((prev) => prev.filter((f) => f.id !== id))
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleMaterialToggle = (material: string) => {
    setModelData((prev) => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter((m) => m !== material)
        : [...prev.materials, material],
    }))
  }

  const handleSubmit = async () => {
    if (!modelData.title || !modelData.description || !modelData.category || files.length === 0) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios y sube al menos un archivo 3D",
        variant: "destructive",
      })
      return
    }

    if (images.length === 0) {
      toast({
        title: "Imágenes requeridas",
        description: "Por favor sube al menos una imagen del modelo",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Simular subida
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Actualizar estadísticas
      incrementStat("modelsUploaded", 1)

      // Simular algunas vistas iniciales
      incrementStat("totalViews", Math.floor(Math.random() * 10) + 1)

      toast({
        title: "¡Modelo subido exitosamente!",
        description: "Tu modelo está siendo procesado y estará disponible pronto",
      })

      // Reset form
      setFiles([])
      setImages([])
      setModelData({
        title: "",
        description: "",
        category: "",
        tags: "",
        price: "",
        materials: [],
        difficulty: "",
        printTime: "",
        supports: false,
        license: "personal",
      })
      setShowUploadForm(false)
    } catch (error) {
      toast({
        title: "Error al subir",
        description: "Hubo un problema al subir tu modelo. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFiles([])
    setImages([])
    setModelData({
      title: "",
      description: "",
      category: "",
      tags: "",
      price: "",
      materials: [],
      difficulty: "",
      printTime: "",
      supports: false,
      license: "personal",
    })
    setShowUploadForm(false)
  }

  if (!showUploadForm) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6 text-center">
          <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Subir Nuevo Modelo</h3>
          <p className="text-gray-400 mb-6">Comparte tus creaciones 3D con la comunidad</p>
          <Button
            onClick={() => setShowUploadForm(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Comenzar Subida
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Subir Nuevo Modelo 3D</h2>
        <Button variant="outline" onClick={resetForm} className="border-gray-600 text-gray-300">
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del Modelo */}
        <div className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Info className="h-5 w-5" />
                Información del Modelo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">
                  Título *
                </Label>
                <Input
                  id="title"
                  value={modelData.title}
                  onChange={(e) => setModelData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Nombre de tu modelo 3D"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">
                  Descripción *
                </Label>
                <Textarea
                  id="description"
                  value={modelData.description}
                  onChange={(e) => setModelData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe tu modelo, cómo se imprime, para qué sirve..."
                  className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-gray-300">
                  Categoría *
                </Label>
                <Select
                  value={modelData.category}
                  onValueChange={(value) => setModelData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags" className="text-gray-300">
                  Etiquetas
                </Label>
                <Input
                  id="tags"
                  value={modelData.tags}
                  onChange={(e) => setModelData((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="gaming, miniatura, funcional (separadas por comas)"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-gray-300">
                  Precio (USD) *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={modelData.price}
                    onChange={(e) => setModelData((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="bg-gray-700 border-gray-600 text-white pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Tag className="h-5 w-5" />
                Especificaciones de Impresión
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Materiales Recomendados</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {materials.map((material) => (
                    <Badge
                      key={material}
                      variant={modelData.materials.includes(material) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        modelData.materials.includes(material)
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-gray-600 text-gray-300 hover:bg-gray-700"
                      }`}
                      onClick={() => handleMaterialToggle(material)}
                    >
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="difficulty" className="text-gray-300">
                  Dificultad de Impresión
                </Label>
                <Select
                  value={modelData.difficulty}
                  onValueChange={(value) => setModelData((prev) => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecciona dificultad" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {difficulties.map((diff) => (
                      <SelectItem key={diff.value} value={diff.value} className="text-white hover:bg-gray-700">
                        {diff.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="printTime" className="text-gray-300">
                  Tiempo de Impresión Estimado
                </Label>
                <Input
                  id="printTime"
                  value={modelData.printTime}
                  onChange={(e) => setModelData((prev) => ({ ...prev, printTime: e.target.value }))}
                  placeholder="ej: 2 horas, 30 minutos"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="supports"
                  checked={modelData.supports}
                  onChange={(e) => setModelData((prev) => ({ ...prev, supports: e.target.checked }))}
                  className="rounded border-gray-600 bg-gray-700"
                />
                <Label htmlFor="supports" className="text-gray-300">
                  Requiere soportes
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Archivos */}
        <div className="space-y-4">
          {/* Archivos 3D */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5" />
                Archivos 3D *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Arrastra archivos aquí o haz clic para seleccionar</p>
                <p className="text-sm text-gray-500">STL, OBJ, 3MF, PLY, GCODE (máx. 50MB)</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".stl,.obj,.3mf,.ply,.gcode"
                onChange={(e) => handleFileUpload(e, "model")}
                className="hidden"
              />

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-white text-sm font-medium">{file.name}</p>
                          <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id, "model")}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Imágenes */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <ImageIcon className="h-5 w-5" />
                Imágenes *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition-colors"
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Sube imágenes de tu modelo</p>
                <p className="text-sm text-gray-500">JPG, PNG, WebP (máx. 5MB cada una)</p>
              </div>

              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileUpload(e, "image")}
                className="hidden"
              />

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview || "/placeholder.svg"}
                        alt={image.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(image.id, "image")}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <p className="text-xs text-gray-400 mt-1 truncate">{image.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botón de Subida */}
      <div className="text-center">
        <Button
          onClick={handleSubmit}
          disabled={isUploading}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 text-lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Subiendo...
            </>
          ) : (
            "Publicar Modelo"
          )}
        </Button>
      </div>
    </div>
  )
}
