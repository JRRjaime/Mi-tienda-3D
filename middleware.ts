import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Rutas protegidas
  const protectedRoutes = ["/perfil", "/subir-modelo", "/admin", "/printer-tools", "/pedidos", "/analytics"]
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Rutas de admin
  const adminRoutes = ["/admin"]
  const isAdminRoute = adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Solo verificar autenticación en rutas protegidas
  if (isProtectedRoute) {
    // En modo demo, verificar localStorage del lado del cliente
    // Por ahora permitir acceso y manejar la redirección en el cliente
    return res
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
