"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, EyeOff, Edit } from "lucide-react"

interface ProfileSettingsProps {
  user: {
    name: string
    email: string
    profileType: string
  }
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)

  return (
    <div className="space-y-6">
      {/* Información personal */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Información Personal</CardTitle>
          <CardDescription className="text-gray-300">Gestiona tu información personal y de contacto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Nombre completo</Label>
              <div className="flex gap-2">
                <Input value={user.name} disabled={!isEditingName} className="bg-white/5 border-white/10 text-white" />
                <Button
                  variant="outline"
                  size="icon"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => setIsEditingName(!isEditingName)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Correo electrónico</Label>
              <div className="flex gap-2">
                <Input
                  value={user.email}
                  disabled={!isEditingEmail}
                  className="bg-white/5 border-white/10 text-white"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => setIsEditingEmail(!isEditingEmail)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          {(isEditingName || isEditingEmail) && (
            <div className="flex gap-2">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">Guardar cambios</Button>
              <Button
                variant="outline"
                className="border-white/20 text-white"
                onClick={() => {
                  setIsEditingName(false)
                  setIsEditingEmail(false)
                }}
              >
                Cancelar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cambiar contraseña */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Seguridad</CardTitle>
          <CardDescription className="text-gray-300">
            Cambia tu contraseña para mantener tu cuenta segura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">Cambiar Contraseña</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Cambiar Contraseña</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Contraseña actual</Label>
                  <div className="relative">
                    <Input type={showCurrentPassword ? "text" : "password"} placeholder="••••••••" className="pr-10" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Nueva contraseña</Label>
                  <div className="relative">
                    <Input type={showNewPassword ? "text" : "password"} placeholder="••••••••" className="pr-10" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Confirmar nueva contraseña</Label>
                  <div className="relative">
                    <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className="pr-10" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500">Cambiar Contraseña</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
