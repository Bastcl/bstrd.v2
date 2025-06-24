"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { validateCoupon } from "@/lib/coupons"

// Definir el contexto del carrito
const CartContext = createContext()

// Hook personalizado para usar el contexto del carrito
export function useCart() {
  return useContext(CartContext)
}

// Proveedor del contexto del carrito
export function CartProvider({ children }) {
  // Estado para los items del carrito
  const [cartItems, setCartItems] = useState([])
  // Estado para controlar si el carrito está abierto
  const [isCartOpen, setIsCartOpen] = useState(false)
  // Estado para controlar si el carrito está inicializado
  const [isInitialized, setIsInitialized] = useState(false)
  // Estado para el cupón aplicado
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  // Estado para el mensaje del cupón
  const [couponMessage, setCouponMessage] = useState({ text: "", type: "" })

  // Cargar el carrito desde localStorage al montar el componente
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
        setCartItems([])
      }
    }

    // Cargar cupón aplicado si existe
    const storedCoupon = localStorage.getItem("appliedCoupon")
    if (storedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(storedCoupon))
      } catch (error) {
        console.error("Error parsing coupon from localStorage:", error)
      }
    }

    setIsInitialized(true)
  }, [])

  // Guardar el carrito en localStorage cuando cambia
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isInitialized])

  // Guardar el cupón en localStorage cuando cambia
  useEffect(() => {
    if (isInitialized && appliedCoupon) {
      localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon))
    } else if (isInitialized) {
      localStorage.removeItem("appliedCoupon")
    }
  }, [appliedCoupon, isInitialized])

  // Añadir un producto al carrito
  const addToCart = (product, quantity = 1, selectedSize = null) => {
    setCartItems((prevItems) => {
      // Verificar si el producto ya está en el carrito con la misma talla
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.selectedSize === selectedSize,
      )

      if (existingItemIndex !== -1) {
        // Si el producto ya existe, actualizar la cantidad
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // Si el producto no existe, añadirlo al carrito
        return [...prevItems, { ...product, quantity, selectedSize }]
      }
    })

    // Abrir el carrito automáticamente al añadir un producto
    setIsCartOpen(true)
  }

  // Eliminar un producto del carrito
  const removeFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index))
  }

  // Actualizar la cantidad de un producto en el carrito
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return

    setCartItems((prevItems) => {
      const updatedItems = [...prevItems]
      updatedItems[index].quantity = newQuantity
      return updatedItems
    })
  }

  // Vaciar el carrito
  const clearCart = () => {
    setCartItems([])
    setAppliedCoupon(null)
    setCouponMessage({ text: "", type: "" })
  }

  // Aplicar un cupón de descuento
  const applyCoupon = (code) => {
    // Validar el cupón
    const result = validateCoupon(code, subtotal)

    if (result.valid) {
      setAppliedCoupon(result.coupon)
      setCouponMessage({ text: result.message, type: "success" })
      return true
    } else {
      setAppliedCoupon(null)
      setCouponMessage({ text: result.message, type: "error" })
      return false
    }
  }

  // Eliminar el cupón aplicado
  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponMessage({ text: "Cupón eliminado", type: "info" })
  }

  // Calcular el total de productos en el carrito
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Calcular el subtotal del carrito
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // Abrir el carrito
  const openCart = () => setIsCartOpen(true)

  // Cerrar el carrito
  const closeCart = () => setIsCartOpen(false)

  // Valores y funciones que se proporcionarán a través del contexto
  const value = {
    cartItems,
    cartCount,
    subtotal,
    isCartOpen,
    appliedCoupon,
    couponMessage,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    applyCoupon,
    removeCoupon,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
