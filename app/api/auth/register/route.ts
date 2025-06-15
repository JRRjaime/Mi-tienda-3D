import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    // Aquí conectas con tu base de datos
    // Ejemplo con tu sistema de base de datos:

    // const existingUser = await db.user.findUnique({
    //   where: { email }
    // })

    // if (existingUser) {
    //   return NextResponse.json(
    //     { message: 'Este email ya está en uso' },
    //     { status: 400 }
    //   )
    // }

    // const hashedPassword = await bcrypt.hash(password, 10)

    // const newUser = await db.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashedPassword,
    //     role,
    //     profile: {
    //       create: {
    //         interests: [],
    //         preferences: {}
    //       }
    //     },
    //     stats: {
    //       create: {
    //         balance: 0,
    //         totalOrders: 0,
    //         // ... otros campos en 0
    //       }
    //     }
    //   },
    //   include: { profile: true, stats: true }
    // })

    // Por ahora, simulamos la respuesta de tu base de datos
    // REEMPLAZA ESTO con tu lógica de base de datos real
    const mockUser = {
      id: Date.now().toString(),
      name,
      email,
      avatar: `/placeholder.svg?height=40&width=40&query=${name
        .split(" ")
        .map((n) => n[0])
        .join("")}`,
      role,
      createdAt: new Date().toISOString(),
      profileConfigured: true,
      interests: [],
      preferences: {
        notifications: true,
        newsletter: true,
        publicProfile: false,
      },
      stats: {
        balance: 0,
        totalOrders: 0,
        totalSales: 0,
        rating: 0,
        modelsUploaded: 0,
        totalDownloads: 0,
        totalEarnings: 0,
        totalViews: 0,
        totalReviews: 0,
        totalLikes: 0,
      },
    }

    return NextResponse.json(mockUser)
  } catch (error) {
    console.error("Register API error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
