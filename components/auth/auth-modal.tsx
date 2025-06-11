"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const { login, register, isLoading } = useAuth()
  const router = useRouter()

  // Estado para formulario de inicio de sesión
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Estado para formulario de registro
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as "user" | "creator" | "printer",
  })

  // Estado para errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Manejar cambios en el formulario de inicio de sesión
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    })
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" })
    }
  }

  // Manejar cambios en el formulario de registro
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    })
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" })
    }
  }

  // Manejar envío del formulario de inicio de sesión
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validación básica
    const newErrors: Record<string, string> = {}

    if (!loginData.email) {
      newErrors.email = "El email es obligatorio"
    }

    if (!loginData.password) {
      newErrors.password = "La contraseña es obligatoria"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Intentar iniciar sesión
    const success = await login(loginData.email, loginData.password)
    if (success) {
      onClose()
      // Usar setTimeout para asegurar que el modal se cierre antes de la redirección
      setTimeout(() => {
        window.location.href = "/productos"
      }, 100)
    }
  }

  // Manejar envío del formulario de registro
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validación básica
    const newErrors: Record<string, string> = {}

    if (!registerData.name) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!registerData.email) {
      newErrors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = "El email no es válido"
    }

    if (!registerData.password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (registerData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Intentar registrar
    const success = await register(registerData.name, registerData.email, registerData.password, registerData.role)

    if (success) {
      onClose()
      // Usar window.location.href para forzar la navegación al mercado
      setTimeout(() => {
        window.location.href = "/productos"
      }, 100)
    }
  }

  // Limpiar formularios cuando se cierre el modal
  const handleClose = () => {
    setLoginData({ email: "", password: "" })
    setRegisterData({ name: "", email: "", password: "", confirmPassword: "", role: "user" })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Accede a tu cuenta</DialogTitle>
          <DialogDescription>
            Inicia sesión o crea una cuenta para acceder a todas las funcionalidades.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "register")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Contraseña</Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>

              <div className="text-center text-sm">
                <a href="#" className="text-blue-500 hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Usuarios de prueba para desarrollo */}
              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-2">Usuarios de prueba:</p>
                <div className="space-y-1 text-xs text-gray-400">
                  <p>carlos@example.com / password123 (Creador)</p>
                  <p>ana@example.com / password123 (Impresor)</p>
                  <p>juan@example.com / password123 (Usuario)</p>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Nombre completo</Label>
                <Input
                  id="register-name"
                  name="name"
                  placeholder="Tu nombre"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Contraseña</Label>
                <Input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Confirmar contraseña</Label>
                <Input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label>Tipo de cuenta</Label>
                <RadioGroup
                  defaultValue="user"
                  value={registerData.role}
                  onValueChange={(value) =>
                    setRegisterData({ ...registerData, role: value as "user" | "creator" | "printer" })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user">Usuario - Quiero comprar modelos 3D</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="creator" id="creator" />
                    <Label htmlFor="creator">Creador - Quiero vender mis modelos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="printer" id="printer" />
                    <Label htmlFor="printer">Impresor - Ofrezco servicios de impresión</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear Cuenta y Explorar Mercado"
                )}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Al registrarte, aceptas nuestros{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  Términos de Servicio
                </a>{" "}
                y{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  Política de Privacidad
                </a>
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
