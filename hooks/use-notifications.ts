"use client"

import { useState, useEffect, useCallback } from "react"

interface NotificationConfig {
  enabled: boolean
  sound: boolean
  vibration: boolean
  badge: boolean
  priority: "low" | "normal" | "high"
  grouping: boolean
  autoExpire: number
}

interface UseNotificationsProps {
  userId: string
  config: NotificationConfig
}

export function useNotifications({ userId, config }: UseNotificationsProps) {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSupported, setIsSupported] = useState(false)
  const [serviceWorker, setServiceWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    // Verificar soporte para notificaciones
    setIsSupported("Notification" in window && "serviceWorker" in navigator)

    if ("Notification" in window) {
      setPermission(Notification.permission)
    }

    // Registrar service worker para notificaciones push
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          setServiceWorker(registration.active)
        })
        .catch((error) => {
          console.error("Error registrando service worker:", error)
        })
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      return permission === "granted"
    } catch (error) {
      console.error("Error solicitando permisos:", error)
      return false
    }
  }, [isSupported])

  interface NotificationAction {
    action: string
    title: string
    icon?: string
  }

  const showNotification = useCallback(
    async (
      title: string,
      options: {
        body?: string
        icon?: string
        badge?: string
        tag?: string
        data?: any
        actions?: NotificationAction[]
        requireInteraction?: boolean
        silent?: boolean
      } = {},
    ) => {
      if (!config.enabled || permission !== "granted") return

      const notificationOptions: NotificationOptions = {
        body: options.body,
        icon: options.icon || "/favicon.ico",
        badge: config.badge ? options.badge || "/favicon.ico" : undefined,
        tag: options.tag,
        data: options.data,
        actions: options.actions,
        requireInteraction: config.priority === "high" || options.requireInteraction,
        silent: !config.sound || options.silent,
        vibrate: config.vibration ? [200, 100, 200] : undefined,
      }

      try {
        if (serviceWorker) {
          // Usar service worker para notificaciones persistentes
          await serviceWorker.showNotification(title, notificationOptions)
        } else {
          // Fallback a notificaciones básicas
          new Notification(title, notificationOptions)
        }

        // Auto-expirar notificación si está configurado
        if (config.autoExpire > 0) {
          setTimeout(
            () => {
              // Cerrar notificación después del tiempo especificado
            },
            config.autoExpire * 60 * 60 * 1000,
          )
        }
      } catch (error) {
        console.error("Error mostrando notificación:", error)
      }
    },
    [config, permission, serviceWorker],
  )

  const playSound = useCallback(
    (soundUrl = "/notification-sound.mp3") => {
      if (!config.sound) return

      try {
        const audio = new Audio(soundUrl)
        audio.volume = 0.3
        audio.play().catch(() => {
          // Ignorar errores de reproducción
        })
      } catch (error) {
        console.error("Error reproduciendo sonido:", error)
      }
    },
    [config.sound],
  )

  const vibrate = useCallback(
    (pattern: number[] = [200, 100, 200]) => {
      if (!config.vibration || !navigator.vibrate) return

      try {
        navigator.vibrate(pattern)
      } catch (error) {
        console.error("Error activando vibración:", error)
      }
    },
    [config.vibration],
  )

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
    playSound,
    vibrate,
  }
}
