"use client"

import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react"
import { clx } from "@lib/util/clx"

// =============================================================================
// BUTTON COMPONENT
// Pa-Pa Baby Shop Design System
// =============================================================================

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link"
export type ButtonSize = "sm" | "md" | "lg" | "xl"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: clx(
    "bg-primary text-white",
    "hover:bg-primary-600 active:bg-primary-700",
    "focus:ring-2 focus:ring-primary-300 focus:ring-offset-2",
    "shadow-sm hover:shadow-primary",
    "disabled:bg-primary-200 disabled:cursor-not-allowed"
  ),
  secondary: clx(
    "bg-secondary text-white",
    "hover:bg-secondary-600 active:bg-secondary-700",
    "focus:ring-2 focus:ring-secondary-300 focus:ring-offset-2",
    "shadow-sm hover:shadow-secondary",
    "disabled:bg-secondary-200 disabled:cursor-not-allowed"
  ),
  outline: clx(
    "bg-transparent border-2 border-primary text-primary",
    "hover:bg-primary-50 active:bg-primary-100",
    "focus:ring-2 focus:ring-primary-300 focus:ring-offset-2",
    "disabled:border-neutral-300 disabled:text-neutral-400 disabled:cursor-not-allowed"
  ),
  ghost: clx(
    "bg-transparent text-neutral-700",
    "hover:bg-neutral-100 active:bg-neutral-200",
    "focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2",
    "disabled:text-neutral-400 disabled:cursor-not-allowed"
  ),
  link: clx(
    "bg-transparent text-primary underline-offset-4",
    "hover:underline hover:text-primary-600",
    "focus:outline-none focus:ring-0",
    "disabled:text-neutral-400 disabled:cursor-not-allowed disabled:no-underline",
    "p-0"
  ),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-4 py-2 text-base rounded-xl gap-2",
  lg: "px-6 py-3 text-lg rounded-xl gap-2",
  xl: "px-8 py-4 text-xl rounded-2xl gap-3",
}

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-5 h-5",
  xl: "w-6 h-6",
}

// Loading spinner component
const Spinner = ({ size }: { size: ButtonSize }) => (
  <svg
    className={clx("animate-spin", iconSizeStyles[size])}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clx(
          // Base styles
          "inline-flex items-center justify-center font-semibold",
          "transition-all duration-200 ease-out",
          "select-none",
          // Variant styles
          variantStyles[variant],
          // Size styles (skip for link variant)
          variant !== "link" && sizeStyles[size],
          // Full width
          fullWidth && "w-full",
          // Custom className
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size={size} />
            <span className="ml-2">{children}</span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className={iconSizeStyles[size]}>{leftIcon}</span>
            )}
            {children}
            {rightIcon && (
              <span className={iconSizeStyles[size]}>{rightIcon}</span>
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

// =============================================================================
// ICON BUTTON COMPONENT
// =============================================================================

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  icon: ReactNode
  "aria-label": string
}

const iconButtonSizeStyles: Record<ButtonSize, string> = {
  sm: "p-1.5 rounded-lg",
  md: "p-2 rounded-xl",
  lg: "p-3 rounded-xl",
  xl: "p-4 rounded-2xl",
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = "ghost",
      size = "md",
      isLoading = false,
      icon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clx(
          // Base styles
          "inline-flex items-center justify-center",
          "transition-all duration-200 ease-out",
          "select-none",
          // Variant styles
          variantStyles[variant],
          // Size styles
          iconButtonSizeStyles[size],
          // Custom className
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Spinner size={size} />
        ) : (
          <span className={iconSizeStyles[size]}>{icon}</span>
        )}
      </button>
    )
  }
)

IconButton.displayName = "IconButton"

// =============================================================================
// ADD TO CART BUTTON - Special variant for product pages
// =============================================================================

interface AddToCartButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  isAdded?: boolean
  size?: ButtonSize
}

export const AddToCartButton = forwardRef<HTMLButtonElement, AddToCartButtonProps>(
  ({ isLoading = false, isAdded = false, size = "lg", className, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="primary"
        size={size}
        isLoading={isLoading}
        disabled={disabled}
        fullWidth
        leftIcon={
          isAdded ? (
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          )
        }
        className={clx(
          isAdded && "!bg-success hover:!bg-green-600 !shadow-success",
          className
        )}
        {...props}
      >
        {isAdded ? "Добавено в кошницата" : "Добави в кошницата"}
      </Button>
    )
  }
)

AddToCartButton.displayName = "AddToCartButton"

export default Button
