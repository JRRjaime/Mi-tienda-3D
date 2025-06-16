"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
  Zap,
  Shield,
  Award,
  Users,
  Printer,
  Palette,
  Sparkles,
} from "lucide-react"

const footerSections = [
  {
    title: "Plataforma",
    links: [
      { name: "Productos", href: "/productos" },
      { name: "Monetización", href: "/monetizacion", badge: "Nuevo" },
      { name: "Colaboración", href: "/collaboration" },
      { name: "Herramientas", href: "/printer-tools" },
      { name: "Analytics", href: "/analytics" },
    ],
  },
  {
    title: "Comunidad",
    links: [
      { name: "Creadores", href: "/creadores" },
      { name: "Impresores", href: "/impresores" },
      { name: "Usuarios", href: "/usuarios" },
      { name: "Foro", href: "/foro" },
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { name: "Centro de Ayuda", href: "/ayuda" },
      { name: "Contacto", href: "/contacto" },
      { name: "Documentación", href: "/docs" },
      { name: "API", href: "/api" },
      { name: "Estado", href: "/status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Términos de Uso", href: "/terminos" },
      { name: "Privacidad", href: "/privacidad" },
      { name: "Cookies", href: "/cookies" },
      { name: "Licencias", href: "/licencias" },
      { name: "DMCA", href: "/dmca" },
    ],
  },
]

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com", color: "hover:text-blue-500" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com", color: "hover:text-sky-400" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com", color: "hover:text-pink-500" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com", color: "hover:text-red-500" },
]

const features = [
  { icon: Shield, text: "Pagos Seguros", color: "text-green-500" },
  { icon: Award, text: "Calidad Garantizada", color: "text-yellow-500" },
  { icon: Users, text: "Comunidad Global", color: "text-blue-500" },
  { icon: Zap, text: "Entrega Rápida", color: "text-purple-500" },
]

export function OptimizedFooter() {
  return (
    <footer className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-t border-blue-200/50 dark:border-slate-700/50 mt-20">
      {/* Newsletter Section */}
      <div className="border-b border-blue-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Mantente al día con las últimas novedades
              </h3>
              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Recibe notificaciones sobre nuevos modelos, ofertas especiales y actualizaciones de la plataforma
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="tu@email.com"
                className="bg-white/80 dark:bg-slate-800/80 border-blue-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400"
              />
              <Button className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300">
                <Mail className="h-4 w-4 mr-2" />
                Suscribirse
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-xl">3D</span>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  World 3D
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Plataforma de Modelos 3D</p>
              </div>
            </Link>

            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              La plataforma líder para creadores, impresores y usuarios de modelos 3D. Conectamos talento con tecnología
              para crear el futuro de la impresión 3D.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 text-blue-500" />
                <span>contacto@world3d.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 text-green-500" />
                <span>+34 900 123 456</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>Madrid, España</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className={`text-gray-500 dark:text-gray-400 transition-colors ${social.color} hover:scale-110 transform`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-gray-900 dark:text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                    >
                      {link.name}
                      {link.badge && (
                        <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-1 py-0 animate-pulse">
                          {link.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="border-t border-blue-200/50 dark:border-slate-700/50 pt-8 mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.text} className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${feature.color}`} />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{feature.text}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Section - SIN "MI TIENDA" */}
        <div className="border-t border-blue-200/50 dark:border-slate-700/50 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <span>© 2024 World 3D. Hecho con</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>en España</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Printer className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">1,234 Impresores</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-500" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">5,678 Creadores</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">12,345 Usuarios</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
