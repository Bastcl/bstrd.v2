"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"

export default function ProductFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [category, setCategory] = useState(searchParams.get("categoria") || "")

  // Usar una referencia para evitar actualizaciones innecesarias
  const isInitialMount = useRef(true)

  // Usamos useCallback para evitar recrear esta función en cada renderizado
  const updateUrl = useCallback(() => {
    // No actualizar la URL en el montaje inicial
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const params = new URLSearchParams()

    if (category) {
      params.set("categoria", category)
    }

    // Comparar con la URL actual para evitar actualizaciones innecesarias
    const newParams = params.toString()
    const currentParams = searchParams.toString()

    if (newParams !== currentParams) {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [category, router, pathname, searchParams])

  // Actualizamos la URL solo cuando los filtros cambian
  useEffect(() => {
    updateUrl()
  }, [updateUrl])

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      
      
      
      
    </div>
  )
}
