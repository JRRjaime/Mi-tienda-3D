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
    modelsUploaded: number
    totalDownloads: number
    totalEarnings: number
    totalViews: number
    totalReviews: number
    totalLikes: number
  }
}

// Tipos para el contexto de autenticación
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginDemo: () => Promise<boolean>
  register: (name: string, email: string, password: string, role: "user" | "creator" | "printer") => Promise<boolean>
  logout: () => void
  updateUserPhoto: (photoUrl: string) => Promise<void>
  updateUserStats: (stats: Partial<User["stats"]>) => void
}

// Función para generar perfil completamente en 0
const generateCleanProfile = (role: "user" | "creator" | "printer") => {
  const baseInterests = ["Tecnología", "Diseño", "Innovación"]

  switch (role) {
    case "creator":
      return {
        interests: [...baseInterests, "Arte", "Modelado 3D", "Diseño Industrial"],
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
    case "printer":
      return {
        interests: [...baseInterests, "Manufactura", "Materiales", "Ingeniería"],
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
    case "user":
    default:
      return {
        interests: [...baseInterests, "Hogar", "Gadgets", "Personalización"],
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
  }
}

// Nombres y apellidos para generar usuarios aleatorios
const NOMBRES = [
  "Carlos",
  "Ana",
  "Juan",
  "María",
  "Luis",
  "Carmen",
  "Pedro",
  "Laura",
  "Miguel",
  "Sofia",
  "Diego",
  "Elena",
  "Pablo",
  "Isabel",
  "Andrés",
  "Lucía",
]
const APELLIDOS = [
  "García",
  "Rodríguez",
  "González",
  "Fernández",
  "López",
  "Martínez",
  "Sánchez",
  "Pérez",
  "Gómez",
  "Martín",
  "Jiménez",
  "Ruiz",
  "Hernández",
  "Díaz",
  "Moreno",
  "Muñoz",
]

// Función para generar usuario aleatorio (TODO EN 0)
const generateRandomUser = () => {
  const nombre = NOMBRES[Math.floor(Math.random() * NOMBRES.length)]
  const apellido = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)]
  const roles: ("user" | "creator" | "printer")[] = ["user", "creator", "printer"]
  const role = roles[Math.floor(Math.random() * roles.length)]
  const email = `${nombre.toLowerCase()}.${apellido.toLowerCase()}@demo.com`

  const profileData = generateCleanProfile(role)

  return {
    id: `demo-${Date.now()}`,
    name: `${nombre} ${apellido}`,
    email,
    password: "demo123",
    avatar: `/placeholder.svg?height=40&width=40&query=${nombre[0]}${apellido[0]}`,
    role,
    createdAt: new Date().toISOString(),
    profileConfigured: true,
    interests: profileData.interests,
    preferences: {
      notifications: true,
      newsletter: role !== "printer",
      publicProfile: role !== "user",
    },
    stats: profileData.stats,
  }
}

// TODOS LOS USUARIOS EMPIEZAN EN 0 - Sin excepciones
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

  // Función de inicio de sesión demo (TODO EN 0)
  const loginDemo = async (): Promise<boolean> => {
    setIsLoading(true)

    // Simular una llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generar usuario aleatorio con todo en 0
    const demoUser = generateRandomUser()

    // Omitir la contraseña del objeto de usuario
    const { password: _, ...userWithoutPassword } = demoUser
    setUser(userWithoutPassword)
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

    // Mensaje personalizado según el rol
    const roleMessages = {
      creator: `¡Bienvenido ${userWithoutPassword.name}! Eres un creador. Sube tu primer modelo para empezar a ganar.`,
      printer: `¡Bienvenido ${userWithoutPassword.name}! Eres un impresor. Configura tu perfil para recibir pedidos.`,
      user: `¡Bienvenido ${userWithoutPassword.name}! Explora y compra modelos 3D increíbles.`,
    }

    toast({
      title: "¡Cuenta demo creada!",
      description: `¡Bienvenido ${userWithoutPassword.name}! Redirigiendo...`,
      duration: 3000,
    })

    setIsLoading(false)
    return true
  }

  // Función de registro (TODO EN 0)
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

    // Generar datos del perfil según el rol (TODO EN 0)
    const profileData = generateCleanProfile(role)

    // Crear nuevo usuario con perfil preconfigurado
    const newUser = {
      id: `${Date.now()}`,
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
        newsletter: role !== "printer",
        publicProfile: role !== "user",
      },
      stats: profileData.stats,
    }

    // Iniciar sesión con el nuevo usuario
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

    // Mensaje personalizado según el rol
    const roleMessages = {
      creator: "¡Bienvenido! Sube tu primer modelo para empezar a ganar dinero.",
      printer: "¡Bienvenido! Configura tu perfil para empezar a recibir pedidos.",
      user: "¡Bienvenido! Explora nuestro mercado de modelos 3D.",
    }

    toast({
      title: "Registro exitoso",
      description: `¡Bienvenido ${name}! Configurando tu experiencia...`,
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

  const updateUserPhoto = async (photoUrl: string): Promise<void> => {
    if (!user) return

    const updatedUser = { ...user, avatar: photoUrl }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
  }

  const updateUserStats = (newStats: Partial<User["stats"]>) => {
    if (!user) return

    const updatedUser = {
      ...user,
      stats: { ...user.stats, ...newStats },
    }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginDemo,
        register,
        logout,
        updateUserPhoto,
        updateUserStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
