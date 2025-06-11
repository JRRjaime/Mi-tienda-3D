import { ProductsGrid } from "@/components/products-grid"
import { GlobalHeader } from "@/components/global-header"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader title="World 3D - Productos" showBackButton backHref="/" />

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Explora Nuestro Catálogo
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Descubre miles de modelos 3D, desde figuras coleccionables hasta herramientas prácticas. Usa nuestra
            búsqueda avanzada para encontrar exactamente lo que necesitas.
          </p>
        </div>

        <ProductsGrid />
      </main>
    </div>
  )
}
