"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus } from "lucide-react"
import { useFollow } from "@/contexts/follow-context"
import { FollowButton } from "./follow-button"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
}

interface FollowersListProps {
  userId: string
  type: "followers" | "following"
  className?: string
}

export function FollowersList({ userId, type, className = "" }: FollowersListProps) {
  const [users, setUsers] = useState<User[]>([])
  const { getFollowers, getFollowing } = useFollow()

  useEffect(() => {
    // Simular obtener datos de usuarios
    // En una app real, esto vendría de una API
    const userIds = type === "followers" ? getFollowers(userId) : getFollowing(userId)

    // Generar usuarios mock basados en los IDs
    const mockUsers: User[] = userIds.map((id, index) => ({
      id,
      name: `Usuario ${index + 1}`,
      email: `usuario${index + 1}@example.com`,
      avatar: `/placeholder.svg?height=40&width=40&query=U${index + 1}`,
      role: ["user", "creator", "printer"][index % 3],
    }))

    setUsers(mockUsers)
  }, [userId, type, getFollowers, getFollowing])

  const title = type === "followers" ? "Seguidores" : "Siguiendo"
  const icon = type === "followers" ? Users : UserPlus

  return (
    <Card className={`bg-white/5 backdrop-blur-sm border-white/10 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          {React.createElement(icon, { className: "h-5 w-5" })}
          {title}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {users.length} {type === "followers" ? "personas te siguen" : "personas que sigues"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {type === "followers" ? "Aún no tienes seguidores" : "Aún no sigues a nadie"}
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                    <Badge
                      variant="outline"
                      className={`text-xs mt-1 ${
                        user.role === "creator"
                          ? "border-purple-500 text-purple-400"
                          : user.role === "printer"
                            ? "border-blue-500 text-blue-400"
                            : "border-green-500 text-green-400"
                      }`}
                    >
                      {user.role === "creator" ? "Creador" : user.role === "printer" ? "Impresor" : "Usuario"}
                    </Badge>
                  </div>
                </div>
                <FollowButton userId={user.id} size="sm" showIcon={false} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
