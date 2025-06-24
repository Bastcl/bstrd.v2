"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import SearchInput from "./search-input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import CartButton from "./cart-button"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)
  const closeSearch = () => setIsSearchOpen(false)

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-black z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/placeholder.svg?height=40&width=120"
              alt="Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          {/* Navegación para escritorio */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300">
              Inicio
            </Link>
            <Link
              href="/categoria/camisetas"
              className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300"
            >
              Camisetas
            </Link>
            <Link
              href="/categoria/pantalones"
              className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300"
            >
              Pantalones
            </Link>
            <Link
              href="/categoria/accesorios"
              className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300"
            >
              Accesorios
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Búsqueda para escritorio */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Buscar">
                  <Search className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <div className="py-4">
                  <h2 className="text-lg font-medium mb-4">Buscar productos</h2>
                  <SearchInput onSearch={closeSearch} className="w-full" />
                </div>
              </DialogContent>
            </Dialog>

            {/* Botón del carrito */}
            <CartButton />

            {/* Botón de menú hamburguesa (solo móvil) */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Menú"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-black pt-16">
            <div className="container mx-auto px-4">
              <button
                onClick={closeMenu}
                className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                aria-label="Cerrar menú"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Campo de búsqueda en el menú móvil */}
              <div className="mb-6 pt-2">
                <SearchInput closeMenu={closeMenu} />
              </div>

              <nav className="flex flex-col space-y-6 py-4">
                <Link
                  href="/"
                  className="text-xl font-medium hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={closeMenu}
                >
                  Inicio
                </Link>
                <Link
                  href="/categoria/camisetas"
                  className="text-xl font-medium hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={closeMenu}
                >
                  Camisetas
                </Link>
                <Link
                  href="/categoria/pantalones"
                  className="text-xl font-medium hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={closeMenu}
                >
                  Pantalones
                </Link>
                <Link
                  href="/categoria/accesorios"
                  className="text-xl font-medium hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={closeMenu}
                >
                  Accesorios
                </Link>

                {/* Selector de tema dentro del menú móvil */}
                <div className="flex items-center pt-2">
                  <span className="text-xl font-medium mr-4">Tema</span>
                  <ModeToggle />
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
