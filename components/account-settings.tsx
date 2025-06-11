"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  Shield,
  User,
  Store,
  Printer,
  Globe,
  Mail,
  Trash2,
  AlertTriangle,
  Save,
  CreditCard,
  Gift,
  FileText,
  Users,
  Settings,
  Download,
  Share2,
  Percent,
  Receipt,
  Building,
  Copy,
  ExternalLink,
  Zap,
  Database,
  Facebook,
  Twitter,
  Instagram,
  Link2,
  Eye,
  BarChart3,
  Target,
  Plus,
  Smartphone,
  Moon,
  Type,
} from "lucide-react"
// Importar el componente de plantillas
import { NotificationTemplates } from "@/components/notification-templates"

interface AccountSettingsProps {
  user: {
    name: string
    email: string
    profileTypes: string[]
    country: string
    language: string
    timezone: string
  }
}

export function AccountSettings({ user }: AccountSettingsProps) {
  // Estados existentes...
  const [generalSettings, setGeneralSettings] = useState({
    language: user.language || "es",
    timezone: user.timezone || "Europe/Madrid",
    country: user.country || "España",
    currency: "EUR",
    publicProfile: true,
    showEmail: false,
    showLocation: true,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    // Configuración básica existente
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    newMessages: true,
    orderUpdates: true,
    newFollowers: true,
    modelApproved: true,
    modelRejected: true,
    salesNotifications: true,
    printJobUpdates: true,
    weeklyDigest: false,
    monthlyReport: true,

    // Nueva configuración avanzada de notificaciones push
    pushConfig: {
      enabled: true,
      sound: true,
      vibration: true,
      badge: true,
      priority: "normal", // low, normal, high
      grouping: true,
      autoExpire: 24, // horas
    },

    // Configuración por tipo de notificación
    notificationTypes: {
      sales: { email: true, push: true, sms: false, inApp: true, priority: "high" },
      orders: { email: true, push: true, sms: true, inApp: true, priority: "high" },
      messages: { email: false, push: true, sms: false, inApp: true, priority: "normal" },
      followers: { email: false, push: true, sms: false, inApp: true, priority: "low" },
      system: { email: true, push: true, sms: false, inApp: true, priority: "high" },
      marketing: { email: false, push: false, sms: false, inApp: false, priority: "low" },
    },

    // Horarios de no molestar
    quietHours: {
      enabled: true,
      startTime: "22:00",
      endTime: "08:00",
      timezone: "Europe/Madrid",
      weekendsOnly: false,
    },

    // Configuración de agrupación
    grouping: {
      enabled: true,
      maxPerGroup: 5,
      timeWindow: 30, // minutos
      collapseAfter: 3,
    },

    // Configuración de canales
    channels: {
      email: { enabled: true, frequency: "immediate" }, // immediate, hourly, daily
      push: { enabled: true, frequency: "immediate" },
      sms: { enabled: false, frequency: "immediate", number: "" },
      inApp: { enabled: true, frequency: "immediate" },
    },

    // Plantillas personalizadas
    templates: {
      sales: {
        title: "¡Nueva venta! 🎉",
        body: "Has vendido {modelName} por ${amount}",
        icon: "💰",
        color: "#10B981",
      },
      orders: {
        title: "Nuevo pedido de impresión",
        body: "Tienes un nuevo trabajo: {modelName}",
        icon: "🖨️",
        color: "#3B82F6",
      },
      messages: {
        title: "Nuevo mensaje",
        body: "{senderName}: {preview}",
        icon: "💬",
        color: "#8B5CF6",
      },
    },
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showPurchaseHistory: false,
    showFavorites: true,
    allowMessages: true,
    showOnlineStatus: true,
    dataCollection: true,
    analyticsTracking: false,
  })

  const [creatorSettings, setCreatorSettings] = useState({
    storeName: "Tienda de Carlos",
    storeDescription: "Creador de modelos 3D únicos y personalizados",
    autoApproveComments: false,
    allowCustomRequests: true,
    minimumPrice: 5,
    defaultLicense: "personal",
    showEarnings: false,
    featuredModels: 3,
  })

  const [printerSettings, setPrinterSettings] = useState({
    workshopName: "Taller 3D Carlos",
    workshopDescription: "Servicios de impresión 3D profesional",
    acceptedMaterials: ["PLA", "PETG", "ABS"],
    maxPrintSize: "200x200x200mm",
    averageDeliveryTime: "3-5 días",
    autoAcceptOrders: false,
    minimumOrderValue: 10,
    workingHours: "9:00 - 18:00",
  })

  // Nuevos estados para las configuraciones expandidas
  const [paymentSettings, setPaymentSettings] = useState({
    defaultPaymentMethod: "card",
    autoWithdraw: false,
    withdrawThreshold: 100,
    taxId: "",
    businessName: "",
    businessAddress: "",
    vatNumber: "",
    preferredWithdrawMethod: "bank",
    bankAccount: "",
    paypalEmail: "",
    savedCards: [
      { id: 1, last4: "4242", brand: "Visa", expiry: "12/25", isDefault: true },
      { id: 2, last4: "5555", brand: "Mastercard", expiry: "08/26", isDefault: false },
    ],
  })

  const [discountSettings, setDiscountSettings] = useState({
    // Para creadores
    volumeDiscounts: [
      { quantity: 5, discount: 5 },
      { quantity: 10, discount: 10 },
      { quantity: 20, discount: 15 },
    ],
    loyaltyProgram: true,
    seasonalDiscounts: true,
    // Para impresores
    bulkPrintingDiscounts: [
      { quantity: 3, discount: 10 },
      { quantity: 5, discount: 15 },
      { quantity: 10, discount: 20 },
    ],
    materialDiscounts: true,
    rushOrderSurcharge: 25,
  })

  const [referralSettings, setReferralSettings] = useState({
    referralCode: "CARLOS3D",
    referralBonus: 10,
    referredBonus: 5,
    totalReferrals: 12,
    totalEarnings: 120,
    socialSharing: true,
    emailInvites: true,
  })

  const [legalSettings, setLegalSettings] = useState({
    acceptedTerms: true,
    acceptedPrivacy: true,
    acceptedCookies: true,
    marketingConsent: false,
    dataRetention: "2years",
    rightToDelete: false,
    copyrightNotices: true,
  })

  const [advancedSettings, setAdvancedSettings] = useState({
    apiEnabled: false,
    apiKey: "sk_live_...",
    webhookUrl: "",
    backupEnabled: true,
    backupFrequency: "weekly",
    twoFactorAuth: false,
    sessionTimeout: 30,
    ipWhitelist: "",
    developerMode: false,
  })

  const [socialSettings, setSocialSettings] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
    website: "",
    showSocialLinks: true,
    autoShareNewModels: false,
    socialLoginEnabled: true,
  })

  const [teamSettings, setTeamSettings] = useState({
    allowCollaborators: false,
    maxCollaborators: 3,
    collaboratorPermissions: "view",
    teamName: "",
    invitePending: [],
  })

  const isCreator = user.profileTypes.includes("creador")
  const isPrinter = user.profileTypes.includes("impresor")
  const isUser = user.profileTypes.includes("usuario")

  const [analyticsSettings, setAnalyticsSettings] = useState({
    // Google Analytics
    googleAnalyticsEnabled: true,
    googleAnalyticsId: "GA-XXXXXXXXX-X",
    gtmEnabled: false,
    gtmId: "GTM-XXXXXXX",

    // Métricas personalizadas
    trackSales: true,
    trackDownloads: true,
    trackPrintJobs: true,
    trackUserBehavior: true,
    trackConversions: true,

    // Eventos personalizados
    customEvents: [
      { name: "model_view", description: "Usuario ve un modelo", enabled: true },
      { name: "model_download", description: "Usuario descarga un modelo", enabled: true },
      { name: "print_request", description: "Usuario solicita impresión", enabled: true },
      { name: "purchase_complete", description: "Compra completada", enabled: true },
      { name: "profile_visit", description: "Visita a perfil de creador", enabled: true },
    ],

    // Objetivos y conversiones
    conversionGoals: [
      { name: "Registro de usuario", value: 5, enabled: true },
      { name: "Primera compra", value: 25, enabled: true },
      { name: "Compra recurrente", value: 15, enabled: true },
    ],

    // Reportes
    weeklyReports: true,
    monthlyReports: true,
    customReports: false,
    reportEmail: user.email,

    // Dashboards personalizados
    creatorDashboard: isCreator,
    printerDashboard: isPrinter,
    userDashboard: true,

    // Configuración de privacidad
    anonymizeIp: true,
    respectDoNotTrack: true,
    cookieConsent: true,
    dataRetentionMonths: 26,

    // Integraciones adicionales
    facebookPixelEnabled: false,
    facebookPixelId: "",
    hotjarEnabled: false,
    hotjarId: "",
    mixpanelEnabled: false,
    mixpanelToken: "",

    // Métricas específicas por rol
    creatorMetrics: {
      trackModelViews: true,
      trackSalesConversion: true,
      trackCustomerRetention: true,
      trackRevenuePerModel: true,
      trackDownloadToSaleRatio: true,
    },

    printerMetrics: {
      trackJobCompletion: true,
      trackCustomerSatisfaction: true,
      trackMaterialUsage: true,
      trackDeliveryTimes: true,
      trackRepeatCustomers: true,
    },

    userMetrics: {
      trackBrowsingBehavior: true,
      trackPurchaseHistory: true,
      trackWishlistActivity: true,
      trackSearchQueries: true,
      trackSupportInteractions: true,
    },
  })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  const handleSaveSettings = (section: string) => {
    console.log(`Guardando configuración de ${section}`)
  }

  const generateNewApiKey = () => {
    const newKey = "sk_live_" + Math.random().toString(36).substring(2, 15)
    setAdvancedSettings({ ...advancedSettings, apiKey: newKey })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const addVolumeDiscount = () => {
    const newDiscount = { quantity: 1, discount: 0 }
    setDiscountSettings({
      ...discountSettings,
      volumeDiscounts: [...discountSettings.volumeDiscounts, newDiscount],
    })
  }

  const removeVolumeDiscount = (index: number) => {
    const newDiscounts = discountSettings.volumeDiscounts.filter((_, i) => i !== index)
    setDiscountSettings({ ...discountSettings, volumeDiscounts: newDiscounts })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-8">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Pagos</span>
          </TabsTrigger>
          <TabsTrigger value="discounts" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            <span className="hidden sm:inline">Descuentos</span>
          </TabsTrigger>
          <TabsTrigger value="referrals" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">Referidos</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacidad</span>
          </TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Legal</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Avanzado</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">Plantillas</span>
          </TabsTrigger>
        </TabsList>

        {/* Configuración General - Mantener la existente */}
        <TabsContent value="general">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configuración General
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configura las preferencias básicas de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Idioma</Label>
                  <Select
                    value={generalSettings.language}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, language: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Zona Horaria</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                      <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                      <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Los Ángeles (GMT-8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">País</Label>
                  <Select
                    value={generalSettings.country}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, country: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="España">España</SelectItem>
                      <SelectItem value="México">México</SelectItem>
                      <SelectItem value="Argentina">Argentina</SelectItem>
                      <SelectItem value="Colombia">Colombia</SelectItem>
                      <SelectItem value="Chile">Chile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Moneda</Label>
                  <Select
                    value={generalSettings.currency}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, currency: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="MXN">Peso Mexicano ($)</SelectItem>
                      <SelectItem value="ARS">Peso Argentino ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Configuración de Perfil Público y Redes Sociales */}
              <Separator className="bg-white/10" />

              <div className="space-y-4">
                <h3 className="text-white font-medium">Redes Sociales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </Label>
                    <Input
                      value={socialSettings.facebook}
                      onChange={(e) => setSocialSettings({ ...socialSettings, facebook: e.target.value })}
                      placeholder="https://facebook.com/tu-perfil"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </Label>
                    <Input
                      value={socialSettings.twitter}
                      onChange={(e) => setSocialSettings({ ...socialSettings, twitter: e.target.value })}
                      placeholder="@tu-usuario"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </Label>
                    <Input
                      value={socialSettings.instagram}
                      onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })}
                      placeholder="@tu-usuario"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      Sitio Web
                    </Label>
                    <Input
                      value={socialSettings.website}
                      onChange={(e) => setSocialSettings({ ...socialSettings, website: e.target.value })}
                      placeholder="https://tu-sitio.com"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Mostrar enlaces sociales</Label>
                    <p className="text-sm text-gray-400">Muestra tus redes sociales en tu perfil público</p>
                  </div>
                  <Switch
                    checked={socialSettings.showSocialLinks}
                    onCheckedChange={(checked) => setSocialSettings({ ...socialSettings, showSocialLinks: checked })}
                  />
                </div>
              </div>

              <Button
                onClick={() => handleSaveSettings("general")}
                className="bg-gradient-to-r from-cyan-500 to-blue-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración General
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nueva Configuración de Pagos */}
        <TabsContent value="payments">
          <div className="space-y-6">
            {/* Métodos de Pago */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Métodos de Pago
                </CardTitle>
                <CardDescription className="text-gray-300">Gestiona tus tarjetas y métodos de pago</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-white font-medium">Tarjetas Guardadas</h3>
                  {paymentSettings.savedCards.map((card) => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{card.brand}</span>
                        </div>
                        <div>
                          <div className="text-white">•••• •••• •••• {card.last4}</div>
                          <div className="text-sm text-gray-400">Expira {card.expiry}</div>
                        </div>
                        {card.isDefault && <Badge className="bg-green-500">Por defecto</Badge>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-white/20 text-white">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-400 text-red-400">
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Añadir Nueva Tarjeta
                  </Button>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <h3 className="text-white font-medium">Otros Métodos de Pago</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">PP</span>
                        </div>
                        <span className="text-white font-medium">PayPal</span>
                      </div>
                      <Input
                        value={paymentSettings.paypalEmail}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, paypalEmail: e.target.value })}
                        placeholder="tu@email.com"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Building className="h-6 w-6 text-green-400" />
                        <span className="text-white font-medium">Transferencia Bancaria</span>
                      </div>
                      <Input
                        value={paymentSettings.bankAccount}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, bankAccount: e.target.value })}
                        placeholder="ES12 1234 5678 9012 3456 7890"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Facturación */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Información de Facturación
                </CardTitle>
                <CardDescription className="text-gray-300">Datos fiscales y de facturación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white">Nombre/Razón Social</Label>
                    <Input
                      value={paymentSettings.businessName}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, businessName: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">NIF/CIF</Label>
                    <Input
                      value={paymentSettings.taxId}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, taxId: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Dirección de Facturación</Label>
                  <Textarea
                    value={paymentSettings.businessAddress}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, businessAddress: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Número de IVA (opcional)</Label>
                  <Input
                    value={paymentSettings.vatNumber}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, vatNumber: e.target.value })}
                    placeholder="ESB12345678"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configuración de Retiros */}
            {(isCreator || isPrinter) && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Configuración de Retiros
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Configura cómo y cuándo retirar tus ganancias
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Método de retiro preferido</Label>
                      <Select
                        value={paymentSettings.preferredWithdrawMethod}
                        onValueChange={(value) =>
                          setPaymentSettings({ ...paymentSettings, preferredWithdrawMethod: value })
                        }
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Transferencia Bancaria</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="card">Tarjeta de Débito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Umbral de retiro automático ($)</Label>
                      <Input
                        type="number"
                        value={paymentSettings.withdrawThreshold}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, withdrawThreshold: Number(e.target.value) })
                        }
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Retiro automático</Label>
                      <p className="text-sm text-gray-400">Retira automáticamente cuando alcances el umbral</p>
                    </div>
                    <Switch
                      checked={paymentSettings.autoWithdraw}
                      onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, autoWithdraw: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={() => handleSaveSettings("payments")}
              className="bg-gradient-to-r from-green-500 to-emerald-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Configuración de Pagos
            </Button>
          </div>
        </TabsContent>

        {/* Nueva Configuración de Descuentos */}
        <TabsContent value="discounts">
          <div className="space-y-6">
            {/* Descuentos por Volumen para Creadores */}
            {isCreator && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    Descuentos por Volumen (Creador)
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Configura descuentos automáticos para compras en lote
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {discountSettings.volumeDiscounts.map((discount, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white text-sm">Cantidad mínima</Label>
                            <Input
                              type="number"
                              value={discount.quantity}
                              onChange={(e) => {
                                const newDiscounts = [...discountSettings.volumeDiscounts]
                                newDiscounts[index].quantity = Number(e.target.value)
                                setDiscountSettings({ ...discountSettings, volumeDiscounts: newDiscounts })
                              }}
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-white text-sm">Descuento (%)</Label>
                            <Input
                              type="number"
                              value={discount.discount}
                              onChange={(e) => {
                                const newDiscounts = [...discountSettings.volumeDiscounts]
                                newDiscounts[index].discount = Number(e.target.value)
                                setDiscountSettings({ ...discountSettings, volumeDiscounts: newDiscounts })
                              }}
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeVolumeDiscount(index)}
                          className="border-red-400 text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button onClick={addVolumeDiscount} variant="outline" className="border-white/20 text-white">
                      Añadir Descuento
                    </Button>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Programas Especiales</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Programa de fidelidad</Label>
                          <p className="text-sm text-gray-400">Descuentos progresivos para clientes frecuentes</p>
                        </div>
                        <Switch
                          checked={discountSettings.loyaltyProgram}
                          onCheckedChange={(checked) =>
                            setDiscountSettings({ ...discountSettings, loyaltyProgram: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Descuentos estacionales</Label>
                          <p className="text-sm text-gray-400">Ofertas especiales en fechas señaladas</p>
                        </div>
                        <Switch
                          checked={discountSettings.seasonalDiscounts}
                          onCheckedChange={(checked) =>
                            setDiscountSettings({ ...discountSettings, seasonalDiscounts: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Descuentos para Impresores */}
            {isPrinter && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Printer className="h-5 w-5" />
                    Descuentos de Impresión (Impresor)
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Configura descuentos para trabajos de impresión en lote
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Descuentos por Cantidad de Piezas</h3>
                    {discountSettings.bulkPrintingDiscounts.map((discount, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white text-sm">Piezas mínimas</Label>
                            <Input
                              type="number"
                              value={discount.quantity}
                              className="bg-white/5 border-white/10 text-white"
                              readOnly
                            />
                          </div>
                          <div>
                            <Label className="text-white text-sm">Descuento (%)</Label>
                            <Input
                              type="number"
                              value={discount.discount}
                              className="bg-white/5 border-white/10 text-white"
                              readOnly
                            />
                          </div>
                        </div>
                        <Badge className="bg-blue-500">Automático</Badge>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Configuración de Precios</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-white">Recargo por urgencia (%)</Label>
                        <Input
                          type="number"
                          value={discountSettings.rushOrderSurcharge}
                          onChange={(e) =>
                            setDiscountSettings({ ...discountSettings, rushOrderSurcharge: Number(e.target.value) })
                          }
                          className="bg-white/5 border-white/10 text-white"
                        />
                        <p className="text-sm text-gray-400">Recargo para pedidos urgentes (menos de 24h)</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Descuentos por material</Label>
                        <p className="text-sm text-gray-400">Ofrecer descuentos según el tipo de material</p>
                      </div>
                      <Switch
                        checked={discountSettings.materialDiscounts}
                        onCheckedChange={(checked) =>
                          setDiscountSettings({ ...discountSettings, materialDiscounts: checked })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={() => handleSaveSettings("discounts")}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Configuración de Descuentos
            </Button>
          </div>
        </TabsContent>

        {/* Nueva Configuración de Referidos */}
        <TabsContent value="referrals">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Programa de Referidos
              </CardTitle>
              <CardDescription className="text-gray-300">
                Invita amigos y gana recompensas por cada nuevo usuario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Estadísticas de Referidos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-green-500 to-emerald-500 border-0">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-white">{referralSettings.totalReferrals}</div>
                    <div className="text-sm text-white/80">Amigos invitados</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-white">${referralSettings.totalEarnings}</div>
                    <div className="text-sm text-white/80">Ganancias totales</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-0">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-white">{referralSettings.referralBonus}%</div>
                    <div className="text-sm text-white/80">Comisión por referido</div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="bg-white/10" />

              {/* Código de Referido */}
              <div className="space-y-4">
                <h3 className="text-white font-medium">Tu Código de Referido</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex">
                      <Input
                        value={referralSettings.referralCode}
                        readOnly
                        className="bg-white/5 border-white/10 text-white rounded-r-none"
                      />
                      <Button
                        onClick={() => copyToClipboard(referralSettings.referralCode)}
                        className="bg-cyan-500 hover:bg-cyan-600 rounded-l-none"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  Comparte este código con tus amigos. Cuando se registren y hagan su primera compra, tú ganarás $
                  {referralSettings.referralBonus} y ellos recibirán ${referralSettings.referredBonus} de descuento.
                </p>
              </div>

              <Separator className="bg-white/10" />

              {/* Opciones de Compartir */}
              <div className="space-y-4">
                <h3 className="text-white font-medium">Invitar Amigos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button className="bg-sky-500 hover:bg-sky-600">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Share2 className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button className="bg-gray-600 hover:bg-gray-700">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Configuración del Programa */}
              <div className="space-y-4">
                <h3 className="text-white font-medium">Configuración</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Compartir en redes sociales</Label>
                      <p className="text-sm text-gray-400">Permite compartir automáticamente tus logros</p>
                    </div>
                    <Switch
                      checked={referralSettings.socialSharing}
                      onCheckedChange={(checked) =>
                        setReferralSettings({ ...referralSettings, socialSharing: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Invitaciones por email</Label>
                      <p className="text-sm text-gray-400">Enviar invitaciones directamente por email</p>
                    </div>
                    <Switch
                      checked={referralSettings.emailInvites}
                      onCheckedChange={(checked) => setReferralSettings({ ...referralSettings, emailInvites: checked })}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleSaveSettings("referrals")}
                className="bg-gradient-to-r from-green-500 to-emerald-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración de Referidos
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Notificaciones - Mantener la existente pero expandida */}
        <TabsContent value="notifications">
          <div className="space-y-6">
            {/* Configuración Básica */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Configuración de Notificaciones
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Controla qué notificaciones quieres recibir y cómo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Configuración existente... */}
                <div className="space-y-4">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Notificaciones por Email
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Notificaciones generales</Label>
                        <p className="text-sm text-gray-400">Recibe emails sobre actividad importante</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Actualizaciones de pedidos</Label>
                        <p className="text-sm text-gray-400">Estado de tus compras e impresiones</p>
                      </div>
                      <Switch
                        checked={notificationSettings.orderUpdates}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, orderUpdates: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Nuevos mensajes</Label>
                        <p className="text-sm text-gray-400">Cuando recibas mensajes de otros usuarios</p>
                      </div>
                      <Switch
                        checked={notificationSettings.newMessages}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, newMessages: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Emails de marketing</Label>
                        <p className="text-sm text-gray-400">Ofertas especiales y novedades</p>
                      </div>
                      <Switch
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, marketingEmails: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nueva Configuración de Notificaciones Push */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Notificaciones Push
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configuración avanzada de notificaciones en tiempo real
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Habilitar notificaciones push</Label>
                    <p className="text-sm text-gray-400">Recibe notificaciones instantáneas en tu navegador</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushConfig.enabled}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        pushConfig: { ...notificationSettings.pushConfig, enabled: checked },
                      })
                    }
                  />
                </div>

                {notificationSettings.pushConfig.enabled && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-white text-sm">Sonido</Label>
                        <Switch
                          checked={notificationSettings.pushConfig.sound}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              pushConfig: { ...notificationSettings.pushConfig, sound: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-white text-sm">Vibración</Label>
                        <Switch
                          checked={notificationSettings.pushConfig.vibration}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              pushConfig: { ...notificationSettings.pushConfig, vibration: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-white text-sm">Badge</Label>
                        <Switch
                          checked={notificationSettings.pushConfig.badge}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              pushConfig: { ...notificationSettings.pushConfig, badge: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-white text-sm">Agrupación</Label>
                        <Switch
                          checked={notificationSettings.pushConfig.grouping}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              pushConfig: { ...notificationSettings.pushConfig, grouping: checked },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-white">Prioridad por defecto</Label>
                        <Select
                          value={notificationSettings.pushConfig.priority}
                          onValueChange={(value) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              pushConfig: { ...notificationSettings.pushConfig, priority: value },
                            })
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baja</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Auto-expirar después de (horas)</Label>
                        <Input
                          type="number"
                          value={notificationSettings.pushConfig.autoExpire}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              pushConfig: { ...notificationSettings.pushConfig, autoExpire: Number(e.target.value) },
                            })
                          }
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configuración por Tipo de Notificación */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración por Tipo
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Personaliza cómo recibir cada tipo de notificación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(notificationSettings.notificationTypes).map(([type, config]) => (
                  <div key={type} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-medium capitalize">{type}</h4>
                      <Select
                        value={config.priority}
                        onValueChange={(value) => {
                          const newTypes = { ...notificationSettings.notificationTypes }
                          newTypes[type].priority = value
                          setNotificationSettings({ ...notificationSettings, notificationTypes: newTypes })
                        }}
                      >
                        <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baja</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(config)
                        .filter(([key]) => key !== "priority")
                        .map(([channel, enabled]) => (
                          <div key={channel} className="flex items-center justify-between">
                            <Label className="text-white text-sm capitalize">{channel}</Label>
                            <Switch
                              checked={enabled}
                              onCheckedChange={(checked) => {
                                const newTypes = { ...notificationSettings.notificationTypes }
                                newTypes[type][channel] = checked
                                setNotificationSettings({ ...notificationSettings, notificationTypes: newTypes })
                              }}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Horarios de No Molestar */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  Horarios de No Molestar
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configura cuándo no quieres recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Habilitar modo silencioso</Label>
                    <p className="text-sm text-gray-400">Silencia notificaciones durante horas específicas</p>
                  </div>
                  <Switch
                    checked={notificationSettings.quietHours.enabled}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        quietHours: { ...notificationSettings.quietHours, enabled: checked },
                      })
                    }
                  />
                </div>

                {notificationSettings.quietHours.enabled && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-white">Hora de inicio</Label>
                        <Input
                          type="time"
                          value={notificationSettings.quietHours.startTime}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              quietHours: { ...notificationSettings.quietHours, startTime: e.target.value },
                            })
                          }
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Hora de fin</Label>
                        <Input
                          type="time"
                          value={notificationSettings.quietHours.endTime}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              quietHours: { ...notificationSettings.quietHours, endTime: e.target.value },
                            })
                          }
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Solo fines de semana</Label>
                        <p className="text-sm text-gray-400">Aplicar modo silencioso solo sábados y domingos</p>
                      </div>
                      <Switch
                        checked={notificationSettings.quietHours.weekendsOnly}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            quietHours: { ...notificationSettings.quietHours, weekendsOnly: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={() => handleSaveSettings("notifications")}
              className="bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Configuración de Notificaciones
            </Button>
          </div>
        </TabsContent>

        {/* Configuración de Privacidad - Mantener la existente */}
        <TabsContent value="privacy">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuración de Privacidad
              </CardTitle>
              <CardDescription className="text-gray-300">
                Controla quién puede ver tu información y actividad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mantener contenido existente de privacidad */}
              <div className="space-y-4">
                <h3 className="text-white font-medium">Visibilidad del Perfil</h3>
                <div className="space-y-2">
                  <Label className="text-white">¿Quién puede ver tu perfil?</Label>
                  <Select
                    value={privacySettings.profileVisibility}
                    onValueChange={(value) => setPrivacySettings({ ...privacySettings, profileVisibility: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Público - Cualquiera puede ver</SelectItem>
                      <SelectItem value="friends">Solo seguidores</SelectItem>
                      <SelectItem value="private">Privado - Solo yo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={() => handleSaveSettings("privacy")}
                className="bg-gradient-to-r from-cyan-500 to-blue-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración de Privacidad
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nueva Configuración Legal */}
        <TabsContent value="legal">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información Legal
              </CardTitle>
              <CardDescription className="text-gray-300">Términos, condiciones y configuración legal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Documentos Legales */}
              <div className="space-y-4">
                <h3 className="text-white font-medium">Documentos y Aceptaciones</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <Label className="text-white">Términos y Condiciones</Label>
                      <p className="text-sm text-gray-400">Última actualización: 15 de enero, 2024</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">Aceptado</Badge>
                      <Button variant="outline" size="sm" className="border-white/20 text-white">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <Label className="text-white">Política de Privacidad</Label>
                      <p className="text-sm text-gray-400">Última actualización: 15 de enero, 2024</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">Aceptado</Badge>
                      <Button variant="outline" size="sm" className="border-white/20 text-white">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <Label className="text-white">Política de Cookies</Label>
                      <p className="text-sm text-gray-400">Última actualización: 10 de enero, 2024</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">Aceptado</Badge>
                      <Button variant="outline" size="sm" className="border-white/20 text-white">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Configuración de Consentimientos */}
              <div className="space-y-4">
                <h3 className="text-white font-medium">Consentimientos</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Consentimiento de marketing</Label>
                      <p className="text-sm text-gray-400">Acepto recibir comunicaciones comerciales</p>
                    </div>
                    <Switch
                      checked={legalSettings.marketingConsent}
                      onCheckedChange={(checked) => setLegalSettings({ ...legalSettings, marketingConsent: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Avisos de derechos de autor</Label>
                      <p className="text-sm text-gray-400">Recibir notificaciones sobre derechos de autor</p>
                    </div>
                    <Switch
                      checked={legalSettings.copyrightNotices}
                      onCheckedChange={(checked) => setLegalSettings({ ...legalSettings, copyrightNotices: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Retención de Datos */}
              <div className="space-y-4">
                <h3 className="text-white font-medium">Gestión de Datos</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Período de retención de datos</Label>
                    <Select
                      value={legalSettings.dataRetention}
                      onValueChange={(value) => setLegalSettings({ ...legalSettings, dataRetention: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1year">1 año</SelectItem>
                        <SelectItem value="2years">2 años</SelectItem>
                        <SelectItem value="5years">5 años</SelectItem>
                        <SelectItem value="indefinite">Indefinido</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-400">
                      Tiempo que mantendremos tus datos después de cerrar tu cuenta
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Derecho al Olvido</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Puedes solicitar la eliminación completa de todos tus datos personales. Esta acción es
                      irreversible y eliminará permanentemente tu cuenta.
                    </p>
                    <Button
                      variant="outline"
                      className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    >
                      Solicitar Eliminación de Datos
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleSaveSettings("legal")}
                className="bg-gradient-to-r from-cyan-500 to-blue-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración Legal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nueva Configuración Avanzada */}
        <TabsContent value="advanced">
          <div className="space-y-6">
            {/* API y Integraciones */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  API y Integraciones
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configuración para desarrolladores e integraciones externas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Habilitar API</Label>
                    <p className="text-sm text-gray-400">Permite el acceso a la API para integraciones</p>
                  </div>
                  <Switch
                    checked={advancedSettings.apiEnabled}
                    onCheckedChange={(checked) => setAdvancedSettings({ ...advancedSettings, apiEnabled: checked })}
                  />
                </div>

                {advancedSettings.apiEnabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Clave API</Label>
                      <div className="flex gap-2">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          value={advancedSettings.apiKey}
                          readOnly
                          className="bg-white/5 border-white/10 text-white"
                        />
                        <Button
                          variant="outline"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="border-white/20 text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(advancedSettings.apiKey)}
                          className="border-white/20 text-white"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button onClick={generateNewApiKey} className="bg-red-500 hover:bg-red-600">
                          Regenerar
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">URL de Webhook</Label>
                      <Input
                        value={advancedSettings.webhookUrl}
                        onChange={(e) => setAdvancedSettings({ ...advancedSettings, webhookUrl: e.target.value })}
                        placeholder="https://tu-sitio.com/webhook"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Backup y Exportación */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup y Exportación
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Gestiona copias de seguridad y exportación de datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Backup automático</Label>
                    <p className="text-sm text-gray-400">Crea copias de seguridad automáticas de tus datos</p>
                  </div>
                  <Switch
                    checked={advancedSettings.backupEnabled}
                    onCheckedChange={(checked) => setAdvancedSettings({ ...advancedSettings, backupEnabled: checked })}
                  />
                </div>

                {advancedSettings.backupEnabled && (
                  <div className="space-y-2">
                    <Label className="text-white">Frecuencia de backup</Label>
                    <Select
                      value={advancedSettings.backupFrequency}
                      onValueChange={(value) => setAdvancedSettings({ ...advancedSettings, backupFrequency: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diario</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Datos
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Backup
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seguridad Avanzada */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Seguridad Avanzada
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configuración de seguridad adicional para tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Autenticación de dos factores</Label>
                    <p className="text-sm text-gray-400">Añade una capa extra de seguridad</p>
                  </div>
                  <Switch
                    checked={advancedSettings.twoFactorAuth}
                    onCheckedChange={(checked) => setAdvancedSettings({ ...advancedSettings, twoFactorAuth: checked })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white">Tiempo de sesión (minutos)</Label>
                    <Input
                      type="number"
                      value={advancedSettings.sessionTimeout}
                      onChange={(e) =>
                        setAdvancedSettings({ ...advancedSettings, sessionTimeout: Number(e.target.value) })
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Lista blanca de IPs</Label>
                    <Input
                      value={advancedSettings.ipWhitelist}
                      onChange={(e) => setAdvancedSettings({ ...advancedSettings, ipWhitelist: e.target.value })}
                      placeholder="192.168.1.1, 10.0.0.1"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Modo desarrollador</Label>
                    <p className="text-sm text-gray-400">Habilita funciones avanzadas y logs detallados</p>
                  </div>
                  <Switch
                    checked={advancedSettings.developerMode}
                    onCheckedChange={(checked) => setAdvancedSettings({ ...advancedSettings, developerMode: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Gestión de Equipos */}
            {(isCreator || isPrinter) && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gestión de Equipos
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Invita colaboradores para gestionar tu {isCreator ? "tienda" : "taller"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Permitir colaboradores</Label>
                      <p className="text-sm text-gray-400">Permite que otros usuarios ayuden a gestionar tu cuenta</p>
                    </div>
                    <Switch
                      checked={teamSettings.allowCollaborators}
                      onCheckedChange={(checked) => setTeamSettings({ ...teamSettings, allowCollaborators: checked })}
                    />
                  </div>

                  {teamSettings.allowCollaborators && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-white">Máximo de colaboradores</Label>
                          <Select
                            value={teamSettings.maxCollaborators.toString()}
                            onValueChange={(value) =>
                              setTeamSettings({ ...teamSettings, maxCollaborators: Number(value) })
                            }
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 colaborador</SelectItem>
                              <SelectItem value="3">3 colaboradores</SelectItem>
                              <SelectItem value="5">5 colaboradores</SelectItem>
                              <SelectItem value="10">10 colaboradores</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">Permisos por defecto</Label>
                          <Select
                            value={teamSettings.collaboratorPermissions}
                            onValueChange={(value) =>
                              setTeamSettings({ ...teamSettings, collaboratorPermissions: value })
                            }
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="view">Solo lectura</SelectItem>
                              <SelectItem value="edit">Editar contenido</SelectItem>
                              <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Invitar colaborador</Label>
                        <div className="flex gap-2">
                          <Input placeholder="email@ejemplo.com" className="bg-white/5 border-white/10 text-white" />
                          <Button className="bg-gradient-to-r from-green-500 to-emerald-500">Invitar</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Button
              onClick={() => handleSaveSettings("advanced")}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Configuración Avanzada
            </Button>
          </div>
        </TabsContent>

        {/* Nueva Configuración de Analytics */}
        <TabsContent value="analytics">
          <div className="space-y-6">
            {/* Google Analytics */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Google Analytics
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configuración de Google Analytics y Google Tag Manager
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Habilitar Google Analytics</Label>
                    <p className="text-sm text-gray-400">Activa el seguimiento con Google Analytics 4</p>
                  </div>
                  <Switch
                    checked={analyticsSettings.googleAnalyticsEnabled}
                    onCheckedChange={(checked) =>
                      setAnalyticsSettings({ ...analyticsSettings, googleAnalyticsEnabled: checked })
                    }
                  />
                </div>

                {analyticsSettings.googleAnalyticsEnabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">ID de Google Analytics</Label>
                      <Input
                        value={analyticsSettings.googleAnalyticsId}
                        onChange={(e) =>
                          setAnalyticsSettings({ ...analyticsSettings, googleAnalyticsId: e.target.value })
                        }
                        placeholder="GA-XXXXXXXXX-X"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Google Tag Manager</Label>
                        <p className="text-sm text-gray-400">Usar GTM para gestión avanzada de tags</p>
                      </div>
                      <Switch
                        checked={analyticsSettings.gtmEnabled}
                        onCheckedChange={(checked) =>
                          setAnalyticsSettings({ ...analyticsSettings, gtmEnabled: checked })
                        }
                      />
                    </div>

                    {analyticsSettings.gtmEnabled && (
                      <div className="space-y-2">
                        <Label className="text-white">ID de Google Tag Manager</Label>
                        <Input
                          value={analyticsSettings.gtmId}
                          onChange={(e) => setAnalyticsSettings({ ...analyticsSettings, gtmId: e.target.value })}
                          placeholder="GTM-XXXXXXX"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    )}
                  </div>
                )}

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <h3 className="text-white font-medium">Configuración de Privacidad</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Anonimizar IP</Label>
                        <p className="text-sm text-gray-400">Cumple con GDPR anonimizando direcciones IP</p>
                      </div>
                      <Switch
                        checked={analyticsSettings.anonymizeIp}
                        onCheckedChange={(checked) =>
                          setAnalyticsSettings({ ...analyticsSettings, anonymizeIp: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Respetar Do Not Track</Label>
                        <p className="text-sm text-gray-400">No rastrear usuarios que han activado DNT</p>
                      </div>
                      <Switch
                        checked={analyticsSettings.respectDoNotTrack}
                        onCheckedChange={(checked) =>
                          setAnalyticsSettings({ ...analyticsSettings, respectDoNotTrack: checked })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Retención de datos (meses)</Label>
                      <Select
                        value={analyticsSettings.dataRetentionMonths.toString()}
                        onValueChange={(value) =>
                          setAnalyticsSettings({ ...analyticsSettings, dataRetentionMonths: Number(value) })
                        }
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="14">14 meses</SelectItem>
                          <SelectItem value="26">26 meses</SelectItem>
                          <SelectItem value="38">38 meses</SelectItem>
                          <SelectItem value="50">50 meses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métricas Personalizadas */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Métricas Personalizadas
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configura qué métricas específicas quieres rastrear
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-white font-medium">Métricas Generales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Ventas y transacciones</Label>
                      <Switch
                        checked={analyticsSettings.trackSales}
                        onCheckedChange={(checked) =>
                          setAnalyticsSettings({ ...analyticsSettings, trackSales: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Descargas de modelos</Label>
                      <Switch
                        checked={analyticsSettings.trackDownloads}
                        onCheckedChange={(checked) =>
                          setAnalyticsSettings({ ...analyticsSettings, trackDownloads: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Trabajos de impresión</Label>
                      <Switch
                        checked={analyticsSettings.trackPrintJobs}
                        onCheckedChange={(checked) =>
                          setAnalyticsSettings({ ...analyticsSettings, trackPrintJobs: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Comportamiento de usuario</Label>
                      <Switch
                        checked={analyticsSettings.trackUserBehavior}
                        onCheckedChange={(checked) =>
                          setAnalyticsSettings({ ...analyticsSettings, trackUserBehavior: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Métricas específicas por rol */}
                {isCreator && (
                  <div className="space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      Métricas de Creador
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Visualizaciones de modelos</Label>
                        <Switch
                          checked={analyticsSettings.creatorMetrics.trackModelViews}
                          onCheckedChange={(checked) =>
                            setAnalyticsSettings({
                              ...analyticsSettings,
                              creatorMetrics: { ...analyticsSettings.creatorMetrics, trackModelViews: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Conversión de ventas</Label>
                        <Switch
                          checked={analyticsSettings.creatorMetrics.trackSalesConversion}
                          onCheckedChange={(checked) =>
                            setAnalyticsSettings({
                              ...analyticsSettings,
                              creatorMetrics: { ...analyticsSettings.creatorMetrics, trackSalesConversion: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Retención de clientes</Label>
                        <Switch
                          checked={analyticsSettings.creatorMetrics.trackCustomerRetention}
                          onCheckedChange={(checked) =>
                            setAnalyticsSettings({
                              ...analyticsSettings,
                              creatorMetrics: { ...analyticsSettings.creatorMetrics, trackCustomerRetention: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Ingresos por modelo</Label>
                        <Switch
                          checked={analyticsSettings.creatorMetrics.trackRevenuePerModel}
                          onCheckedChange={(checked) =>
                            setAnalyticsSettings({
                              ...analyticsSettings,
                              creatorMetrics: { ...analyticsSettings.creatorMetrics, trackRevenuePerModel: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {isPrinter && (
                  <div className="space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Printer className="h-4 w-4" />
                      Métricas de Impresor
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Finalización de trabajos</Label>
                        <Switch
                          checked={analyticsSettings.printerMetrics.trackJobCompletion}
                          onCheckedChange={(checked) =>
                            setAnalyticsSettings({
                              ...analyticsSettings,
                              printerMetrics: { ...analyticsSettings.printerMetrics, trackJobCompletion: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Satisfacción del cliente</Label>
                        <Switch
                          checked={analyticsSettings.printerMetrics.trackCustomerSatisfaction}
                          onCheckedChange={(checked) =>
                            setAnalyticsSettings({
                              ...analyticsSettings,
                              printerMetrics: {
                                ...analyticsSettings.printerMetrics,
                                trackCustomerSatisfaction: checked,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Uso de materiales</Label>
                        <Switch
                          checked={analyticsSettings.printerMetrics.trackMaterialUsage}
                          onCheckedChange={(checked) =>
                            setAnalyticsSettings({
                              ...analyticsSettings,
                              printerMetrics: { ...analyticsSettings.printerMetrics, trackMaterialUsage: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Tiempos de entrega</Label>
                        <Switch
                          checked={analyticsSettings.printerMetrics.trackDeliveryTimes}
                          onCheckedChange={(checked) =>
                            setAnalyticsSettings({
                              ...analyticsSettings,
                              printerMetrics: { ...analyticsSettings.printerMetrics, trackDeliveryTimes: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Eventos Personalizados */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Eventos Personalizados
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configura eventos específicos para rastrear acciones importantes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {analyticsSettings.customEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div>
                        <Label className="text-white">{event.name}</Label>
                        <p className="text-sm text-gray-400">{event.description}</p>
                      </div>
                      <Switch
                        checked={event.enabled}
                        onCheckedChange={(checked) => {
                          const newEvents = [...analyticsSettings.customEvents]
                          newEvents[index].enabled = checked
                          setAnalyticsSettings({ ...analyticsSettings, customEvents: newEvents })
                        }}
                      />
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => {
                    const newEvent = { name: "custom_event", description: "Evento personalizado", enabled: true }
                    setAnalyticsSettings({
                      ...analyticsSettings,
                      customEvents: [...analyticsSettings.customEvents, newEvent],
                    })
                  }}
                  variant="outline"
                  className="border-white/20 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Evento Personalizado
                </Button>
              </CardContent>
            </Card>

            {/* Objetivos y Conversiones */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objetivos y Conversiones
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Define objetivos de negocio y asigna valores a las conversiones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {analyticsSettings.conversionGoals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex-1">
                        <Label className="text-white">{goal.name}</Label>
                        <p className="text-sm text-gray-400">Valor: ${goal.value}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={goal.enabled}
                          onCheckedChange={(checked) => {
                            const newGoals = [...analyticsSettings.conversionGoals]
                            newGoals[index].enabled = checked
                            setAnalyticsSettings({ ...analyticsSettings, conversionGoals: newGoals })
                          }}
                        />
                        <Button variant="outline" size="sm" className="border-white/20 text-white">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reportes y Dashboards */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Reportes y Dashboards
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configura reportes automáticos y dashboards personalizados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-white font-medium">Reportes Automáticos</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Reportes semanales</Label>
                        <p className="text-sm text-gray-400">Recibe un resumen semanal por email</p>
                      </div>
                      <Switch
                        checked={analyticsSettings.weeklyReports}
                        onCheckedChange={(checked) =>
                          setAnalyticsSettings({ ...analyticsSettings, weeklyReports: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Reportes mensuales</Label>
                        <p className="text-sm text-gray-400">Recibe un análisis mensual detallado</p>
                      </div>
                      <Switch
                        checked={analyticsSettings.monthlyReports}
                        onCheckedChange={(checked) =>
                          setAnalyticsSettings({ ...analyticsSettings, monthlyReports: checked })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Email para reportes</Label>
                      <Input
                        value={analyticsSettings.reportEmail}
                        onChange={(e) => setAnalyticsSettings({ ...analyticsSettings, reportEmail: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <h3 className="text-white font-medium">Dashboards Personalizados</h3>
                  <div className="space-y-4">
                    {isCreator && (
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Dashboard de Creador</Label>
                          <p className="text-sm text-gray-400">Métricas específicas para creadores</p>
                        </div>
                        <Switch
                          checked={analyticsSettings.creatorDashboard}
                          onCheckedChange={(checked) =>
                            setAnalyticsSettings({ ...analyticsSettings, creatorDashboard: checked })
                          }
                        />
                      </div>
                    )}

                    {isPrinter && (
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Dashboard de Impresor</Label>
                          <p className="text-sm text-gray-400">Métricas específicas para impresores</p>
                        </div>
                        <Switch
                          checked={analyticsSettings.printerDashboard}
                          onCheckedChange={(checked) =>
                            setAnalyticsSettings({ ...analyticsSettings, printerDashboard: checked })
                          }
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Dashboard de Usuario</Label>
                        <p className="text-sm text-gray-400">Métricas generales de actividad</p>
                      </div>
                      <Switch
                        checked={analyticsSettings.userDashboard}
                        onCheckedChange={(checked) =>
                          setAnalyticsSettings({ ...analyticsSettings, userDashboard: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integraciones Adicionales */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Integraciones Adicionales
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Conecta con otras herramientas de analytics y marketing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Facebook Pixel</Label>
                      <p className="text-sm text-gray-400">Tracking para anuncios de Facebook</p>
                    </div>
                    <Switch
                      checked={analyticsSettings.facebookPixelEnabled}
                      onCheckedChange={(checked) =>
                        setAnalyticsSettings({ ...analyticsSettings, facebookPixelEnabled: checked })
                      }
                    />
                  </div>

                  {analyticsSettings.facebookPixelEnabled && (
                    <div className="space-y-2">
                      <Label className="text-white">ID de Facebook Pixel</Label>
                      <Input
                        value={analyticsSettings.facebookPixelId}
                        onChange={(e) =>
                          setAnalyticsSettings({ ...analyticsSettings, facebookPixelId: e.target.value })
                        }
                        placeholder="123456789012345"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Hotjar</Label>
                      <p className="text-sm text-gray-400">Mapas de calor y grabaciones de sesión</p>
                    </div>
                    <Switch
                      checked={analyticsSettings.hotjarEnabled}
                      onCheckedChange={(checked) =>
                        setAnalyticsSettings({ ...analyticsSettings, hotjarEnabled: checked })
                      }
                    />
                  </div>

                  {analyticsSettings.hotjarEnabled && (
                    <div className="space-y-2">
                      <Label className="text-white">ID de Hotjar</Label>
                      <Input
                        value={analyticsSettings.hotjarId}
                        onChange={(e) => setAnalyticsSettings({ ...analyticsSettings, hotjarId: e.target.value })}
                        placeholder="1234567"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Mixpanel</Label>
                      <p className="text-sm text-gray-400">Analytics avanzado de eventos</p>
                    </div>
                    <Switch
                      checked={analyticsSettings.mixpanelEnabled}
                      onCheckedChange={(checked) =>
                        setAnalyticsSettings({ ...analyticsSettings, mixpanelEnabled: checked })
                      }
                    />
                  </div>

                  {analyticsSettings.mixpanelEnabled && (
                    <div className="space-y-2">
                      <Label className="text-white">Token de Mixpanel</Label>
                      <Input
                        value={analyticsSettings.mixpanelToken}
                        onChange={(e) => setAnalyticsSettings({ ...analyticsSettings, mixpanelToken: e.target.value })}
                        placeholder="abcdef1234567890"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => handleSaveSettings("analytics")}
              className="bg-gradient-to-r from-blue-500 to-purple-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Configuración de Analytics
            </Button>
          </div>
        </TabsContent>

        {/* Añadir el contenido de la pestaña después de la configuración de analytics: */}
        <TabsContent value="templates">
          <NotificationTemplates />
        </TabsContent>

        {/* Configuraciones específicas por rol - Mantener las existentes */}
        {isCreator && (
          <TabsContent value="creator">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Configuración de Tienda
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configura tu tienda y cómo vendes tus modelos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white">Nombre de la tienda</Label>
                    <Input
                      value={creatorSettings.storeName}
                      onChange={(e) => setCreatorSettings({ ...creatorSettings, storeName: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Precio mínimo ($)</Label>
                    <Input
                      type="number"
                      value={creatorSettings.minimumPrice}
                      onChange={(e) => setCreatorSettings({ ...creatorSettings, minimumPrice: Number(e.target.value) })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Descripción de la tienda</Label>
                  <Textarea
                    value={creatorSettings.storeDescription}
                    onChange={(e) => setCreatorSettings({ ...creatorSettings, storeDescription: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={() => handleSaveSettings("creator")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración de Tienda
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isPrinter && (
          <TabsContent value="printer">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Printer className="h-5 w-5" />
                  Configuración de Taller
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configura tu taller de impresión y servicios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white">Nombre del taller</Label>
                    <Input
                      value={printerSettings.workshopName}
                      onChange={(e) => setPrinterSettings({ ...printerSettings, workshopName: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Tiempo de entrega promedio</Label>
                    <Input
                      value={printerSettings.averageDeliveryTime}
                      onChange={(e) => setPrinterSettings({ ...printerSettings, averageDeliveryTime: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => handleSaveSettings("printer")}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración de Taller
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Zona de peligro */}
      <Card className="bg-red-500/10 border-red-400/30">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Zona de Peligro
          </CardTitle>
          <CardDescription className="text-gray-300">
            Acciones irreversibles que afectan permanentemente tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Cuenta
            </Button>
          ) : (
            <div className="space-y-4 p-4 bg-red-500/20 rounded-lg border border-red-400/50">
              <div className="text-red-400 font-medium">¿Estás seguro de que quieres eliminar tu cuenta?</div>
              <p className="text-sm text-gray-300">
                Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos, modelos, pedidos y
                configuraciones.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                  onClick={() => {
                    console.log("Eliminando cuenta...")
                  }}
                >
                  Sí, eliminar mi cuenta
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
