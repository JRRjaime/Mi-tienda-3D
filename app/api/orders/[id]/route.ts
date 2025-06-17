import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status, printer_id, notes, estimated_completion } = body

    // Verificar que el usuario puede actualizar este pedido
    const { data: order, error: fetchError } = await supabase.from("orders").select("*").eq("id", params.id).single()

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Solo el cliente, el impresor asignado o un admin pueden actualizar
    if (order.user_id !== user.id && order.printer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (printer_id) updateData.printer_id = printer_id
    if (notes) updateData.notes = notes
    if (estimated_completion) updateData.estimated_completion = estimated_completion

    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating order:", updateError)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    console.error("Update order API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
