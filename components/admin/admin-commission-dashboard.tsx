"use client"

import { useState, useMemo } from "react"
import { usePlatformCommission } from "@/contexts/platform-commission-context"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  Download,
  Users,
} from "lucide-react"
import { TestCommissionGenerator } from "./test-commission-generator"

// Función helper para formatear moneda
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function AdminCommissionDashboard() {
  const { user, logout } = useAuth()
  const {
    commissions,
    totalEarnings,
    pendingEarnings,
    processedEarnings,
    processCommission,
    getTotalCommissionsToday,
    getTotalCommissionsThisMonth,
  } = usePlatformCommission()

  const [selectedPeriod, setSelectedPeriod] = useState("all")

  // Calcular métricas usando las funciones del contexto
  const todayEarnings = useMemo(() => getTotalCommissionsToday(), [getTotalCommissionsToday])
  const monthEarnings = useMemo(() => getTotalCommissionsThisMonth(), [getTotalCommissionsThisMonth])

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  const handleProcessCommission = async (commissionId: string) => {
    processCommission(commissionId)
  }

  const exportCommissions = () => {
    if (!commissions || commissions.length === 0) {
      alert("No hay comisiones para exportar")
      return
    }

    const csvContent = [
      ["Fecha", "Usuario", "Producto", "Monto Original", "Comisión", "Estado"],
      ...commissions.map((commission) => [
        new Date(commission.date).toLocaleDateString(),
        commission.userName,
        commission.productInfo.productName,
        formatCurrency(commission.originalAmount),
        formatCurrency(commission.commissionAmount),
        commission.status === "processed" ? "Procesada" : "Pendiente",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `comisiones_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Filtrar comisiones por período
  const filteredCommissions = useMemo(() => {
    if (!commissions) return []

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    switch (selectedPeriod) {
      case "today":
        return commissions.filter((c) => new Date(c.date) >= today)
      case "week":
        return commissions.filter((c) => new Date(c.date) >= thisWeek)
      case "month":
        return commissions.filter((c) => new Date(c.date) >= thisMonth)
      default:
        return commissions
    }
  }, [commissions, selectedPeriod])

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
            <p className="text-gray-400 mt-2">
              Bienvenido, {user?.name || "Admin"} - Gestiona tus comisiones de plataforma
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportCommissions} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Test Commission Generator - Solo para desarrollo */}
        <TestCommissionGenerator />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Ganancias Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(totalEarnings || 0)}</div>
              <p className="text-xs text-gray-400">{commissions?.length || 0} transacciones • Comisión 5%</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Ganancias de Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(todayEarnings || 0)}</div>
              <p className="text-xs text-gray-400">
                +{((todayEarnings / (monthEarnings || 1)) * 100).toFixed(1)}% del mes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Ganancias del Mes</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(monthEarnings || 0)}</div>
              <p className="text-xs text-gray-400">
                Promedio: {formatCurrency((monthEarnings || 0) / new Date().getDate())}/día
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Comisiones Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(pendingEarnings || 0)}</div>
              <p className="text-xs text-gray-400">
                {commissions?.filter((c) => c.status === "pending").length || 0} por procesar
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Commission History */}
        <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="space-y-4">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="today">Hoy</TabsTrigger>
            <TabsTrigger value="week">Esta Semana</TabsTrigger>
            <TabsTrigger value="month">Este Mes</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedPeriod}>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Historial de Comisiones
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {filteredCommissions.length} transacciones encontradas
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-700">
                    5% Comisión
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {!commissions || commissions.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No hay comisiones registradas</h3>
                    <p className="text-gray-400 mb-4">
                      Las comisiones aparecerán aquí automáticamente cuando se realicen compras en la plataforma.
                    </p>
                    <div className="bg-gray-700/50 rounded-lg p-4 max-w-md mx-auto">
                      <h4 className="text-white font-medium mb-2">¿Cómo funciona?</h4>
                      <ul className="text-sm text-gray-400 space-y-1 text-left">
                        <li>• Cada compra genera automáticamente una comisión del 5%</li>
                        <li>• Las comisiones se registran en tiempo real</li>
                        <li>• Puedes procesarlas y exportar reportes</li>
                      </ul>
                    </div>
                  </div>
                ) : filteredCommissions.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No hay comisiones para el período seleccionado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCommissions.map((commission) => (
                      <div
                        key={commission.id}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {commission.status === "processed" ? (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                              <Clock className="h-5 w-5 text-orange-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-white font-medium">{commission.userName}</p>
                              <Badge
                                variant={commission.status === "processed" ? "default" : "secondary"}
                                className={
                                  commission.status === "processed"
                                    ? "bg-green-900/20 text-green-400 border-green-700"
                                    : "bg-orange-900/20 text-orange-400 border-orange-700"
                                }
                              >
                                {commission.status === "processed" ? "Procesada" : "Pendiente"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400">{commission.productInfo.productName}</p>
                            <p className="text-xs text-gray-500">
                              👤 {commission.productInfo.creatorName} •{" "}
                              {new Date(commission.date).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-green-400">
                            +{formatCurrency(commission.commissionAmount)}
                          </p>
                          <p className="text-sm text-gray-400">
                            de {formatCurrency(commission.originalAmount)} ({commission.commissionPercentage}%)
                          </p>
                          {commission.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => handleProcessCommission(commission.id)}
                              className="mt-2 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Procesar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <Card className="bg-gray-800 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-white font-medium mb-2">💰 Configuración</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Comisión: 5% por venta</li>
                  <li>• Aplicación automática</li>
                  <li>• Cálculo en tiempo real</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">📊 Funcionalidades</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Dashboard en vivo</li>
                  <li>• Exportación CSV</li>
                  <li>• Filtros por período</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">🔄 Estados</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Pendiente: Recién generada</li>
                  <li>• Procesada: Lista para pago</li>
                  <li>• Pagada: Completada</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
