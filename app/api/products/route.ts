import { NextResponse } from "next/server"
import type { Product } from "@/types/product"

// GET /api/products - Obtener todos los productos
export async function GET() {
  try {
    // En producción, esto leería de un archivo JSON real
    // Para desarrollo, usamos datos de ejemplo de lib/products.ts
    const { getAllProducts } = await import("@/lib/products")
    const products = await getAllProducts()

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al cargar productos" }, { status: 500 })
  }
}

// POST /api/products - Crear un nuevo producto
export async function POST(request: Request) {
  try {
    const product = await request.json()

    // Validar datos del producto
    if (!product.name || !product.price || !product.category || !product.images) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // En producción, esto escribiría en un archivo JSON real o base de datos
    // Para desarrollo, solo simulamos la creación
    const newProduct: Product = {
      id: Date.now().toString(),
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category,
      images: product.images,
      sizes: product.sizes || [],
      addedDate: new Date().toISOString(),
    }

    return NextResponse.json({ message: "Producto creado", product: newProduct }, { status: 201 })
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
