"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Download,
  ShoppingCart,
  DollarSign,
  Target,
  Calendar,
  RefreshCw,
  ExternalLink,
} from "lucide-react"

interface AnalyticsDashboardProps {
  userType: string[]
}

// Datos simulados de analytics
const analyticsData = {
  overview: {
    totalViews: 15420,
    totalDownloads: 2340,
    totalSales: 890,
    totalRevenue: 12450.5,
    conversionRate: 3.8,
    avgSessionDuration: "4:32",
    bounceRate: 42.3,
    returningUsers: 68.2,
  },
  trends: {
    viewsChange: 12.5,
    downloadsChange: -3.2,
    salesChange: 8.7,
    revenueChange: 15.3,
  },
  topModels: [
    { name: "Dragon Ball Z - Goku", views: 1250, downloads: 340, revenue: 425.6 },
    { name: "Organizador Modular", views: 980, downloads: 280, revenue: 238.0 },
    { name: "Engranaje Industrial", views: 750, downloads: 120, revenue: 300.0 },
  ],
  userBehavior: {
    topPages: [
      { page: "/productos/figuras-accion", views: 3420, avgTime: "3:45" },
      { page: "/productos/industrial", views: 2890, avgTime: "4:12" },
      { page: "/productos/hogar", views: 2340, avgTime: "2:58" },
    ],
    deviceTypes: [
      { device: "Desktop", percentage: 65.4 },
      { device: "Mobile", percentage: 28.7 },
      { device: "Tablet", percentage: 5.9 },
    ],
    trafficSources: [
      { source: "Directo", percentage: 45.2 },
      { source: "Google", percentage: 32.8 },
      { source: "Redes Sociales", percentage: 15.6 },
      { source: "Referencias", percentage: 6.4 },
    ],
  },
  goals: [
    { name: "Registro de usuarios", target: 100, current: 87, percentage: 87 },
    { name: "Ventas mensuales", target: 1000, current: 890, percentage: 89 },
    { name: "Tasa de conversión", target: 5, current: 3.8, percentage: 76 },
  ],
}

