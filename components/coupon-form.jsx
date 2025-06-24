"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tag, X, Check } from "lucide-react"
import { calculateDiscount } from "@/lib/coupons"

export default function CouponForm({ subtotal, shippingCost }) {
  const { appliedCoupon, couponMessage, applyCoupon, removeCoupon } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [isApplying, setIsApplying] = useState(false)

  // Calcular el descuento si hay un cupón aplicado
  const discount = appliedCoupon ? calculateDiscount(appliedCoupon, subtotal, shippingCost) : 0

  const handleApplyCoupon = async (e) => {
    e.preventDefault()
    if (!couponCode.trim()) return

    setIsApplying(true)

    // Simular una pequeña demora para dar feedback visual
    await new Promise((resolve) => setTimeout(resolve, 500))

    const success = applyCoupon(couponCode.trim())

    if (success) {
      setCouponCode("")
    }

    setIsApplying(false)
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    setCouponCode("")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Tag className="mr-2 h-4 w-4" />
        <h3 className="text-sm font-medium">Cupón de descuento</h3>
      </div>

      {appliedCoupon ? (
        <div className="border rounded-md p-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <span className="font-medium mr-2">{appliedCoupon.code}</span>
                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs px-2 py-0.5 rounded-full flex items-center">
                  <Check className="h-3 w-3 mr-1" />
                  Aplicado
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{appliedCoupon.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRemoveCoupon} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
              <span className="sr-only">Eliminar cupón</span>
            </Button>
          </div>

          {discount > 0 && (
            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
              Ahorro: ${discount.toLocaleString()}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleApplyCoupon} className="flex space-x-2">
          <div className="flex-1">
            <Input
              id="couponCode"
              placeholder="Ingresa tu código"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full"
            />
            {couponMessage.text && (
              <p
                className={`text-xs mt-1 ${
                  couponMessage.type === "error"
                    ? "text-red-500"
                    : couponMessage.type === "success"
                      ? "text-green-500"
                      : "text-gray-500"
                }`}
              >
                {couponMessage.text}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isApplying || !couponCode.trim()}>
            {isApplying ? "Aplicando..." : "Aplicar"}
          </Button>
        </form>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>Cupones disponibles para prueba:</p>
        <ul className="list-disc list-inside mt-1">
          <li>BIENVENIDA10: 10% de descuento</li>
          <li>VERANO20: 20% en compras sobre $50.000</li>
          <li>ENVIOGRATIS: Envío gratis en compras sobre $30.000</li>
          <li>DESCUENTO5000: $5.000 de descuento en compras sobre $25.000</li>
        </ul>
      </div>
    </div>
  )
}
