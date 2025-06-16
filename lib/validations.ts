import { z } from "zod"

// Validaciones para formularios
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  role: z.enum(["user", "creator", "printer"]),
})

export const modelSchema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().min(10, "Mínimo 10 caracteres"),
  price: z.number().min(0, "Precio debe ser positivo"),
  category: z.string().min(1, "Categoría requerida"),
  tags: z.array(z.string()).min(1, "Al menos un tag"),
})

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number().min(1),
        price: z.number().min(0),
      }),
    )
    .min(1, "Al menos un item"),
  shippingAddress: z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    city: z.string().min(2),
    zipCode: z.string().min(3),
    country: z.string().min(2),
  }),
})
