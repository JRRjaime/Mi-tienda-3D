// components/analytics/advanced-analytics-dashboard.tsx
"use client"

import { useAnalytics } from "@/contexts/analytics-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
// ... otros imports ...

export function AdvancedAnalyticsDashboard() {
  const { analytics, refreshAnalytics, isLoading, getMarketInsights, getPriceRecommendation, calculateROI } =
    useAnalytics()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-semibold">Cargando analíticas...</p>
          <p className="text-sm text-muted-foreground">Un momento, por favor.</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-center p-6 bg-card rounded-lg shadow-lg">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error al cargar Analíticas</h2>
          <p className="text-muted-foreground mb-4">
            No se pudieron cargar los datos de analíticas. Por favor, intenta refrescar.
          </p>
          <Button onClick={refreshAnalytics}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refrescar Analíticas
          </Button>
        </div>
      </div>
    )
  }

  // El resto del componente permanece igual, usando los datos de `analytics`
  // ...
  // Ejemplo de cómo usar una de las funciones:
  // const gokuRoi = calculateROI("model-1");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Panel de Analíticas Avanzadas</h1>
        <Button onClick={refreshAnalytics} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Actualizar Datos
        </Button>
      </div>

      {/* Resumen General */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.modelROIs.reduce((sum, roi) => sum + roi.revenue, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
          </CardContent>
        </Card>
        {/* ... otras cards de resumen ... */}
      </div>

      {/* Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Tendencias del Mercado
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {analytics.marketTrends.map((trend) => (
            <Card key={trend.category} className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{trend.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Crecimiento: <span className="font-semibold text-green-500">{trend.growth}%</span>
                </p>
                <p>
                  Demanda:{" "}
                  <span
                    className={`font-semibold ${trend.demand === "Alta" ? "text-red-500" : trend.demand === "Media" ? "text-yellow-500" : "text-blue-500"}`}
                  >
                    {trend.demand}
                  </span>
                </p>
                <p>
                  Precio Promedio: <span className="font-semibold">${trend.avgPrice.toFixed(2)}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Keywords: {trend.topKeywords.join(", ")}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Price Optimizations */}
      {/* ... y el resto de las secciones del dashboard ... */}
    </div>
  )
}
