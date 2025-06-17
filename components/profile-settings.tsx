"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Edit, User, Upload, Printer, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface ProfileSettingsProps {
  user: {
    name: string
    email: string
    role: string
  }
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const { updateUserRole } = useAuth()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isUpdatingRole, setIsUpdatingRole] = useState(false)

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "creator":
        return {
          label: "Creador",
          description: "Sube y vende modelos 3D",
          icon: Upload,
          color: "bg-purple-500",
        }
      case "printer":
        return {
          label: "Impresor",
          description: "Ofrece servicios de impresión 3D",
          icon: Printer,
          color: "bg-blue-500",
        }
      case "user":
        return {
          label: "Usuario",
          description: "Compra modelos y servicios",
          icon: User,
          color: "bg-green-500",
        }
      case "admin":
        return {
          label: "Administrador",
          description: "Gestiona la plataforma",
          icon: User,
          color: "bg-red-500",
        }
      default:
        return {
          label: "Usuario",
          description: "Compra modelos y servicios",
          icon: User,
          color: "bg-green-500",
        }
    }
  }

  const handleRoleChange = async (newRole: "user" | "creator" | "printer") => {
    if (newRole === user.role) return

    setIsUpdatingRole(true)
    try {
      const success = await updateUserRole(newRole)
      if (success) {
        // La página se actualizará automáticamente debido al cambio en el contexto
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (error) {
      console.error("Error updating role:", error)
    } finally {
      setIsUpdatingRole(false)
    }
  }

  const currentRoleInfo = getRoleInfo(user.role)
  const CurrentRoleIcon = currentRoleInfo.icon

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

      {/* Tipo de Cuenta */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CurrentRoleIcon className="h-5 w-5" />
            Tipo de Cuenta
          </CardTitle>
          <CardDescription className="text-gray-300">
            Cambia tu rol para acceder a diferentes funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rol actual */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${currentRoleInfo.color} flex items-center justify-center`}>
                <CurrentRoleIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">{currentRoleInfo.label}</div>
                <div className="text-sm text-gray-400">{currentRoleInfo.description}</div>
              </div>
            </div>
            <Badge className={currentRoleInfo.color}>Actual</Badge>
          </div>

          <Separator className="bg-white/10" />

          {/* Selector de nuevo rol */}
          <div className="space-y-4">
            <Label className="text-white">Cambiar a:</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Usuario */}
              <div
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  user.role === "user"
                    ? "border-green-500 bg-green-500/10"
                    : "border-white/10 bg-white/5 hover:border-green-500/50"
                }`}
                onClick={() => handleRoleChange("user")}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-white font-medium">Usuario</div>
                  <div className="text-sm text-gray-400">Compra modelos y servicios</div>
                  {user.role === "user" && <Badge className="bg-green-500">Actual</Badge>}
                </div>
              </div>

              {/* Creador */}
              <div
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  user.role === "creator"
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-white/10 bg-white/5 hover:border-purple-500/50"
                }`}
                onClick={() => handleRoleChange("creator")}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-white font-medium">Creador</div>
                  <div className="text-sm text-gray-400">Sube y vende modelos 3D</div>
                  {user.role === "creator" && <Badge className="bg-purple-500">Actual</Badge>}
                </div>
              </div>

              {/* Impresor */}
              <div
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  user.role === "printer"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 bg-white/5 hover:border-blue-500/50"
                }`}
                onClick={() => handleRoleChange("printer")}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <Printer className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-white font-medium">Impresor</div>
                  <div className="text-sm text-gray-400">Ofrece servicios de impresión</div>
                  {user.role === "printer" && <Badge className="bg-blue-500">Actual</Badge>}
                </div>
              </div>
            </div>

            {isUpdatingRole && (
              <div className="flex items-center justify-center p-4 bg-white/5 rounded-lg">
                <RefreshCw className="h-4 w-4 animate-spin text-cyan-400 mr-2" />
                <span className="text-white">Actualizando rol...</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="text-yellow-400 font-medium mb-2">💡 Información importante</div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Puedes cambiar tu rol en cualquier momento</li>
              <li>• Cada rol tiene acceso a diferentes funcionalidades</li>
              <li>• Los datos de tu perfil se mantendrán al cambiar de rol</li>
              <li>• La página se recargará automáticamente tras el cambio</li>
            </ul>
          </div>
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
