"use client"

// Stub for @medusajs/ui components
// These are simple replacements to allow the build to succeed
// TODO: Replace with custom components or a different UI library

import React, { forwardRef, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, TableHTMLAttributes, useState } from "react"

// clx utility - combines class names
type ClassValue = string | number | boolean | undefined | null | ClassValue[]

export function clx(...inputs: ClassValue[]): string {
  const classes: string[] = []
  for (const input of inputs) {
    if (!input) continue
    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      const inner = clx(...input)
      if (inner) classes.push(inner)
    }
  }
  return classes.join(" ")
}

// Basic text components
export const Heading = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement> & { level?: "h1" | "h2" | "h3" }>(
  ({ level = "h2", className, children, ...props }, ref) => {
    const Tag = level
    return <Tag ref={ref} className={clx("font-semibold", className)} {...props}>{children}</Tag>
  }
)
Heading.displayName = "Heading"

export const Text = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement> & { as?: "p" | "span" | "div" }>(
  ({ as: Tag = "p", className, children, ...props }, ref) => (
    <Tag ref={ref as any} className={className} {...props}>{children}</Tag>
  )
)
Text.displayName = "Text"

// Button
export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string; isLoading?: boolean }>(
  ({ className, children, variant, size, isLoading, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={clx(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
        "bg-primary text-white hover:bg-primary/90 disabled:opacity-50",
        className
      )}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  )
)
Button.displayName = "Button"

// Container
export const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clx("container mx-auto px-4", className)} {...props}>
      {children}
    </div>
  )
)
Container.displayName = "Container"

// Input
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string }>(
  ({ className, label, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        ref={ref}
        className={clx(
          "rounded-md border border-gray-300 px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          className
        )}
        {...props}
      />
    </div>
  )
)
Input.displayName = "Input"

// Label
export const Label = forwardRef<HTMLLabelElement, HTMLAttributes<HTMLLabelElement>>(
  ({ className, children, ...props }, ref) => (
    <label ref={ref} className={clx("text-sm font-medium", className)} {...props}>
      {children}
    </label>
  )
)
Label.displayName = "Label"

// Table components
export const Table = forwardRef<HTMLTableElement, TableHTMLAttributes<HTMLTableElement>>(
  ({ className, children, ...props }, ref) => (
    <table ref={ref} className={clx("w-full", className)} {...props}>{children}</table>
  )
)
Table.displayName = "Table"

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, children, ...props }, ref) => (
    <thead ref={ref} className={className} {...props}>{children}</thead>
  )
)
TableHeader.displayName = "Table.Header"

const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, children, ...props }, ref) => (
    <tbody ref={ref} className={className} {...props}>{children}</tbody>
  )
)
TableBody.displayName = "Table.Body"

const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, children, ...props }, ref) => (
    <tr ref={ref} className={className} {...props}>{children}</tr>
  )
)
TableRow.displayName = "Table.Row"

const TableCell = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, children, ...props }, ref) => (
    <td ref={ref} className={className} {...props}>{children}</td>
  )
)
TableCell.displayName = "Table.Cell"

// Attach sub-components
;(Table as any).Header = TableHeader
;(Table as any).Body = TableBody
;(Table as any).Row = TableRow
;(Table as any).Cell = TableCell

// IconButton
export const IconButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clx("inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100", className)}
      {...props}
    >
      {children}
    </button>
  )
)
IconButton.displayName = "IconButton"

// Checkbox
export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string }>(
  ({ className, label, ...props }, ref) => (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input ref={ref} type="checkbox" className={clx("rounded", className)} {...props} />
      {label && <span className="text-sm">{label}</span>}
    </label>
  )
)
Checkbox.displayName = "Checkbox"

