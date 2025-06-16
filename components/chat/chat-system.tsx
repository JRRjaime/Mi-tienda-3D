"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  X,
  Plus,
  Paperclip,
  Smile,
  CheckCheck,
  Star,
  Archive,
  Trash2,
  Check,
  MessageSquare,
  Maximize2,
  Minimize2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
  type: "text" | "image" | "file" | "audio"
  metadata?: Record<string, any>
}

interface Chat {
  id: string
  participants: string[]
  participantNames: string[]
  participantAvatars: string[]
  lastMessage?: Message
  unreadCount: number
  isGroup: boolean
  groupName?: string
  groupAvatar?: string
  createdAt: Date
  updatedAt: Date
  archived: boolean
  starred: boolean
  muted: boolean
  type: "direct" | "group" | "support" | "business"
}

interface Contact {
  id: string
  name: string
  avatar: string
  status: "online" | "offline" | "away" | "busy"
  lastSeen?: Date
  type: "user" | "creator" | "printer" | "support"
}

export function ChatSystem() {
  const { user } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Cargar chats y mensajes guardados
  useEffect(() => {
    if (!user) return

    const savedChats = localStorage.getItem(`chats_${user.id}`)
    const savedMessages = localStorage.getItem(`messages_${user.id}`)

    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          lastMessage: chat.lastMessage
            ? {
                ...chat.lastMessage,
                timestamp: new Date(chat.lastMessage.timestamp),
              }
            : undefined,
        }))
        setChats(parsedChats)
      } catch (error) {
        console.error("Error parsing chats:", error)
      }
    }

    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages)
        const messagesWithDates = Object.keys(parsedMessages).reduce(
          (acc, chatId) => {
            acc[chatId] = parsedMessages[chatId].map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }))
            return acc
          },
          {} as Record<string, Message[]>,
        )
        setMessages(messagesWithDates)
      } catch (error) {
        console.error("Error parsing messages:", error)
      }
    }

    // Cargar contactos de ejemplo
    setContacts([
      {
        id: "creator1",
        name: "Ana García",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
        type: "creator",
      },
      {
        id: "printer1",
        name: "TechPrint 3D",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
        type: "printer",
      },
      {
        id: "support1",
        name: "Soporte Técnico",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
        type: "support",
      },
    ])
  }, [user])

  // 🎉 ESCUCHAR EVENTOS DE INTEGRACIÓN PARA CREAR CHATS AUTOMÁTICAMENTE
  useEffect(() => {
    const handleCreateChat = (event: CustomEvent) => {
      const { contactId, contactName, contactType, initialMessage } = event.detail

      if (!user) return

      // Verificar si ya existe un chat con este contacto
      const existingChat = chats.find(
        (chat) => chat.participants.includes(contactId) && chat.participants.includes(user.id),
      )

      if (existingChat) {
        // Si ya existe, abrir el chat y enviar el mensaje inicial
        setActiveChat(existingChat.id)
        if (initialMessage) {
          setTimeout(() => {
            sendMessage(existingChat.id, initialMessage)
          }, 500)
        }
      } else {
        // Crear nuevo chat
        const newChatId = `chat-${Date.now()}`
        const newChat: Chat = {
          id: newChatId,
          participants: [user.id, contactId],
          participantNames: [user.name, contactName],
          participantAvatars: [user.avatar || "/placeholder.svg", "/placeholder.svg"],
          unreadCount: 0,
          isGroup: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          archived: false,
          starred: false,
          muted: false,
          type: contactType === "creator" ? "business" : "direct",
        }

        setChats((prev) => [newChat, ...prev])
        setActiveChat(newChatId)

        // Enviar mensaje inicial automáticamente
        if (initialMessage) {
          setTimeout(() => {
            sendMessage(newChatId, initialMessage)
          }, 500)
        }

        console.log("🎉 Chat created automatically:", newChatId)
      }
    }

    window.addEventListener("createChat", handleCreateChat as EventListener)

    return () => {
      window.removeEventListener("createChat", handleCreateChat as EventListener)
    }
  }, [user, chats])

  // Guardar chats cuando cambien
  useEffect(() => {
    if (user && chats.length > 0) {
      localStorage.setItem(`chats_${user.id}`, JSON.stringify(chats))
    }
  }, [chats, user])

  // Guardar mensajes cuando cambien
  useEffect(() => {
    if (user && Object.keys(messages).length > 0) {
      localStorage.setItem(`messages_${user.id}`, JSON.stringify(messages))
    }
  }, [messages, user])

  // Scroll automático al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeChat])

  const sendMessage = useCallback(
    (chatId: string, content: string, type: "text" | "image" | "file" | "audio" = "text") => {
      if (!user || !content.trim()) return

      const chat = chats.find((c) => c.id === chatId)
      if (!chat) return

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: user.id,
        receiverId: chat.participants.find((p) => p !== user.id) || "",
        content: content.trim(),
        timestamp: new Date(),
        read: false,
        type,
      }

      // Agregar mensaje
      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage],
      }))

      // Actualizar último mensaje del chat
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                lastMessage: newMessage,
                updatedAt: new Date(),
              }
            : c,
        ),
      )

      setNewMessage("")
    },
    [user, chats],
  )

  const handleSendMessage = () => {
    if (activeChat && newMessage.trim()) {
      sendMessage(activeChat, newMessage)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const createNewChat = (contactId: string) => {
    if (!user) return

    const contact = contacts.find((c) => c.id === contactId)
    if (!contact) return

    // Verificar si ya existe un chat
    const existingChat = chats.find(
      (chat) => chat.participants.includes(contactId) && chat.participants.includes(user.id),
    )

    if (existingChat) {
      setActiveChat(existingChat.id)
      setShowNewChatModal(false)
      return
    }

    const newChatId = `chat-${Date.now()}`
    const newChat: Chat = {
      id: newChatId,
      participants: [user.id, contactId],
      participantNames: [user.name, contact.name],
      participantAvatars: [user.avatar || "/placeholder.svg", contact.avatar],
      unreadCount: 0,
      isGroup: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      archived: false,
      starred: false,
      muted: false,
      type: contact.type === "creator" ? "business" : "direct",
    }

    setChats((prev) => [newChat, ...prev])
    setActiveChat(newChatId)
    setShowNewChatModal(false)
  }

  const getFilteredChats = () => {
    return chats
      .filter((chat) => {
        if (!searchQuery) return true
        const otherParticipantName = chat.participantNames.find((name) => name !== user?.name) || ""
        return otherParticipantName.toLowerCase().includes(searchQuery.toLowerCase())
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
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

  const activeChat_data = chats.find((c) => c.id === activeChat)
  const activeChatMessages = activeChat ? messages[activeChat] || [] : []

  return (
    <>
      {/* Botón flotante de chat */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 z-50"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
          {chats.reduce((sum, chat) => sum + chat.unreadCount, 0) > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center p-0">
              {chats.reduce((sum, chat) => sum + chat.unreadCount, 0) > 99
                ? "99+"
                : chats.reduce((sum, chat) => sum + chat.unreadCount, 0)}
            </Badge>
          )}
        </Button>
      )}

      {/* Ventana de chat */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 bg-gray-900/95 backdrop-blur-sm border border-white/10 shadow-xl transition-all duration-300",
            isMinimized
              ? "bottom-6 right-6 h-14 w-72 rounded-full overflow-hidden"
              : "bottom-6 right-6 w-[420px] h-[600px] rounded-xl overflow-hidden",
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
                {chats.reduce((sum, chat) => sum + chat.unreadCount, 0) > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {chats.reduce((sum, chat) => sum + chat.unreadCount, 0) > 99
                      ? "99+"
                      : chats.reduce((sum, chat) => sum + chat.unreadCount, 0)}
                  </Badge>
                )}
              </div>
              <Maximize2 className="h-4 w-4 text-white" />
            </div>
          ) : (
            <div className="flex h-full bg-gray-900/95 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
              {/* Lista de chats */}
              <div className="w-80 border-r border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">Mensajes</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewChatModal(true)}
                      className="text-white hover:bg-white/10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar conversaciones..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  {getFilteredChats().length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-6xl mb-4">💬</div>
                      <h3 className="text-white font-bold text-lg mb-2">¡Hora de Socializar! 🎉</h3>
                      <p className="text-gray-400 mb-4">
                        Tu bandeja de entrada está más vacía que mi nevera...
                        <br />
                        ¡Pero eso está a punto de cambiar! 🚀
                      </p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <span>🛒</span>
                          <span>Compra algo y chatea con vendedores</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <span>👥</span>
                          <span>Conecta con otros creadores</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <span>🎨</span>
                          <span>Colabora en proyectos épicos</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowNewChatModal(true)}
                        className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Iniciar Chat
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {getFilteredChats().map((chat) => {
                        const otherParticipantIndex = chat.participants.findIndex((p) => p !== user?.id)
                        const otherParticipantName = chat.participantNames[otherParticipantIndex] || "Usuario"
                        const otherParticipantAvatar =
                          chat.participantAvatars[otherParticipantIndex] || "/placeholder.svg"

                        return (
                          <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id)}
                            className={cn(
                              "p-3 cursor-pointer hover:bg-white/5 transition-colors",
                              activeChat === chat.id && "bg-white/10",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={otherParticipantAvatar || "/placeholder.svg"} />
                                  <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                                    {otherParticipantName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div
                                  className={cn(
                                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900",
                                    getStatusColor("online"),
                                  )}
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-white font-medium truncate">{otherParticipantName}</h4>
                                  <div className="flex items-center gap-1">
                                    {chat.starred && <Star className="h-3 w-3 text-yellow-400 fill-current" />}
                                    {chat.lastMessage && (
                                      <span className="text-xs text-gray-400">
                                        {formatTimestamp(chat.lastMessage.timestamp)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-gray-400 truncate">
                                    {chat.lastMessage ? chat.lastMessage.content : "Nuevo chat"}
                                  </p>
                                  {chat.unreadCount > 0 && (
                                    <Badge className="bg-cyan-500 text-xs">{chat.unreadCount}</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Área de chat */}
              <div className="flex-1 flex flex-col">
                {activeChat_data ? (
                  <>
                    {/* Header del chat */}
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={
                                activeChat_data.participantAvatars[
                                  activeChat_data.participants.findIndex((p) => p !== user?.id)
                                ] || "/placeholder.svg"
                              }
                            />
                            <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                              {(
                                activeChat_data.participantNames[
                                  activeChat_data.participants.findIndex((p) => p !== user?.id)
                                ] || "U"
                              ).charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={cn(
                              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900",
                              getStatusColor("online"),
                            )}
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">
                            {activeChat_data.participantNames[
                              activeChat_data.participants.findIndex((p) => p !== user?.id)
                            ] || "Usuario"}
                          </h4>
                          <p className="text-xs text-green-400">En línea</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                          <Video className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-700">
                            <DropdownMenuItem>
                              <Star className="h-4 w-4 mr-2" />
                              Destacar chat
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="h-4 w-4 mr-2" />
                              Archivar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-400">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                      </div>
                    </div>

                    {/* Mensajes */}
                    <ScrollArea className="flex-1 p-4">
                      {activeChatMessages.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4">🎬</div>
                          <h3 className="text-white font-bold text-lg mb-2">¡Acción! 🎭</h3>
                          <p className="text-gray-400 mb-4">
                            Este chat está esperando su primera línea...
                            <br />
                            ¡Sé el protagonista y rompe el hielo! ❄️
                          </p>
                          <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex items-center justify-center gap-2">
                              <span>👋</span>
                              <span>Di "¡Hola!" para empezar</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <span>🤝</span>
                              <span>Pregunta sobre productos</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <span>💡</span>
                              <span>Comparte ideas geniales</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {activeChatMessages.map((message) => {
                            const isOwn = message.senderId === user?.id
                            return (
                              <div key={message.id} className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
                                <div className={cn("max-w-xs lg:max-w-md", isOwn ? "order-2" : "order-1")}>
                                  <div
                                    className={cn(
                                      "px-4 py-2 rounded-lg",
                                      isOwn
                                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                                        : "bg-white/10 text-white",
                                    )}
                                  >
                                    <p className="text-sm">{message.content}</p>
                                  </div>
                                  <div
                                    className={cn(
                                      "flex items-center gap-1 mt-1",
                                      isOwn ? "justify-end" : "justify-start",
                                    )}
                                  >
                                    <span className="text-xs text-gray-400">{formatTimestamp(message.timestamp)}</span>
                                    {isOwn && (
                                      <div className="flex items-center">
                                        {message.read ? (
                                          <CheckCheck className="h-3 w-3 text-blue-400" />
                                        ) : (
                                          <Check className="h-3 w-3 text-gray-400" />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </ScrollArea>

                    {/* Input de mensaje */}
                    <div className="p-4 border-t border-white/10">
                      <div className="flex items-end gap-2">
                        <div className="flex-1 relative">
                          <Textarea
                            ref={inputRef}
                            placeholder="Escribe un mensaje..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="bg-white/5 border-white/20 text-white resize-none min-h-[40px] max-h-[120px] pr-20"
                            rows={1}
                          />
                          <div className="absolute right-2 bottom-2 flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-white/10">
                              <Paperclip className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-white/10">
                              <Smile className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-6">💬</div>
                      <h3 className="text-white font-bold text-2xl mb-3">¡Bienvenido al Chat! 🎉</h3>
                      <p className="text-gray-400 mb-6 max-w-md">
                        Selecciona una conversación para empezar a chatear
                        <br />o crea una nueva para conectar con alguien increíble
                      </p>
                      <Button
                        onClick={() => setShowNewChatModal(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Chat
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal para nuevo chat */}
              {showNewChatModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <Card className="w-96 bg-gray-900 border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Nuevo Chat</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNewChatModal(false)}
                          className="text-white hover:bg-white/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {contacts.map((contact) => (
                          <div
                            key={contact.id}
                            onClick={() => createNewChat(contact.id)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                          >
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                                  {contact.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={cn(
                                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900",
                                  getStatusColor(contact.status),
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{contact.name}</h4>
                              <p className="text-xs text-gray-400 capitalize">{contact.type}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                contact.type === "creator" && "border-purple-400 text-purple-400",
                                contact.type === "printer" && "border-blue-400 text-blue-400",
                                contact.type === "support" && "border-green-400 text-green-400",
                              )}
                            >
                              {contact.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}
