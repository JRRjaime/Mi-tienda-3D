"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Wallet,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Shield,
  RefreshCw,
  CreditCard,
  Building2,
  Send,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { useToast } from "@/hooks/use-toast"
import { CreditCardForm } from "@/components/payment/credit-card-form"

export function AdvancedWallet() {
  const {
    balance,
    transactions,
    isLoading,
    addFunds,
    withdrawFunds,
    sendPayment,
    confirmPayment,
    reportProblem,
    refreshBalance,
  } = useWallet()

  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [addFundsAmount, setAddFundsAmount] = useState("")
  const [addFundsMethod, setAddFundsMethod] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentRecipient, setPaymentRecipient] = useState("")
  const [paymentDescription, setPaymentDescription] = useState("")
  const [problemReason, setProblemReason] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)

  // Filtrar transacciones por tipo
  const pendingTransactions = transactions.filter((tx) => tx.status === "pending" || tx.status === "blocked")
  const completedTransactions = transactions.filter((tx) => tx.status === "completed")

  const recentTransactions = transactions.slice(0, 10)

  const handleAddFunds = async () => {
    if (!addFundsAmount || !addFundsMethod) return
    const amount = Number.parseFloat(addFundsAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Cantidad inválida",
        description: "Por favor ingresa una cantidad válida",
        variant: "destructive",
      })
      return
    }
    await addFunds(Number.parseFloat(addFundsAmount), addFundsMethod)
    setAddFundsAmount("")
    setAddFundsMethod("")
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawMethod) return
    const amount = Number.parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Cantidad inválida",
        description: "Por favor ingresa una cantidad válida",
        variant: "destructive",
      })
      return
    }

    if (amount > balance.available) {
      toast({
        title: "Fondos insuficientes",
        description: "No tienes suficiente saldo disponible",
        variant: "destructive",
      })
      return
    }
    await withdrawFunds(Number.parseFloat(withdrawAmount), withdrawMethod)
    setWithdrawAmount("")
    setWithdrawMethod("")
  }

  const handleSendPayment = async () => {
    if (!paymentAmount || !paymentRecipient || !paymentDescription) return
    const amount = Number.parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Cantidad inválida",
        description: "Por favor ingresa una cantidad válida",
        variant: "destructive",
      })
      return
    }
    await sendPayment(Number.parseFloat(paymentAmount), paymentRecipient, paymentDescription)
    setPaymentAmount("")
    setPaymentRecipient("")
    setPaymentDescription("")
  }

  const handleConfirmReceived = async (transactionId: string) => {
    await confirmPayment(transactionId)
  }

  const handleReportProblem = async (transactionId: string) => {
    if (!problemReason.trim()) {
      toast({
        title: "Motivo requerido",
        description: "Por favor describe el problema",
        variant: "destructive",
      })
      return
    }

    await reportProblem(transactionId, problemReason)
    setProblemReason("")
    setSelectedTransaction(null)
  }

  const getTransactionIcon = (type: string, status: string) => {
    if (status === "pending" || status === "blocked") return <Clock className="h-4 w-4" />
    if (type === "income" || type === "pending_income") return <ArrowUpRight className="h-4 w-4" />
    return <ArrowDownLeft className="h-4 w-4" />
  }

  const getTransactionColor = (type: string, status: string) => {
    if (status === "pending" || status === "blocked") return "text-yellow-400"
    if (status === "cancelled") return "text-red-400"
    if (type === "income" || type === "pending_income") return "text-green-400"
    return "text-red-400"
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      blocked: "destructive",
      cancelled: "outline",
    } as const

    const labels = {
      completed: "Completado",
      pending: "Pendiente",
      blocked: "Bloqueado",
      cancelled: "Cancelado",
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Saldo Disponible</CardTitle>
            <Wallet className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${balance.available.toFixed(2)}</div>
            <p className="text-xs text-white/80">Listo para usar</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Dinero Pendiente</CardTitle>
            <Clock className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${balance.pending.toFixed(2)}</div>
            <p className="text-xs text-white/80">Esperando confirmación</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-pink-500 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Dinero Bloqueado</CardTitle>
            <Shield className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${balance.blocked.toFixed(2)}</div>
            <p className="text-xs text-white/80">En transacciones activas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${balance.total.toFixed(2)}</div>
            <p className="text-xs text-white/80">Patrimonio total</p>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Gestión de Fondos</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshBalance}
              disabled={isLoading}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {/* Añadir Fondos */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                <Plus className="h-4 w-4 mr-2" />
                Añadir Fondos
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900/95 backdrop-blur-sm border-white/10 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Añadir Fondos</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Recarga tu cartera con fondos adicionales
                </DialogDescription>
              </DialogHeader>

              {addFundsMethod === "credit_card" && addFundsAmount ? (
                <CreditCardForm
                  amount={Number.parseFloat(addFundsAmount)}
                  onSuccess={() => {
                    handleAddFunds()
                    setAddFundsAmount("")
                    setAddFundsMethod("")
                  }}
                  onCancel={() => {
                    setAddFundsMethod("")
                  }}
                />
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount" className="text-white">
                      Cantidad
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={addFundsAmount}
                      onChange={(e) => setAddFundsAmount(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Método de pago</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      <Button
                        variant={addFundsMethod === "credit_card" ? "default" : "outline"}
                        onClick={() => setAddFundsMethod("credit_card")}
                        className="justify-start h-12"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        <div className="text-left">
                          <div>Tarjeta de Crédito/Débito</div>
                          <div className="text-xs opacity-70">Visa, Mastercard, Amex</div>
                        </div>
                      </Button>
                      <Button
                        variant={addFundsMethod === "bank_transfer" ? "default" : "outline"}
                        onClick={() => setAddFundsMethod("bank_transfer")}
                        className="justify-start h-12"
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        <div className="text-left">
                          <div>Transferencia Bancaria</div>
                          <div className="text-xs opacity-70">1-3 días hábiles</div>
                        </div>
                      </Button>
                    </div>
                  </div>

                  {addFundsMethod === "credit_card" && addFundsAmount && (
                    <Button
                      onClick={() => {}} // El formulario se mostrará automáticamente
                      disabled={!addFundsAmount}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
                    >
                      Continuar con Tarjeta
                    </Button>
                  )}

                  {addFundsMethod === "bank_transfer" && (
                    <Button
                      onClick={handleAddFunds}
                      disabled={isLoading || !addFundsAmount}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                    >
                      {isLoading ? "Procesando..." : "Continuar con Transferencia"}
                    </Button>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Retirar Fondos */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Minus className="h-4 w-4 mr-2" />
                Retirar Fondos
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900/95 backdrop-blur-sm border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Retirar Fondos</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Retira dinero de tu cartera a tu cuenta bancaria
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="withdraw-amount" className="text-white">
                    Cantidad
                  </Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">Disponible: ${balance.available.toFixed(2)}</p>
                </div>
                <div>
                  <Label htmlFor="withdraw-method" className="text-white">
                    Método de Retiro
                  </Label>
                  <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Seleccionar método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2" />
                          Transferencia Bancaria
                        </div>
                      </SelectItem>
                      <SelectItem value="paypal">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          PayPal
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleWithdraw}
                  disabled={isLoading || !withdrawAmount || !withdrawMethod}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  {isLoading ? "Procesando..." : "Retirar Fondos"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Enviar Pago */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Send className="h-4 w-4 mr-2" />
                Enviar Pago
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900/95 backdrop-blur-sm border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Enviar Pago</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Envía dinero a otro usuario de forma segura
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="payment-amount" className="text-white">
                    Cantidad
                  </Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="payment-recipient" className="text-white">
                    Email del Destinatario
                  </Label>
                  <Input
                    id="payment-recipient"
                    type="email"
                    placeholder="usuario@example.com"
                    value={paymentRecipient}
                    onChange={(e) => setPaymentRecipient(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="payment-description" className="text-white">
                    Descripción
                  </Label>
                  <Textarea
                    id="payment-description"
                    placeholder="Motivo del pago..."
                    value={paymentDescription}
                    onChange={(e) => setPaymentDescription(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <Button
                  onClick={handleSendPayment}
                  disabled={isLoading || !paymentAmount || !paymentRecipient || !paymentDescription}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  {isLoading ? "Enviando..." : "Enviar Pago"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Tabs de Transacciones */}
      <Tabs defaultValue="resumen" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="pendientes">
            Pendientes
            {pendingTransactions.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {pendingTransactions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Resumen de Actividad</CardTitle>
              <CardDescription className="text-gray-300">Últimas transacciones y estado de tu cartera</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full bg-white/10 ${getTransactionColor(transaction.type, transaction.status)}`}
                      >
                        {getTransactionIcon(transaction.type, transaction.status)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{transaction.description}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(transaction.date).toLocaleDateString("es-ES")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-lg font-bold ${getTransactionColor(transaction.type, transaction.status)}`}>
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendientes">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Transacciones Pendientes</CardTitle>
              <CardDescription className="text-gray-300">Pagos que requieren tu atención</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTransactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No hay transacciones pendientes</div>
                ) : (
                  pendingTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-yellow-500/20 text-yellow-400">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{transaction.description}</div>
                            <div className="text-sm text-gray-400">
                              {transaction.relatedUser && `De: ${transaction.relatedUser}`}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-yellow-400">
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </div>
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>

                      {transaction.type === "pending_income" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => confirmPayment(transaction.id)}
                            disabled={isLoading}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirmar Recepción
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Reportar Problema
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-900/95 backdrop-blur-sm border-white/10">
                              <DialogHeader>
                                <DialogTitle className="text-white">Reportar Problema</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Describe el problema con esta transacción
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea
                                  placeholder="Describe el problema..."
                                  value={problemReason}
                                  onChange={(e) => setProblemReason(e.target.value)}
                                  className="bg-white/5 border-white/20 text-white"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => {
                                      reportProblem(transaction.id, problemReason)
                                      setProblemReason("")
                                    }}
                                    disabled={isLoading || !problemReason}
                                    className="flex-1 bg-red-500 hover:bg-red-600"
                                  >
                                    Reportar
                                  </Button>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" className="border-white/20 text-white">
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Historial Completo</CardTitle>
              <CardDescription className="text-gray-300">Todas tus transacciones completadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full bg-white/10 ${getTransactionColor(transaction.type, transaction.status)}`}
                      >
                        {getTransactionIcon(transaction.type, transaction.status)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{transaction.description}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(transaction.date).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        {transaction.relatedUser && (
                          <div className="text-xs text-gray-500">
                            {transaction.type === "income" ? "De" : "Para"}: {transaction.relatedUser}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-lg font-bold ${getTransactionColor(transaction.type, transaction.status)}`}>
                        {transaction.type === "expense" ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
