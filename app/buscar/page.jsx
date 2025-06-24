"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import ProductGrid from "@/components/product-grid"
import { getAllProducts } from "@/lib/products"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function searchProducts() {
      setLoading(true)

      try {
        // Obtener todos los productos
        const allProducts = await getAllProducts()

        // Filtrar productos según la consulta de búsqueda
        const filteredProducts = allProducts.filter((product) => {
          const searchTerm = query.toLowerCase()
          return (
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
          )
        })

        setProducts(filteredProducts)
      } catch (error) {
        console.error("Error al buscar productos:", error)
      } finally {
        setLoading(false)
      }
    }

    searchProducts()
  }, [query])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Resultados de búsqueda</h1>
      <p className="text-center mb-8 text-gray-600 dark:text-gray-400">
        {query ? `Mostrando resultados para "${query}"` : "Busca productos por nombre, descripción o categoría"}
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <p>Buscando productos...</p>
        </div>
      ) : products.length > 0 ? (
        <ProductGrid initialProducts={products} />
      ) : (
        <div className="text-center py-12">
          <p className="text-lg mb-2">No se encontraron productos que coincidan con tu búsqueda.</p>
          <p className="text-gray-600 dark:text-gray-400">
            Intenta con otros términos o navega por nuestras categorías.
          </p>
        </div>
      )}
    </div>
  )
}
