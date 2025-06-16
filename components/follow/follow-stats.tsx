"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus } from "lucide-react"
import { useFollow } from "@/contexts/follow-context"

interface FollowStatsProps {
  userId: string
  userName?: string
  showTitle?: boolean
  className?: string
}

export function FollowStats({ userId, userName, showTitle = true, className = "" }: FollowStatsProps) {
  const { getFollowStats } = useFollow()
  const stats = getFollowStats(userId)

  return (
    <Card className={`bg-white/5 backdrop-blur-sm border-white/10 ${className}`}>
      {showTitle && (
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Estadísticas de Seguimiento
          </CardTitle>
          {userName && <CardDescription className="text-gray-300">Estadísticas de {userName}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{stats.followers}</div>
            <div className="text-sm text-gray-400">Seguidores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.following}</div>
            <div className="text-sm text-gray-400">Siguiendo</div>
          </div>
        </div>

        {stats.isFollowing && (
          <div className="flex justify-center">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <UserPlus className="h-3 w-3 mr-1" />
              Siguiendo
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
