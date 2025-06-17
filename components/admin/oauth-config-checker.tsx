"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle, AlertCircle, Loader2, ExternalLink, Copy } from "lucide-react"

export function OAuthConfigChecker() {
  const [isChecking, setIsChecking] = useState(false)
  const [configStatus, setConfigStatus] = useState<any>(null)
  const { isSupabaseEnabled, loginWithProvider } = useAuth()

  const checkOAuthConfig = async () => {
    setIsChecking(true)

    try {
      // Verificar variables de entorno
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      const status = {
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey,
        supabaseEnabled: isSupabaseEnabled,
        currentDomain: window.location.origin,
        callbackUrl: `${window.location.origin}/auth/callback`,
        timestamp: new Date().toISOString(),
      }

      setConfigStatus(status)

      if (status.supabaseEnabled) {
        toast({
          title: "✅ Configuración OAuth verificada",
          description: "Supabase está configurado correctamente",
        })
      } else {
        toast({
          title: "⚠️ Problema de configuración",
          description: "Revisa las variables de entorno de Supabase",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error checking OAuth config:", error)
      toast({
        title: "❌ Error de verificación",
        description: "No se pudo verificar la configuración",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  const testGoogleLogin = async () => {
    if (!isSupabaseEnabled) {
      toast({
        title: "⚠️ Supabase no configurado",
        description: "Configura Supabase primero",
        variant: "destructive",
      })
      return
    }

    try {
      toast({
        title: "🔄 Probando Google OAuth...",
        description: "Redirigiendo a Google...",
      })

      await loginWithProvider("google")
    } catch (error: any) {
      console.error("Google OAuth test error:", error)
      toast({
        title: "❌ Error en Google OAuth",
        description: error.message || "Error desconocido",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "📋 Copiado",
      description: "URL copiada al portapapeles",
    })
  }

  useEffect(() => {
    checkOAuthConfig()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Verificador de Configuración OAuth
          </CardTitle>
          <CardDescription>Verifica que Google OAuth esté configurado correctamente en Supabase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkOAuthConfig} disabled={isChecking} className="w-full">
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "🔍 Verificar Configuración"
            )}
          </Button>

          {configStatus && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Supabase URL</span>
                  {configStatus.supabaseUrl ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Supabase Key</span>
                  {configStatus.supabaseKey ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Supabase Habilitado</span>
                  {configStatus.supabaseEnabled ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Dominio Actual</span>
                  <Badge variant="outline">{configStatus.currentDomain}</Badge>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📋 URL de Callback para Supabase:</h4>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-white border rounded text-sm">{configStatus.callbackUrl}</code>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(configStatus.callbackUrl)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  ☝️ Copia esta URL y pégala en la configuración de Google OAuth en Supabase
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Prueba de Google OAuth
          </CardTitle>
          <CardDescription>Prueba la autenticación con Google para verificar que funciona</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={testGoogleLogin} disabled={!isSupabaseEnabled} className="w-full" variant="outline">
            {isSupabaseEnabled ? "🧪 Probar Login con Google" : "⚠️ Supabase no configurado"}
          </Button>

          {!isSupabaseEnabled && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Configuración Requerida</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Para probar Google OAuth, necesitas configurar las variables de entorno de Supabase.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📚 Guía de Configuración Google OAuth</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="mt-1">1</Badge>
              <div>
                <p className="font-medium">Ve a Supabase Dashboard</p>
                <p className="text-sm text-gray-600">Authentication → Providers → Google</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="mt-1">2</Badge>
              <div>
                <p className="font-medium">Habilita Google Provider</p>
                <p className="text-sm text-gray-600">Activa el toggle de Google OAuth</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="mt-1">3</Badge>
              <div>
                <p className="font-medium">Configura Google Console</p>
                <p className="text-sm text-gray-600">Crea un proyecto en Google Cloud Console</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="mt-1">4</Badge>
              <div>
                <p className="font-medium">Añade Callback URL</p>
                <p className="text-sm text-gray-600">Usa la URL mostrada arriba</p>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <a
              href="https://console.cloud.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir Google Cloud Console
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
