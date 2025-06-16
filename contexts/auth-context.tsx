"use client"

import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from "react"
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
  {
    id: "admin-001",
    name: "Administrador Principal",
    email: "admin@3dplatform.com",
    password: "Admin2024!@#$SecurePass",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin" as const,
    createdAt: "2023-01-01T00:00:00Z",
    profileConfigured: true,
    interests: ["Administración", "Analytics", "Monetización", "Gestión"],
    preferences: {
      notifications: true,
      newsletter: false,
      publicProfile: false,
    },
    stats: {
      balance: 0,
      totalOrders: 0,
      totalSales: 0,
      rating: 5.0,
      modelsUploaded: 0,
      totalDownloads: 0,
      totalEarnings: 0, // Aquí se acumularán las comisiones
      totalViews: 0,
      totalReviews: 0,
      totalLikes: 0,
    },
  },
]

// Función mejorada para verificar si Supabase está configurado correctamente
const isSupabaseConfigured = () => {
  if (typeof window === "undefined") return false

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Verificar que las variables existan y tengan el formato correcto
  const isValidUrl = url && url.startsWith("https://") && url.includes(".supabase.co")
  const isValidKey = key && key.length > 50 // Las claves de Supabase son largas

  console.log("🔍 Supabase Configuration Check:")
  console.log("  URL:", url ? "✅ Present" : "❌ Missing")
  console.log("  Key:", key ? "✅ Present" : "❌ Missing")
  console.log("  Valid URL:", isValidUrl ? "✅ Valid" : "❌ Invalid")
  console.log("  Valid Key:", isValidKey ? "✅ Valid" : "❌ Invalid")

  return !!(isValidUrl && isValidKey)
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

  const isSupabaseEnabled = useMemo(() => isSupabaseConfigured(), [])

  // Memoizar funciones para evitar re-renders
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true)

      try {
        if (isSupabaseEnabled && supabase) {
          console.log("🔐 Attempting Supabase login...")
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) {
            console.error("❌ Supabase login error:", error.message)

            if (error.message.includes("Invalid API key")) {
              setSupabase(null)
              console.log("🧪 Switching to demo mode due to login API error")
              return await loginWithMockData(email, password)
            }

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
            console.log("✅ Supabase login successful")
            toast({
              title: "Sesión iniciada",
              description: `Bienvenido de nuevo`,
            })
            setIsLoading(false)
            return true
          }
        } else {
          console.log("🧪 Using demo login...")
          return await loginWithMockData(email, password)
        }

        setIsLoading(false)
        return false
      } catch (error: any) {
        console.error("❌ Login error:", error.message)

        if (error.message?.includes("Invalid API key")) {
          setSupabase(null)
          console.log("🧪 Switching to demo mode due to catch API error")
          return await loginWithMockData(email, password)
        }

        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con el servidor. Intenta de nuevo.",
          variant: "destructive",
        })
        setIsLoading(false)
        return false
      }
    },
    [isSupabaseEnabled, supabase, toast],
  )

  const loginWithMockData = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      console.log("🧪 Attempting demo login...")
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
        console.log("✅ Demo login successful")
        setIsLoading(false)
        return true
      } else {
        toast({
          title: "Error de inicio de sesión",
          description: "Email o contraseña incorrectos",
          variant: "destructive",
        })
        console.log("❌ Demo login failed - invalid credentials")
        setIsLoading(false)
        return false
      }
    },
    [toast],
  )

  const loginDemo = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    console.log("🎭 Creating demo user...")

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

      console.log("✅ Demo user created successfully")
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("❌ Demo login error:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la cuenta demo. Intenta de nuevo.",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }
  }, [toast])

  const register = useCallback(
    async (name: string, email: string, password: string, role: "user" | "creator" | "printer"): Promise<boolean> => {
      setIsLoading(true)

      try {
        if (isSupabaseEnabled && supabase) {
          console.log("📝 Attempting Supabase registration...")
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
            console.error("❌ Supabase register error:", error.message)

            if (error.message.includes("Invalid API key")) {
              setSupabase(null)
              console.log("🧪 Switching to demo mode due to register API error")
              return await registerWithMockData(name, email, password, role)
            }

            toast({
              title: "Error de registro",
              description: error.message === "User already registered" ? "Este email ya está en uso" : error.message,
              variant: "destructive",
            })
            setIsLoading(false)
            return false
          }

          if (data.user) {
            console.log("✅ Supabase registration successful")
            const profileData = generateCleanProfile(role)

            try {
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
                console.warn("⚠️ Error creating profile:", profileError.message)
              } else {
                console.log("✅ Profile created successfully")
              }
            } catch (profileError) {
              console.warn("⚠️ Profile creation failed:", profileError)
            }

            toast({
              title: "Registro exitoso",
              description: `¡Bienvenido ${name}! Revisa tu email para confirmar tu cuenta.`,
            })

            setIsLoading(false)
            return true
          }
        } else {
          console.log("🧪 Using demo registration...")
          return await registerWithMockData(name, email, password, role)
        }

        setIsLoading(false)
        return false
      } catch (error: any) {
        console.error("❌ Register error:", error.message)

        if (error.message?.includes("Invalid API key")) {
          setSupabase(null)
          console.log("🧪 Switching to demo mode due to catch register API error")
          return await registerWithMockData(name, email, password, role)
        }

        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con el servidor. Intenta de nuevo.",
          variant: "destructive",
        })
        setIsLoading(false)
        return false
      }
    },
    [isSupabaseEnabled, supabase, toast],
  )

  const registerWithMockData = useCallback(
    async (name: string, email: string, password: string, role: "user" | "creator" | "printer"): Promise<boolean> => {
      console.log("🧪 Attempting demo registration...")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (MOCK_USERS.some((u) => u.email === email)) {
        toast({
          title: "Error de registro",
          description: "Este email ya está en uso",
          variant: "destructive",
        })
        console.log("❌ Demo registration failed - email exists")
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

      console.log("✅ Demo registration successful")
      setIsLoading(false)
      return true
    },
    [toast],
  )

  const logout = useCallback(async () => {
    try {
      console.log("🚪 Iniciando proceso de logout...")

      // Marcar que estamos haciendo logout
      sessionStorage.setItem("isLoggingOut", "true")

      // PRIMERO: Resetear el estado del usuario inmediatamente
      setUser(null)

      // SEGUNDO: Limpiar completamente TODOS los datos de almacenamiento
      console.log("🧹 Limpiando todos los datos de almacenamiento...")

      // Limpiar localStorage completamente
      const keysToRemove = ["currentUser", "supabase.auth.token", "sb-auth-token", "supabase-auth-token"]

      // Buscar y eliminar todas las claves relacionadas con Supabase
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key && (key.includes("supabase") || key.includes("sb-") || key === "currentUser")) {
          localStorage.removeItem(key)
        }
      }

      // Limpiar sessionStorage completamente
      sessionStorage.clear()

      // TERCERO: Si hay Supabase, cerrar sesión
      if (isSupabaseEnabled && supabase) {
        console.log("👋 Cerrando sesión en Supabase...")
        try {
          await supabase.auth.signOut()
        } catch (supabaseError) {
          console.warn("⚠️ Error al cerrar sesión en Supabase:", supabaseError)
        }
      }

      // CUARTO: Mostrar confirmación
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      })

      // QUINTO: Redirigir sin recargar (para evitar que useEffect restaure el usuario)
      console.log("🔄 Redirigiendo a página principal...")
      window.location.replace("/")

      console.log("✅ Logout completado")
    } catch (error) {
      console.error("❌ Error durante logout:", error)

      // Forzar logout incluso si hay error
      setUser(null)
      localStorage.clear()
      sessionStorage.clear()
      window.location.replace("/")
    }
  }, [isSupabaseEnabled, supabase, toast])

  const updateUserPhoto = useCallback(
    async (photoUrl: string): Promise<void> => {
      if (!user) return

      try {
        if (isSupabaseEnabled && supabase) {
          const { error } = await supabase.from("profiles").update({ avatar: photoUrl }).eq("id", user.id)

          if (!error) {
            const updatedUser = { ...user, avatar: photoUrl }
            setUser(updatedUser)
            console.log("✅ Photo updated in Supabase")
          }
        } else {
          const updatedUser = { ...user, avatar: photoUrl }
          setUser(updatedUser)
          localStorage.setItem("currentUser", JSON.stringify(updatedUser))
          console.log("✅ Photo updated in localStorage")
        }
      } catch (error) {
        console.error("❌ Update photo error:", error)
      }
    },
    [user, isSupabaseEnabled, supabase],
  )

  const updateUserStats = useCallback(
    async (newStats: Partial<User["stats"]>) => {
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
            console.log("✅ Stats updated in Supabase")
          }
        } else {
          const updatedUser = {
            ...user,
            stats: updatedStats,
          }
          setUser(updatedUser)
          localStorage.setItem("currentUser", JSON.stringify(updatedUser))
          console.log("✅ Stats updated in localStorage")
        }
      } catch (error) {
        console.error("❌ Update stats error:", error)
      }
    },
    [user, isSupabaseEnabled, supabase],
  )

  // Inicialización optimizada
  useEffect(() => {
    const initSupabase = async () => {
      if (isSupabaseEnabled) {
        try {
          console.log("🚀 Initializing Supabase...")
          const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs")
          const supabaseClient = createClientComponentClient()

          // Probar la conexión con una llamada simple
          const { data, error } = await supabaseClient.auth.getSession()

          if (error && error.message.includes("Invalid API key")) {
            console.error("❌ Invalid Supabase API key, falling back to demo mode")
            setSupabase(null)
            return
          }

          setSupabase(supabaseClient)
          console.log("✅ Supabase initialized successfully")
        } catch (error) {
          console.warn("⚠️ Supabase initialization failed, falling back to demo mode:", error)
          setSupabase(null)
        }
      } else {
        console.log("🧪 Running in demo mode - Supabase not properly configured")
        setSupabase(null)
      }
    }

    initSupabase()
  }, [isSupabaseEnabled])

  // Comprobar si hay un usuario autenticado al cargar
  useEffect(() => {
    const getUser = async () => {
      try {
        // Verificar si acabamos de hacer logout (flag temporal)
        const isLoggingOut = sessionStorage.getItem("isLoggingOut")
        if (isLoggingOut) {
          sessionStorage.removeItem("isLoggingOut")
          setIsLoading(false)
          return
        }

        if (isSupabaseEnabled && supabase) {
          console.log("🔍 Checking for existing Supabase session...")
          // Usar Supabase Auth
          try {
            const {
              data: { session },
              error: sessionError,
            } = await supabase.auth.getSession()

            if (sessionError) {
              console.warn("⚠️ Session error:", sessionError.message)
              // Si hay error de API key, desactivar Supabase
              if (sessionError.message.includes("Invalid API key")) {
                setSupabase(null)
                console.log("🧪 Switching to demo mode due to invalid API key")
              }
              setIsLoading(false)
              return
            }

            if (session?.user) {
              console.log("✅ Found existing Supabase session")
              // Obtener datos adicionales del usuario desde la tabla profiles
              const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single()

              if (profileError) {
                console.warn("⚠️ Profile error:", profileError.message)
                // Crear perfil básico si no existe
                const basicProfile = {
                  id: session.user.id,
                  name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Usuario",
                  email: session.user.email || "",
                  avatar: session.user.user_metadata?.avatar_url || `/placeholder.svg?height=40&width=40`,
                  role: "user" as const,
                  createdAt: session.user.created_at,
                  profileConfigured: false,
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
                setUser(basicProfile)
              } else if (profile) {
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
            } else {
              console.log("ℹ️ No existing Supabase session found")
            }
          } catch (supabaseError: any) {
            console.warn("⚠️ Supabase error, falling back to localStorage:", supabaseError.message)
            // Si hay error de API key, desactivar Supabase
            if (supabaseError.message?.includes("Invalid API key")) {
              setSupabase(null)
              console.log("🧪 Switching to demo mode due to API error")
            }
            // Fallback a localStorage si Supabase falla
            const storedUser = localStorage.getItem("currentUser")
            if (storedUser) {
              try {
                setUser(JSON.parse(storedUser))
                console.log("✅ Loaded user from localStorage")
              } catch (error) {
                console.error("❌ Error parsing stored user:", error)
                localStorage.removeItem("currentUser")
              }
            }
          }
        } else {
          console.log("🧪 Using demo mode - checking localStorage...")
          // Verificar localStorage solo si no hay flag de logout
          const storedUser = localStorage.getItem("currentUser")
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser)
              // Verificar que el usuario sea válido
              if (parsedUser && parsedUser.id && parsedUser.name) {
                setUser(parsedUser)
                console.log("✅ Loaded demo user from localStorage")
              } else {
                console.log("❌ Invalid user data, removing from localStorage")
                localStorage.removeItem("currentUser")
              }
            } catch (error) {
              console.error("❌ Error parsing stored user:", error)
              localStorage.removeItem("currentUser")
            }
          } else {
            console.log("ℹ️ No stored user found")
          }
        }
      } catch (error) {
        console.error("❌ Error getting user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    // Escuchar cambios en la autenticación solo si Supabase está habilitado y funcionando
    if (isSupabaseEnabled && supabase) {
      try {
        console.log("👂 Setting up Supabase auth listener...")
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
          console.log("🔄 Auth state changed:", event)

          if (event === "SIGNED_IN" && session?.user) {
            console.log("✅ User signed in via Supabase")
            // Usuario se ha autenticado
            try {
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
            } catch (error) {
              console.warn("⚠️ Error loading profile after sign in:", error)
            }
          } else if (event === "SIGNED_OUT") {
            console.log("👋 User signed out")
            setUser(null)
          }
        })

        return () => {
          console.log("🔇 Cleaning up auth listener")
          subscription.unsubscribe()
        }
      } catch (error) {
        console.warn("⚠️ Error setting up auth listener:", error)
      }
    }
  }, [isSupabaseEnabled, supabase])

  // Memoizar el valor del contexto
  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      isSupabaseEnabled: isSupabaseEnabled && !!supabase,
      login,
      loginDemo,
      register,
      logout,
      updateUserPhoto,
      updateUserStats,
    }),
    [
      user,
      isLoading,
      isSupabaseEnabled,
      supabase,
      login,
      loginDemo,
      register,
      logout,
      updateUserPhoto,
      updateUserStats,
    ],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
