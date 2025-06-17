"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedAuthModal } from "./enhanced-auth-modal"
import { LogIn, UserPlus, Search } from "lucide-react"

export function AuthButtonLocator() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            ¿Dónde está el botón de Google?
          </CardTitle>
          <CardDescription>
            Los botones de autenticación social (incluyendo Google) aparecen en el modal de autenticación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold">🔑 Modal de Login</h3>
              <p className="text-sm text-gray-600">
                Abre el modal de inicio de sesión para ver todos los botones sociales
              </p>
              <Button onClick={() => setShowLoginModal(true)} className="w-full" variant="outline">
                <LogIn className="mr-2 h-4 w-4" />
                Abrir Modal de Login
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">📝 Modal de Registro</h3>
              <p className="text-sm text-gray-600">También aparecen en el modal de registro de nuevos usuarios</p>
              <Button onClick={() => setShowRegisterModal(true)} className="w-full" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Abrir Modal de Registro
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">📍 Ubicaciones donde aparece el modal:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="space-y-2">
                <p>
                  • <strong>Header:</strong> Botón "Iniciar Sesión"
                </p>
                <p>
                  • <strong>Landing:</strong> CTAs principales
                </p>
                <p>
                  • <strong>Productos:</strong> Al intentar comprar
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  • <strong>Subir modelo:</strong> Requiere login
                </p>
                <p>
                  • <strong>Checkout:</strong> Antes de pagar
                </p>
                <p>
                  • <strong>Perfil:</strong> Acceso restringido
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">🎯 Botones incluidos:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
              <p>✅ Google</p>
              <p>✅ Apple</p>
              <p>✅ GitHub</p>
              <p>✅ Discord</p>
              <p>✅ Facebook</p>
              <p>✅ Twitter/X</p>
              <p>✅ Microsoft</p>
              <p>✅ LinkedIn</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">🚀 Estado actual:</h4>
            <p className="text-sm text-green-800">
              Los botones están implementados y aparecerán habilitados si tienes Supabase configurado correctamente. Si
              no tienes Supabase, aparecen deshabilitados con un mensaje informativo.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modales */}
      <EnhancedAuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} defaultTab="login" />

      <EnhancedAuthModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} defaultTab="register" />
    </div>
  )
}
