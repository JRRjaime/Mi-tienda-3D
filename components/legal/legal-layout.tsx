"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Shield, Cookie, Scale, Copyright, Gavel } from "lucide-react"

interface LegalLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  lastUpdated: string
  icon?: React.ReactNode
}

const legalPages = [
  { name: "Términos de Uso", href: "/terminos", icon: FileText, color: "text-blue-500" },
  { name: "Privacidad", href: "/privacidad", icon: Shield, color: "text-green-500" },
  { name: "Cookies", href: "/cookies", icon: Cookie, color: "text-orange-500" },
  { name: "Licencias", href: "/licencias", icon: Scale, color: "text-purple-500" },
  { name: "DMCA", href: "/dmca", icon: Copyright, color: "text-red-500" },
]

export function LegalLayout({ children, title, description, lastUpdated, icon }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6 hover:bg-blue-100 dark:hover:bg-slate-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>

          <div className="flex items-center gap-4 mb-4">
            {icon && <div className="text-blue-600 dark:text-blue-400">{icon}</div>}
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{description}</p>
            </div>
          </div>

          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Actualizado: {lastUpdated}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Gavel className="h-4 w-4 text-blue-500" />
                  Documentos Legales
                </h3>
                <nav className="space-y-2">
                  {legalPages.map((page) => {
                    const Icon = page.icon
                    return (
                      <Link
                        key={page.href}
                        href={page.href}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Icon className={`h-4 w-4 ${page.color}`} />
                        <span className="text-sm">{page.name}</span>
                      </Link>
                    )
                  })}
                </nav>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-slate-800 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">¿Necesitas ayuda?</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Si tienes preguntas sobre estos términos, contáctanos.
                  </p>
                  <Link href="/contacto">
                    <Button size="sm" className="w-full">
                      Contactar Soporte
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-gray dark:prose-invert max-w-none">{children}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
