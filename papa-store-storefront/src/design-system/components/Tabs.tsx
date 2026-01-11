"use client"

import { useState } from "react"
import { clx } from "@lib/util/clx"

// =============================================================================
// TABS COMPONENT
// Pa-Pa Baby Shop Design System
// =============================================================================

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  variant?: "underline" | "pills" | "boxed"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  className?: string
  onChange?: (tabId: string) => void
}

export function Tabs({
  tabs,
  defaultTab,
  variant = "underline",
  size = "md",
  fullWidth = false,
  className,
  onChange,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-2.5",
  }

  const variantClasses = {
    underline: {
      container: "border-b border-neutral-200",
      tab: (isActive: boolean) =>
        clx(
          "relative font-heading font-medium transition-colors",
          "hover:text-primary",
          isActive
            ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
            : "text-neutral-500"
        ),
    },
    pills: {
      container: "bg-neutral-100 p-1 rounded-xl",
      tab: (isActive: boolean) =>
        clx(
          "font-heading font-medium rounded-lg transition-all",
          isActive
            ? "bg-white text-primary shadow-sm"
            : "text-neutral-600 hover:text-neutral-900"
        ),
    },
    boxed: {
      container: "gap-2",
      tab: (isActive: boolean) =>
        clx(
          "font-heading font-medium rounded-xl border-2 transition-all",
          isActive
            ? "border-primary bg-primary-50 text-primary"
            : "border-neutral-200 text-neutral-600 hover:border-primary-200 hover:text-primary"
        ),
    },
  }

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div
        className={clx(
          "flex",
          fullWidth && "w-full",
          variantClasses[variant].container
        )}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => handleTabClick(tab.id)}
            className={clx(
              sizeClasses[size],
              variantClasses[variant].tab(activeTab === tab.id),
              fullWidth && "flex-1",
              tab.disabled && "opacity-50 cursor-not-allowed",
              "flex items-center justify-center gap-2"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={tab.id}
            hidden={activeTab !== tab.id}
            className={clx(
              "animate-fade-in-top",
              activeTab !== tab.id && "hidden"
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// SIMPLE TAB LIST (for custom implementations)
// =============================================================================

interface TabListProps {
  children: React.ReactNode
  variant?: "underline" | "pills" | "boxed"
  className?: string
}

export function TabList({ children, variant = "underline", className }: TabListProps) {
  const containerClasses = {
    underline: "border-b border-neutral-200",
    pills: "bg-neutral-100 p-1 rounded-xl",
    boxed: "gap-2",
  }

  return (
    <div className={clx("flex", containerClasses[variant], className)} role="tablist">
      {children}
    </div>
  )
}

interface TabButtonProps {
  isActive?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

export function TabButton({ isActive, onClick, children, className }: TabButtonProps) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={clx(
        "px-4 py-2 font-heading font-medium transition-colors relative",
        "hover:text-primary",
        isActive
          ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
          : "text-neutral-500",
        className
      )}
    >
      {children}
    </button>
  )
}

export default Tabs
