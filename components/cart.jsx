"use client"

import { useCart } from "@/context/cart-context"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { calculateDiscount } from "@/lib/coupons"
import { Separator } from "@/components/ui/separator"

export default function Cart() {
  const { cartItems, isCartOpen, closeCart, removeFromCart, updateQuantity, subtotal, cartCount, appliedCoupon } =
    useCart()
  const router = useRouter()

  // Calcular descuento si hay un cupón aplicado
  const discount = appliedCoupon ? calculateDiscount(appliedCoupon, subtotal, 0) : 0

  // Total después de aplicar descuentos (no incluye envío)
  const total = subtotal - (appliedCoupon?.type !== "shipping" ? discount : 0)

  const handleCheckout = () => {
    closeCart()
    router.push("/checkout")
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b pb-4 mb-4">
          <SheetTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Carrito de compras ({cartCount})
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
            <ShoppingBag className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
              Parece que aún no has añadido ningún producto a tu carrito de compras.
            </p>
            <Button onClick={closeCart} variant="outline">
              Continuar comprando
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-2">
              <ul className="space-y-4">
                {cartItems.map((item, index) => (
                  <li key={`${item.id}-${item.selectedSize}-${index}`} className="flex py-2 border-b">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
                      <Image
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium">
                        <h3>
                          <Link href={`/producto/${item.id}`} className="hover:underline" onClick={closeCart}>
                            {item.name}
                          </Link>
                        </h3>
                        <p className="ml-4">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      {item.selectedSize && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Talla: {item.selectedSize}</p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-300 dark:border-gray-700">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="px-2 py-1 border-r border-gray-300 dark:border-gray-700"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="px-2 py-1 border-l border-gray-300 dark:border-gray-700"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(index)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-4 mt-auto">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-base">
                  <p>Subtotal</p>
                  <p>${subtotal.toLocaleString()}</p>
                </div>

                {/* Mostrar descuento si hay un cupón aplicado */}
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 text-sm">
                    <div className="flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      <span>Cupón: {appliedCoupon.code}</span>
                    </div>
                    <p>-${discount.toLocaleString()}</p>
                  </div>
                )}

                {appliedCoupon && <Separator />}

                {/* Mostrar total con descuento si hay un cupón aplicado */}
                {appliedCoupon && (
                  <div className="flex justify-between font-medium">
                    <p>Total</p>
                    <p>${total.toLocaleString()}</p>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Envío e impuestos calculados al finalizar la compra.
              </p>
              <div className="space-y-2">
                <Button className="w-full" onClick={handleCheckout}>
                  Finalizar compra
                </Button>
                <Button variant="outline" className="w-full" onClick={closeCart}>
                  Continuar comprando
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
