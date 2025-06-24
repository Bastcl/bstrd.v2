"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Clock, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Máximo número de búsquedas recientes a guardar
const MAX_RECENT_SEARCHES = 5

export default function SearchInput({ onSearch, closeMenu = null, className = "" }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState([])
  const [showRecent, setShowRecent] = useState(false)
  const router = useRouter()
  const inputRef = useRef(null)
  const recentSearchesRef = useRef(null)

  // Cargar búsquedas recientes del localStorage al montar el componente
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches))
      } catch (e) {
        console.error("Error parsing recent searches:", e)
        setRecentSearches([])
      }
    }
  }, [])

  // Cerrar el panel de búsquedas recientes al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        recentSearchesRef.current &&
        !recentSearchesRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowRecent(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Guardar una nueva búsqueda en el historial
  const saveSearch = (query) => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return

    // Crear nuevo array de búsquedas recientes
    const updatedSearches = [trimmedQuery, ...recentSearches.filter((item) => item !== trimmedQuery)].slice(
      0,
      MAX_RECENT_SEARCHES,
    )

    // Actualizar estado y localStorage
    setRecentSearches(updatedSearches)
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
  }

  // Eliminar una búsqueda del historial
  const removeSearch = (query, e) => {
    e.stopPropagation() // Evitar que se active la búsqueda al hacer clic en el botón de eliminar
    const updatedSearches = recentSearches.filter((item) => item !== query)
    setRecentSearches(updatedSearches)
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
  }

  // Limpiar todo el historial de búsquedas
  const clearAllSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  // Ejecutar una búsqueda
  const executeSearch = (query) => {
    if (query.trim()) {
      saveSearch(query)
      router.push(`/buscar?q=${encodeURIComponent(query.trim())}`)
      setShowRecent(false)

      if (onSearch) {
        onSearch(query)
      }

      if (closeMenu) {
        closeMenu()
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    executeSearch(searchQuery)
  }

  // Mostrar búsquedas recientes cuando el input recibe el foco
  const handleFocus = () => {
    if (recentSearches.length > 0) {
      setShowRecent(true)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex">
          <Input
            ref={inputRef}
            type="search"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            className="pr-10"
            autoFocus
          />
          <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
            <Search className="h-4 w-4" />
            <span className="sr-only">Buscar</span>
          </Button>
        </div>
      </form>

      {/* Mostrar búsquedas recientes solo cuando showRecent es true */}
      {showRecent && recentSearches.length > 0 && (
        <div
          ref={recentSearchesRef}
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg"
        >
          <div className="p-2 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <span className="text-sm font-medium">Búsquedas recientes</span>
            <Button variant="ghost" size="sm" onClick={clearAllSearches} className="h-8 text-xs">
              Borrar todo
            </Button>
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            {recentSearches.map((query, index) => (
              <li
                key={index}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center justify-between"
                onClick={() => {
                  setSearchQuery(query)
                  executeSearch(query)
                }}
              >
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{query}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => removeSearch(query, e)}>
                  <X className="h-3 w-3" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
