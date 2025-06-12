"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  X,
  Check,
  Archive,
  Star,
  Volume2,
  VolumeX,
  Smartphone,
  MessageSquare,
  DollarSign,
  Printer,
  User,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "sales" | "orders" | "messages" | "followers" | "system" | "marketing"
  priority: "low" | "normal" | "high"
  title: string
  message: string
  icon: string
  color: string
  timestamp: Date
  read: boolean
  archived: boolean
  starred: boolean
  actionUrl?: string
  actionText?: string
  groupId?: string
  metadata?: Record<string, any>
}

interface NotificationSystemProps {
  userId: string
  userType: string[]
}

export function NotificationSystem({ userId, userType }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "unread" | "starred" | "archived">("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [pushEnabled, setPushEnabled] = useState(false)

  // Inicializar con array vacío
  useEffect(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [userId])

  const showPushNotification = (notification: Notification) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: notification.type,
        requireInteraction: notification.priority === "high",
        silent: !soundEnabled,
      })
    }
  }

  const playNotificationSound = () => {
    try {
      const audio = new Audio("/notification-sound.mp3")
      audio.volume = 0.3
      audio.play().catch(() => {
        // Ignorar errores de reproducción
      })
    } catch (error) {
      console.error("Error playing notification sound:", error)
    }
  }

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission()
        setPushEnabled(permission === "granted")
      } catch (error) {
        console.error("Error requesting notification permission:", error)
      }
    }
  }

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [])

  const toggleStar = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, starred: !n.starred } : n)))
  }, [])

  const archiveNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, archived: true } : n)))
  }, [])

  const deleteNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      const notification = notifications.find((n) => n.id === id)
      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    },
    [notifications],
  )

  const getFilteredNotifications = () => {
    let filtered = notifications

    // Filtrar por estado
    switch (filter) {
      case "unread":
        filtered = filtered.filter((n) => !n.read)
        break
      case "starred":
        filtered = filtered.filter((n) => n.starred)
        break
      case "archived":
        filtered = filtered.filter((n) => n.archived)
        break
      default:
        filtered = filtered.filter((n) => !n.archived)
    }

    // Filtrar por tipo
    if (typeFilter !== "all") {
      filtered = filtered.filter((n) => n.type === typeFilter)
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "sales":
        return <DollarSign className="h-4 w-4" />
      case "orders":
        return <Printer className="h-4 w-4" />
      case "messages":
        return <MessageSquare className="h-4 w-4" />
      case "followers":
        return <User className="h-4 w-4" />
      case "system":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <XCircle className="h-3 w-3 text-red-400" />
      case "normal":
        return <Info className="h-3 w-3 text-blue-400" />
      case "low":
        return <CheckCircle className="h-3 w-3 text-green-400" />
      default:
        return null
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Ahora"
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return timestamp.toLocaleDateString()
  }

  return (
    <div className="relative">
      {/* Botón de notificaciones */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-white hover:bg-white/10"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center p-0">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 max-h-[600px] bg-white/5 backdrop-blur-sm border-white/10 z-50 shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones
                {unreadCount > 0 && <Badge className="bg-red-500 text-xs">{unreadCount}</Badge>}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="text-white hover:bg-white/10"
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={requestNotificationPermission}
                  className="text-white hover:bg-white/10"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex gap-1">
                {["all", "unread", "starred", "archived"].map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilter(f as any)}
                    className={cn(
                      "text-xs",
                      filter === f ? "bg-cyan-500 text-white" : "text-gray-300 hover:bg-white/10",
                    )}
                  >
                    {f === "all"
                      ? "Todas"
                      : f === "unread"
                        ? "No leídas"
                        : f === "starred"
                          ? "Destacadas"
                          : "Archivadas"}
                  </Button>
                ))}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-cyan-400 hover:bg-white/10"
                >
                  Marcar todas como leídas
                </Button>
              )}
            </div>

            {/* Filtro por tipo */}
            <div className="flex gap-1 mt-2">
              {["all", "sales", "orders", "messages", "followers", "system"].map((type) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    "text-xs",
                    typeFilter === type ? "bg-purple-500 text-white" : "text-gray-300 hover:bg-white/10",
                  )}
                >
                  {type === "all" ? "Todos" : type}
                </Button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {getFilteredNotifications().length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">🔔</div>
                  <div className="text-4xl mb-3">😴</div>
                  <h3 className="text-white font-bold text-lg mb-2">¡Silencio Total! 🤫</h3>
                  <p className="text-gray-400 mb-4">
                    Tus notificaciones están tomando una siesta...
                    <br />
                    ¡Pero pronto este lugar va a explotar de actividad! 🚀
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <span>💰</span>
                      <span>Aquí aparecerán tus ventas épicas</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span>🖨️</span>
                      <span>Pedidos de impresión súper cool</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span>💬</span>
                      <span>Mensajes de fans admiradores</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span>👥</span>
                      <span>Nuevos seguidores increíbles</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                    <div className="text-2xl mb-2">🎯</div>
                    <p className="text-cyan-400 font-medium">
                      ¡Tip Pro! Sube tu primer modelo y prepárate para la avalancha de notificaciones 📈
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {getFilteredNotifications().map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-b border-white/10 hover:bg-white/5 transition-colors",
                        !notification.read && "bg-white/5",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: notification.color }}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className={cn(
                                "text-sm font-medium truncate",
                                notification.read ? "text-gray-300" : "text-white",
                              )}
                            >
                              {notification.title}
                            </h4>
                            {getPriorityIcon(notification.priority)}
                            {notification.starred && <Star className="h-3 w-3 text-yellow-400 fill-current" />}
                          </div>
                          <p className={cn("text-sm truncate", notification.read ? "text-gray-400" : "text-gray-300")}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {notification.actionText && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-cyan-400 hover:bg-white/10 h-6"
                                onClick={() => {
                                  markAsRead(notification.id)
                                  // Aquí iría la navegación
                                }}
                              >
                                {notification.actionText}
                              </Button>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-white/10 h-6 w-6 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                            {!notification.read && (
                              <DropdownMenuItem
                                onClick={() => markAsRead(notification.id)}
                                className="text-gray-300 hover:bg-gray-700"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Marcar como leída
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => toggleStar(notification.id)}
                              className="text-gray-300 hover:bg-gray-700"
                            >
                              <Star className="h-4 w-4 mr-2" />
                              {notification.starred ? "Quitar estrella" : "Destacar"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => archiveNotification(notification.id)}
                              className="text-gray-300 hover:bg-gray-700"
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Archivar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-400 hover:bg-gray-700"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
