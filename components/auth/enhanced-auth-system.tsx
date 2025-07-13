"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Mail, Lock, Eye, EyeOff, CheckCircle, RefreshCw, AlertCircle, X } from "lucide-react"

interface EnhancedAuthSystemProps {
  mode?: "login" | "register" | "reset" | "verify"
  onSuccess?: () => void
  redirectTo?: string
}

export function EnhancedAuthSystem({ mode = "login", onSuccess, redirectTo = "/dashboard" }: EnhancedAuthSystemProps) {
  const [currentMode, setCurrentMode] = useState(mode)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [authError, setAuthError] = useState<string | null>(null)

  const { login, register, resetPassword, verifyEmail, resendVerification, loginDemo } = useAuth()
  const router = useRouter()

  // Estados de formularios
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as "user" | "creator" | "printer",
  })

  const [resetForm, setResetForm] = useState({
    email: "",
  })

  const [verifyForm, setVerifyForm] = useState({
    email: "",
    token: "",
  })

  // Validaciones
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const validateForm = (formType: string) => {
    const newErrors: Record<string, string> = {}

    switch (formType) {
      case "login":
        if (!loginForm.email) newErrors.email = "Email es requerido"
        else if (!validateEmail(loginForm.email)) newErrors.email = "Email inválido"
        if (!loginForm.password) newErrors.password = "Contraseña es requerida"
        break

      case "register":
        if (!registerForm.name) newErrors.name = "Nombre es requerido"
        if (!registerForm.email) newErrors.email = "Email es requerido"
        else if (!validateEmail(registerForm.email)) newErrors.email = "Email inválido"
        if (!registerForm.password) newErrors.password = "Contraseña es requerida"
        else if (!validatePassword(registerForm.password))
          newErrors.password = "Contraseña debe tener al menos 8 caracteres"
        if (registerForm.password !== registerForm.confirmPassword)
          newErrors.confirmPassword = "Las contraseñas no coinciden"
        break

      case "reset":
        if (!resetForm.email) newErrors.email = "Email es requerido"
        else if (!validateEmail(resetForm.email)) newErrors.email = "Email inválido"
        break

      case "verify":
        if (!verifyForm.email) newErrors.email = "Email es requerido"
        if (!verifyForm.token) newErrors.token = "Código de verificación es requerido"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm("login") || isLoading) return

    setIsLoading(true)
    setAuthError(null)

    try {
      const success = await login(loginForm.email, loginForm.password)
      if (success) {
        onSuccess?.()
        router.push(redirectTo)
      }
    } catch (error: any) {
      setAuthError(error.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    if (isLoading) return

    setIsLoading(true)
    setAuthError(null)

    try {
      const success = await loginDemo()
      if (success) {
        onSuccess?.()
        router.push(redirectTo)
      }
    } catch (error: any) {
      setAuthError(error.message || "Error al crear cuenta demo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm("register") || isLoading) return

    setIsLoading(true)
    setAuthError(null)

    try {
      const success = await register(registerForm.name, registerForm.email, registerForm.password, registerForm.role)
      if (success) {
        onSuccess?.()
        router.push(redirectTo)
      }
    } catch (error: any) {
      setAuthError(error.message || "Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm("reset") || isLoading) return

    setIsLoading(true)
    setAuthError(null)

    try {
      await resetPassword(resetForm.email)
    } catch (error: any) {
      setAuthError(error.message || "No se pudo enviar el email")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm("verify") || isLoading) return

    setIsLoading(true)
    setAuthError(null)

    try {
      const success = await verifyEmail(verifyForm.email, verifyForm.token)
      if (success) {
        onSuccess?.()
        router.push(redirectTo)
      }
    } catch (error: any) {
      setAuthError(error.message || "Error de verificación")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (isLoading) return

    setIsLoading(true)
    setAuthError(null)

    try {
      await resendVerification(verifyForm.email)
    } catch (error: any) {
      setAuthError(error.message || "No se pudo reenviar el código")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Error global */}
      {authError && (
        <Card className="bg-red-500/10 border-red-400/30 mb-4">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-red-400 font-semibold text-sm">Error de autenticación</h4>
                <p className="text-red-300 text-sm mt-1">{authError}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAuthError(null)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={currentMode} onValueChange={(value) => setCurrentMode(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="login">Iniciar</TabsTrigger>
          <TabsTrigger value="register">Registro</TabsTrigger>
          <TabsTrigger value="reset">Recuperar</TabsTrigger>
          <TabsTrigger value="verify">Verificar</TabsTrigger>
        </TabsList>

        {/* Login */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Iniciar Sesión
              </CardTitle>
              <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
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
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
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

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">O</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando demo...
                    </>
                  ) : (
                    "🎭 Probar con cuenta demo"
                  )}
                </Button>

                <div className="text-center">
                  <Button type="button" variant="link" onClick={() => setCurrentMode("reset")} className="text-sm">
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Register */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Crear Cuenta</CardTitle>
              <CardDescription>Únete a nuestra plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nombre completo</Label>
                  <Input
                    id="register-name"
                    placeholder="Tu nombre"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    className={errors.name ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
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
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
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
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
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
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reset Password */}
        <TabsContent value="reset">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Recuperar Contraseña
              </CardTitle>
              <CardDescription>Te enviaremos un enlace para restablecer tu contraseña</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={resetForm.email}
                    onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
                    className={errors.email ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar enlace de recuperación"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verify Email */}
        <TabsContent value="verify">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Verificar Email
              </CardTitle>
              <CardDescription>Ingresa el código que enviamos a tu email</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verify-email">Email</Label>
                  <Input
                    id="verify-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={verifyForm.email}
                    onChange={(e) => setVerifyForm({ ...verifyForm, email: e.target.value })}
                    className={errors.email ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verify-token">Código de verificación</Label>
                  <Input
                    id="verify-token"
                    placeholder="123456"
                    value={verifyForm.token}
                    onChange={(e) => setVerifyForm({ ...verifyForm, token: e.target.value })}
                    className={errors.token ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.token && <p className="text-sm text-red-500">{errors.token}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Verificar Email"
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendVerification}
                    disabled={isLoading}
                    className="text-sm"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reenviar código
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
