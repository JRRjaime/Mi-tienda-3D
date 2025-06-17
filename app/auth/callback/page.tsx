"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { isSupabaseEnabled, supabase } = useAuth()

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!isSupabaseEnabled || !supabase) {
        router.push("/")
        return
      }

      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          toast({
            title: "Error de autenticación",
            description: error.message,
            variant: "destructive",
          })
          router.push("/?auth=login")
          return
        }

        if (data.session) {
          toast({
            title: "🎉 ¡Autenticación exitosa!",
            description: "Bienvenido a la plataforma",
          })
          router.push("/bienvenida")
        } else {
          router.push("/?auth=login")
        }
      } catch (error) {
        console.error("Callback handling error:", error)
        router.push("/?auth=login")
      }
    }

    handleAuthCallback()
  }, [router, isSupabaseEnabled, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="text-center text-white">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Completando autenticación...</h2>
        <p className="text-blue-100">Esto solo tomará un momento</p>
      </div>
    </div>
  )
}
