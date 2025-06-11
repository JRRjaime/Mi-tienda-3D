import { CategoryProjects } from "@/components/category-projects"
import { GlobalHeader } from "@/components/global-header"

interface CategoryPageProps {
  params: {
    categoria: string
  }
}

const categoryNames: Record<string, string> = {
  "figuras-coleccion": "Figuras de Colección",
  industrial: "Industrial",
  medico: "Médico",
  joyeria: "Joyería",
  hogar: "Hogar y Decoración",
  educativo: "Educativo",
  automotriz: "Automotriz",
  arte: "Arte y Diseño",
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = categoryNames[params.categoria] || "Categoría"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader title={categoryName} showBackButton backHref="/productos" />

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        <CategoryProjects categoria={params.categoria} />
      </main>
    </div>
  )
}
