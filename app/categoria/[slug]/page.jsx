import { getProductsByCategory } from "@/lib/products"
import ProductGrid from "@/components/product-grid"
import ProductFilters from "@/components/product-filters"

export default async function CategoryPage({ params }) {
  const { slug } = params
  const products = await getProductsByCategory(slug)

  // Capitalizar primera letra de la categoría
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{categoryName}</h1>

      <ProductFilters />

      <ProductGrid initialProducts={products} />
    </div>
  )
}
