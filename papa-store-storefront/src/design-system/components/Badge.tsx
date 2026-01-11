"use client"

import { ReactNode } from "react"
import { clx } from "@medusajs/ui"

// =============================================================================
// BADGE COMPONENT
// Pa-Pa Baby Shop Design System
// =============================================================================

export type BadgeVariant = "sale" | "new" | "bestseller" | "lowstock" | "default" | "success" | "warning" | "error" | "info"
export type BadgeSize = "sm" | "md" | "lg"

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  sale: "bg-sale text-white",
  new: "bg-new text-white",
  bestseller: "bg-bestseller text-white",
  lowstock: "bg-lowstock text-white",
  default: "bg-neutral-100 text-neutral-700",
  success: "bg-success-light text-success-dark",
  warning: "bg-warning-light text-warning-dark",
  error: "bg-error-light text-error-dark",
  info: "bg-info-light text-info-dark",
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
}

export function Badge({
  variant = "default",
  size = "md",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={clx(
        "inline-flex items-center font-semibold rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  )
}

// =============================================================================
// PRODUCT BADGE - Positioned badge for product cards
// =============================================================================

interface ProductBadgeProps {
  type: "sale" | "new" | "bestseller" | "lowstock"
  value?: string | number
  position?: "top-left" | "top-right"
  className?: string
}

const badgeLabels: Record<string, string> = {
  sale: "Намаление",
  new: "Ново",
  bestseller: "Бестселър",
  lowstock: "Последни бройки",
}

export function ProductBadge({
  type,
  value,
  position = "top-left",
  className,
}: ProductBadgeProps) {
  const positionStyles = position === "top-left" ? "left-3 top-3" : "right-3 top-3"

  // For sale badge, show percentage if provided
  const label = type === "sale" && value ? `-${value}%` : badgeLabels[type]

  return (
    <Badge
      variant={type}
      size="md"
      className={clx("absolute shadow-sm", positionStyles, className)}
    >
      {label}
    </Badge>
  )
}

// =============================================================================
// STOCK INDICATOR - Shows stock status
// =============================================================================

interface StockIndicatorProps {
  stock: number
  lowStockThreshold?: number
  className?: string
}

export function StockIndicator({
  stock,
  lowStockThreshold = 5,
  className,
}: StockIndicatorProps) {
  if (stock === 0) {
    return (
      <div className={clx("flex items-center gap-2 text-error", className)}>
        <div className="w-2 h-2 rounded-full bg-error" />
        <span className="text-sm font-medium">Изчерпано</span>
      </div>
    )
  }

  if (stock <= lowStockThreshold) {
    return (
      <div className={clx("flex items-center gap-2 text-lowstock", className)}>
        <div className="w-2 h-2 rounded-full bg-lowstock animate-pulse" />
        <span className="text-sm font-medium">Само {stock} в наличност</span>
      </div>
    )
  }

  return (
    <div className={clx("flex items-center gap-2 text-success", className)}>
      <div className="w-2 h-2 rounded-full bg-success" />
      <span className="text-sm font-medium">В наличност</span>
    </div>
  )
}

// =============================================================================
// TAG - For categories, filters, etc.
// =============================================================================

interface TagProps {
  children: ReactNode
  onRemove?: () => void
  color?: "primary" | "secondary" | "mint" | "lavender" | "peach" | "neutral"
  className?: string
}

const tagColorStyles: Record<string, string> = {
  primary: "bg-primary-100 text-primary-700 hover:bg-primary-200",
  secondary: "bg-secondary-100 text-secondary-700 hover:bg-secondary-200",
  mint: "bg-mint-100 text-mint-700 hover:bg-mint-200",
  lavender: "bg-lavender-100 text-lavender-700 hover:bg-lavender-200",
  peach: "bg-peach-100 text-peach-700 hover:bg-peach-200",
  neutral: "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
}

export function Tag({
  children,
  onRemove,
  color = "neutral",
  className,
}: TagProps) {
  return (
    <span
      className={clx(
        "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
        tagColorStyles[color],
        className
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
          aria-label="Премахни"
        >
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  )
}

export default Badge
