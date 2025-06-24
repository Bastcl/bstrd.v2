import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllProducts } from "@/lib/products"

export default async function AdminPage() {
  const products = await getAllProducts()

  // Contar productos por categoría
  const categoryCounts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Agregar Nuevo Producto</CardTitle>
            <CardDescription>Completa el formulario para agregar un nuevo producto al catálogo.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input id="name" placeholder="Nombre del producto" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" placeholder="Descripción del producto" rows={4} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="price">Precio (CLP)</Label>
                  <Input id="price" type="number" placeholder="19990" />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="category">Categoría</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="poleras">Poleras</SelectItem>
                      <SelectItem value="polerones">Polerones</SelectItem>
                      <SelectItem value="pantalones">Pantalones</SelectItem>
                      <SelectItem value="accesorios">Accesorios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="images">Imágenes</Label>
                <Input id="images" type="file" multiple accept="image/*" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Puedes seleccionar múltiples imágenes. La primera será la imagen principal.
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="sizes">Tallas Disponibles</Label>
                <div className="flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <label key={size} className="flex items-center space-x-2">
                      <Input type="checkbox" className="w-4 h-4" id={`size-${size}`} />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Agregar Producto
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
            <CardDescription>Resumen de productos y categorías.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Productos</p>
                <p className="text-3xl font-bold">{products.length}</p>
              </div>

              <div className="border-b pb-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categorías</p>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <p>Poleras</p>
                    <p className="font-medium">{categoryCounts.poleras || 0}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Polerones</p>
                    <p className="font-medium">{categoryCounts.polerones || 0}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Pantalones</p>
                    <p className="font-medium">{categoryCounts.pantalones || 0}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Accesorios</p>
                    <p className="font-medium">{categoryCounts.accesorios || 0}</p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Ver Todos los Productos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
