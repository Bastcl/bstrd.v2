"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, CreditCard, Truck, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import CouponForm from "@/components/coupon-form"
import { calculateDiscount } from "@/lib/coupons"

// Regiones de Chile
const regiones = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana de Santiago",
  "Libertador General Bernardo O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
]

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart, appliedCoupon } = useCart()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState("cart")
  const [paymentMethod, setPaymentMethod] = useState("webpay")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    postalCode: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  // Costos de envío
  const shippingCosts = {
    standard: 4990,
    express: 7990,
  }

  // Costo de envío actual
  const shippingCost = shippingMethod ? shippingCosts[shippingMethod] : 0

  // Calcular descuento si hay un cupón aplicado
  const discount = appliedCoupon ? calculateDiscount(appliedCoupon, subtotal, shippingCost) : 0

  // Calcular el costo de envío después de aplicar cupón de envío gratis
  const finalShippingCost =
    appliedCoupon?.type === "shipping" ? shippingCost - Math.min(discount, shippingCost) : shippingCost

  // Total del pedido
  const total = subtotal + finalShippingCost - (appliedCoupon?.type !== "shipping" ? discount : 0)

  // Redirigir a la página de inicio si el carrito está vacío
  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      router.push("/")
    }
  }, [cartItems, router, orderComplete])

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Limpiar error cuando el usuario escribe
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  // Validar el formulario de envío
  const validateShippingForm = () => {
    const errors = {}
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "region"]

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = "Este campo es obligatorio"
      }
    })

    // Validación específica para email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Correo electrónico inválido"
    }

    // Validación específica para teléfono (formato chileno)
    if (formData.phone && !/^(\+?56)?(\s?)(0?9)(\s?)[9876543]\d{7}$/.test(formData.phone)) {
      errors.phone = "Formato de teléfono inválido (ej: +56 9 1234 5678)"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Avanzar al siguiente paso
  const nextStep = () => {
    if (currentStep === "cart") {
      setCurrentStep("shipping")
    } else if (currentStep === "shipping") {
      if (validateShippingForm()) {
        setCurrentStep("payment")
      }
    }
  }

  // Volver al paso anterior
  const prevStep = () => {
    if (currentStep === "shipping") {
      setCurrentStep("cart")
    } else if (currentStep === "payment") {
      setCurrentStep("shipping")
    }
  }

  // Procesar el pago
  const processPayment = async () => {
    setIsSubmitting(true)

    try {
      // Simular procesamiento de pago
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generar número de orden aleatorio
      const randomOrderNumber = Math.floor(100000 + Math.random() * 900000).toString()
      setOrderNumber(randomOrderNumber)
      setOrderComplete(true)
      clearCart() // Limpiar el carrito después de completar la orden
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      // Mostrar mensaje de error
    } finally {
      setIsSubmitting(false)
    }
  }

  // Si la orden está completa, mostrar página de confirmación
  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="border-green-200 dark:border-green-900">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center mb-6">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">¡Gracias por tu compra!</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Tu pedido #{orderNumber} ha sido recibido y está siendo procesado.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Hemos enviado un correo de confirmación a {formData.email}
              </p>
            </div>

            <div className="border rounded-lg p-4 mb-6">
              <h2 className="font-medium mb-2">Detalles del envío:</h2>
              <p>
                {formData.firstName} {formData.lastName}
              </p>
              <p>{formData.address}</p>
              <p>
                {formData.city}, {formData.region}
              </p>
              <p>{formData.postalCode}</p>
              <p>{formData.phone}</p>
            </div>

            <div className="flex justify-center">
              <Button asChild>
                <Link href="/">Volver a la tienda</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>

      {/* Pasos del checkout */}
      <div className="mb-8">
        <Tabs value={currentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cart" disabled={currentStep !== "cart"} className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Carrito</span>
            </TabsTrigger>
            <TabsTrigger value="shipping" disabled={currentStep !== "shipping"} className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Envío</span>
            </TabsTrigger>
            <TabsTrigger value="payment" disabled={currentStep !== "payment"} className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Pago</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cart" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
                <CardDescription>Revisa los productos en tu carrito</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.selectedSize}-${index}`} className="flex py-2 border-b">
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
                        <h3>{item.name}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center mt-1">
                        {item.selectedSize && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mr-4">Talla: {item.selectedSize}</p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400">Cantidad: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p className="font-medium">${subtotal.toLocaleString()}</p>
                  </div>
                </div>

                {/* Formulario de cupón */}
                <div className="mt-6 pt-4 border-t">
                  <CouponForm subtotal={subtotal} shippingCost={shippingCost} />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={nextStep}>
                  Continuar al envío
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de Envío</CardTitle>
                <CardDescription>Ingresa tus datos para el envío</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Tu nombre"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={formErrors.firstName ? "border-red-500" : ""}
                    />
                    {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Tu apellido"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={formErrors.lastName ? "border-red-500" : ""}
                    />
                    {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+56 9 1234 5678"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={formErrors.phone ? "border-red-500" : ""}
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Calle y número"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={formErrors.address ? "border-red-500" : ""}
                  />
                  {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Ciudad"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={formErrors.city ? "border-red-500" : ""}
                    />
                    {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Región</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) => {
                        setFormData({ ...formData, region: value })
                        if (formErrors.region) {
                          setFormErrors({ ...formErrors, region: "" })
                        }
                      }}
                    >
                      <SelectTrigger id="region" className={formErrors.region ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccionar región" />
                      </SelectTrigger>
                      <SelectContent>
                        {regiones.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.region && <p className="text-red-500 text-xs mt-1">{formErrors.region}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    placeholder="Código postal"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2 pt-4">
                  <Label>Método de Envío</Label>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-2">
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="cursor-pointer">
                          Envío Estándar (3-5 días hábiles)
                        </Label>
                      </div>
                      <span className="font-medium">${shippingCosts.standard.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="cursor-pointer">
                          Envío Express (1-2 días hábiles)
                        </Label>
                      </div>
                      <span className="font-medium">${shippingCosts.express.toLocaleString()}</span>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Volver
                </Button>
                <Button onClick={nextStep}>Continuar al pago</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pago</CardTitle>
                  <CardDescription>Selecciona cómo quieres pagar</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem value="webpay" id="webpay" />
                      <Label htmlFor="webpay" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-10 h-6 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold">
                          WP
                        </div>
                        Webpay (Débito/Crédito)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem value="mercadopago" id="mercadopago" />
                      <Label htmlFor="mercadopago" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-10 h-6 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold">
                          MP
                        </div>
                        Mercado Pago
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem value="flow" id="flow" />
                      <Label htmlFor="flow" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-10 h-6 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold">
                          FL
                        </div>
                        Flow
                      </Label>
                    </div>
                  </RadioGroup>

                  <Alert className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Esta es una tienda de demostración. No se realizarán cargos reales.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p>Subtotal</p>
                      <p>${subtotal.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Envío ({shippingMethod === "standard" ? "Estándar" : "Express"})</p>
                      <p>${finalShippingCost.toLocaleString()}</p>
                    </div>

                    {/* Mostrar descuento si hay un cupón aplicado */}
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <p className="flex items-center">
                          Descuento
                          <span className="text-xs ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-0.5 rounded-full">
                            {appliedCoupon.code}
                          </span>
                        </p>
                        <p>-${discount.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <p>Total</p>
                    <p>${total.toLocaleString()}</p>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Al completar tu compra, aceptas nuestros{" "}
                      <Link href="#" className="underline">
                        Términos y Condiciones
                      </Link>{" "}
                      y{" "}
                      <Link href="#" className="underline">
                        Política de Privacidad
                      </Link>
                      .
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Volver
                  </Button>
                  <Button onClick={processPayment} disabled={isSubmitting}>
                    {isSubmitting ? "Procesando..." : "Finalizar Compra"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
