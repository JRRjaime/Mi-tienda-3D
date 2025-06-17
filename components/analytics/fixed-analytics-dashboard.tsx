"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, Users, Package, DollarSign, Download, Eye, Star, ShoppingCart } from "lucide-react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function FixedAnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")

  // Datos simulados pero realistas
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalRevenue: 12450.5,
      totalOrders: 89,
      totalViews: 15420,
      totalDownloads: 234,
      conversionRate: 5.8,
      avgOrderValue: 139.9,
    },
    revenueData: [
      { name: "Ene", revenue: 2400, orders: 24 },
      { name: "Feb", revenue: 1398, orders: 18 },
      { name: "Mar", revenue: 9800, orders: 45 },
      { name: "Abr", revenue: 3908, orders: 32 },
      { name: "May", revenue: 4800, orders: 38 },
      { name: "Jun", revenue: 3800, orders: 29 },
      { name: "Jul", revenue: 4300, orders: 35 },
    ],
    categoryData: [
      { name: "Figuras", value: 35, revenue: 4200 },
      { name: "Prototipos", value: 25, revenue: 3100 },
      { name: "Decoración", value: 20, revenue: 2400 },
      { name: "Herramientas", value: 15, revenue: 1800 },
      { name: "Otros", value: 5, revenue: 600 },
    ],
    topModels: [
      { name: "Dragón Articulado", downloads: 45, revenue: 675, rating: 4.8 },
      { name: "Miniatura Guerrero", downloads: 38, revenue: 570, rating: 4.9 },
      { name: "Vaso Personalizado", downloads: 32, revenue: 384, rating: 4.6 },
      { name: "Engranaje Industrial", downloads: 28, revenue: 840, rating: 4.7 },
      { name: "Organizador Mesa", downloads: 25, revenue: 375, rating: 4.5 },
    ],
    dailyStats: [
      { date: "2024-01-15", views: 120, downloads: 8, revenue: 96 },
      { date: "2024-01-16", views: 145, downloads: 12, revenue: 144 },
      { date: "2024-01-17", views: 98, downloads: 6, revenue: 72 },
      { date: "2024-01-18", views: 167, downloads: 15, revenue: 225 },
      { date: "2024-01-19", views: 189, downloads: 18, revenue: 270 },
      { date: "2024-01-20", views: 156, downloads: 11, revenue: 165 },
      { date: "2024-01-21", views: 203, downloads: 22, revenue: 330 },
    ],
  })

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeRange])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-white">Cargando analytics...</span>
        </div>
      </div>
    )
  }

  const StatCard = ({ title, value, icon: Icon, change, color = "text-cyan-400" }: any) => (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {change && (
              <p className="text-xs text-green-400 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />+{change}% vs mes anterior
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full bg-white/10`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
          </select>
        </div>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ingresos Totales"
          value={`$${analyticsData.overview.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          change={12.5}
          color="text-green-400"
        />
        <StatCard
          title="Pedidos Totales"
          value={analyticsData.overview.totalOrders}
          icon={ShoppingCart}
          change={8.2}
          color="text-blue-400"
        />
        <StatCard
          title="Visualizaciones"
          value={analyticsData.overview.totalViews.toLocaleString()}
          icon={Eye}
          change={15.3}
          color="text-purple-400"
        />
        <StatCard
          title="Descargas"
          value={analyticsData.overview.totalDownloads}
          icon={Download}
          change={22.1}
          color="text-cyan-400"
        />
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Ingresos</TabsTrigger>
          <TabsTrigger value="models">Modelos</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Ingresos por Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F3F4F6",
                      }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Pedidos por Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F3F4F6",
                      }}
                    />
                    <Bar dataKey="orders" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Tasa de Conversión"
              value={`${analyticsData.overview.conversionRate}%`}
              icon={TrendingUp}
              change={2.1}
              color="text-yellow-400"
            />
            <StatCard
              title="Valor Promedio Pedido"
              value={`$${analyticsData.overview.avgOrderValue}`}
              icon={DollarSign}
              change={5.8}
              color="text-green-400"
            />
            <StatCard title="Modelos Activos" value="47" icon={Package} change={12.0} color="text-blue-400" />
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Modelos Más Populares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topModels.map((model, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{model.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {model.downloads} descargas
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400" />
                            {model.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">${model.revenue}</p>
                      <p className="text-gray-400 text-sm">ingresos</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Distribución por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Ingresos por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-white">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">${category.revenue}</p>
                        <p className="text-gray-400 text-sm">{category.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Actividad Diaria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                  />
                  <Line type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="downloads" stroke="#06B6D4" strokeWidth={2} />
                  <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Visitas Hoy" value="203" icon={Eye} change={12.5} color="text-purple-400" />
            <StatCard title="Descargas Hoy" value="22" icon={Download} change={18.2} color="text-cyan-400" />
            <StatCard title="Ingresos Hoy" value="$330" icon={DollarSign} change={25.3} color="text-green-400" />
            <StatCard title="Nuevos Seguidores" value="8" icon={Users} change={33.3} color="text-blue-400" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
