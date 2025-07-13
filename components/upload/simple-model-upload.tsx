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
import { Upload, X, FileText, ImageIcon, DollarSign, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usePlatformData } from "@/contexts/platform-data-context"
import { useAuth } from "@/contexts/auth-context"
import type { Model3D } from "@/types"
import { useRouter } from "next/navigation"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  preview?: string
}

export function SimpleModelUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [images, setImages] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [modelData, setModelData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    price: "0",
    materials: [] as string[],
    difficulty: "intermediate" as Model3D["difficulty"],
    printTime: "",
    supports: false,
    featured: false,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { addModel } = usePlatformData()
  const { user } = useAuth()
  const router = useRouter()

  const categories = [
    "Figuras y Coleccionables",
    "Herramientas y Utilidades",
    "Decoración y Arte",
    "Juguetes y Juegos",
    "Joyería y Accesorios",
    "Prototipos Industriales",
  ]

  const materials = ["PLA", "ABS", "PETG", "TPU", "ASA", "PC", "Nylon", "Wood Fill", "Metal Fill", "Resina"]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "model" | "image") => {
    const selectedFiles = Array.from(event.target.files || [])

    selectedFiles.forEach((file) => {
      if (type === "model") {
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        }
        setFiles((prev) => [...prev, newFile])
      } else {
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
    // Validaciones
    if (
      !modelData.title.trim() ||
      !modelData.description.trim() ||
      !modelData.category ||
      files.length === 0 ||
      images.length === 0
    ) {
      toast({
        title: "Faltan campos",
        description: "Por favor, completa todos los campos requeridos.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newModel: Omit<Model3D, "id" | "downloads" | "likes" | "rating" | "reviews" | "createdAt"> = {
      title: modelData.title.trim(),
      description: modelData.description.trim(),
      price: Number.parseFloat(modelData.price) || 0,
      category: modelData.category,
      tags: modelData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      images: images.map((img) => img.preview!),
      fileUrl: files[0].url,
      author: {
        id: user?.id || "guest-user",
        name: user?.name || "Usuario Anónimo",
        avatar: user?.avatar || "/placeholder.svg?height=40&width=40",
        verified: user?.role === "creator" || false,
      },
      materials: modelData.materials,
      difficulty: modelData.difficulty,
      printTime: modelData.printTime || "N/A",
      supports: modelData.supports,
      featured: modelData.featured,
    }

    addModel(newModel)
    setIsUploading(false)
    setUploadSuccess(true)

    toast({
      title: "¡Modelo subido exitosamente!",
      description: "Tu creación ya está disponible en el mercado.",
    })
  }

  if (uploadSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">¡Subida Completada!</h1>
        <p className="text-gray-400 mb-6">Tu modelo ha sido publicado en el mercado.</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/modelos")}>Ver en el Mercado</Button>
          <Button variant="outline" onClick={() => setUploadSuccess(false)}>
            Subir otro modelo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
          Subir Modelo 3D
        </h1>
        <p className="text-gray-400">Comparte tus creaciones con la comunidad</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ... (resto del JSX del formulario sin cambios) ... */}
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Información del Modelo</CardTitle>
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
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
