"use client"

import { useState, useEffect, useMemo } from "react"
import ProductCard from "./product-card"
import { useSearchParams } from "next/navigation"

export default function ProductGrid({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts)
  const searchParams = useSearchParams()

  // Convertir searchParams a una cadena para usarla como dependencia
  const searchParamsString = useMemo(() => {
    return searchParams.toString()
  }, [searchParams])

  useEffect(() => {
    // Evitar actualizaciones innecesarias
    let filteredProducts = [...initialProducts]

    // Filtrar por categoría si existe
    const category = searchParams.get("categoria")
    if (category) {
      filteredProducts = filteredProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase())
    }

    // Comparar productos actuales con los nuevos filtrados
    const currentProductsJson = JSON.stringify(products)
    const newProductsJson = JSON.stringify(filteredProducts)

    // Solo actualizar si realmente hay cambios
    if (currentProductsJson !== newProductsJson) {
      setProducts(filteredProducts)
    }
  }, [initialProducts, searchParamsString])

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No se encontraron productos con los filtros seleccionados.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
