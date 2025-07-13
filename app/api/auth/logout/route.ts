import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Aquí puedes limpiar sesiones, tokens, etc.
    // Por ejemplo, si usas cookies de sesión:
    // const response = NextResponse.json({ message: 'Logout exitoso' })
    // response.cookies.delete('session')
    // return response

    return NextResponse.json({ message: "Logout exitoso" })
  } catch (error) {
    console.error("Logout API error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
