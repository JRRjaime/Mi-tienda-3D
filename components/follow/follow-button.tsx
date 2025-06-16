"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus, Loader2 } from "lucide-react"
import { useFollow } from "@/contexts/follow-context"
import { useAuth } from "@/contexts/auth-context"

interface FollowButtonProps {
  userId: string
  userName?: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  showIcon?: boolean
  className?: string
}

export function FollowButton({
  userId,
  userName,
  variant = "default",
  size = "default",
  showIcon = true,
  className = "",
}: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { followUser, unfollowUser, isFollowing } = useFollow()
  const { isAuthenticated, user } = useAuth()

  const following = isFollowing(userId)

  // No mostrar el botón si es el mismo usuario
  if (user?.id === userId) {
    return null
  }

  // No mostrar si no está autenticado
  if (!isAuthenticated) {
    return null
  }

  const handleClick = async () => {
    setIsLoading(true)
    try {
      if (following) {
        await unfollowUser(userId)
      } else {
        await followUser(userId)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={following ? "outline" : variant}
      size={size}
      className={`${className} ${following ? "border-red-500 text-red-500 hover:bg-red-50" : ""}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {showIcon && (following ? <UserMinus className="h-4 w-4 mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />)}
          {following ? "Dejar de seguir" : "Seguir"}
          {userName && ` a ${userName}`}
        </>
      )}
    </Button>
  )
}
