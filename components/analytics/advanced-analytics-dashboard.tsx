"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Target, RefreshCw, BarChart3, Activity, Zap, Brain } from "lucide-react"
import { useAnalytics } from "@/contexts/analytics-context"
import { useAuth } from "@/contexts/auth-context"

export function AdvancedAnalyticsDashboard() {
  const { analytics, refreshAnalytics } = useAnalytics()
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header con refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">📊 Analytics Avanzado</h2>
          <p className="text-gray-400">Insights profundos con IA para optimizar tu negocio</p>
        </div>
        <Button onClick={refreshAnalytics} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualizar Datos
        </Button>
      </div>

      {/* Métricas de Engagement */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Métricas de Engagement
          </CardTitle>
          <CardDescription className="text-gray-300">Análisis profundo del comportamiento de usuarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{analytics.engagementMetrics.viewToDownloadRate}%</div>
              <div className="text-sm text-gray-400">Vista → Descarga</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{analytics.engagementMetrics.likeToDownloadRate}%</div>
              <div className="text-sm text-gray-400">Like → Descarga</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{analytics.engagementMetrics.avgTimeOnModel}min</div>
              <div className="text-sm text-gray-400">Tiempo Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{analytics.engagementMetrics.bounceRate}%</div>
              <div className="text-sm text-gray-400">Bounce Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{analytics.engagementMetrics.shareRate}%</div>
              <div className="text-sm text-gray-400">Share Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tendencias del Mercado */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Análisis de Tendencias del Mercado
          </CardTitle>
          <CardDescription className="text-gray-300">Categorías con mayor crecimiento y demanda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.marketTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-white">{trend.category}</h4>
                    <Badge
                      variant={trend.demand === "Alta" ? "default" : trend.demand === "Media" ? "secondary" : "outline"}
                      className={
                        trend.demand === "Alta"
                          ? "bg-green-500"
                          : trend.demand === "Media"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                      }
                    >
                      {trend.demand} Demanda
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Crecimiento: {trend.growth}%</span>
                    <span>Precio Promedio: ${trend.avgPrice}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {trend.topKeywords.map((keyword, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-bold">+{trend.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimización de Precios */}
      <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            Optimización de Precios con IA
          </CardTitle>
          <CardDescription className="text-gray-300">
            Recomendaciones inteligentes para maximizar ingresos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.priceOptimizations.map((opt, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-white">Modelo #{opt.modelId}</h4>
                    <p className="text-sm text-gray-400">{opt.reason}</p>
                  </div>
                  <Badge className="bg-yellow-500">{opt.confidence}% Confianza</Badge>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Precio Actual</div>
                    <div className="text-xl font-bold text-red-400">${opt.currentPrice}</div>
                  </div>
                  <div className="text-2xl text-gray-500">→</div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Precio Sugerido</div>
                    <div className="text-xl font-bold text-green-400">${opt.suggestedPrice}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Incremento</div>
                    <div className="text-xl font-bold text-yellow-400">
                      +{(((opt.suggestedPrice - opt.currentPrice) / opt.currentPrice) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ROI por Modelo */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            ROI por Modelo
          </CardTitle>
          <CardDescription className="text-gray-300">Análisis de rentabilidad y retorno de inversión</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.modelROIs.map((roi, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-white">{roi.title}</h4>
                    <p className="text-sm text-gray-400">Break-even en {roi.breakEvenDays} días</p>
                  </div>
                  <Badge className="bg-purple-500">ROI: {roi.roi.toFixed(1)}%</Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-400">Inversión</div>
                    <div className="text-lg font-bold text-red-400">${roi.investment}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Ingresos</div>
                    <div className="text-lg font-bold text-green-400">${roi.revenue}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Margen</div>
                    <div className="text-lg font-bold text-yellow-400">{roi.profitMargin.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">ROI</div>
                    <div className="text-lg font-bold text-purple-400">{roi.roi.toFixed(1)}%</div>
                  </div>
                </div>
                <Progress value={roi.profitMargin} className="mt-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predicción de Demanda */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Predicción de Demanda IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-cyan-400">+{analytics.demandPrediction.nextMonth}</div>
              <div className="text-sm text-gray-400">Descargas próximo mes</div>
              <Badge className="mt-2 bg-cyan-500">{analytics.demandPrediction.confidence}% Confianza</Badge>
            </div>
            <div className="space-y-2">
              <h5 className="font-semibold text-white">Factores Clave:</h5>
              {analytics.demandPrediction.factors.map((factor, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <Zap className="h-3 w-3 text-yellow-400" />
                  {factor}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Análisis Competitivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{analytics.competitorAnalysis.marketShare}%</div>
                <div className="text-sm text-gray-400">Tu Market Share</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">${analytics.competitorAnalysis.avgPrice}</div>
                <div className="text-sm text-gray-400">Precio Promedio Mercado</div>
              </div>
              <div>
                <h5 className="font-semibold text-white mb-2">Top Competidores:</h5>
                {analytics.competitorAnalysis.topCompetitors.map((comp, i) => (
                  <Badge key={i} variant="outline" className="mr-2 mb-2">
                    {comp}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
