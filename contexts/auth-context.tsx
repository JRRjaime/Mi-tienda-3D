"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "user" | "creator" | "printer" | "admin"
  verified?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<boolean>
  loginWithDemo: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuarios demo para testing
const DEMO_USERS: User[] = [
  {
    id: "user-1",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "creator",
    verified: true,
  },
  {
    id: "user-2",
    name: "Ana García",
    email: "ana@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "printer",
    verified: true,
  },
  {
    id: "user-3",
    name: "Juan Pérez",
    email: "juan@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "user",
    verified: false,
  },
  {
    id: "admin-1",
    name: "Admin Platform",
    email: "admin@3dplatform.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
    verified: true,
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Inicializar auth una sola vez
  useEffect(() => {
    if (!isInitialized) {
      const savedUser = localStorage.getItem("auth-user")
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
        } catch (error) {
          console.error("Error parsing saved user:", error)
          localStorage.removeItem("auth-user")
        }
      }
      setIsInitialized(true)
    }
  }, [isInitialized])

  const login = async (email: string, password: string): Promise<boolean> => {
    if (isLoading) return false

    setIsLoading(true)

    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Buscar usuario demo
      const foundUser = DEMO_USERS.find((u) => u.email === email)

      if (foundUser && password === "password123") {
        setUser(foundUser)
        localStorage.setItem("auth-user", JSON.stringify(foundUser))

        toast({
          title: "¡Bienvenido!",
          description: `Hola ${foundUser.name}, has iniciado sesión correctamente.`,
        })

        setIsLoading(false)
        return true
      } else if (foundUser && email === "admin@3dplatform.com" && password === "Admin2024!@#$SecurePass") {
        setUser(foundUser)
        localStorage.setItem("auth-user", JSON.stringify(foundUser))

        toast({
          title: "¡Bienvenido Admin!",
          description: `Acceso administrativo concedido.`,
        })

        setIsLoading(false)
        return true
      } else {
        toast({
          title: "Error de autenticación",
          description: "Email o contraseña incorrectos",
          variant: "destructive",
        })
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al iniciar sesión",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    if (isLoading) return false

    setIsLoading(true)

    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Crear nuevo usuario
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        avatar: "/placeholder.svg?height=40&width=40",
        role: "user",
        verified: false,
      }

      setUser(newUser)
      localStorage.setItem("auth-user", JSON.stringify(newUser))

      toast({
        title: "¡Cuenta creada!",
        description: `Bienvenido ${name}, tu cuenta ha sido creada exitosamente.`,
      })

      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Register error:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al crear la cuenta",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }
  }

  const loginWithDemo = () => {
    const demoUser = DEMO_USERS[0] // Carlos por defecto
    setUser(demoUser)
    localStorage.setItem("auth-user", JSON.stringify(demoUser))

    toast({
      title: "¡Modo Demo Activado!",
      description: `Conectado como ${demoUser.name}`,
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth-user")
    router.push("/")

    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isInitialized,
    login,
    logout,
    register,
    loginWithDemo,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
