"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GlobalHeader } from "@/components/global-header"
import { ProductsGrid } from "@/components/products-grid"
import { ImageCarousel } from "@/components/image-carousel"
import { Search, Star, TrendingUp, Users, Zap } from "lucide-react"

const categories = [
  {
    id: "figuras",
    name: "Figuras",
    description: "Personajes y coleccionables",
    image: "/images/3d-art.png",
    count: "2,847 modelos",
    trending: true,
  },
  {
    id: "hogar",
    name: "Hogar",
    description: "Decoración y utilidades",
    image: "/images/3d-prototype.png",
    count: "1,923 modelos",
    trending: false,
  },
  {
    id: "industrial",
    name: "Industrial",
    description: "Piezas y herramientas",
    image: "/images/3d-automotive.png",
    count: "1,456 modelos",
    trending: true,
  },
  {
    id: "joyeria",
    name: "Joyería",
    description: "Accesorios personalizados",
    image: "/images/3d-jewelry.png",
    count: "892 modelos",
    trending: false,
  },
  {
    id: "medico",
    name: "Médico",
    description: "Dispositivos y prótesis",
    image: "/images/3d-medical.png",
    count: "634 modelos",
    trending: true,
  },
]

const featuredImages = [
  "/images/goku-figure.png",
  "/images/geometric-vase.png",
  "/images/industrial-gear.png",
  "/images/custom-ring.png",
  "/images/drone-prototype.png",
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <>
      <GlobalHeader />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl mx-4" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              El futuro de la
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                impresión 3D
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Descubre miles de modelos 3D únicos, conecta con creadores talentosos y da vida a tus ideas con la mejor
              tecnología de impresión.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar modelos 3D, creadores, categorías..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-2xl"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl">
                  Buscar
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-white/80">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">50K+</div>
                <div className="text-sm">Modelos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">12K+</div>
                <div className="text-sm">Creadores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">200K+</div>
                <div className="text-sm">Descargas</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Carousel */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Modelos Destacados</h2>
            <ImageCarousel images={featuredImages} />
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Explora por Categorías</h2>
              <p className="text-gray-300 text-lg">Encuentra exactamente lo que necesitas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link key={category.id} href={`/productos/${category.id}`}>
                  <Card className="group hover:scale-105 transition-all duration-300 bg-white/5 border-white/10 hover:bg-white/10">
                    <CardContent className="p-6">
                      <div className="relative mb-4">
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {category.trending && (
                          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                      <p className="text-gray-400 mb-3">{category.description}</p>
                      <p className="text-cyan-400 font-medium">{category.count}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Products */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">Más Populares</h2>
              <Link href="/productos">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Ver todos
                </Button>
              </Link>
            </div>
            <ProductsGrid limit={6} />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">¿Por qué elegirnos?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Calidad Premium</h3>
                <p className="text-gray-400">Todos los modelos son verificados por nuestro equipo de expertos</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Comunidad Activa</h3>
                <p className="text-gray-400">Conecta con miles de creadores y entusiastas de todo el mundo</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Descarga Instantánea</h3>
                <p className="text-gray-400">Accede a tus modelos inmediatamente después de la compra</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl p-12">
              <h2 className="text-4xl font-bold text-white mb-4">¿Listo para crear?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Únete a nuestra comunidad y comienza a vender tus modelos 3D hoy mismo
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-lg px-8 py-3">
                  Comenzar a Vender
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-3">
                  Explorar Modelos
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3D</span>
                  </div>
                  <span className="font-bold text-white">World 3D</span>
                </div>
                <p className="text-gray-400">La plataforma líder para modelos 3D y servicios de impresión.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Explorar</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/productos" className="hover:text-white transition-colors">
                      Todos los Modelos
                    </Link>
                  </li>
                  <li>
                    <Link href="/productos/figuras" className="hover:text-white transition-colors">
                      Figuras
                    </Link>
                  </li>
                  <li>
                    <Link href="/productos/hogar" className="hover:text-white transition-colors">
                      Hogar
                    </Link>
                  </li>
                  <li>
                    <Link href="/productos/industrial" className="hover:text-white transition-colors">
                      Industrial
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Comunidad</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/creadores" className="hover:text-white transition-colors">
                      Creadores
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/foro" className="hover:text-white transition-colors">
                      Foro
                    </Link>
                  </li>
                  <li>
                    <Link href="/eventos" className="hover:text-white transition-colors">
                      Eventos
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Soporte</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/ayuda" className="hover:text-white transition-colors">
                      Centro de Ayuda
                    </Link>
                  </li>
                  <li>
                    <Link href="/contacto" className="hover:text-white transition-colors">
                      Contacto
                    </Link>
                  </li>
                  <li>
                    <Link href="/terminos" className="hover:text-white transition-colors">
                      Términos
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacidad" className="hover:text-white transition-colors">
                      Privacidad
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 World 3D. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
