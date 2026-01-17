"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { clx } from "@lib/util/clx"
import { Category, getCategories } from "@lib/api"

// =============================================================================
// MEGA MENU COMPONENT - Vertical Dropdowns
// Pa-Pa Baby Shop - Dynamic Category Navigation
// =============================================================================

interface MegaMenuProps {
  className?: string
}

export function MegaMenu({ className }: MegaMenuProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        setIsLoading(false)
      }
    }
    loadCategories()
  }, [])

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null)
    }, 100)
  }

  const handleMouseEnter = (categoryId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setActiveCategory(categoryId)
  }

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
  }

  if (isLoading) {
    return (
      <nav className={clx("hidden lg:flex items-center gap-1", className)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-20 bg-neutral-100 rounded animate-pulse" />
        ))}
      </nav>
    )
  }

  if (error || categories.length === 0) {
    return null
  }

  return (
    <nav className={clx("hidden lg:flex items-center justify-center flex-1 gap-1", className)}>
      {categories.map((category) => (
        <div
          key={category.id}
          className="relative"
          onMouseEnter={() => handleMouseEnter(category.id)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={`/categories/${category.handle}`}
            className={clx(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
              "hover:bg-primary-50 hover:text-primary",
              activeCategory === category.id
                ? "bg-primary-50 text-primary"
                : "text-neutral-700"
            )}
          >
            {category.name}
            {category.children.length > 0 && (
              <svg
                className={clx(
                  "w-3.5 h-3.5 transition-transform duration-150",
                  activeCategory === category.id && "rotate-180"
                )}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </Link>

          {/* Vertical Dropdown */}
          {activeCategory === category.id && category.children.length > 0 && (
            <div
              className="absolute top-full left-0 z-50"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Invisible bridge to prevent gap */}
              <div className="h-2" />
              <div className="bg-white rounded-xl shadow-lg border border-neutral-100 py-2 min-w-[220px]">
                {/* Subcategories */}
                {category.children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/categories/${child.handle}`}
                    className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary transition-colors"
                  >
                    {child.name}
                  </Link>
                ))}

                <div className="border-t border-neutral-100 my-1" />

                {/* View All Link */}
                <Link
                  href={`/categories/${category.handle}`}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary-50 transition-colors"
                >
                  <span>Виж всички</span>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      ))}

    </nav>
  )
}

export default MegaMenu
