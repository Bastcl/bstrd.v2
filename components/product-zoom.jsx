"use client"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function ProductZoom({ isOpen, onClose, imageUrl, productName }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const containerRef = useRef(null)

  // Reset zoom when image changes
  useEffect(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [imageUrl])

  const handleMouseMove = (e) => {
    if (scale <= 1) return

    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate position as percentage of container
    const xPercent = (x / rect.width) * 100
    const yPercent = (y / rect.height) * 100

    // Calculate offset based on zoom level
    const xOffset = (50 - xPercent) * (scale - 1)
    const yOffset = (50 - yPercent) * (scale - 1)

    setPosition({ x: xOffset, y: yOffset })
  }

  const handleWheel = (e) => {
    e.preventDefault()

    // Adjust scale based on wheel direction
    const newScale =
      e.deltaY < 0
        ? Math.min(scale + 0.5, 4) // Zoom in (max 4x)
        : Math.max(scale - 0.5, 1) // Zoom out (min 1x)

    setScale(newScale)

    // Reset position if zooming out to 1x
    if (newScale <= 1) {
      setPosition({ x: 0, y: 0 })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <div
          ref={containerRef}
          className="relative w-full h-[80vh] bg-gray-100 dark:bg-gray-900 overflow-hidden cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
        >
          <div
            className="absolute inset-0 transition-transform duration-100"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: `${50 + position.x}% ${50 + position.y}%`,
              backgroundSize: `${scale * 100}%`,
              backgroundRepeat: "no-repeat",
            }}
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-black/80 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-black z-10"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-center bg-white/80 dark:bg-black/80 py-2 px-4 rounded text-sm">
            <p>Usa la rueda del mouse para hacer zoom. Mueve el cursor para navegar por la imagen.</p>
            <p className="font-medium mt-1">{productName}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
