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
  isSupabaseEnabled: boolean
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

// USUARIOS MOCK PARA DESARROLLO (TODO EN 0)
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

// Función para verificar si Supabase está configurado
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
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
  const [supabase, setSupabase] = useState<any>(null)
  const { toast } = useToast()

  const isSupabaseEnabled = isSupabaseConfigured()

  // Inicializar Supabase solo si está configurado
  useEffect(() => {
    const initSupabase = async () => {
      if (isSupabaseEnabled) {
        try {
          const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs")
          const supabaseClient = createClientComponentClient()
          setSupabase(supabaseClient)
        } catch (error) {
          console.error("Error initializing Supabase:", error)
        }
      }
    }

    initSupabase()
  }, [isSupabaseEnabled])

  // Comprobar si hay un usuario autenticado al cargar
  useEffect(() => {
    const getUser = async () => {
      try {
        if (isSupabaseEnabled && supabase) {
          // Usar Supabase Auth
          const {
            data: { session },
          } = await supabase.auth.getSession()

          if (session?.user) {
            // Obtener datos adicionales del usuario desde la tabla profiles
            const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

            if (profile) {
              const userData: User = {
                id: session.user.id,
                name:
                  profile.name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Usuario",
                email: session.user.email || "",
                avatar:
                  profile.avatar || session.user.user_metadata?.avatar_url || `/placeholder.svg?height=40&width=40`,
                role: profile.role || "user",
                createdAt: session.user.created_at,
                profileConfigured: profile.profile_configured || false,
                interests: profile.interests || [],
                preferences: {
                  notifications: profile.preferences?.notifications ?? true,
                  newsletter: profile.preferences?.newsletter ?? true,
                  publicProfile: profile.preferences?.publicProfile ?? false,
                },
                stats: {
                  balance: profile.stats?.balance || 0,
                  totalOrders: profile.stats?.totalOrders || 0,
                  totalSales: profile.stats?.totalSales || 0,
                  rating: profile.stats?.rating || 0,
                  modelsUploaded: profile.stats?.modelsUploaded || 0,
                  totalDownloads: profile.stats?.totalDownloads || 0,
                  totalEarnings: profile.stats?.totalEarnings || 0,
                  totalViews: profile.stats?.totalViews || 0,
                  totalReviews: profile.stats?.totalReviews || 0,
                  totalLikes: profile.stats?.totalLikes || 0,
                },
              }
              setUser(userData)
            }
          }
        } else {
          // Usar sistema mock - verificar localStorage
          const storedUser = localStorage.getItem("currentUser")
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser))
            } catch (error) {
              console.error("Error parsing stored user:", error)
              localStorage.removeItem("currentUser")
            }
          }
        }
      } catch (error) {
        console.error("Error getting user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    // Escuchar cambios en la autenticación solo si Supabase está habilitado
    if (isSupabaseEnabled && supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
        if (event === "SIGNED_IN" && session?.user) {
          // Usuario se ha autenticado
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          if (profile) {
            const userData: User = {
              id: session.user.id,
              name: profile.name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Usuario",
              email: session.user.email || "",
              avatar: profile.avatar || session.user.user_metadata?.avatar_url || `/placeholder.svg?height=40&width=40`,
              role: profile.role || "user",
              createdAt: session.user.created_at,
              profileConfigured: profile.profile_configured || false,
              interests: profile.interests || [],
              preferences: {
                notifications: profile.preferences?.notifications ?? true,
                newsletter: profile.preferences?.newsletter ?? true,
                publicProfile: profile.preferences?.publicProfile ?? false,
              },
              stats: {
                balance: profile.stats?.balance || 0,
                totalOrders: profile.stats?.totalOrders || 0,
                totalSales: profile.stats?.totalSales || 0,
                rating: profile.stats?.rating || 0,
                modelsUploaded: profile.stats?.modelsUploaded || 0,
                totalDownloads: profile.stats?.totalDownloads || 0,
                totalEarnings: profile.stats?.totalEarnings || 0,
                totalViews: profile.stats?.totalViews || 0,
                totalReviews: profile.stats?.totalReviews || 0,
                totalLikes: profile.stats?.totalLikes || 0,
              },
            }
            setUser(userData)
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null)
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [isSupabaseEnabled, supabase])

  // Función de inicio de sesión
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      if (isSupabaseEnabled && supabase) {
        // Usar Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          toast({
            title: "Error de inicio de sesión",
            description:
              error.message === "Invalid login credentials" ? "Email o contraseña incorrectos" : error.message,
            variant: "destructive",
          })
          setIsLoading(false)
          return false
        }

        if (data.user) {
          toast({
            title: "Sesión iniciada",
            description: `Bienvenido de nuevo`,
          })
          setIsLoading(false)
          return true
        }
      } else {
        // Usar sistema mock
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

        if (foundUser) {
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

      setIsLoading(false)
      return false
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

  // Función de inicio de sesión demo
  const loginDemo = async (): Promise<boolean> => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const demoUser = generateRandomUser()
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

  // Función de registro
  const register = async (
    name: string,
    email: string,
    password: string,
    role: "user" | "creator" | "printer",
  ): Promise<boolean> => {
    setIsLoading(true)

    try {
      if (isSupabaseEnabled && supabase) {
        // Usar Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role,
            },
          },
        })

        if (error) {
          toast({
            title: "Error de registro",
            description: error.message === "User already registered" ? "Este email ya está en uso" : error.message,
            variant: "destructive",
          })
          setIsLoading(false)
          return false
        }

        if (data.user) {
          const profileData = generateCleanProfile(role)

          const { error: profileError } = await supabase.from("profiles").insert({
            id: data.user.id,
            name,
            email,
            role,
            profile_configured: true,
            interests: profileData.interests,
            preferences: {
              notifications: true,
              newsletter: role !== "printer",
              publicProfile: role !== "user",
            },
            stats: profileData.stats,
          })

          if (profileError) {
            console.error("Error creating profile:", profileError)
          }

          toast({
            title: "Registro exitoso",
            description: `¡Bienvenido ${name}! Revisa tu email para confirmar tu cuenta.`,
          })

          setIsLoading(false)
          return true
        }
      } else {
        // Usar sistema mock
        await new Promise((resolve) => setTimeout(resolve, 1500))

        if (MOCK_USERS.some((u) => u.email === email)) {
          toast({
            title: "Error de registro",
            description: "Este email ya está en uso",
            variant: "destructive",
          })
          setIsLoading(false)
          return false
        }

        const profileData = generateCleanProfile(role)

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

        const { password: _, ...userWithoutPassword } = newUser
        setUser(userWithoutPassword)
        localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

        toast({
          title: "Registro exitoso",
          description: `¡Bienvenido ${name}! Configurando tu experiencia...`,
        })

        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
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
      if (isSupabaseEnabled && supabase) {
        await supabase.auth.signOut()
      } else {
        localStorage.removeItem("currentUser")
      }
      setUser(null)
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateUserPhoto = async (photoUrl: string): Promise<void> => {
    if (!user) return

    try {
      if (isSupabaseEnabled && supabase) {
        const { error } = await supabase.from("profiles").update({ avatar: photoUrl }).eq("id", user.id)

        if (!error) {
          const updatedUser = { ...user, avatar: photoUrl }
          setUser(updatedUser)
        }
      } else {
        const updatedUser = { ...user, avatar: photoUrl }
        setUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error("Update photo error:", error)
    }
  }

  const updateUserStats = async (newStats: Partial<User["stats"]>) => {
    if (!user) return

    try {
      const updatedStats = { ...user.stats, ...newStats }

      if (isSupabaseEnabled && supabase) {
        const { error } = await supabase.from("profiles").update({ stats: updatedStats }).eq("id", user.id)

        if (!error) {
          const updatedUser = {
            ...user,
            stats: updatedStats,
          }
          setUser(updatedUser)
        }
      } else {
        const updatedUser = {
          ...user,
          stats: updatedStats,
        }
        setUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }
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
        isSupabaseEnabled,
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