export function AnalyticsDashboard({ userType }: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [isLoading, setIsLoading] = useState(false)

  const isCreator = userType.includes("creador")
  const isPrinter = userType.includes("impresor")

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES").format(num)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const getTrendIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-400" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-400" />
    )
  }

  const getTrendColor = (change: number) => {
    return change >= 0 ? "text-green-400" : "text-red-400"
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard de Analytics</h2>
          <p className="text-gray-400">Métricas y estadísticas de tu actividad</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={selectedPeriod === "24h" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("24h")}
              className={selectedPeriod === "24h" ? "bg-cyan-500" : "border-white/20 text-white"}
            >
              24h
            </Button>
            <Button
              variant={selectedPeriod === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("7d")}
              className={selectedPeriod === "7d" ? "bg-cyan-500" : "border-white/20 text-white"}
            >
              7d
            </Button>
            <Button
              variant={selectedPeriod === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("30d")}
              className={selectedPeriod === "30d" ? "bg-cyan-500" : "border-white/20 text-white"}
            >
              30d
            </Button>
          </div>
          <Button
            onClick={refreshData}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-white/20 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="audience">Audiencia</TabsTrigger>
          <TabsTrigger value="goals">Objetivos</TabsTrigger>
        </TabsList>

        {/* Resumen General */}
        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Visualizaciones</p>
                      <p className="text-2xl font-bold text-white">{formatNumber(analyticsData.overview.totalViews)}</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(analyticsData.trends.viewsChange)}
                    <span className={`text-sm ml-1 ${getTrendColor(analyticsData.trends.viewsChange)}`}>
                      {Math.abs(analyticsData.trends.viewsChange)}%
                    </span>
                    <span className="text-sm text-gray-400 ml-1">vs período anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Descargas</p>
                      <p className="text-2xl font-bold text-white">
                        {formatNumber(analyticsData.overview.totalDownloads)}
                      </p>
                    </div>
                    <Download className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(analyticsData.trends.downloadsChange)}
                    <span className={`text-sm ml-1 ${getTrendColor(analyticsData.trends.downloadsChange)}`}>
                      {Math.abs(analyticsData.trends.downloadsChange)}%
                    </span>
                    <span className="text-sm text-gray-400 ml-1">vs período anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Ventas</p>
                      <p className="text-2xl font-bold text-white">{formatNumber(analyticsData.overview.totalSales)}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(analyticsData.trends.salesChange)}
                    <span className={`text-sm ml-1 ${getTrendColor(analyticsData.trends.salesChange)}`}>
                      {Math.abs(analyticsData.trends.salesChange)}%
                    </span>
                    <span className="text-sm text-gray-400 ml-1">vs período anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Ingresos</p>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(analyticsData.overview.totalRevenue)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-400" />
                  </div>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(analyticsData.trends.revenueChange)}
                    <span className={`text-sm ml-1 ${getTrendColor(analyticsData.trends.revenueChange)}`}>
                      {Math.abs(analyticsData.trends.revenueChange)}%
                    </span>
                    <span className="text-sm text-gray-400 ml-1">vs período anterior</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Métricas secundarias */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Tasa de Conversión</p>
                    <p className="text-xl font-bold text-cyan-400">{analyticsData.overview.conversionRate}%</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Duración Promedio</p>
                    <p className="text-xl font-bold text-cyan-400">{analyticsData.overview.avgSessionDuration}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Tasa de Rebote</p>
                    <p className="text-xl font-bold text-cyan-400">{analyticsData.overview.bounceRate}%</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Usuarios Recurrentes</p>
                    <p className="text-xl font-bold text-cyan-400">{analyticsData.overview.returningUsers}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Modelos */}
            {isCreator && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Modelos Más Populares</CardTitle>
                  <CardDescription className="text-gray-300">Tus modelos con mejor rendimiento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topModels.map((model, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{model.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                            <span>{formatNumber(model.views)} vistas</span>
                            <span>{formatNumber(model.downloads)} descargas</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">{formatCurrency(model.revenue)}</div>
                          <Badge className="bg-cyan-500">#{index + 1}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Rendimiento */}
        <TabsContent value="performance">
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Páginas Más Visitadas</CardTitle>
                <CardDescription className="text-gray-300">Contenido con mejor rendimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.userBehavior.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{page.page}</h4>
                        <p className="text-sm text-gray-400">Tiempo promedio: {page.avgTime}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-cyan-400">{formatNumber(page.views)}</div>
                        <p className="text-sm text-gray-400">vistas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Tipos de Dispositivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.userBehavior.deviceTypes.map((device, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white">{device.device}</span>
                          <span className="text-cyan-400">{device.percentage}%</span>
                        </div>
                        <Progress value={device.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Fuentes de Tráfico</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.userBehavior.trafficSources.map((source, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white">{source.source}</span>
                          <span className="text-cyan-400">{source.percentage}%</span>
                        </div>
                        <Progress value={source.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Audiencia */}
        <TabsContent value="audience">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-white mx-auto mb-2" />
                    <p className="text-sm text-white/80">Usuarios Únicos</p>
                    <p className="text-2xl font-bold text-white">8,420</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Calendar className="h-8 w-8 text-white mx-auto mb-2" />
                    <p className="text-sm text-white/80">Nuevos Usuarios</p>
                    <p className="text-2xl font-bold text-white">1,240</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 text-white mx-auto mb-2" />
                    <p className="text-sm text-white/80">Usuarios Recurrentes</p>
                    <p className="text-2xl font-bold text-white">7,180</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Demografía de Usuarios</CardTitle>
                <CardDescription className="text-gray-300">Información sobre tu audiencia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-white font-medium mb-4">Países Principales</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white">España</span>
                        <span className="text-cyan-400">45.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">México</span>
                        <span className="text-cyan-400">18.7%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">Argentina</span>
                        <span className="text-cyan-400">12.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">Colombia</span>
                        <span className="text-cyan-400">8.9%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-4">Grupos de Edad</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white">18-24</span>
                        <span className="text-cyan-400">22.1%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">25-34</span>
                        <span className="text-cyan-400">35.6%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">35-44</span>
                        <span className="text-cyan-400">28.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">45+</span>
                        <span className="text-cyan-400">14.0%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Objetivos */}
        <TabsContent value="goals">
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Progreso de Objetivos
                </CardTitle>
                <CardDescription className="text-gray-300">Seguimiento de tus metas de negocio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analyticsData.goals.map((goal, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-white font-medium">{goal.name}</h4>
                        <div className="text-right">
                          <span className="text-cyan-400 font-bold">{goal.current}</span>
                          <span className="text-gray-400"> / {goal.target}</span>
                        </div>
                      </div>
                      <Progress value={goal.percentage} className="h-3" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{goal.percentage}% completado</span>
                        <span className="text-gray-400">{goal.target - goal.current} restante</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Eventos Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">Nueva venta completada</p>
                        <p className="text-gray-400 text-xs">Hace 5 minutos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">Nuevo usuario registrado</p>
                        <p className="text-gray-400 text-xs">Hace 12 minutos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">Modelo descargado</p>
                        <p className="text-gray-400 text-xs">Hace 18 minutos</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Enlaces Rápidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-between border-white/20 text-white hover:bg-white/10"
                    >
                      <span>Google Analytics</span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-between border-white/20 text-white hover:bg-white/10"
                    >
                      <span>Google Search Console</span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-between border-white/20 text-white hover:bg-white/10"
                    >
                      <span>Facebook Insights</span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
