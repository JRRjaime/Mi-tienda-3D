"use client"

import { SampleProductCard } from "@/components/products/sample-product-card"

const sampleProducts = [
  {
    id: "1",
    name: "Figura de Goku Super Saiyan",
    description: "Increíble figura de Goku en su forma Super Saiyan, perfecta para coleccionistas",
    price: 25.99,
    image: "/images/goku-figure.png",
    creatorName: "AnimeCreator3D",
    creatorId: "creator1",
    category: "Anime",
    tags: ["anime", "goku", "dragon-ball", "figura"],
    type: "printed" as const,
    rating: 4.8,
    downloads: 1250,
  },
  {
    id: "2",
    name: "Jarrón Geométrico Moderno",
    description: "Elegante jarrón con diseño geométrico moderno para decoración",
    price: 15.5,
    image: "/images/geometric-vase.png",
    creatorName: "ModernDesigns",
    creatorId: "creator2",
    category: "Decoración",
    tags: ["decoracion", "jarron", "geometrico", "moderno"],
    type: "download" as const,
    rating: 4.6,
    downloads: 890,
  },
  {
    id: "3",
    name: "Engranaje Industrial",
    description: "Pieza de engranaje industrial de alta precisión para proyectos mecánicos",
    price: 8.99,
    image: "/images/industrial-gear.png",
    creatorName: "TechParts",
    creatorId: "creator3",
    category: "Industrial",
    tags: ["industrial", "engranaje", "mecanico", "precision"],
    type: "printed" as const,
    rating: 4.9,
    downloads: 2100,
  },
  {
    id: "4",
    name: "Organizador de Escritorio",
    description: "Práctico organizador para mantener tu escritorio ordenado y funcional",
    price: 12.75,
    image: "/images/desk-organizer.png",
    creatorName: "OfficeUtils",
    creatorId: "creator4",
    category: "Oficina",
    tags: ["oficina", "organizador", "escritorio", "practico"],
    type: "download" as const,
    rating: 4.4,
    downloads: 650,
  },
]

export default function TestProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Productos de Prueba</h1>
        <p className="text-gray-600">Prueba el carrito con estos productos de ejemplo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sampleProducts.map((product) => (
          <SampleProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}
