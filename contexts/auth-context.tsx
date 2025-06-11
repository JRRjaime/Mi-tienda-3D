"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

// Tipos para el usuario
export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: "user" | "creator" | "printer" | "admin"
  createdAt: string
  // Datos preconfigurados del perfil
  profileConfigured: boolean
  interests: string[]
  preferences: {
    notifications: boolean
    newsletter: boolean
    publicProfile: boolean
  }
  stats: {
    balance: number
    totalOrders: number
    totalSales: number
    rating: number
  }
}

// Tipos para el contexto de autenticación
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, role: "user" | "creator" | "printer") => Promise<boolean>
  logout: () => void
}

// Función para generar perfil preconfigurado según el rol
const generateProfileData = (role: "user" | "creator" | "printer") => {
  const baseInterests = ["Tecnología", "Diseño", "Innovación"]

  switch (role) {
    case "creator":
      return {
        interests: [...baseInterests, "Arte", "Modelado 3D", "Diseño Industrial"],
        stats: {
          balance: 250.0,
          totalOrders: 0,
          totalSales: 12,
          rating: 4.8,
        },
      }
    case "printer":
      return {
        interests: [...baseInterests, "Manufactura", "Materiales", "Ingeniería"],
        stats: {
          balance: 180.5,
          totalOrders: 8,
          totalSales: 0,
          rating: 4.9,
        },
      }
    case "user":
    default:
      return {
        interests: [...baseInterests, "Hogar", "Gadgets", "Personalización"],
        stats: {
          balance: 75.25,
          totalOrders: 3,
          totalSales: 0,
          rating: 5.0,
        },
      }
  }
}

// Datos de usuario simulados actualizados
const MOCK_USERS = [
  {
    id: "1",
    name: "Carlos Mendez",
    email: "carlos@example.com",
    password: "password123",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "creator" as const,
    createdAt: "2023-01-15T00:00:00Z",
    profileConfigured: true,
    interests: ["Tecnología", "Diseño", "Innovación", "Arte", "Modelado 3D", "Diseño Industrial"],
    preferences: {
      notifications: true,
      newsletter: true,
      publicProfile: true,
    },
    stats: {
      balance: 250.0,
      totalOrders: 0,
      totalSales: 12,
      rating: 4.8,
    },
  },
  {
    id: "2",
    name: "Ana López",
    email: "ana@example.com",
    password: "password123",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "printer" as const,
    createdAt: "2023-02-20T00:00:00Z",
    profileConfigured: true,
    interests: ["Tecnología", "Diseño", "Innovación", "Manufactura", "Materiales", "Ingeniería"],
    preferences: {
      notifications: true,
      newsletter: false,
      publicProfile: true,
    },
    stats: {
      balance: 180.5,
      totalOrders: 8,
      totalSales: 0,
      rating: 4.9,
    },
  },
  {
    id: "3",
    name: "Juan Pérez",
    email: "juan@example.com",
    password: "password123",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "user" as const,
    createdAt: "2023-03-10T00:00:00Z",
    profileConfigured: true,
    interests: ["Tecnología", "Diseño", "Innovación", "Hogar", "Gadgets", "Personalización"],
    preferences: {
      notifications: true,
      newsletter: true,
      publicProfile: false,
    },
    stats: {
      balance: 75.25,
      totalOrders: 3,
      totalSales: 0,
      rating: 5.0,
    },
  },
]

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

// Proveedor del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Comprobar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("currentUser")
      }
    }
    setIsLoading(false)
  }, [])

  // Función de inicio de sesión
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simular una llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      // Omitir la contraseña del objeto de usuario
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
      toast({
        title: "Sesión iniciada",
        description: `Bienvenido de nuevo, ${userWithoutPassword.name}`,
      })
      setIsLoading(false)
      return true
    } else {
      toast({
        title: "Error de inicio de sesión",
        description: "Email o contraseña incorrectos",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }
  }

  // Función de registro
  const register = async (
    name: string,
    email: string,
    password: string,
    role: "user" | "creator" | "printer",
  ): Promise<boolean> => {
    setIsLoading(true)

    // Simular una llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Comprobar si el email ya está en uso
    if (MOCK_USERS.some((u) => u.email === email)) {
      toast({
        title: "Error de registro",
        description: "Este email ya está en uso",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }

    // Generar datos del perfil según el rol
    const profileData = generateProfileData(role)

    // Crear nuevo usuario con perfil preconfigurado
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      name,
      email,
      password,
      avatar: `/placeholder.svg?height=40&width=40&query=${name
        .split(" ")
        .map((n) => n[0])
        .join("")}`,
      role,
      createdAt: new Date().toISOString(),
      profileConfigured: true,
      interests: profileData.interests,
      preferences: {
        notifications: true,
        newsletter: role !== "printer", // Los impresores por defecto no quieren newsletter
        publicProfile: role !== "user", // Los usuarios por defecto tienen perfil privado
      },
      stats: profileData.stats,
    }

    // En una aplicación real, aquí enviaríamos los datos a la API
    // Para esta simulación, simplemente añadimos el usuario a nuestro array
    MOCK_USERS.push(newUser)

    // Iniciar sesión con el nuevo usuario
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

    // Mensaje personalizado según el rol
    const roleMessages = {
      creator: "¡Bienvenido! Tu perfil de creador está listo. Puedes empezar a vender tus modelos.",
      printer: "¡Bienvenido! Tu perfil de impresor está configurado. Puedes ofrecer servicios de impresión.",
      user: "¡Bienvenido! Tu cuenta está lista. Explora nuestro mercado de modelos 3D.",
    }

    toast({
      title: "Registro exitoso",
      description: roleMessages[role],
    })

    setIsLoading(false)
    return true
  }

  // Función de cierre de sesión
  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
