"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AdminCommissionDashboard } from "@/components/admin/admin-commission-dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Loader2, AlertCircle } from "lucide-react"

export default function AdminPage() {
  const { user, login, isLoading } = useAuth()
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  // Si el usuario ya está logueado y es admin, mostrar dashboard
  if (user?.role === "admin") {
    return <AdminCommissionDashboard />
  }

  // Si hay un usuario logueado pero no es admin, mostrar acceso denegado
  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Acceso Denegado</CardTitle>
            <CardDescription>
              No tienes permisos para acceder a esta área. Solo administradores pueden ver esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/")} className="w-full">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mostrar formulario de login admin
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!loginData.email || !loginData.password) {
      setError("Por favor completa todos los campos")
      return
    }

    try {
      const success = await login(loginData.email, loginData.password)
      if (!success) {
        setError("Credenciales incorrectas")
      }
    } catch (error) {
      setError("Error de conexión")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    })
    if (error) setError("")
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle>Panel de Administración</CardTitle>
          <CardDescription>Acceso restringido solo para administradores</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email de Administrador</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@3dplatform.com"
                value={loginData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={error ? "border-red-500" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••••••••••"
                value={loginData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={error ? "border-red-500" : ""}
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Acceder al Panel
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">
              <strong>Credenciales de Administrador:</strong>
            </p>
            <div className="space-y-1 text-xs text-gray-500 font-mono">
              <p>📧 Email: admin@3dplatform.com</p>
              <p>🔐 Contraseña: Admin2024!@#$SecurePass</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => (window.location.href = "/")} className="text-sm">
              ← Volver al sitio principal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
