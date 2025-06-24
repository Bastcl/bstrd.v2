import { Instagram, Facebook, Twitter } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "./mode-toggle"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Todos los derechos reservados BSTRD Chile. 
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="https://www.instagram.com/bstrd_cl/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <div className="hidden md:block">
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
