"use client"

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, useState } from "react"
import { clx } from "@lib/util/clx"

// =============================================================================
// INPUT COMPONENT
// Pa-Pa Baby Shop Design System
// =============================================================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const hasError = !!error

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clx(
              // Base styles
              "w-full px-4 py-3 text-base font-body",
              "bg-white border-2 rounded-xl",
              "placeholder:text-neutral-400",
              "transition-all duration-200 ease-out",
              // Focus styles
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              // Normal state
              !hasError && [
                "border-neutral-200",
                "hover:border-neutral-300",
                "focus:border-primary focus:ring-primary-200",
              ],
              // Error state
              hasError && [
                "border-error",
                "focus:border-error focus:ring-error-light",
              ],
              // Disabled state
              "disabled:bg-neutral-100 disabled:border-neutral-200 disabled:cursor-not-allowed",
              // Icon padding
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || hint) && (
          <p className={clx(
            "mt-1.5 text-sm",
            error ? "text-error" : "text-neutral-500"
          )}>
            {error || hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

// =============================================================================
// TEXTAREA COMPONENT
// =============================================================================

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const hasError = !!error

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={clx(
            // Base styles
            "w-full px-4 py-3 text-base font-body",
            "bg-white border-2 rounded-xl",
            "placeholder:text-neutral-400",
            "transition-all duration-200 ease-out",
            "resize-y min-h-[120px]",
            // Focus styles
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            // Normal state
            !hasError && [
              "border-neutral-200",
              "hover:border-neutral-300",
              "focus:border-primary focus:ring-primary-200",
            ],
            // Error state
            hasError && [
              "border-error",
              "focus:border-error focus:ring-error-light",
            ],
            // Disabled state
            "disabled:bg-neutral-100 disabled:border-neutral-200 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {(error || hint) && (
          <p className={clx(
            "mt-1.5 text-sm",
            error ? "text-error" : "text-neutral-500"
          )}>
            {error || hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

// =============================================================================
// SEARCH BAR COMPONENT
// =============================================================================

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void
  isLoading?: boolean
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onSearch, isLoading, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400">
          {isLoading ? (
            <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <input
          ref={ref}
          type="search"
          className={clx(
            "w-full pl-12 pr-4 py-3 text-base font-body",
            "bg-neutral-50 border-2 border-transparent rounded-full",
            "placeholder:text-neutral-400",
            "transition-all duration-200 ease-out",
            "focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary-100",
            "hover:bg-neutral-100",
            className
          )}
          placeholder="Търсене на продукти..."
          {...props}
        />
      </div>
    )
  }
)

SearchBar.displayName = "SearchBar"

// =============================================================================
// CHECKBOX COMPONENT - Playful style
// =============================================================================

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  color?: "primary" | "secondary" | "mint" | "lavender"
}

const checkboxColors = {
  primary: {
    checked: "checked:bg-primary checked:border-primary",
    hover: "hover:border-primary-400",
    focus: "focus:ring-primary-200",
  },
  secondary: {
    checked: "checked:bg-secondary checked:border-secondary",
    hover: "hover:border-secondary-400",
    focus: "focus:ring-secondary-200",
  },
  mint: {
    checked: "checked:bg-mint checked:border-mint",
    hover: "hover:border-mint-400",
    focus: "focus:ring-mint-200",
  },
  lavender: {
    checked: "checked:bg-lavender checked:border-lavender",
    hover: "hover:border-lavender-400",
    focus: "focus:ring-lavender-200",
  },
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, color = "primary", className, id, ...props }, ref) => {
    const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`
    const colors = checkboxColors[color]

    return (
      <label
        htmlFor={inputId}
        className="inline-flex items-center gap-3 cursor-pointer select-none group"
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            className={clx(
              "peer appearance-none w-6 h-6",
              "border-2 border-neutral-300 rounded-lg",
              "bg-white transition-all duration-200 ease-out",
              colors.checked,
              colors.hover,
              "checked:scale-100 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              colors.focus,
              "disabled:bg-neutral-100 disabled:border-neutral-200 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          {/* Playful checkmark with bounce animation */}
          <svg
            className={clx(
              "absolute top-1 left-1 w-4 h-4 text-white pointer-events-none",
              "opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100",
              "transition-all duration-200 ease-out"
            )}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        {label && (
          <span className="text-base text-neutral-700 group-hover:text-neutral-900 transition-colors">
            {label}
          </span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = "Checkbox"

// =============================================================================
// RADIO BUTTON COMPONENT - Playful style
// =============================================================================

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  color?: "primary" | "secondary" | "mint" | "lavender"
}

const radioColors = {
  primary: {
    checked: "checked:border-primary",
    dot: "bg-primary",
    hover: "hover:border-primary-400",
    focus: "focus:ring-primary-200",
  },
  secondary: {
    checked: "checked:border-secondary",
    dot: "bg-secondary",
    hover: "hover:border-secondary-400",
    focus: "focus:ring-secondary-200",
  },
  mint: {
    checked: "checked:border-mint",
    dot: "bg-mint",
    hover: "hover:border-mint-400",
    focus: "focus:ring-mint-200",
  },
  lavender: {
    checked: "checked:border-lavender",
    dot: "bg-lavender",
    hover: "hover:border-lavender-400",
    focus: "focus:ring-lavender-200",
  },
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, color = "primary", className, id, ...props }, ref) => {
    const inputId = id || `radio-${Math.random().toString(36).substr(2, 9)}`
    const colors = radioColors[color]

    return (
      <label
        htmlFor={inputId}
        className="inline-flex items-center gap-3 cursor-pointer select-none group"
      >
        <div className="relative">
          <input
            ref={ref}
            type="radio"
            id={inputId}
            className={clx(
              "peer appearance-none w-6 h-6",
              "border-2 border-neutral-300 rounded-full",
              "bg-white transition-all duration-200 ease-out",
              colors.checked,
              colors.hover,
              "active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              colors.focus,
              "disabled:bg-neutral-100 disabled:border-neutral-200 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          {/* Playful inner dot with scale animation */}
          <div
            className={clx(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-3 h-3 rounded-full pointer-events-none",
              colors.dot,
              "opacity-0 scale-0 peer-checked:opacity-100 peer-checked:scale-100",
              "transition-all duration-200 ease-out"
            )}
          />
        </div>
        {label && (
          <span className="text-base text-neutral-700 group-hover:text-neutral-900 transition-colors">
            {label}
          </span>
        )}
      </label>
    )
  }
)

Radio.displayName = "Radio"

// =============================================================================
// QUANTITY SELECTOR COMPONENT
// =============================================================================

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (value > min) onChange(value - 1)
  }

  const increase = () => {
    if (value < max) onChange(value + 1)
  }

  return (
    <div className="inline-flex items-center border-2 border-neutral-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={decrease}
        disabled={disabled || value <= min}
        className={clx(
          "w-10 h-10 flex items-center justify-center",
          "text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200",
          "transition-colors duration-150",
          "disabled:text-neutral-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        )}
        aria-label="Намали количеството"
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value, 10)
          if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            onChange(newValue)
          }
        }}
        disabled={disabled}
        min={min}
        max={max}
        className={clx(
          "w-12 h-10 text-center text-base font-semibold",
          "border-x-2 border-neutral-200 bg-white",
          "focus:outline-none focus:bg-primary-50",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          "disabled:bg-neutral-100 disabled:cursor-not-allowed"
        )}
      />
      <button
        type="button"
        onClick={increase}
        disabled={disabled || value >= max}
        className={clx(
          "w-10 h-10 flex items-center justify-center",
          "text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200",
          "transition-colors duration-150",
          "disabled:text-neutral-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        )}
        aria-label="Увеличи количеството"
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}

// =============================================================================
// SELECT / DROPDOWN COMPONENT
// =============================================================================

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends Omit<InputHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
  onChange?: (value: string) => void
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, onChange, className, id, value, ...props }, ref) => {
    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`
    const hasError = !!error

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={clx(
              // Base styles
              "w-full px-4 py-3 text-base font-body appearance-none",
              "bg-white border-2 rounded-xl",
              "transition-all duration-200 ease-out",
              "cursor-pointer",
              // Focus styles
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              // Normal state
              !hasError && [
                "border-neutral-200",
                "hover:border-neutral-300",
                "focus:border-primary focus:ring-primary-200",
              ],
              // Error state
              hasError && [
                "border-error",
                "focus:border-error focus:ring-error-light",
              ],
              // Disabled state
              "disabled:bg-neutral-100 disabled:border-neutral-200 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        {(error || hint) && (
          <p className={clx(
            "mt-1.5 text-sm",
            error ? "text-error" : "text-neutral-500"
          )}>
            {error || hint}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

export default Input
