"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  CreditCard,
  Globe,
  Key,
  Webhook,
  RefreshCw,
  ExternalLink,
} from "lucide-react"

interface ConfigStatus {
  stripeConfigured: boolean
  webhookConfigured: boolean
  testPaymentWorks: boolean
  publicKeyValid: boolean
  secretKeyValid: boolean
}

export function StripeConfigChecker() {
  const [status, setStatus] = useState<ConfigStatus>({
    stripeConfigured: false,
    webhookConfigured: false,
    testPaymentWorks: false,
    publicKeyValid: false,
    secretKeyValid: false,
  })
  const [isChecking, setIsChecking] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const { toast } = useToast()

  const checkStripeConfig = async () => {
    setIsChecking(true)

    try {
      // Verificar configuración básica
      const configResponse = await fetch("/api/stripe/check-config")
      const configData = await configResponse.json()

      // Verificar webhook
      const webhookResponse = await fetch("/api/stripe/test-webhook", {
        method: "POST",
      })
      const webhookData = await webhookResponse.json()

      // Verificar pago de prueba
      const testPaymentResponse = await fetch("/api/stripe/test-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 100 }), // $1.00 de prueba
      })
      const testPaymentData = await testPaymentResponse.json()

      setStatus({
        stripeConfigured: configData.configured || false,
        publicKeyValid: configData.publicKeyValid || false,
        secretKeyValid: configData.secretKeyValid || false,
        webhookConfigured: webhookData.configured || false,
        testPaymentWorks: testPaymentData.success || false,
      })

      setLastCheck(new Date())

      toast({
        title: "✅ Verificación completada",
        description: "Estado de Stripe actualizado",
      })
    } catch (error) {
      console.error("Error checking Stripe config:", error)
      toast({
        title: "❌ Error en verificación",
        description: "No se pudo verificar la configuración de Stripe",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkStripeConfig()
  }, [])

  const getStatusIcon = (isValid: boolean, isLoading = false) => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    return isValid ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusBadge = (isValid: boolean) => {
    return isValid ? (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Configurado</Badge>
    ) : (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">No Configurado</Badge>
    )
  }

  const allConfigured = Object.values(status).every(Boolean)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
          Verificador de Configuración Stripe
        </h1>
        <p className="text-gray-400">Verifica que tu integración de Stripe esté configurada correctamente</p>
      </div>

      {/* Estado General */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Estado General
            </div>
            <Button
              onClick={checkStripeConfig}
              disabled={isChecking}
              size="sm"
              variant="outline"
              className="border-white/20"
            >
              {isChecking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Verificar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium text-white">Configuración de Stripe</span>
            {allConfigured ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-lg px-4 py-2">
                ✅ Completamente Configurado
              </Badge>
            ) : (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-lg px-4 py-2">
                ⚠️ Configuración Incompleta
              </Badge>
            )}
          </div>

          {lastCheck && <p className="text-sm text-gray-400">Última verificación: {lastCheck.toLocaleString()}</p>}
        </CardContent>
      </Card>

      {/* Detalles de Configuración */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Claves API */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Key className="h-5 w-5" />
              Claves API
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.publicKeyValid, isChecking)}
                <span className="text-white">Clave Pública</span>
              </div>
              {getStatusBadge(status.publicKeyValid)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.secretKeyValid, isChecking)}
                <span className="text-white">Clave Secreta</span>
              </div>
              {getStatusBadge(status.secretKeyValid)}
            </div>

            {!status.publicKeyValid || !status.secretKeyValid ? (
              <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-yellow-400 font-medium">Configurar Variables de Entorno</p>
                    <p className="text-yellow-300 mt-1">Añade STRIPE_SECRET_KEY y NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Claves API configuradas correctamente</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Webhook */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Webhook className="h-5 w-5" />
              Webhook
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.webhookConfigured, isChecking)}
                <span className="text-white">Endpoint Webhook</span>
              </div>
              {getStatusBadge(status.webhookConfigured)}
            </div>

            {!status.webhookConfigured ? (
              <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-yellow-400 font-medium">Configurar Webhook</p>
                    <p className="text-yellow-300 mt-1">URL: /api/stripe/webhook</p>
                    <p className="text-yellow-300">Eventos: payment_intent.succeeded, payment_intent.payment_failed</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Webhook configurado y funcionando</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagos de Prueba */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CreditCard className="h-5 w-5" />
              Pagos de Prueba
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.testPaymentWorks, isChecking)}
                <span className="text-white">Payment Intent</span>
              </div>
              {getStatusBadge(status.testPaymentWorks)}
            </div>

            {status.testPaymentWorks ? (
              <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Pagos funcionando correctamente</span>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-red-400 font-medium">Error en pagos de prueba</p>
                    <p className="text-red-300 mt-1">Verifica la configuración de las claves API</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enlaces Útiles */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="h-5 w-5" />
              Enlaces Útiles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start border-white/20 text-white hover:bg-white/10"
              onClick={() => window.open("https://dashboard.stripe.com/test/apikeys", "_blank")}
            >
              <Key className="h-4 w-4 mr-2" />
              Claves API de Stripe
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start border-white/20 text-white hover:bg-white/10"
              onClick={() => window.open("https://dashboard.stripe.com/test/webhooks", "_blank")}
            >
              <Webhook className="h-4 w-4 mr-2" />
              Configurar Webhooks
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start border-white/20 text-white hover:bg-white/10"
              onClick={() => window.open("https://stripe.com/docs/testing", "_blank")}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Tarjetas de Prueba
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tarjetas de Prueba */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <CreditCard className="h-5 w-5" />
            Tarjetas de Prueba
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">✅ Pago Exitoso</h4>
              <div className="text-sm text-green-300 space-y-1">
                <p>
                  <strong>Número:</strong> 4242 4242 4242 4242
                </p>
                <p>
                  <strong>Fecha:</strong> 12/34
                </p>
                <p>
                  <strong>CVC:</strong> 123
                </p>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
              <h4 className="text-red-400 font-semibold mb-2">❌ Pago Fallido</h4>
              <div className="text-sm text-red-300 space-y-1">
                <p>
                  <strong>Número:</strong> 4000 0000 0000 0002
                </p>
                <p>
                  <strong>Fecha:</strong> 12/34
                </p>
                <p>
                  <strong>CVC:</strong> 123
                </p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold mb-2">🔄 Requiere Auth</h4>
              <div className="text-sm text-yellow-300 space-y-1">
                <p>
                  <strong>Número:</strong> 4000 0025 0000 3155
                </p>
                <p>
                  <strong>Fecha:</strong> 12/34
                </p>
                <p>
                  <strong>CVC:</strong> 123
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
