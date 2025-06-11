import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductsGrid } from "@/components/products-grid"
import { CategoryProjects } from "@/components/category-projects"
import { ArrowRight, Star, Zap, Shield, Globe, Printer, Palette, DollarSign } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-10" />
        <div className="relative container mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              🚀 Plataforma Líder en Modelos 3D
            </Badge>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              El Futuro de la
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Impresión 3D
              </span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Descubre, compra y vende modelos 3D únicos. Conecta con creadores y makers de todo el mundo en la
              plataforma más avanzada de impresión 3D.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
              >
                <Link href="/productos" className="flex items-center">
                  Explorar Modelos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600"
              >
                <Link href="/auth/register?type=seller" className="flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  Empieza a Vender
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600"
              >
                <Link href="/auth/register?type=printer" className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Gana con tu Impresora 3D
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-cyan-900/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-300 mb-2">50K+</div>
              <div className="text-gray-200">Modelos 3D</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-300 mb-2">15K+</div>
              <div className="text-gray-200">Creadores</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-300 mb-2">100K+</div>
              <div className="text-gray-200">Descargas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-300 mb-2">95%</div>
              <div className="text-gray-200">Satisfacción</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">¿Por qué elegir World 3D?</h2>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto">
              La plataforma más completa para todo lo relacionado con impresión 3D
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-cyan-900/20 border-cyan-500/20 hover:bg-cyan-800/30 transition-colors">
              <CardHeader>
                <Zap className="h-12 w-12 text-cyan-300 mb-4" />
                <CardTitle className="text-white">Búsqueda Inteligente</CardTitle>
                <CardDescription className="text-gray-200">
                  Encuentra exactamente lo que buscas con nuestro sistema de IA avanzado
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-blue-900/20 border-blue-500/20 hover:bg-blue-800/30 transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-300 mb-4" />
                <CardTitle className="text-white">Pagos Seguros</CardTitle>
                <CardDescription className="text-gray-200">
                  Transacciones protegidas con encriptación de nivel bancario
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-purple-900/20 border-purple-500/20 hover:bg-purple-800/30 transition-colors">
              <CardHeader>
                <Globe className="h-12 w-12 text-purple-300 mb-4" />
                <CardTitle className="text-white">Comunidad Global</CardTitle>
                <CardDescription className="text-gray-200">
                  Conecta con makers y creadores de más de 150 países
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-green-900/20 border-green-500/20 hover:bg-green-800/30 transition-colors">
              <CardHeader>
                <Printer className="h-12 w-12 text-green-300 mb-4" />
                <CardTitle className="text-white">Herramientas Pro</CardTitle>
                <CardDescription className="text-gray-200">
                  Suite completa de herramientas para impresores profesionales
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-pink-900/20 border-pink-500/20 hover:bg-pink-800/30 transition-colors">
              <CardHeader>
                <Palette className="h-12 w-12 text-pink-300 mb-4" />
                <CardTitle className="text-white">Colaboración</CardTitle>
                <CardDescription className="text-gray-200">
                  Trabaja en equipo en proyectos 3D con herramientas colaborativas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-yellow-900/20 border-yellow-500/20 hover:bg-yellow-800/30 transition-colors">
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-300 mb-4" />
                <CardTitle className="text-white">Calidad Premium</CardTitle>
                <CardDescription className="text-gray-200">
                  Todos los modelos son verificados por nuestro equipo de expertos
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-blue-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Modelos Destacados</h2>
            <p className="text-gray-200 text-lg">Los modelos más populares y mejor valorados de la semana</p>
          </div>

          <Suspense fallback={<div className="text-center text-white">Cargando productos destacados...</div>}>
            <ProductsGrid />
          </Suspense>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link href="/productos">
                Ver Todos los Modelos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Explora por Categorías</h2>
            <p className="text-gray-200 text-lg">Encuentra modelos 3D para cualquier proyecto</p>
          </div>

          <Suspense fallback={<div className="text-center text-white">Cargando categorías...</div>}>
            <CategoryProjects />
          </Suspense>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">¿Listo para empezar?</h2>
          <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
            Únete a miles de creadores y makers que ya están transformando sus ideas en realidad
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
            >
              Comenzar Gratis
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600"
            >
              <Link href="/auth/register?type=seller">Empieza a Vender</Link>
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600"
            >
              <Link href="/auth/register?type=printer">Gana con tu Impresora 3D</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
