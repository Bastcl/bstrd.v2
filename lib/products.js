import productsData from "@/data/products.json"

// Función para obtener todos los productos
export async function getAllProducts() {
  try {
    // Usamos el archivo JSON local
    return productsData
  } catch (error) {
    console.error("Error al cargar productos:", error)
    return []
  }
}

// Función para obtener un producto por ID
export async function getProductById(id) {
  try {
    const products = await getAllProducts()
    return products.find((product) => product.id === id) || null
  } catch (error) {
    console.error("Error al cargar el producto:", error)
    return null
  }
}

// Función para obtener productos por categoría
export async function getProductsByCategory(category) {
  try {
    const products = await getAllProducts()
    return products.filter((product) => product.category.toLowerCase() === category.toLowerCase())
  } catch (error) {
    console.error("Error al cargar productos por categoría:", error)
    return []
  }
}
