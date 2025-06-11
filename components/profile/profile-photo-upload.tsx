"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, X, Check, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

interface ProfilePhotoUploadProps {
  currentPhoto?: string
  userName: string
  onPhotoUpdate?: (newPhotoUrl: string) => void
}

export function ProfilePhotoUpload({ currentPhoto, userName, onPhotoUpdate }: ProfilePhotoUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { updateUserPhoto } = useAuth()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Archivo inválido",
        description: "Por favor selecciona una imagen válida",
        variant: "destructive",
      })
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "La imagen debe ser menor a 5MB",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)

    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)

    try {
      // Simular subida de archivo
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Crear URL de la imagen usando el archivo real
      const newPhotoUrl = URL.createObjectURL(selectedFile)

      // Actualizar en el contexto de autenticación
      await updateUserPhoto(newPhotoUrl)

      // Callback opcional
      onPhotoUpdate?.(newPhotoUrl)

      toast({
        title: "Foto actualizada",
        description: "Tu foto de perfil se ha actualizado correctamente",
      })

      setIsOpen(false)
      setSelectedFile(null)
      setPreviewUrl(null)
    } catch (error) {
      toast({
        title: "Error al subir foto",
        description: "No se pudo actualizar la foto de perfil",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemovePhoto = async () => {
    setIsUploading(true)

    try {
      // Simular eliminación
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Actualizar con foto por defecto
      const defaultPhoto = `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(userName.charAt(0))}`
      await updateUserPhoto(defaultPhoto)

      onPhotoUpdate?.(defaultPhoto)

      toast({
        title: "Foto eliminada",
        description: "Se ha restaurado la foto por defecto",
      })

      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la foto",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const resetSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          <Avatar className="h-24 w-24 mx-auto">
            <AvatarImage src={currentPhoto || "/placeholder.svg"} alt={userName} />
            <AvatarFallback className="text-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-sm border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Cambiar Foto de Perfil</DialogTitle>
          <DialogDescription className="text-gray-400">Sube una nueva foto o elimina la actual</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vista previa actual */}
          <div className="text-center">
            <Avatar className="h-32 w-32 mx-auto mb-4">
              <AvatarImage src={previewUrl || currentPhoto} alt={userName} />
              <AvatarFallback className="text-4xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {selectedFile && (
              <div className="text-sm text-gray-400">
                <p>{selectedFile.name}</p>
                <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>

          {/* Input de archivo oculto */}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

          {/* Botones de acción */}
          <div className="space-y-3">
            {!selectedFile ? (
              <>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Seleccionar Nueva Foto
                </Button>

                {currentPhoto && !currentPhoto.includes("placeholder.svg") && (
                  <Button
                    onClick={handleRemovePhoto}
                    variant="outline"
                    className="w-full border-red-400/30 text-red-400 hover:bg-red-400/10"
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <X className="h-4 w-4 mr-2" />}
                    Eliminar Foto Actual
                  </Button>
                )}
              </>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleUpload}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                  Confirmar
                </Button>

                <Button
                  onClick={resetSelection}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>

          {/* Información adicional */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="text-sm text-gray-400 space-y-1">
                <p>• Formatos soportados: JPG, PNG, GIF</p>
                <p>• Tamaño máximo: 5MB</p>
                <p>• Recomendado: 400x400px o superior</p>
                <p>• La imagen se redimensionará automáticamente</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
