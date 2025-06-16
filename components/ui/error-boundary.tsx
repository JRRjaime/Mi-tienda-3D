"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md w-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <CardTitle className="text-white">¡Oops! Algo salió mal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-gray-300">Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.</p>

              {process.env.NODE_ENV === "development" && (
                <details className="text-left bg-red-900/20 p-3 rounded-lg">
                  <summary className="text-red-400 cursor-pointer">Detalles del error</summary>
                  <pre className="text-xs text-red-300 mt-2 overflow-auto">{this.state.error?.stack}</pre>
                </details>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reintentar
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="outline"
                  className="flex-1 border-white/20 text-white"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook para manejar errores en componentes funcionales
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    console.error("Error handled:", error, errorInfo)
    // Aquí puedes enviar el error a un servicio como Sentry
  }
}