// RadioGroup
export const RadioGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} role="radiogroup" className={clx("flex flex-col gap-2", className)} {...props}>
      {children}
    </div>
  )
)
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string }>(
  ({ className, label, ...props }, ref) => (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input ref={ref} type="radio" className={clx("", className)} {...props} />
      {label && <span className="text-sm">{label}</span>}
    </label>
  )
)
RadioGroupItem.displayName = "RadioGroup.Item"

;(RadioGroup as any).Item = RadioGroupItem

// Select
export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={clx(
        "rounded-md border border-gray-300 px-3 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = "Select"

// Badge
export const Badge = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement> & { color?: string }>(
  ({ className, children, color, ...props }, ref) => (
    <span
      ref={ref}
      className={clx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        "bg-gray-100 text-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
)
Badge.displayName = "Badge"

// Tooltip (simplified - just renders children)
export const Tooltip = ({ children }: { children: React.ReactNode; content?: React.ReactNode }) => <>{children}</>
Tooltip.displayName = "Tooltip"

// Toast (simplified - just renders children)
export const Toaster = () => null
export const toast = {
  success: (msg: string) => console.log("Toast success:", msg),
  error: (msg: string) => console.error("Toast error:", msg),
  info: (msg: string) => console.log("Toast info:", msg),
}

// useToggleState hook
export function useToggleState(initial = false): [boolean, () => void, () => void, () => void] {
  const [state, setState] = useState(initial)
  const open = () => setState(true)
  const close = () => setState(false)
  const toggle = () => setState((s) => !s)
  return [state, open, close, toggle]
}

// StatusBadge
export const StatusBadge = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement> & { color?: string }>(
  ({ className, children, color = "grey", ...props }, ref) => (
    <span
      ref={ref}
      className={clx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        color === "green" && "bg-green-100 text-green-800",
        color === "red" && "bg-red-100 text-red-800",
        color === "orange" && "bg-orange-100 text-orange-800",
        color === "grey" && "bg-gray-100 text-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
)
StatusBadge.displayName = "StatusBadge"

// IconBadge
export const IconBadge = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={clx("inline-flex items-center justify-center rounded-full p-1", className)}
      {...props}
    >
      {children}
    </span>
  )
)
IconBadge.displayName = "IconBadge"

// Copy
export const Copy = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { content: string }>(
  ({ content, children, className, ...props }, ref) => {
    const handleCopy = () => {
      navigator.clipboard.writeText(content)
    }
    return (
      <button ref={ref} onClick={handleCopy} className={clx("cursor-pointer", className)} {...props}>
        {children || "Copy"}
      </button>
    )
  }
)
Copy.displayName = "Copy"

// ProgressTabs (simplified)
export const ProgressTabs = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { value?: string; onValueChange?: (value: string) => void }>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clx("", className)} {...props}>{children}</div>
  )
)
ProgressTabs.displayName = "ProgressTabs"

const ProgressTabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clx("flex gap-2", className)} {...props}>{children}</div>
  )
)
ProgressTabsList.displayName = "ProgressTabs.List"

const ProgressTabsTrigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { value: string; status?: string }>(
  ({ className, children, value, status, ...props }, ref) => (
    <button ref={ref} className={clx("px-4 py-2 rounded", className)} {...props}>{children}</button>
  )
)
ProgressTabsTrigger.displayName = "ProgressTabs.Trigger"

const ProgressTabsContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { value: string }>(
  ({ className, children, value, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>{children}</div>
  )
)
ProgressTabsContent.displayName = "ProgressTabs.Content"

;(ProgressTabs as any).List = ProgressTabsList
;(ProgressTabs as any).Trigger = ProgressTabsTrigger
;(ProgressTabs as any).Content = ProgressTabsContent

export default {
  clx,
  Heading,
  Text,
  Button,
  Container,
  Input,
  Label,
  Table,
  IconButton,
  Checkbox,
  RadioGroup,
  Select,
  Badge,
  Tooltip,
  Toaster,
  toast,
  useToggleState,
  StatusBadge,
  Copy,
  ProgressTabs,
}
