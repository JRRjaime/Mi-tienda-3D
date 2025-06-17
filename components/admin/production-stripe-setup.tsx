"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Copy, ExternalLink, Shield, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ProductionStripeSetup() {
  const [copied, setCopied] = useState<string | null>(null)
  const { toast } = useToast()

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    toast({
      title: "¡Copiado!",
      description: `${label} copiado al portapapeles`,
    })
    setTimeout(() => setCopied(null), 2000)
  }

  const productionKeys = {
    publishable:
      "pk_live_51RaYoeG7GMJ186FTWAU9YURyKtNNZ1kqoyzwNHxNQ5HFAsYyXZsZL3a3UXaoaXHsrmoS6Gq6bKvy8CgJ6pa2zZBB00fMWK58c7",
    secret:
      "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",
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-green-500" />🚀 Configuración de Producción
        </h1>
        <p className="text-muted-foreground">Claves LIVE de Stripe - ¡Pagos reales!</p>
      </div>

      {/* Advertencia de Seguridad */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>⚠️ IMPORTANTE:</strong> Estas son claves de PRODUCCIÓN. Los pagos serán reales. Asegúrate de:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Configurar correctamente en Vercel (no en .env.local)</li>
            <li>Crear webhook de PRODUCCIÓN en Stripe</li>
            <li>Probar exhaustivamente antes de lanzar</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Configuración para Vercel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-500" />
            Configuración en Vercel (PRODUCCIÓN)
          </CardTitle>
          <CardDescription>Configura estas variables en tu proyecto de Vercel para producción</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3">📋 Pasos en Vercel:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Ve a tu proyecto en vercel.com</li>
              <li>Settings → Environment Variables</li>
              <li>Añade las siguientes variables:</li>
            </ol>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500">LIVE</Badge>
                <span className="font-mono text-sm">STRIPE_SECRET_KEY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">sk_live_...</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(productionKeys.secret, "Secret Key")}
                >
                  {copied === "Secret Key" ? "✅" : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500">LIVE</Badge>
                <span className="font-mono text-sm">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">pk_live_...</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(productionKeys.publishable, "Publishable Key")}
                >
                  {copied === "Publishable Key" ? "✅" : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-orange-50">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">PENDIENTE</Badge>
                <span className="font-mono text-sm">STRIPE_WEBHOOK_SECRET</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">whsec_... (crear webhook)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhook de Producción */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Webhook de PRODUCCIÓN
          </CardTitle>
          <CardDescription>Debes crear un webhook separado para producción</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold mb-2">🔥 IMPORTANTE - Webhook de Producción:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Ve a Stripe Dashboard → Cambia a "Live mode" (arriba a la derecha)</li>
              <li>Developers → Webhooks → Add endpoint</li>
              <li>
                URL: <code className="bg-white px-2 py-1 rounded">https://tu-dominio.com/api/stripe/webhook</code>
              </li>
              <li>Eventos: payment_intent.succeeded, payment_intent.payment_failed</li>
              <li>Copia el webhook secret (whsec_...) y añádelo a Vercel</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => window.open("https://dashboard.stripe.com/webhooks", "_blank")}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir Stripe Dashboard (LIVE)
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                copyToClipboard(
                  "payment_intent.succeeded,payment_intent.payment_failed,charge.dispute.created",
                  "Eventos",
                )
              }
            >
              {copied === "Eventos" ? "✅ Copiado" : "Copiar Eventos"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diferencias Test vs Live */}
      <Card>
        <CardHeader>
          <CardTitle>🔄 Test vs Producción</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <h3 className="font-semibold text-blue-800 mb-2">🧪 Modo Test (Desarrollo)</h3>
              <ul className="text-sm space-y-1 text-blue-700">
                <li>• Claves: pk_test_... / sk_test_...</li>
                <li>• Pagos simulados</li>
                <li>• Tarjetas de prueba</li>
                <li>• Sin dinero real</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg bg-green-50">
              <h3 className="font-semibold text-green-800 mb-2">🚀 Modo Live (Producción)</h3>
              <ul className="text-sm space-y-1 text-green-700">
                <li>• Claves: pk_live_... / sk_live_...</li>
                <li>• Pagos reales</li>
                <li>• Tarjetas reales</li>
                <li>• Dinero real transferido</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Final */}
      <Card>
        <CardHeader>
          <CardTitle>✅ Checklist de Producción</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Claves de producción obtenidas</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Configurar variables en Vercel</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Crear webhook de producción</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Probar con tarjeta real (cantidad pequeña)</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Verificar que los pagos llegan a tu cuenta</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
