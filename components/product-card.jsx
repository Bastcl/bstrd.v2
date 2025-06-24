"use client"

import { useState } from "react"
import Image from "next/image"
import ProductModal from "./product-modal"

export default function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="group cursor-pointer" onClick={() => setIsModalOpen(true)}>
        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-medium">{product.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">${product.price.toLocaleString()}</p>
        </div>
      </div>

      {isModalOpen && <ProductModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </>
  )
}
