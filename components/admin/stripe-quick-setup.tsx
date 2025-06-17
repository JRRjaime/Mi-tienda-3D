"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function StripeQuickSetup() {
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

  const envVars = [
    {
      key: "STRIPE_SECRET_KEY",
      value:
        "sk_test_51RaYom4f5seHo4SUylcmU3QpSzwiaOs496GVHYI5tRoqK4UwQzKhlwSHDrHpWt8ngIL5YRdPnP2qlLAxt0fQ2bI900zfLk4Mrs",
      status: "ready",
    },
    {
      key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      value:
        "pk_test_51RaYom4f5seHo4SUKjDGjswodvNwBrTv8MBNnVjNaX8p9akUMDRXp2f10ePywkKRZycBkNzzOCuWBE9EnuBo1Qt4007NGCEiEJ",
      status: "ready",
    },
    {
      key: "STRIPE_WEBHOOK_SECRET",
      value: "whsec_[PENDIENTE_DE_CONFIGURAR]",
      status: "pending",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🎉 ¡Stripe Casi Listo!</h1>
        <p className="text-muted-foreground">Tus claves están configuradas. Solo falta el webhook.</p>
      </div>

      {/* Estado Actual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Estado de Configuración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {envVars.map((env) => (
            <div key={env.key} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant={env.status === "ready" ? "default" : "secondary"}>
                  {env.status === "ready" ? "✅ Listo" : "⏳ Pendiente"}
                </Badge>
                <span className="font-mono text-sm">{env.key}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{env.value.substring(0, 20)}...</span>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(env.value, env.key)}>
                  {copied === env.key ? "✅" : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Configurar Webhook */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Configurar Webhook (Último Paso)
          </CardTitle>
          <CardDescription>
            Necesitas configurar el webhook en Stripe para procesar pagos automáticamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-2">📋 Pasos para el Webhook:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Ve al Dashboard de Stripe → Developers → Webhooks</li>
              <li>Haz clic en "Add endpoint"</li>
              <li>
                URL del endpoint: <code className="bg-white px-2 py-1 rounded">tu-dominio.com/api/stripe/webhook</code>
              </li>
              <li>
                Eventos a escuchar: <code className="bg-white px-2 py-1 rounded">payment_intent.succeeded</code>
              </li>
              <li>Copia el "Signing secret" (whsec_...)</li>
              <li>Añádelo a tu archivo .env</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => window.open("https://dashboard.stripe.com/webhooks", "_blank")}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir Stripe Dashboard
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

      {/* Tarjetas de Prueba */}
      <Card>
        <CardHeader>
          <CardTitle>💳 Tarjetas de Prueba</CardTitle>
          <CardDescription>Usa estas tarjetas para probar los pagos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="font-semibold text-green-600">✅ Pago Exitoso</div>
              <div className="font-mono text-sm">4242 4242 4242 4242</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-semibold text-red-600">❌ Pago Fallido</div>
              <div className="font-mono text-sm">4000 0000 0000 0002</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-semibold text-orange-600">🔄 Requiere Auth</div>
              <div className="font-mono text-sm">4000 0025 0000 3155</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Próximos Pasos */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 ¡Ya Casi Terminamos!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Claves de Stripe configuradas</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span>Configurar webhook (5 minutos)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-gray-400" />
              <span>Probar pagos de prueba</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-gray-400" />
              <span>¡Listo para producción!</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
