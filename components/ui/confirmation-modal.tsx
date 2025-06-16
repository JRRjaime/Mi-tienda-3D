"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertTriangle, Trash2, Check, X } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info"
  isLoading?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger",
  isLoading = false,
}: ConfirmationModalProps) {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return <Trash2 className="h-6 w-6 text-red-400" />
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-400" />
      case "info":
        return <Check className="h-6 w-6 text-blue-400" />
    }
  }

  const getConfirmButtonClass = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700"
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700"
      case "info":
        return "bg-blue-600 hover:bg-blue-700"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {getIcon()}
            <DialogTitle className="text-white">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-300">{description}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            <X className="h-4 w-4 mr-2" />
            {cancelText}
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} className={`flex-1 ${getConfirmButtonClass()}`}>
            {isLoading ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook para usar el modal de confirmación
export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<Omit<ConfirmationModalProps, "isOpen" | "onClose" | "onConfirm">>({
    title: "",
    description: "",
  })
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {})

  const confirm = (options: {
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    type?: "danger" | "warning" | "info"
  }) => {
    return new Promise<boolean>((resolve) => {
      setConfig(options)
      setOnConfirm(() => () => {
        resolve(true)
        setIsOpen(false)
      })
      setIsOpen(true)
    })
  }

  const Modal = () => (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false)
      }}
      onConfirm={onConfirm}
      {...config}
    />
  )

  return { confirm, Modal }
}
