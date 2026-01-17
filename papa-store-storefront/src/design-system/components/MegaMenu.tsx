"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { clx } from "@lib/util/clx"
import { Category, getCategories } from "@lib/api"

// =============================================================================
// MEGA MENU - Cascading Flyouts
// Level 2 shows as list, Level 3 flies out to the right on hover
// =============================================================================

interface MegaMenuProps {
  className?: string
}

export function MegaMenu({ className }: MegaMenuProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null)

  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const clearTimeouts = useCallback(() => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
  }, [])

  const handleMouseEnter = useCallback((categoryId: string) => {
    clearTimeouts()
    openTimeoutRef.current = setTimeout(() => {
      setActiveCategory(categoryId)
      setActiveSubcategory(null)
    }, 80)
  }, [clearTimeouts])

  const handleMouseLeave = useCallback(() => {
    clearTimeouts()
    closeTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null)
      setActiveSubcategory(null)
    }, 150)
  }, [clearTimeouts])

  const close = useCallback(() => {
    clearTimeouts()
    setActiveCategory(null)
    setActiveSubcategory(null)
  }, [clearTimeouts])

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        console.error('Failed to load categories:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [close])

  useEffect(() => {
    return () => clearTimeouts()
  }, [clearTimeouts])

  if (isLoading) {
    return (
      <nav className={clx("hidden lg:flex items-center gap-1", className)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-24 bg-neutral-100 rounded-lg animate-pulse" />
        ))}
      </nav>
    )
  }

  if (categories.length === 0) return null

  const currentCategory = categories.find(c => c.id === activeCategory)

  return (
    <nav
      className={clx("hidden lg:flex items-center justify-center flex-1", className)}
      role="menubar"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-0.5">
        {categories.map((category) => {
          const isActive = activeCategory === category.id
          const hasChildren = category.children && category.children.length > 0

          return (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => handleMouseEnter(category.id)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Trigger */}
              <Link
                href={`/categories/${category.handle}`}
                className={clx(
                  "flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-primary-50 hover:text-primary",
                  isActive ? "bg-primary-50 text-primary" : "text-neutral-700"
                )}
              >
                <span>{category.name}</span>
                {hasChildren && (
                  <svg
                    className={clx(
                      "w-3.5 h-3.5 transition-transform duration-200",
                      isActive && "rotate-180"
                    )}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </Link>

              {/* Cascading dropdown */}
              {isActive && hasChildren && (
                <>
                  {/* Bridge */}
                  <div className="absolute left-0 right-0 h-2 top-full" />

                  {/* Level 2 dropdown */}
                  <div
                    className={clx(
                      "absolute top-full left-0 mt-2 z-50",
                      "bg-white rounded-xl shadow-xl border border-neutral-100",
                      "animate-dropdown-in py-2 min-w-[220px]"
                    )}
                  >
                    {category.children.map((subcategory) => {
                      const isSubActive = activeSubcategory === subcategory.id
                      const hasGrandchildren = subcategory.children && subcategory.children.length > 0

                      return (
                        <div
                          key={subcategory.id}
                          className="relative"
                          onMouseEnter={() => setActiveSubcategory(subcategory.id)}
                        >
                          <Link
                            href={`/categories/${subcategory.handle}`}
                            onClick={close}
                            className={clx(
                              "flex items-center justify-between px-4 py-2.5 text-sm transition-all",
                              "hover:bg-neutral-50 hover:text-primary",
                              isSubActive ? "bg-neutral-50 text-primary" : "text-neutral-700"
                            )}
                          >
                            <span>{subcategory.name}</span>
                            {hasGrandchildren && (
                              <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </Link>

                          {/* Level 3 flyout */}
                          {isSubActive && hasGrandchildren && (
                            <>
                              {/* Horizontal bridge */}
                              <div className="absolute top-0 bottom-0 -right-2 w-2" />

                              <div
                                className={clx(
                                  "absolute top-0 left-full ml-2 z-50",
                                  "bg-white rounded-xl shadow-xl border border-neutral-100",
                                  "animate-level3-in py-2 min-w-[200px]"
                                )}
                              >
                                {subcategory.children.map((item) => (
                                  <Link
                                    key={item.id}
                                    href={`/categories/${item.handle}`}
                                    onClick={close}
                                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors"
                                  >
                                    {item.name}
                                  </Link>
                                ))}

                                {/* View all in subcategory */}
                                <div className="mt-2 pt-2 mx-4 border-t border-neutral-100">
                                  <Link
                                    href={`/categories/${subcategory.handle}`}
                                    onClick={close}
                                    className="text-sm text-primary font-medium hover:text-primary-600"
                                  >
                                    Виж всички →
                                  </Link>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })}

                    {/* View all in category */}
                    <div className="mt-2 pt-2 mx-4 border-t border-neutral-100">
                      <Link
                        href={`/categories/${category.handle}`}
                        onClick={close}
                        className="text-sm text-primary font-semibold hover:text-primary-600"
                      >
                        Виж всички в {category.name} →
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}

export default MegaMenu
