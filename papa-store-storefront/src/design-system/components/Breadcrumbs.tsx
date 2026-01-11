"use client"

import Link from "next/link"
import { clx } from "@lib/util/clx"

// =============================================================================
// BREADCRUMBS COMPONENT
// Pa-Pa Baby Shop Design System
// =============================================================================

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
}

const DefaultSeparator = () => (
  <svg
    className="w-4 h-4 text-neutral-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export function Breadcrumbs({
  items,
  separator = <DefaultSeparator />,
  className,
}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={clx("flex items-center", className)}>
      <ol className="flex items-center gap-2 text-sm">
        {/* Home link */}
        <li>
          <Link
            href="/"
            className="text-neutral-500 hover:text-primary transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="text-neutral-300">{separator}</span>
            {item.href && index !== items.length - 1 ? (
              <Link
                href={item.href}
                className="text-neutral-500 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
