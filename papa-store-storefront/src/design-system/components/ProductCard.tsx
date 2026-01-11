"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { clx } from "@lib/util/clx"
import { ProductBadge, StockIndicator } from "./Badge"
import { IconButton } from "./Button"

// =============================================================================
// PRODUCT CARD COMPONENT
// Pa-Pa Baby Shop Design System
// =============================================================================

export interface ProductCardProps {
  id: string
  handle: string
  title: string
  thumbnail?: string
  images?: string[]
  price: {
    amount: number
    currencyCode: string
  }
  compareAtPrice?: {
    amount: number
    currencyCode: string
  }
  stock?: number
  badge?: "sale" | "new" | "bestseller" | "lowstock"
  badgeValue?: string | number
  rating?: number
  reviewCount?: number
  onAddToCart?: () => void
  onAddToWishlist?: () => void
  className?: string
}

export function ProductCard({
  id,
  handle,
  title,
  thumbnail,
  images,
  price,
  compareAtPrice,
  stock,
  badge,
  badgeValue,
  rating,
  reviewCount,
  onAddToCart,
  onAddToWishlist,
  className,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  // Format price in Bulgarian lev
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("bg-BG", {
      style: "currency",
      currency: currency,
    }).format(amount / 100)
  }

  // Calculate discount percentage
  const discountPercent = compareAtPrice
    ? Math.round((1 - price.amount / compareAtPrice.amount) * 100)
    : 0

  // Determine badge to show
  const displayBadge = badge || (discountPercent > 0 ? "sale" : undefined)
  const displayBadgeValue = badgeValue || (discountPercent > 0 ? discountPercent : undefined)

  // Handle wishlist toggle
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    onAddToWishlist?.()
  }

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.()
  }

  return (
    <div
      className={clx(
        "group relative bg-white rounded-2xl overflow-hidden",
        "transition-all duration-300 ease-out",
        "shadow-card hover:shadow-card-hover",
        "hover:-translate-y-1",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/products/${handle}`} className="block relative aspect-square overflow-hidden bg-neutral-50">
        {/* Product Image */}
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className={clx(
              "object-cover transition-transform duration-500 ease-out",
              "group-hover:scale-105"
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <svg className="w-16 h-16 text-neutral-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2zm16 2l-8 5-8-5v10h16V7z" />
            </svg>
          </div>
        )}

        {/* Secondary Image on Hover */}
        {images && images.length > 1 && (
          <Image
            src={images[1]}
            alt={`${title} - снимка 2`}
            fill
            className={clx(
              "object-cover absolute inset-0 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Badge */}
        {displayBadge && (
          <ProductBadge type={displayBadge} value={displayBadgeValue} />
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={clx(
            "absolute top-3 right-3 p-2 rounded-full",
            "bg-white/90 backdrop-blur-sm shadow-sm",
            "transition-all duration-200",
            "hover:scale-110 hover:bg-white",
            isWishlisted && "text-primary"
          )}
          aria-label={isWishlisted ? "Премахни от любими" : "Добави в любими"}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Quick Add Button */}
        <div
          className={clx(
            "absolute bottom-3 left-3 right-3",
            "transition-all duration-300 ease-out",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
        >
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={clx(
              "w-full py-2.5 px-4 rounded-xl",
              "bg-primary text-white font-semibold text-sm",
              "transition-colors duration-200",
              "hover:bg-primary-600 active:bg-primary-700",
              "disabled:bg-neutral-300 disabled:cursor-not-allowed",
              "shadow-sm"
            )}
          >
            {stock === 0 ? "Изчерпано" : "Добави в кошницата"}
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/products/${handle}`}>
          <h3 className="font-heading font-semibold text-neutral-900 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        {/* Rating */}
        {rating !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={clx(
                    "w-4 h-4",
                    star <= Math.round(rating) ? "text-sunny" : "text-neutral-200"
                  )}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {reviewCount !== undefined && (
              <span className="text-xs text-neutral-500">({reviewCount})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className={clx(
            "font-bold text-lg",
            compareAtPrice ? "text-sale" : "text-neutral-900"
          )}>
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          {compareAtPrice && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </span>
          )}
        </div>

        {/* Stock Indicator */}
        {stock !== undefined && stock <= 5 && (
          <div className="mt-2">
            <StockIndicator stock={stock} lowStockThreshold={5} />
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// PRODUCT CARD SKELETON - Loading state
// =============================================================================

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
      <div className="aspect-square bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
        <div className="h-6 bg-neutral-200 rounded w-1/3" />
      </div>
    </div>
  )
}

// =============================================================================
// PRODUCT GRID - Grid layout for product cards
// =============================================================================

interface ProductGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4 | 5
  className?: string
}

export function ProductGrid({
  children,
  columns = 4,
  className,
}: ProductGridProps) {
  const columnStyles = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  }

  return (
    <div className={clx("grid gap-4 md:gap-6", columnStyles[columns], className)}>
      {children}
    </div>
  )
}

export default ProductCard
