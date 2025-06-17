import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userType = searchParams.get("userType") || "buyer"

    let query = supabase
      .from("orders")
      .select(`
        *,
        print_specifications(*),
        order_status_history(*)
      `)
      .order("created_at", { ascending: false })

    // Filtrar según el tipo de usuario
    if (userType === "printer") {
      query = query.eq("printer_id", user.id)
    } else {
      query = query.eq("user_id", user.id)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Orders API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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
    const {
      model_id,
      model_name,
      model_image,
      quantity = 1,
      total_price,
      print_specifications,
      shipping_address,
      notes,
    } = body

    // Crear el pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        model_id,
        model_name,
        model_image,
        quantity,
        total_price,
        shipping_address,
        notes,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Crear especificaciones de impresión si se proporcionan
    if (print_specifications && order) {
      const { error: specsError } = await supabase.from("print_specifications").insert({
        order_id: order.id,
        ...print_specifications,
      })

      if (specsError) {
        console.error("Error creating print specifications:", specsError)
      }
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Create order API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
