"use client"

import { useState, useEffect, createContext, useContext, useCallback } from "react"
import { createPortal } from "react-dom"
import { clx } from "@medusajs/ui"

// =============================================================================
// TOAST COMPONENT
// Pa-Pa Baby Shop Design System
// =============================================================================

type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

// =============================================================================
// TOAST PROVIDER
// =============================================================================

interface ToastProviderProps {
  children: React.ReactNode
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"
}

export function ToastProvider({ children, position = "top-right" }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {mounted &&
        createPortal(
          <div
            className={clx(
              "fixed z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none",
              positionClasses[position]
            )}
          >
            {toasts.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  )
}

// =============================================================================
// TOAST ITEM
// =============================================================================

interface ToastItemProps {
  toast: Toast
  onClose: () => void
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  useEffect(() => {
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration, onClose])

  const typeStyles = {
    success: {
      bg: "bg-success-light",
      border: "border-success",
      icon: (
        <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bg: "bg-error-light",
      border: "border-error",
      icon: (
        <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    warning: {
      bg: "bg-warning-light",
      border: "border-warning",
      icon: (
        <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      bg: "bg-info-light",
      border: "border-info",
      icon: (
        <svg className="w-5 h-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  }

  const style = typeStyles[toast.type]

  return (
    <div
      className={clx(
        "pointer-events-auto w-full bg-white rounded-xl shadow-lg border-l-4 p-4",
        "animate-fade-in-right",
        style.border
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={clx("flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center", style.bg)}>
          {style.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-semibold text-neutral-900">{toast.title}</p>
          {toast.message && <p className="text-sm text-neutral-600 mt-0.5">{toast.message}</p>}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          aria-label="Затвори"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// USE TOAST HOOK
// =============================================================================

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  const { addToast, removeToast } = context

  return {
    success: (title: string, message?: string, duration?: number) =>
      addToast({ type: "success", title, message, duration }),
    error: (title: string, message?: string, duration?: number) =>
      addToast({ type: "error", title, message, duration }),
    warning: (title: string, message?: string, duration?: number) =>
      addToast({ type: "warning", title, message, duration }),
    info: (title: string, message?: string, duration?: number) =>
      addToast({ type: "info", title, message, duration }),
    dismiss: removeToast,
  }
}

// =============================================================================
// STANDALONE TOAST (for simple use without provider)
// =============================================================================

interface StandaloneToastProps {
  type: ToastType
  title: string
  message?: string
  isVisible: boolean
  onClose: () => void
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
}

export function StandaloneToast({
  type,
  title,
  message,
  isVisible,
  onClose,
  position = "top-right",
}: StandaloneToastProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isVisible) return null

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  }

  return createPortal(
    <div className={clx("fixed z-50 max-w-sm w-full", positionClasses[position])}>
      <ToastItem toast={{ id: "standalone", type, title, message }} onClose={onClose} />
    </div>,
    document.body
  )
}

export default ToastProvider
