"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Send,
  Paperclip,
  ImageIcon,
  FileText,
  Clock,
  CheckCircle,
  Shield,
  User,
  Bot,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderType: "buyer" | "seller" | "support" | "system"
  message: string
  timestamp: Date
  attachments?: {
    type: "image" | "document"
    url: string
    name: string
  }[]
  read: boolean
}

interface DisputeChatProps {
  orderId: string
  userId: string
  userType: "buyer" | "seller"
  disputeStatus: "pending" | "resolved" | "escalated"
}

export function DisputeChat({ orderId, userId, userType, disputeStatus }: DisputeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Mensajes de ejemplo
  const mockMessages: ChatMessage[] = [
    {
      id: "1",
      senderId: "system",
      senderName: "Sistema",
      senderType: "system",
      message: `Se ha abierto una disputa para el pedido ${orderId}. Un agente de soporte se unirá pronto para ayudar a resolver el problema.`,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: "2",
      senderId: "buyer1",
      senderName: "Juan Pérez",
      senderType: "buyer",
      message: "Hola, he recibido el producto pero tiene un defecto en la impresión. Una de las piezas está rota.",
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      attachments: [
        {
          type: "image",
          url: "/placeholder.svg?height=200&width=200",
          name: "defecto_producto.jpg",
        },
      ],
      read: true,
    },
    {
      id: "3",
      senderId: "seller1",
      senderName: "María García",
      senderType: "seller",
      message:
        "Lamento mucho el problema. Puedo enviar una pieza de reemplazo o procesar un reembolso parcial. ¿Qué prefieres?",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: "4",
      senderId: "support1",
      senderName: "Agente de Soporte",
      senderType: "support",
      message:
        "Hola, soy el agente de soporte asignado a esta disputa. He revisado las imágenes y efectivamente hay un defecto. Vamos a trabajar juntos para encontrar la mejor solución.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
    },
  ]

  useEffect(() => {
    setMessages(mockMessages)
  }, [orderId])

  useEffect(() => {
    // Auto-scroll al final cuando hay nuevos mensajes
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: userId,
      senderName: userType === "buyer" ? "Tú (Comprador)" : "Tú (Vendedor)",
      senderType: userType,
      message: newMessage,
      timestamp: new Date(),
      read: false,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simular respuesta automática del soporte
    setTimeout(() => {
      if (Math.random() > 0.7) {
        const supportMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: "support1",
          senderName: "Agente de Soporte",
          senderType: "support",
          message: "Gracias por la información adicional. Estoy revisando los detalles y te responderé pronto.",
          timestamp: new Date(),
          read: false,
        }
        setMessages((prev) => [...prev, supportMessage])
      }
    }, 2000)
  }

  const getSenderIcon = (senderType: string) => {
    switch (senderType) {
      case "support":
        return <Shield className="h-4 w-4" />
      case "system":
        return <Bot className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getSenderColor = (senderType: string) => {
    switch (senderType) {
      case "support":
        return "text-blue-400"
      case "system":
        return "text-gray-400"
      case "buyer":
        return "text-green-400"
      case "seller":
        return "text-purple-400"
      default:
        return "text-white"
    }
  }

  const getMessageBubbleStyle = (senderId: string, senderType: string) => {
    if (senderId === userId) {
      return "ml-auto bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
    }

    switch (senderType) {
      case "support":
        return "bg-blue-500/20 border border-blue-400/30 text-blue-100"
      case "system":
        return "bg-gray-500/20 border border-gray-400/30 text-gray-100 mx-auto text-center"
      default:
        return "bg-white/10 border border-white/20 text-white"
    }
  }

  return (
    <Card className="bg-white/5 border-white/10 h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat de Disputa - {orderId}
          </CardTitle>
          <Badge
            className={cn(
              disputeStatus === "pending"
                ? "bg-yellow-500/20 text-yellow-400"
                : disputeStatus === "resolved"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400",
            )}
          >
            {disputeStatus === "pending" ? "Pendiente" : disputeStatus === "resolved" ? "Resuelto" : "Escalado"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Área de mensajes */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col gap-1",
                  message.senderId === userId ? "items-end" : "items-start",
                  message.senderType === "system" && "items-center",
                )}
              >
                {/* Información del remitente */}
                {message.senderId !== userId && message.senderType !== "system" && (
                  <div className="flex items-center gap-2 text-xs">
                    <div className={getSenderColor(message.senderType)}>{getSenderIcon(message.senderType)}</div>
                    <span className={cn("font-medium", getSenderColor(message.senderType))}>{message.senderName}</span>
                    <span className="text-gray-500">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}

                {/* Burbuja del mensaje */}
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg",
                    getMessageBubbleStyle(message.senderId, message.senderType),
                    message.senderType === "system" && "max-w-[90%] text-sm",
                  )}
                >
                  <p className="text-sm">{message.message}</p>

                  {/* Archivos adjuntos */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-black/20 rounded border border-white/10"
                        >
                          {attachment.type === "image" ? (
                            <ImageIcon className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                          <span className="text-xs">{attachment.name}</span>
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                            Ver
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Timestamp para mensajes propios */}
                {message.senderId === userId && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    {message.read && <CheckCircle className="h-3 w-3 text-green-400" />}
                  </div>
                )}
              </div>
            ))}

            {/* Indicador de escritura */}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
                <span>El agente está escribiendo...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Área de entrada de mensaje */}
        {disputeStatus !== "resolved" && (
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-white/10">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-white/10">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-white/5 border-white/20 text-white"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-cyan-500 to-blue-500"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Mensaje de disputa resuelta */}
        {disputeStatus === "resolved" && (
          <div className="p-4 border-t border-white/10 bg-green-500/10">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Esta disputa ha sido resuelta. El chat está cerrado.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
