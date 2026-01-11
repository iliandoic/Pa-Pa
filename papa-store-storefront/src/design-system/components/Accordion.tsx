"use client"

import { useState, useRef, useEffect } from "react"
import { clx } from "@medusajs/ui"

// =============================================================================
// ACCORDION COMPONENT
// Pa-Pa Baby Shop Design System
// =============================================================================

interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
  icon?: React.ReactNode
  defaultOpen?: boolean
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  variant?: "default" | "bordered" | "separated"
  className?: string
}

export function Accordion({
  items,
  allowMultiple = false,
  variant = "default",
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(
    items.filter((item) => item.defaultOpen).map((item) => item.id)
  )

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId]
      )
    } else {
      setOpenItems((prev) =>
        prev.includes(itemId) ? [] : [itemId]
      )
    }
  }

  const variantClasses = {
    default: {
      container: "divide-y divide-neutral-200",
      item: "",
      header: "py-4",
      content: "pb-4",
    },
    bordered: {
      container: "border border-neutral-200 rounded-2xl divide-y divide-neutral-200 overflow-hidden",
      item: "",
      header: "px-5 py-4 bg-neutral-50",
      content: "px-5 pb-4",
    },
    separated: {
      container: "space-y-3",
      item: "border border-neutral-200 rounded-xl overflow-hidden",
      header: "px-5 py-4",
      content: "px-5 pb-4",
    },
  }

  return (
    <div className={clx(variantClasses[variant].container, className)}>
      {items.map((item) => (
        <AccordionItemComponent
          key={item.id}
          item={item}
          isOpen={openItems.includes(item.id)}
          onToggle={() => toggleItem(item.id)}
          variant={variant}
          variantClasses={variantClasses[variant]}
        />
      ))}
    </div>
  )
}

// =============================================================================
// ACCORDION ITEM COMPONENT (with animation)
// =============================================================================

interface AccordionItemComponentProps {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
  variant: "default" | "bordered" | "separated"
  variantClasses: {
    item: string
    header: string
    content: string
  }
}

function AccordionItemComponent({
  item,
  isOpen,
  onToggle,
  variantClasses,
}: AccordionItemComponentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(
    item.defaultOpen ? undefined : 0
  )

  useEffect(() => {
    if (isOpen) {
      const contentHeight = contentRef.current?.scrollHeight
      setHeight(contentHeight)
      // After animation, set to auto for dynamic content
      const timer = setTimeout(() => setHeight(undefined), 300)
      return () => clearTimeout(timer)
    } else {
      // First set to current height, then to 0
      const contentHeight = contentRef.current?.scrollHeight
      setHeight(contentHeight)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(0)
        })
      })
    }
  }, [isOpen])

  return (
    <div className={variantClasses.item}>
      {/* Header */}
      <button
        onClick={onToggle}
        className={clx(
          "w-full flex items-center justify-between gap-4 text-left",
          "hover:text-primary transition-colors",
          variantClasses.header
        )}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${item.id}`}
      >
        <div className="flex items-center gap-3">
          {item.icon && (
            <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary flex items-center justify-center">
              {item.icon}
            </span>
          )}
          <span className="font-heading font-semibold text-neutral-900">
            {item.title}
          </span>
        </div>
        <svg
          className={clx(
            "w-5 h-5 text-neutral-400 transition-transform duration-300 ease-out",
            isOpen && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Content with smooth animation */}
      <div
        id={`accordion-content-${item.id}`}
        ref={contentRef}
        style={{ height: height !== undefined ? `${height}px` : "auto" }}
        className={clx(
          "overflow-hidden transition-all duration-300 ease-out",
          !isOpen && height === 0 && "invisible"
        )}
      >
        <div
          className={clx(
            "text-neutral-600",
            variantClasses.content,
            "transform transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          {item.content}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// SINGLE ACCORDION ITEM (for custom implementations)
// =============================================================================

interface AccordionSingleProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  icon?: React.ReactNode
  className?: string
}

export function AccordionSingle({
  title,
  children,
  defaultOpen = false,
  icon,
  className,
}: AccordionSingleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0)

  useEffect(() => {
    if (isOpen) {
      const contentHeight = contentRef.current?.scrollHeight
      setHeight(contentHeight)
      const timer = setTimeout(() => setHeight(undefined), 300)
      return () => clearTimeout(timer)
    } else {
      const contentHeight = contentRef.current?.scrollHeight
      setHeight(contentHeight)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(0)
        })
      })
    }
  }, [isOpen])

  return (
    <div className={clx("border border-neutral-200 rounded-xl overflow-hidden", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary flex items-center justify-center">
              {icon}
            </span>
          )}
          <span className="font-heading font-semibold text-neutral-900">{title}</span>
        </div>
        <svg
          className={clx(
            "w-5 h-5 text-neutral-400 transition-transform duration-300 ease-out",
            isOpen && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        ref={contentRef}
        style={{ height: height !== undefined ? `${height}px` : "auto" }}
        className={clx(
          "overflow-hidden transition-all duration-300 ease-out",
          !isOpen && height === 0 && "invisible"
        )}
      >
        <div
          className={clx(
            "px-5 pb-4 text-neutral-600",
            "transform transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Accordion
