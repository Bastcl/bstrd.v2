import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner principal */}
      <div className="relative w-full h-[60vh] mb-8 overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Colección Minimalista"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 text-white p-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">Colección Minimalista</h1>
          <p className="text-lg md:text-xl mb-6 text-center max-w-2xl">
            Descubre nuestra nueva colección con diseños minimalistas y elegantes.
          </p>
          <Link
            href="/categoria/poleras"
            className="bg-white text-black px-6 py-3 rounded-none hover:bg-gray-100 transition-colors"
          >
            Ver Colección
          </Link>
        </div>
      </div>

      {/* Banners de categorías */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-12">
        {/* Banner Camisetas */}
        <CategoryBanner
          title="Poleras"
          description="Diseños minimalistas para tu día a día"
          imageUrl="/placeholder.svg?height=800&width=600"
          href="/categoria/poleras"
        />

        {/* Banner Pantalones */}
        <CategoryBanner
          title="Pantalones"
          description="Comodidad y estilo en cada prenda"
          imageUrl="/placeholder.svg?height=800&width=600"
          href="/categoria/pantalones"
        />

        {/* Banner Accesorios */}
        <CategoryBanner
          title="Accesorios"
          description="Complementos que marcan la diferencia"
          imageUrl="/placeholder.svg?height=800&width=600"
          href="/categoria/accesorios"
        />
      </div>

      {/* Banner promocional */}
      <div className="relative w-full h-[40vh] mb-12 overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Image src="/placeholder.svg?height=800&width=1600" alt="Promoción especial" fill className="object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-white p-4">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center">Nueva Colección de Temporada</h2>
          <p className="text-lg mb-6 text-center max-w-xl">
            Descubre las últimas tendencias en moda minimalista con nuestra nueva colección.
          </p>
          <Link
            href="/categoria/poleras"
            className="bg-white text-black px-6 py-3 rounded-none hover:bg-gray-100 transition-colors"
          >
            Comprar Ahora
          </Link>
        </div>
      </div>
    </div>
  )
}

// Componente para los banners de categorías
function CategoryBanner({ title, description, imageUrl, href }) {
  return (
    <Link href={href} className="group block relative h-[400px] overflow-hidden bg-gray-100 dark:bg-gray-900">
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300 p-4">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white text-center">{description}</p>
      </div>
    </Link>
  )
}
