"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const images = [
  {
    src: "/images/3d-prototype.png",
    alt: "Impresión 3D de prototipo mecánico",
    title: "Prototipos Industriales",
  },
  {
    src: "/images/3d-art.png",
    alt: "Figura decorativa impresa en 3D",
    title: "Arte y Decoración",
  },
  {
    src: "/images/3d-medical.png",
    alt: "Pieza médica impresa en 3D",
    title: "Aplicaciones Médicas",
  },
  {
    src: "/images/3d-automotive.png",
    alt: "Componente automotriz 3D",
    title: "Sector Automotriz",
  },
  {
    src: "/images/3d-jewelry.png",
    alt: "Joyería impresa en 3D",
    title: "Joyería Personalizada",
  },
]

export function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Card className="overflow-hidden bg-white/10 backdrop-blur-sm border-white/20">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                index === currentIndex
                  ? "translate-x-0"
                  : index < currentIndex
                    ? "-translate-x-full"
                    : "translate-x-full"
              }`}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl md:text-2xl font-semibold drop-shadow-lg">{image.title}</h3>
              </div>
            </div>
          ))}

          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Dots indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex ? "bg-cyan-400 w-6" : "bg-white/40"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
