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

  // Función de inicio de sesión con base de datos real
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Llamada a tu API de autenticación
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const userData = await response.json()

        // Asegurar que el usuario tenga la estructura correcta
        const userWithDefaults = {
          ...userData,
          profileConfigured: userData.profileConfigured ?? true,
          interests: userData.interests ?? [],
          preferences: {
            notifications: userData.preferences?.notifications ?? true,
            newsletter: userData.preferences?.newsletter ?? true,
            publicProfile: userData.preferences?.publicProfile ?? false,
            ...userData.preferences,
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
            ...userData.stats,
          },
        }

        setUser(userWithDefaults)
        localStorage.setItem("currentUser", JSON.stringify(userWithDefaults))

        toast({
          title: "Sesión iniciada",
          description: `Bienvenido de nuevo, ${userWithDefaults.name}`,
        })

        setIsLoading(false)
        return true
      } else {
        const errorData = await response.json()
        toast({
          title: "Error de inicio de sesión",
          description: errorData.message || "Email o contraseña incorrectos",
          variant: "destructive",
        })
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor. Intenta de nuevo.",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }
  }

  // Función de inicio de sesión demo (funciona sin base de datos)
  const loginDemo = async (): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simular una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generar usuario aleatorio con todo en 0
      const demoUser = generateRandomUser()

      // Omitir la contraseña del objeto de usuario
      const { password: _, ...userWithoutPassword } = demoUser
      setUser(userWithoutPassword)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

      toast({
        title: "¡Cuenta demo creada!",
        description: `¡Bienvenido ${userWithoutPassword.name}! Redirigiendo...`,
        duration: 3000,
      })

      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Demo login error:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la cuenta demo. Intenta de nuevo.",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }
  }

  // Función de registro con base de datos real
  const register = async (
    name: string,
    email: string,
    password: string,
    role: "user" | "creator" | "printer",
  ): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Llamada a tu API de registro
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      if (response.ok) {
        const userData = await response.json()

        // Asegurar que el usuario tenga la estructura correcta con stats en 0
        const profileData = generateCleanProfile(role)
        const userWithDefaults = {
          ...userData,
          profileConfigured: true,
          interests: profileData.interests,
          preferences: {
            notifications: true,
            newsletter: role !== "printer",
            publicProfile: role !== "user",
          },
          stats: profileData.stats, // Todo en 0
        }

        setUser(userWithDefaults)
        localStorage.setItem("currentUser", JSON.stringify(userWithDefaults))

        toast({
          title: "Registro exitoso",
          description: `¡Bienvenido ${name}! Configurando tu experiencia...`,
        })

        setIsLoading(false)
        return true
      } else {
        const errorData = await response.json()
        toast({
          title: "Error de registro",
          description: errorData.message || "No se pudo crear la cuenta",
          variant: "destructive",
        })
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error("Register error:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor. Intenta de nuevo.",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }
  }

  // Función de cierre de sesión
  const logout = async () => {
    try {
      // Llamar a tu API de logout si existe
      await fetch("/api/auth/logout", {
        method: "POST",
      })
    } catch (error) {
      console.error("Logout error:", error)
    }

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

    // Opcional: actualizar en la base de datos
    try {
      await fetch("/api/user/update-photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photoUrl }),
      })
    } catch (error) {
      console.error("Update photo error:", error)
    }
  }

  const updateUserStats = (newStats: Partial<User["stats"]>) => {
    if (!user) return

    const updatedUser = {
      ...user,
      stats: { ...user.stats, ...newStats },
    }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Opcional: actualizar en la base de datos
    try {
      fetch("/api/user/update-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stats: newStats }),
      })
    } catch (error) {
      console.error("Update stats error:", error)
    }
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
