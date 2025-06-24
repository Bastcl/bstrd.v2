"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import ProductZoom from "./product-zoom"
import { useCart } from "@/context/cart-context"

export default function ProductModal({ product, isOpen, onClose }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    // Si el producto tiene tallas y solo hay una, seleccionarla automáticamente
    if (product.sizes && product.sizes.length === 1) {
      setSelectedSize(product.sizes[0])
    }
  }, [product.sizes])

  const handleSizeSelect = (size) => {
    setSelectedSize(size === selectedSize ? null : size)
  }

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize)
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl p-0 overflow-auto sm:rounded-lg w-full max-h-[90vh]">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-900">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover cursor-zoom-in"
                sizes="(max-width: 768px) 100vw, 50vw"
                onClick={() => setIsZoomOpen(true)}
              />

              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        selectedImage === index ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedImage(index)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-medium mt-2 sm:mt-0">{product.name}</h2>
              <p className="text-base sm:text-lg font-bold mt-1 sm:mt-2">${product.price.toLocaleString()}</p>

              <div className="mt-3 sm:mt-4">
                <h3 className="text-sm font-medium">Descripción</h3>
                <p className="mt-1 sm:mt-2 text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <h3 className="text-sm font-medium mb-2">Tallas</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`px-3 py-2 min-w-[40px] text-center text-sm border transition-colors ${
                          selectedSize === size
                            ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                        aria-pressed={selectedSize === size}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {selectedSize && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Talla seleccionada: <span className="font-medium">{selectedSize}</span>
                    </p>
                  )}
                </div>
              )}

              <div className="mt-4 sm:mt-6">
                <h3 className="text-sm font-medium mb-2">Cantidad</h3>
                <div className="flex items-center border border-gray-300 dark:border-gray-700 inline-flex">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-2 border-r border-gray-300 dark:border-gray-700"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-2 border-l border-gray-300 dark:border-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                className="w-full mt-4 sm:mt-8"
                disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
                onClick={handleAddToCart}
              >
                {product.sizes && product.sizes.length > 0 && !selectedSize
                  ? "Selecciona una talla"
                  : "Agregar al carrito"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ProductZoom
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        imageUrl={product.images[selectedImage]}
        productName={product.name}
      />
    </>
  )
}
