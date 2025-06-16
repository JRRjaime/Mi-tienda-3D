import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductGrid } from "@/components/product-grid"
import { getProducts } from "@/lib/shopify"

interface Props {
  params: {
    categoria: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = params

  return {
    title: `Productos - ${categoria}`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { categoria } = params
  const products = await getProducts({ collection: categoria })

  if (!products || products.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4 capitalize">{categoria}</h1>
      <ProductGrid products={products} />
    </div>
  )
}
