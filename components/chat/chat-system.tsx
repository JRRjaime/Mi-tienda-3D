"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  ImageIcon,
  Smile,
  Phone,
  Video,
  Info,
  X,
  Maximize2,
  Minimize2,
  ChevronDown,
  CheckCheck,
  Check,
  Clock,
  User,
  Printer,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Tipos
interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  status: "sent" | "delivered" | "read" | "failed"
  attachments?: {
    type: "image" | "file" | "model"
    url: string
    name: string
    size?: number
  }[]
}

interface ChatContact {
  id: string
  name: string
  avatar?: string
  status: "online" | "offline" | "away" | "busy"
  lastSeen?: Date
  unreadCount: number
  lastMessage?: {
    content: string
    timestamp: Date
    isFromMe: boolean
  }
  type: "user" | "creator" | "printer" | "support"
}

interface ChatSystemProps {
  userId: string
  userType: string[]
}

export function ChatSystem({ userId, userType }: ChatSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [contacts, setContacts] = useState<ChatContact[]>([])
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "users" | "creators" | "printers" | "support">("all")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Datos de ejemplo
  useEffect(() => {
    // Simular contactos
    const mockContacts: ChatContact[] = [
      {
        id: "1",
        name: "Ana López",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
        unreadCount: 3,
        lastMessage: {
          content: "¿Podrías hacer una versión más pequeña del modelo?",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          isFromMe: false,
        },
        type: "user",
      },
      {
        id: "2",
        name: "Miguel Ángel",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "offline",
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
        unreadCount: 0,
        lastMessage: {
          content: "El modelo se ve genial, gracias!",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          isFromMe: true,
        },
        type: "creator",
      },
      {
        id: "3",
        name: "Laura Martínez",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "away",
        unreadCount: 0,
        lastMessage: {
          content: "Tu pedido está en proceso de impresión",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          isFromMe: false,
        },
        type: "printer",
      },
      {
        id: "4",
        name: "Soporte Técnico",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
        unreadCount: 1,
        lastMessage: {
          content: "Hemos resuelto tu incidencia con el pago",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isFromMe: false,
        },
        type: "support",
      },
    ]

    // Simular mensajes para cada contacto
    const mockMessages: Record<string, ChatMessage[]> = {}
    mockContacts.forEach((contact) => {
      const contactMessages: ChatMessage[] = []
      // Generar entre 5 y 15 mensajes aleatorios
      const messageCount = Math.floor(Math.random() * 10) + 5

      for (let i = 0; i < messageCount; i++) {
        const isFromMe = Math.random() > 0.5
        const timeOffset = (messageCount - i) * (Math.random() * 60 * 60 * 1000)

        contactMessages.push({
          id: `msg-${contact.id}-${i}`,
          senderId: isFromMe ? userId : contact.id,
          receiverId: isFromMe ? contact.id : userId,
          content: isFromMe
            ? [
                "Hola, ¿cómo estás?",
                "¿Puedes revisar este modelo?",
                "Gracias por tu ayuda",
                "¿Cuánto costaría imprimir esto?",
                "Me encanta tu trabajo",
              ][Math.floor(Math.random() * 5)]
            : [
                "Todo bien, ¿y tú?",
                "Claro, lo revisaré ahora",
                "No hay problema",
                "Depende del tamaño y material",
                "¡Gracias! Me alegra que te guste",
              ][Math.floor(Math.random() * 5)],
          timestamp: new Date(Date.now() - timeOffset),
          status: isFromMe ? (Math.random() > 0.7 ? "read" : "delivered") : "read",
        })
      }

      // Añadir el último mensaje que se muestra en la lista de contactos
      if (contact.lastMessage) {
        contactMessages.push({
          id: `msg-${contact.id}-last`,
          senderId: contact.lastMessage.isFromMe ? userId : contact.id,
          receiverId: contact.lastMessage.isFromMe ? contact.id : userId,
          content: contact.lastMessage.content,
          timestamp: contact.lastMessage.timestamp,
          status: contact.lastMessage.isFromMe ? "delivered" : "read",
        })
      }

      // Ordenar mensajes por timestamp
      mockMessages[contact.id] = contactMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    })

    setContacts(mockContacts)
    setMessages(mockMessages)
  }, [userId])

  // Scroll al último mensaje cuando cambia la conversación activa o llegan nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeChat, messages])

  // Filtrar contactos por búsqueda y tipo
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = activeTab === "all" || contact.type === activeTab.slice(0, -1) // Quitar la 's' final
    return matchesSearch && matchesType
  })

  // Ordenar contactos: primero los que tienen mensajes no leídos, luego por timestamp del último mensaje
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (a.unreadCount !== b.unreadCount) {
      return b.unreadCount - a.unreadCount
    }

    const aTime = a.lastMessage?.timestamp.getTime() || 0
    const bTime = b.lastMessage?.timestamp.getTime() || 0
    return bTime - aTime
  })

  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: userId,
      receiverId: activeChat,
      content: message,
      timestamp: new Date(),
      status: "sent",
    }

    // Actualizar mensajes
    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage],
    }))

    // Limpiar input
    setMessage("")

    // Simular respuesta después de un tiempo aleatorio
    setTimeout(
      () => {
        const contact = contacts.find((c) => c.id === activeChat)
        if (!contact) return

        // Marcar como entregado
        setMessages((prev) => ({
          ...prev,
          [activeChat]: prev[activeChat].map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg,
          ),
        }))

        // Simular que el contacto está escribiendo
        setTimeout(() => {
          const responseMessage: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            senderId: activeChat,
            receiverId: userId,
            content: [
              "Claro, entiendo",
              "Gracias por tu mensaje",
              "Lo revisaré pronto",
              "¿Necesitas algo más?",
              "Perfecto, hablamos luego",
            ][Math.floor(Math.random() * 5)],
            timestamp: new Date(),
            status: "read",
          }

          setMessages((prev) => ({
            ...prev,
            [activeChat]: [...(prev[activeChat] || []), responseMessage],
          }))

          // Marcar como leído después de un tiempo
          setTimeout(() => {
            setMessages((prev) => ({
              ...prev,
              [activeChat]: prev[activeChat].map((msg) => (msg.senderId === userId ? { ...msg, status: "read" } : msg)),
            }))
          }, 1000)
        }, 2000)
      },
      1000 + Math.random() * 2000,
    )
  }

  const handleOpenChat = (contactId: string) => {
    setActiveChat(contactId)

    // Marcar mensajes como leídos
    setContacts((prev) => prev.map((contact) => (contact.id === contactId ? { ...contact, unreadCount: 0 } : contact)))

    if (isMinimized) {
      setIsMinimized(false)
    }

    if (!isOpen) {
      setIsOpen(true)
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      return ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][date.getDay()]
    } else {
      return date.toLocaleDateString([], { day: "numeric", month: "numeric" })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return <Clock className="h-3 w-3 text-gray-400" />
    }
  }

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="h-3 w-3" />
      case "creator":
        return <Upload className="h-3 w-3" />
      case "printer":
        return <Printer className="h-3 w-3" />
      case "support":
        return <MessageSquare className="h-3 w-3" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const activeContact = activeChat ? contacts.find((c) => c.id === activeChat) : null
  const chatMessages = activeChat ? messages[activeChat] || [] : []

  return (
    <>
      {/* Botón flotante de chat */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg hover:shadow-xl transition-all duration-300"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
          {contacts.reduce((sum, contact) => sum + contact.unreadCount, 0) > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center p-0">
              {contacts.reduce((sum, contact) => sum + contact.unreadCount, 0)}
            </Badge>
          )}
        </Button>
      )}

      {/* Ventana de chat */}
      {isOpen && (
        <Card
          className={cn(
            "fixed z-50 bg-white/5 backdrop-blur-sm border-white/10 shadow-xl transition-all duration-300",
            isMinimized
              ? "bottom-6 right-6 h-14 w-72 rounded-full overflow-hidden"
              : "bottom-6 right-6 w-[380px] h-[600px] rounded-xl overflow-hidden",
          )}
        >
          {isMinimized ? (
            <div
              className="h-full flex items-center justify-between px-4 cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-500"
              onClick={() => setIsMinimized(false)}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-white" />
                <span className="font-medium text-white">Mensajes</span>
                {contacts.reduce((sum, contact) => sum + contact.unreadCount, 0) > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {contacts.reduce((sum, contact) => sum + contact.unreadCount, 0)}
                  </Badge>
                )}
              </div>
              <Maximize2 className="h-4 w-4 text-white" />
            </div>
          ) : (
            <>
              {/* Cabecera */}
              <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 flex flex-row items-center justify-between">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {activeChat ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-6 text-white hover:bg-white/10"
                        onClick={() => setActiveChat(null)}
                      >
                        <ChevronDown className="h-4 w-4 mr-1" />
                        <span>{activeContact?.name}</span>
                      </Button>
                      <div className={cn("h-2 w-2 rounded-full", getStatusColor(activeContact?.status || "offline"))} />
                    </div>
                  ) : (
                    <span>Mensajes</span>
                  )}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 h-8 w-8 p-0"
                    onClick={() => setIsMinimized(true)}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 h-8 w-8 p-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Contenido */}
              <CardContent className="p-0 flex flex-col h-[calc(100%-64px)]">
                {!activeChat ? (
                  <>
                    {/* Lista de contactos */}
                    <div className="p-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar conversaciones..."
                          className="pl-9 bg-white/5"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                      <TabsList className="grid grid-cols-5 bg-white/5 mx-3">
                        <TabsTrigger value="all">Todos</TabsTrigger>
                        <TabsTrigger value="users">
                          <User className="h-4 w-4" />
                        </TabsTrigger>
                        <TabsTrigger value="creators">
                          <Upload className="h-4 w-4" />
                        </TabsTrigger>
                        <TabsTrigger value="printers">
                          <Printer className="h-4 w-4" />
                        </TabsTrigger>
                        <TabsTrigger value="support">
                          <Info className="h-4 w-4" />
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <ScrollArea className="flex-1 px-3 py-2">
                      {sortedContacts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
                          <p>No hay conversaciones</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {sortedContacts.map((contact) => (
                            <div
                              key={contact.id}
                              className={cn(
                                "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/5",
                                contact.unreadCount > 0 && "bg-white/5",
                              )}
                              onClick={() => handleOpenChat(contact.id)}
                            >
                              <div className="relative">
                                <Avatar>
                                  <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div
                                  className={cn(
                                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                                    getStatusColor(contact.status),
                                  )}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium truncate flex items-center gap-1">
                                    {contact.name}
                                    <Badge variant="outline" className="h-4 px-1 text-[10px] font-normal">
                                      {getContactTypeIcon(contact.type)}
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-gray-400">
                                    {contact.lastMessage ? formatTime(contact.lastMessage.timestamp) : ""}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm truncate text-gray-400 max-w-[180px]">
                                    {contact.lastMessage?.isFromMe && "Tú: "}
                                    {contact.lastMessage?.content || ""}
                                  </p>
                                  {contact.unreadCount > 0 ? (
                                    <Badge className="bg-red-500 text-white h-5 min-w-5 flex items-center justify-center p-0 text-xs">
                                      {contact.unreadCount}
                                    </Badge>
                                  ) : (
                                    contact.lastMessage?.isFromMe && (
                                      <div className="text-xs">
                                        {getStatusIcon(messages[contact.id]?.slice(-1)[0]?.status || "sent")}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </>
                ) : (
                  <>
                    {/* Conversación activa */}
                    <div className="flex items-center justify-between p-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activeContact?.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{activeContact?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{activeContact?.name}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <div
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                getStatusColor(activeContact?.status || "offline"),
                              )}
                            />
                            {activeContact?.status === "online"
                              ? "En línea"
                              : "Último acceso " + formatTime(activeContact?.lastSeen || new Date())}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/5">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/5">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-white/5">
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Mensajes */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {chatMessages.map((msg, index) => {
                          const isFromMe = msg.senderId === userId
                          const showAvatar =
                            !isFromMe && (index === 0 || chatMessages[index - 1].senderId !== msg.senderId)

                          return (
                            <div key={msg.id} className={cn("flex", isFromMe ? "justify-end" : "justify-start")}>
                              {!isFromMe && showAvatar && (
                                <Avatar className="h-8 w-8 mr-2 mt-1">
                                  <AvatarImage src={activeContact?.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>{activeContact?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              )}

                              {!isFromMe && !showAvatar && <div className="w-10" />}

                              <div
                                className={cn(
                                  "max-w-[70%] rounded-lg p-3",
                                  isFromMe
                                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                                    : "bg-white/10 text-gray-100",
                                )}
                              >
                                <p className="text-sm">{msg.content}</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                  <span className="text-xs opacity-70">{formatTime(msg.timestamp)}</span>
                                  {isFromMe && <span className="text-xs">{getStatusIcon(msg.status)}</span>}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Input de mensaje */}
                    <div className="p-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:bg-white/5">
                          <Paperclip className="h-5 w-5" />
                        </Button>
                        <Input
                          placeholder="Escribe un mensaje..."
                          className="flex-1 bg-white/5"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                        />
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:bg-white/5">
                          <ImageIcon className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:bg-white/5">
                          <Smile className="h-5 w-5" />
                        </Button>
                        <Button
                          size="icon"
                          className="h-9 w-9 bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90"
                          onClick={handleSendMessage}
                          disabled={!message.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </>
          )}
        </Card>
      )}
    </>
  )
}
