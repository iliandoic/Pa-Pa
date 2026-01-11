"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { clx } from "@medusajs/ui"

// =============================================================================
// CAROUSEL COMPONENT
// Pa-Pa Baby Shop Design System
// =============================================================================

interface CarouselProps {
  children: React.ReactNode[]
  showArrows?: boolean
  showDots?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  loop?: boolean
  slidesToShow?: number
  gap?: number
  className?: string
}

export function Carousel({
  children,
  showArrows = true,
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  loop = true,
  slidesToShow = 1,
  gap = 16,
  className,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const totalSlides = children.length
  const maxIndex = Math.max(0, totalSlides - slidesToShow)

  const goToSlide = useCallback((index: number) => {
    if (loop) {
      if (index < 0) {
        setCurrentIndex(maxIndex)
      } else if (index > maxIndex) {
        setCurrentIndex(0)
      } else {
        setCurrentIndex(index)
      }
    } else {
      setCurrentIndex(Math.max(0, Math.min(index, maxIndex)))
    }
  }, [loop, maxIndex])

  const goToPrevious = useCallback(() => {
    goToSlide(currentIndex - 1)
  }, [currentIndex, goToSlide])

  const goToNext = useCallback(() => {
    goToSlide(currentIndex + 1)
  }, [currentIndex, goToSlide])

  // Auto-play
  useEffect(() => {
    if (autoPlay && !isHovered) {
      const interval = setInterval(goToNext, autoPlayInterval)
      return () => clearInterval(interval)
    }
  }, [autoPlay, autoPlayInterval, isHovered, goToNext])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToPrevious, goToNext])

  return (
    <div
      className={clx("relative group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
            gap: `${gap}px`,
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `calc(${100 / slidesToShow}% - ${(gap * (slidesToShow - 1)) / slidesToShow}px)` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > slidesToShow && (
        <>
          <button
            onClick={goToPrevious}
            disabled={!loop && currentIndex === 0}
            className={clx(
              "absolute left-2 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 rounded-full bg-white/90 shadow-lg",
              "flex items-center justify-center",
              "text-neutral-700 hover:text-primary hover:bg-white",
              "transition-all duration-200",
              "opacity-0 group-hover:opacity-100",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
            aria-label="Предишен"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            disabled={!loop && currentIndex === maxIndex}
            className={clx(
              "absolute right-2 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 rounded-full bg-white/90 shadow-lg",
              "flex items-center justify-center",
              "text-neutral-700 hover:text-primary hover:bg-white",
              "transition-all duration-200",
              "opacity-0 group-hover:opacity-100",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
            aria-label="Следващ"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {showDots && totalSlides > slidesToShow && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={clx(
                "w-2 h-2 rounded-full transition-all duration-200",
                currentIndex === index
                  ? "bg-primary w-6"
                  : "bg-neutral-300 hover:bg-neutral-400"
              )}
              aria-label={`Отиди на слайд ${index + 1}`}
              aria-current={currentIndex === index ? "true" : "false"}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// IMAGE GALLERY (Product image gallery with thumbnails)
// =============================================================================

interface ImageGalleryProps {
  images: { url: string; alt?: string }[]
  className?: string
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-neutral-100 rounded-2xl flex items-center justify-center">
        <span className="text-neutral-400">Няма снимка</span>
      </div>
    )
  }

  return (
    <div className={clx("flex flex-col gap-4", className)}>
      {/* Main Image */}
      <div
        className="relative aspect-square bg-neutral-50 rounded-2xl overflow-hidden cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={images[selectedIndex].url}
          alt={images[selectedIndex].alt || "Снимка на продукт"}
          fill
          className={clx(
            "object-contain transition-transform duration-300",
            isZoomed && "scale-150 cursor-zoom-out"
          )}
          priority
        />

        {/* Navigation arrows for main image */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center text-neutral-700 hover:bg-white hover:text-primary transition-colors"
              aria-label="Предишна снимка"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center text-neutral-700 hover:bg-white hover:text-primary transition-colors"
              aria-label="Следваща снимка"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={clx(
                "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                selectedIndex === index
                  ? "border-primary"
                  : "border-transparent hover:border-neutral-300"
              )}
            >
              <Image
                src={image.url}
                alt={image.alt || `Миниатюра ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// HERO CAROUSEL (Full-width hero banner slider)
// =============================================================================

interface HeroSlide {
  image: string
  title: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  align?: "left" | "center" | "right"
}

interface HeroCarouselProps {
  slides: HeroSlide[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

export function HeroCarousel({
  slides,
  autoPlay = true,
  autoPlayInterval = 6000,
  className,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length)
      }, autoPlayInterval)
      return () => clearInterval(interval)
    }
  }, [autoPlay, autoPlayInterval, slides.length])

  const alignClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }

  return (
    <div className={clx("relative w-full h-[400px] md:h-[500px] overflow-hidden", className)}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={clx(
            "absolute inset-0 transition-opacity duration-700",
            currentIndex === index ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Background Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

          {/* Content */}
          <div className={clx(
            "absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-3xl",
            alignClasses[slide.align || "left"]
          )}>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-lg md:text-xl text-white/90 mb-6">
                {slide.subtitle}
              </p>
            )}
            {slide.buttonText && slide.buttonHref && (
              <a
                href={slide.buttonHref}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors w-fit"
              >
                {slide.buttonText}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={clx(
              "w-2 h-2 rounded-full transition-all duration-200",
              currentIndex === index
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Отиди на слайд ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel
