import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/context/cart-context"
import Cart from "@/components/cart"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Catálogo de Moda Minimalista",
  description: "Catálogo de ropa minimalista con diseño en blanco y negro",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white text-black dark:bg-black dark:text-white min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Cart />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
