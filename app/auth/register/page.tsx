"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get the type parameter (seller, buyer, etc.)
    const type = searchParams.get("type")

    // Redirect to home page with register modal open
    // We'll pass the type as a query parameter to pre-select the role
    const params = new URLSearchParams()
    params.set("auth", "register")

    // Map seller to creator, buyer to user
    if (type === "seller") {
      params.set("role", "creator")
    } else if (type === "buyer") {
      params.set("role", "user")
    } else if (type === "printer") {
      params.set("role", "printer")
    }

    router.replace(`/?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Redirigiendo al registro...</p>
      </div>
    </div>
  )
}
