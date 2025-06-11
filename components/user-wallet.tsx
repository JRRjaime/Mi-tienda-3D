"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react"

interface UserWalletProps {
  user: {
    balance: number
  }
}

const transactions = [
  {
    id: 1,
    type: "income",
    description: "Venta de modelo 3D - Dragon Ball Goku",
    amount: 25.0,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: 2,
    type: "expense",
    description: "Compra de modelo - Engranaje Industrial",
    amount: -15.5,
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: 3,
    type: "income",
    description: "Recarga de saldo",
    amount: 100.0,
    date: "2024-01-12",
    status: "completed",
  },
  {
    id: 4,
    type: "expense",
    description: "Servicio de impresión 3D",
    amount: -45.0,
    date: "2024-01-10",
    status: "pending",
  },
]

export function UserWallet({ user }: UserWalletProps) {
  return (
    <div className="space-y-6">
      {/* Saldo actual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-cyan-500 to-blue-500 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Saldo Disponible</CardTitle>
            <Wallet className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${user.balance.toFixed(2)}</div>
            <p className="text-xs text-white/80">Disponible para usar</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Ingresos del Mes</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">$125.00</div>
            <p className="text-xs text-gray-400">+12% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Gastos del Mes</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">$60.50</div>
            <p className="text-xs text-gray-400">-5% vs mes anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
            <Plus className="h-4 w-4 mr-2" />
            Recargar Saldo
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <CreditCard className="h-4 w-4 mr-2" />
            Retirar Fondos
          </Button>
        </CardContent>
      </Card>

      {/* Historial de transacciones */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Historial de Transacciones</CardTitle>
          <CardDescription className="text-gray-300">Últimas transacciones en tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "income" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-white font-medium">{transaction.description}</div>
                    <div className="text-sm text-gray-400">{transaction.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`text-lg font-bold ${transaction.type === "income" ? "text-green-400" : "text-red-400"}`}
                  >
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                  <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                    {transaction.status === "completed" ? "Completado" : "Pendiente"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
