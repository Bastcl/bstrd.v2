// Cupones de descuento disponibles
export const availableCoupons = [
  {
    code: "BIENVENIDA10",
    type: "percentage", // porcentaje de descuento
    value: 10, // 10%
    minAmount: 0, // sin mínimo de compra
    description: "10% de descuento en tu primera compra",
    expiryDate: "2025-12-31",
  },
  {
    code: "VERANO20",
    type: "percentage",
    value: 20, // 20%
    minAmount: 50000, // mínimo de compra $50.000
    description: "20% de descuento en compras sobre $50.000",
    expiryDate: "2025-12-31",
  },
  {
    code: "ENVIOGRATIS",
    type: "shipping", // envío gratis
    value: 100, // 100% del envío
    minAmount: 30000, // mínimo de compra $30.000
    description: "Envío gratis en compras sobre $30.000",
    expiryDate: "2025-12-31",
  },
  {
    code: "DESCUENTO5000",
    type: "fixed", // monto fijo
    value: 5000, // $5.000 de descuento
    minAmount: 25000, // mínimo de compra $25.000
    description: "$5.000 de descuento en compras sobre $25.000",
    expiryDate: "2025-12-31",
  },
]

// Función para validar un cupón
export function validateCoupon(code, subtotal) {
  // Convertir a mayúsculas para hacer la comparación insensible a mayúsculas/minúsculas
  const normalizedCode = code.toUpperCase()

  // Buscar el cupón en la lista de cupones disponibles
  const coupon = availableCoupons.find((coupon) => coupon.code.toUpperCase() === normalizedCode)

  // Si no se encuentra el cupón, retornar error
  if (!coupon) {
    return {
      valid: false,
      message: "El cupón no existe",
    }
  }

  // Verificar si el cupón ha expirado
  const currentDate = new Date()
  const expiryDate = new Date(coupon.expiryDate)

  if (currentDate > expiryDate) {
    return {
      valid: false,
      message: "El cupón ha expirado",
    }
  }

  // Verificar si se cumple el monto mínimo de compra
  if (subtotal < coupon.minAmount) {
    return {
      valid: false,
      message: `El monto mínimo para este cupón es $${coupon.minAmount.toLocaleString()}`,
    }
  }

  // Si pasa todas las validaciones, el cupón es válido
  return {
    valid: true,
    coupon,
    message: "Cupón aplicado correctamente",
  }
}

// Función para calcular el descuento
export function calculateDiscount(coupon, subtotal, shippingCost) {
  if (!coupon) return 0

  switch (coupon.type) {
    case "percentage":
      return Math.round((subtotal * coupon.value) / 100)

    case "fixed":
      return Math.min(coupon.value, subtotal) // El descuento no puede ser mayor que el subtotal

    case "shipping":
      return Math.round((shippingCost * coupon.value) / 100)

    default:
      return 0
  }
}
