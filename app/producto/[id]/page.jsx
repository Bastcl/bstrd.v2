// Convertir a componente cliente para manejar estado
"use client"

import { useState, useEffect } from "react"
import { getProductById } from "@/lib/products"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"

export default function ProductPage({ params }) {
  const { id } = params
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    async function loadProduct() {
      const productData = await getProductById(id)
      if (!productData) {
        notFound()
      }
      setProduct(productData)

      // Si el producto tiene solo una talla, seleccionarla automáticamente
      if (productData.sizes && productData.sizes.length === 1) {
        setSelectedSize(productData.sizes[0])
      }

      setLoading(false)
    }

    loadProduct()
  }, [id])

  const handleSizeSelect = (size) => {
    setSelectedSize(size === selectedSize ? null : size)
  }

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <p>Cargando producto...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-900">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xl font-medium mt-2">${product.price.toLocaleString()}</p>

          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Descripción</h2>
            <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-2">Tallas</h2>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`border px-4 py-2 ${
                      selectedSize === size
                        ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                        : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Cantidad</h2>
            <div className="flex items-center border border-gray-300 dark:border-gray-700 inline-flex">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-4 py-2 border-r border-gray-300 dark:border-gray-700"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-6 py-2">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-4 py-2 border-l border-gray-300 dark:border-gray-700"
              >
                +
              </button>
            </div>
          </div>

          <Button
            className="w-full mt-8"
            disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
            onClick={handleAddToCart}
          >
            {product.sizes && product.sizes.length > 0 && !selectedSize ? "Selecciona una talla" : "Agregar al carrito"}
          </Button>
        </div>
      </div>
    </div>
  )
}
