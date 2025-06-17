"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Zap, AlertCircle, Mail, RefreshCw, Eye, EyeOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { SocialAuthButtons } from "./social-auth-buttons"

interface EnhancedAuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "login" | "register"
  preselectedRole?: "user" | "creator" | "printer" | null
}

export function EnhancedAuthModal({
  isOpen,
  onClose,
  defaultTab = "login",
  preselectedRole = null,
}: EnhancedAuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab)
  const { login, loginDemo, register, isLoading, isSupabaseEnabled, supabase, setIsLoading } = useAuth()
  const router = useRouter()

  // Estados para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
    role: preselectedRole || ("user" as "user" | "creator" | "printer"),
  })

  // Estado para errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

  // Resetear el tab cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab)
      setErrors({})
      setShowPassword(false)
      setShowConfirmPassword(false)

      // Set preselected role if provided
      if (preselectedRole) {
        setRegisterData((prev) => ({ ...prev, role: preselectedRole }))
      }
    }
  }, [isOpen, defaultTab, preselectedRole])

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

  // Manejar inicio de sesión demo
  const handleDemoLogin = async () => {
    try {
      const success = await loginDemo()
      if (success) {
        onClose()
        router.push("/bienvenida")
      }
    } catch (error) {
      console.error("Demo login failed:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la cuenta demo. Intenta de nuevo.",
        variant: "destructive",
      })
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

    try {
      // Intentar iniciar sesión
      const success = await login(loginData.email, loginData.password)
      if (success) {
        onClose()
        router.push("/bienvenida")
      }
    } catch (error) {
      console.error("Login failed:", error)
      setErrors({ general: "Error de conexión. Intenta de nuevo." })
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
      if (isSupabaseEnabled) {
        // Mostrar pestaña de confirmación de email
        setRegisteredEmail(registerData.email)
        setShowEmailConfirmation(true)
        setActiveTab("confirm-email" as any)

        toast({
          title: "¡Registro exitoso!",
          description: "Revisa tu email para confirmar tu cuenta.",
          duration: 5000,
        })
      } else {
        // Sin Supabase, redirigir directamente
        onClose()
        router.push("/bienvenida")
      }
    }
  }

  const handleResendConfirmation = async () => {
    if (!isSupabaseEnabled || !supabase || !registeredEmail) return

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: registeredEmail,
      })

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo reenviar el email. Intenta de nuevo.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Email reenviado",
          description: "Revisa tu bandeja de entrada.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo reenviar el email.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar éxito de autenticación social
  const handleSocialSuccess = () => {
    onClose()
    router.push("/bienvenida")
  }

  // Limpiar formularios cuando se cierre el modal
  const handleClose = () => {
    setLoginData({ email: "", password: "" })
    setRegisterData({ name: "", email: "", password: "", confirmPassword: "", role: "user" })
    setErrors({})
    setShowEmailConfirmation(false)
    setRegisteredEmail("")
    setShowPassword(false)
    setShowConfirmPassword(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Accede a tu cuenta</DialogTitle>
          <DialogDescription>
            Inicia sesión o crea una cuenta para acceder a todas las funcionalidades.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
            <TabsTrigger value="confirm-email" disabled={!showEmailConfirmation}>
              Confirma Email
            </TabsTrigger>
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
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className={errors.password ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              {errors.general && (
                <div className="flex items-center space-x-2 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.general}</span>
                </div>
              )}

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
                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className="text-blue-500 hover:underline"
                >
                  ¿No tienes cuenta? Regístrate aquí
                </button>
              </div>

              {/* Información sobre el sistema */}
              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-2">
                  {isSupabaseEnabled ? "Conectado con Supabase:" : "Modo Demo:"}
                </p>
                <div className="space-y-1 text-xs text-gray-400">
                  {isSupabaseEnabled ? (
                    <>
                      <p>✅ Autenticación segura</p>
                      <p>✅ OAuth con Google, Apple, GitHub, etc.</p>
                      <p>✅ Base de datos en tiempo real</p>
                    </>
                  ) : (
                    <>
                      <p>🧪 carlos@example.com / password123 (Creador)</p>
                      <p>🧪 ana@example.com / password123 (Impresor)</p>
                      <p>🧪 juan@example.com / password123 (Usuario)</p>
                    </>
                  )}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className={errors.password ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
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
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label>Tipo de cuenta</Label>
                <RadioGroup
                  value={registerData.role}
                  onValueChange={(value) =>
                    setRegisterData({ ...registerData, role: value as "user" | "creator" | "printer" })
                  }
                  disabled={isLoading}
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
                  "Crear Cuenta"
                )}
              </Button>

              <div className="text-center text-sm">
                <button type="button" onClick={() => setActiveTab("login")} className="text-blue-500 hover:underline">
                  ¿Ya tienes cuenta? Inicia sesión aquí
                </button>
              </div>

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

          <TabsContent value="confirm-email">
            <div className="space-y-4 pt-4 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">¡Confirma tu email!</h3>
                <p className="text-sm text-gray-600">Hemos enviado un enlace de confirmación a:</p>
                <p className="text-sm font-medium text-blue-600">{registeredEmail}</p>
              </div>

              <div className="space-y-3 text-sm text-gray-500">
                <p>• Revisa tu bandeja de entrada</p>
                <p>• Busca también en spam/promociones</p>
                <p>• Haz clic en el enlace para activar tu cuenta</p>
              </div>

              <div className="space-y-2">
                <Button onClick={handleResendConfirmation} variant="outline" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Reenviando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reenviar email
                    </>
                  )}
                </Button>

                <Button onClick={() => setActiveTab("login")} variant="ghost" className="w-full">
                  Volver al inicio de sesión
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Autenticación Social - AHORA DESPUÉS DEL FORMULARIO */}
        <div className="mt-6">
          <SocialAuthButtons onSuccess={handleSocialSuccess} disabled={isLoading} />
        </div>

        {/* Botón de prueba rápida - AL FINAL */}
        <div className="mt-4">
          <Button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cuenta demo...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Prueba Rápida - Crear Usuario Demo
              </>
            )}
          </Button>
          <p className="text-xs text-center text-gray-500 mt-2">Crea automáticamente un usuario de prueba aleatorio</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
