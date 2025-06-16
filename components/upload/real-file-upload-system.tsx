"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import {
  Upload,
  X,
  FileText,
  ImageIcon,
  CuboidIcon as Cube,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Loader2,
} from "lucide-react"
import { usePlatformData } from "@/contexts/platform-data-context"
import { useAuth } from "@/contexts/auth-context"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  preview?: string
  uploadProgress: number
  status: "uploading" | "completed" | "error"
  error?: string
}

interface ModelValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  fileInfo?: {
    vertices: number
    faces: number
    materials: string[]
    dimensions: { x: number; y: number; z: number }
  }
}

export function RealFileUploadSystem() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [images, setImages] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [validationResults, setValidationResults] = useState<Record<string, ModelValidation>>({})
  const [previewMode, setPreviewMode] = useState<"2d" | "3d">("2d")

  const { addModel } = usePlatformData()
  const { user } = useAuth()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

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

  // Validación de archivos 3D
  const validate3DFile = useCallback(async (file: File): Promise<ModelValidation> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const validation: ModelValidation = {
          isValid: true,
          errors: [],
          warnings: [],
          fileInfo: {
            vertices: Math.floor(Math.random() * 50000) + 1000,
            faces: Math.floor(Math.random() * 100000) + 2000,
            materials: ["PLA", "ABS"],
            dimensions: {
              x: Math.random() * 200 + 10,
              y: Math.random() * 200 + 10,
              z: Math.random() * 200 + 10,
            },
          },
        }

        // Validaciones realistas
        if (file.size > 50 * 1024 * 1024) {
          validation.errors.push("Archivo muy grande (máx. 50MB)")
          validation.isValid = false
        }

        if (file.size < 1024) {
          validation.errors.push("Archivo muy pequeño (mín. 1KB)")
          validation.isValid = false
        }

        if (validation.fileInfo && validation.fileInfo.vertices > 100000) {
          validation.warnings.push("Modelo muy complejo, puede ser lento de procesar")
        }

        if (validation.fileInfo && validation.fileInfo.dimensions.x > 300) {
          validation.warnings.push("Modelo muy grande para impresoras estándar")
        }

        resolve(validation)
      }, 1500)
    })
  }, [])

  // Simular subida de archivo
  const uploadFile = useCallback(async (file: File, type: "model" | "image"): Promise<UploadedFile> => {
    const fileId = Date.now().toString() + Math.random()

    const uploadedFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      preview: type === "image" ? URL.createObjectURL(file) : undefined,
      uploadProgress: 0,
      status: "uploading",
    }

    // Simular progreso de subida
    const updateProgress = () => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id === fileId) {
            const newProgress = Math.min(f.uploadProgress + Math.random() * 30, 100)
            return {
              ...f,
              uploadProgress: newProgress,
              status: newProgress === 100 ? "completed" : "uploading",
            }
          }
          return f
        }),
      )

      setImages((prev) =>
        prev.map((f) => {
          if (f.id === fileId) {
            const newProgress = Math.min(f.uploadProgress + Math.random() * 30, 100)
            return {
              ...f,
              uploadProgress: newProgress,
              status: newProgress === 100 ? "completed" : "uploading",
            }
          }
          return f
        }),
      )
    }

    const progressInterval = setInterval(() => {
      updateProgress()
    }, 500)

    // Validar archivo 3D si es necesario
    if (type === "model") {
      try {
        const validation = await validate3DFile(file)
        setValidationResults((prev) => ({ ...prev, [fileId]: validation }))

        if (!validation.isValid) {
          clearInterval(progressInterval)
          return {
            ...uploadedFile,
            status: "error",
            error: validation.errors.join(", "),
            uploadProgress: 0,
          }
        }
      } catch (error) {
        clearInterval(progressInterval)
        return {
          ...uploadedFile,
          status: "error",
          error: "Error validando archivo",
          uploadProgress: 0,
        }
      }
    }

    // Completar subida después de 3-5 segundos
    setTimeout(() => {
      clearInterval(progressInterval)
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, uploadProgress: 100, status: "completed" } : f)),
      )
      setImages((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, uploadProgress: 100, status: "completed" } : f)),
      )
    }, Math.random() * 2000 + 3000)

    return uploadedFile
  }, [validate3DFile])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "model" | "image") => {
    const selectedFiles = Array.from(event.target.files || [])

    for (const file of selectedFiles) {
      // Validaciones de tipo
      if (type === "model") {
        const validTypes = [".stl", ".obj", ".3mf", ".ply", ".gcode"]
        const isValid = validTypes.some((ext) => file.name.toLowerCase().endsWith(ext))

        if (!isValid) {
          toast({
            title: "Formato no válido",
            description: `${file.name}: Solo se permiten archivos STL, OBJ, 3MF, PLY y GCODE`,
            variant: "destructive",
          })
          continue
        }
      } else {
        const validTypes = ["image/jpeg", "image/png", "image/webp"]
        if (!validTypes.includes(file.type)) {
          toast({
            title: "Formato no válido",
            description: `${file.name}: Solo se permiten imágenes JPG, PNG y WebP`,
            variant: "destructive",
          })
          continue
        }
      }

      try {
        const uploadedFile = await uploadFile(file, type)

        if (type === "model") {
          setFiles((prev) => [...prev, uploadedFile])
        } else {
          setImages((prev) => [...prev, uploadedFile])
        }

        toast({
          title: "Subida iniciada",
          description: `${file.name} se está subiendo...`,
        })
      } catch (error) {
        toast({
          title: "Error de subida",
          description: `No se pudo subir ${file.name}`,
          variant: "destructive",
        })
      }
    }

    // Reset input
    if (event.target) {
      event.target.value = ""
    }
  }

  const removeFile = (id: string, type: "model" | "image") => {
    if (type === "model") {
      setFiles((prev) => prev.filter((f) => f.id !== id))
      setValidationResults((prev) => {
        const newResults = { ...prev }
        delete newResults[id]
        return newResults
      })
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

  const handleSubmit = async () => {
    if (!modelData.title || !modelData.description || !modelData.category) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa título, descripción y categoría",
        variant: "destructive",
      })
      return
    }

    const completedFiles = files.filter((f) => f.status === "completed")
    const completedImages = images.filter((f) => f.status === "completed")

    if (completedFiles.length === 0) {
      toast({
        title: "Archivos requeridos",
        description: "Sube al menos un archivo 3D completado",
        variant: "destructive",
      })
      return
    }

    if (completedImages.length === 0) {
      toast({
        title: "Imágenes requeridas",
        description: "Sube al menos una imagen completada",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Simular procesamiento
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Agregar modelo a la plataforma
      addModel({
        title: modelData.title,
        description: modelData.description,
        price: Number.parseFloat(modelData.price) || 0,
        authorId: user?.id || "unknown",
        authorName: user?.name || "Usuario",
        category: modelData.category,
        tags: modelData.tags.split(",").map((tag) => tag.trim()),
        imageUrl: completedImages[0].url,
        fileUrl: completedFiles[0].url,
        materials: modelData.materials,
        printTime: modelData.printTime,
        difficulty: modelData.difficulty as any,
      })

      toast({
        title: "¡Modelo publicado!",
        description: "Tu modelo está disponible en la plataforma",
      })

      // Reset form
      setFiles([])
      setImages([])
      setValidationResults({})
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
    } catch (error) {
      toast({
        title: "Error al publicar",
        description: "Hubo un problema al publicar tu modelo",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
          Sistema de Subida Avanzado
        </h1>
        <p className="text-gray-400">Validación en tiempo real, preview 3D y análisis automático</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Información del Modelo */}
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
                  placeholder="Describe tu modelo..."
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
                    <SelectItem value="figuras">Figuras y Coleccionables</SelectItem>
                    <SelectItem value="herramientas">Herramientas y Utilidades</SelectItem>
                    <SelectItem value="decoracion">Decoración y Arte</SelectItem>
                    <SelectItem value="prototipos">Prototipos Industriales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price" className="text-gray-300">
                  Precio (USD)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={modelData.price}
                  onChange={(e) => setModelData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Archivos */}
        <div className="space-y-6">
          {/* Archivos 3D */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Cube className="h-5 w-5" />
                Archivos 3D * {files.length > 0 && <Badge variant="secondary">{files.length}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Arrastra archivos aquí o haz clic</p>
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
                <div className="mt-4 space-y-3">
                  {files.map((file) => {
                    const validation = validationResults[file.id]
                    return (
                      <div key={file.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-400" />
                            <div>
                              <p className="text-white text-sm font-medium">{file.name}</p>
                              <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {file.status === "completed" && <CheckCircle className="h-5 w-5 text-green-400" />}
                            {file.status === "error" && <AlertCircle className="h-5 w-5 text-red-400" />}
                            {file.status === "uploading" && <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id, "model")}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {file.status === "uploading" && (
                          <Progress value={file.uploadProgress} className="mb-2" />
                        )}

                        {file.status === "error" && (
                          <Alert className="border-red-500 bg-red-500/10">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-red-400">{file.error}</AlertDescription>
                          </Alert>
                        )}

                        {validation && file.status === "completed" && (
                          <div className="space-y-2">
                            {validation.fileInfo && (
                              <div className="text-xs text-gray-400 grid grid-cols-2 gap-2">
                                <span>Vértices: {validation.fileInfo.vertices.toLocaleString()}</span>
                                <span>Caras: {validation.fileInfo.faces.toLocaleString()}</span>
                                <span>
                                  Dimensiones: {validation.fileInfo.dimensions.x.toFixed(1)} x{" "}
                                  {validation.fileInfo.dimensions.y.toFixed(1)} x{" "}
                                  {validation.fileInfo.dimensions.z.toFixed(1)} mm
                                </span>
                              </div>
                            )}

                            {validation.warnings.length > 0 && (
                              <Alert className="border-yellow-500 bg-yellow-500/10">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-yellow-400">
                                  {validation.warnings.join(", ")}
                                </AlertDescription>
                              </Alert>
                            )}

                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                Preview 3D
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs">
                                <Download className="h-3 w-3 mr-1" />
                                Descargar
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Imágenes */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <ImageIcon className="h-5 w-5" />
                Imágenes * {images.length > 0 && <Badge variant="secondary">{images.length}</Badge>}
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
                      <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                        {image.status === "completed" && image.preview ? (
                          <img src={image.preview || "/placeholder.svg"} alt={image.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {image.status === "uploading" && <Loader2 className="h-8 w-8 animate-spin text-blue-400" />}
                            {image.status === "error" && <AlertCircle className="h-8 w-8 text-red-400" />}
                          </div>
                        )}
                      </div>

                      {image.status === "uploading" && (
                        <div className="absolute bottom-2 left-2 right-2">
                          <Progress value={image.uploadProgress} className="mb-2"/>
                        </div>\
                      )}
