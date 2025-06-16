"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

// Tipos para el sistema de seguimiento
export interface FollowRelation {
  id: string
  followerId: string
  followingId: string
  createdAt: string
}

export interface UserFollowStats {
  userId: string
  followers: number
  following: number
  isFollowing?: boolean
}

// Tipos para el contexto
interface FollowContextType {
  followUser: (userId: string) => Promise<boolean>
  unfollowUser: (userId: string) => Promise<boolean>
  isFollowing: (userId: string) => boolean
  getFollowStats: (userId: string) => UserFollowStats
  getFollowers: (userId: string) => string[]
  getFollowing: (userId: string) => string[]
  getAllFollowStats: () => UserFollowStats[]
}

// Crear el contexto
const FollowContext = createContext<FollowContextType | undefined>(undefined)

// Hook personalizado para usar el contexto
export const useFollow = () => {
  const context = useContext(FollowContext)
  if (context === undefined) {
    throw new Error("useFollow debe ser usado dentro de un FollowProvider")
  }
  return context
}

// Proveedor del contexto
export function FollowProvider({ children }: { children: ReactNode }) {
  const [followRelations, setFollowRelations] = useState<FollowRelation[]>([])
  const { toast } = useToast()

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const storedRelations = localStorage.getItem("followRelations")
    if (storedRelations) {
      try {
        const parsedRelations = JSON.parse(storedRelations)
        setFollowRelations(parsedRelations)
      } catch (error) {
        console.error("Error parsing stored follow relations:", error)
        setFollowRelations([])
      }
    }
  }, [])

  // Guardar relaciones en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("followRelations", JSON.stringify(followRelations))
  }, [followRelations])

  // Función para seguir a un usuario
  const followUser = async (userId: string): Promise<boolean> => {
    try {
      // Obtener usuario actual del localStorage
      const currentUserData = localStorage.getItem("currentUser")
      if (!currentUserData) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para seguir usuarios",
          variant: "destructive",
        })
        return false
      }

      const currentUser = JSON.parse(currentUserData)
      const currentUserId = currentUser.id

      // Verificar que no se esté siguiendo a sí mismo
      if (currentUserId === userId) {
        toast({
          title: "Error",
          description: "No puedes seguirte a ti mismo",
          variant: "destructive",
        })
        return false
      }

      // Verificar si ya sigue al usuario
      const existingRelation = followRelations.find(
        (rel) => rel.followerId === currentUserId && rel.followingId === userId,
      )

      if (existingRelation) {
        toast({
          title: "Ya sigues a este usuario",
          description: "Ya estás siguiendo a este usuario",
        })
        return false
      }

      // Crear nueva relación de seguimiento
      const newRelation: FollowRelation = {
        id: `follow-${Date.now()}`,
        followerId: currentUserId,
        followingId: userId,
        createdAt: new Date().toISOString(),
      }

      setFollowRelations((prev) => [...prev, newRelation])

      toast({
        title: "¡Ahora sigues a este usuario!",
        description: "Recibirás notificaciones de sus nuevos modelos",
      })

      return true
    } catch (error) {
      console.error("Error following user:", error)
      toast({
        title: "Error",
        description: "No se pudo seguir al usuario. Intenta de nuevo.",
        variant: "destructive",
      })
      return false
    }
  }

  // Función para dejar de seguir a un usuario
  const unfollowUser = async (userId: string): Promise<boolean> => {
    try {
      const currentUserData = localStorage.getItem("currentUser")
      if (!currentUserData) {
        return false
      }

      const currentUser = JSON.parse(currentUserData)
      const currentUserId = currentUser.id

      // Encontrar y eliminar la relación
      const relationToRemove = followRelations.find(
        (rel) => rel.followerId === currentUserId && rel.followingId === userId,
      )

      if (!relationToRemove) {
        toast({
          title: "No sigues a este usuario",
          description: "No estás siguiendo a este usuario",
        })
        return false
      }

      setFollowRelations((prev) => prev.filter((rel) => rel.id !== relationToRemove.id))

      toast({
        title: "Has dejado de seguir a este usuario",
        description: "Ya no recibirás notificaciones de sus modelos",
      })

      return true
    } catch (error) {
      console.error("Error unfollowing user:", error)
      toast({
        title: "Error",
        description: "No se pudo dejar de seguir al usuario. Intenta de nuevo.",
        variant: "destructive",
      })
      return false
    }
  }

  // Función para verificar si sigue a un usuario
  const isFollowing = (userId: string): boolean => {
    const currentUserData = localStorage.getItem("currentUser")
    if (!currentUserData) return false

    const currentUser = JSON.parse(currentUserData)
    const currentUserId = currentUser.id

    return followRelations.some((rel) => rel.followerId === currentUserId && rel.followingId === userId)
  }

  // Función para obtener estadísticas de seguimiento
  const getFollowStats = (userId: string): UserFollowStats => {
    const followers = followRelations.filter((rel) => rel.followingId === userId).length
    const following = followRelations.filter((rel) => rel.followerId === userId).length

    return {
      userId,
      followers,
      following,
      isFollowing: isFollowing(userId),
    }
  }

  // Función para obtener lista de seguidores
  const getFollowers = (userId: string): string[] => {
    return followRelations.filter((rel) => rel.followingId === userId).map((rel) => rel.followerId)
  }

  // Función para obtener lista de seguidos
  const getFollowing = (userId: string): string[] => {
    return followRelations.filter((rel) => rel.followerId === userId).map((rel) => rel.followingId)
  }

  // Función para obtener todas las estadísticas
  const getAllFollowStats = (): UserFollowStats[] => {
    const userIds = new Set([
      ...followRelations.map((rel) => rel.followerId),
      ...followRelations.map((rel) => rel.followingId),
    ])

    return Array.from(userIds).map((userId) => getFollowStats(userId))
  }

  return (
    <FollowContext.Provider
      value={{
        followUser,
        unfollowUser,
        isFollowing,
        getFollowStats,
        getFollowers,
        getFollowing,
        getAllFollowStats,
      }}
    >
      {children}
    </FollowContext.Provider>
  )
}
