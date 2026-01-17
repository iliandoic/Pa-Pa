"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { clx } from "@lib/util/clx"
import { Category, getCategories } from "@lib/api"

// =============================================================================
// MOBILE MENU COMPONENT
// Pa-Pa Baby Shop - Mobile Category Navigation
// =============================================================================

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Failed to load categories:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadCategories()
  }, [])

  if (!isOpen) return null

  return (
    <div className="lg:hidden bg-white border-t border-neutral-100 animate-fade-in-top">
      <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-neutral-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {categories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center">
                  <Link
                    href={`/categories/${category.handle}`}
                    onClick={onClose}
                    className="flex-1 flex items-center px-4 py-3 rounded-xl text-base font-semibold font-heading hover:bg-primary-50 hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                  {category.children.length > 0 && (
                    <button
                      onClick={() => setExpandedCategory(
                        expandedCategory === category.id ? null : category.id
                      )}
                      className="p-3 hover:bg-neutral-50 rounded-xl transition-colors"
                      aria-label={expandedCategory === category.id ? "Скрий" : "Покажи"}
                    >
                      <svg
                        className={clx(
                          "w-5 h-5 text-neutral-400 transition-transform",
                          expandedCategory === category.id && "rotate-90"
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                {expandedCategory === category.id && category.children.length > 0 && (
                  <div className="ml-4 mt-1 space-y-1 animate-fade-in-top">
                    {category.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/categories/${child.handle}`}
                        onClick={onClose}
                        className="block px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-primary-50 hover:text-primary transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Sale Link */}
            <Link
              href="/sale"
              onClick={onClose}
              className="flex items-center px-4 py-3 rounded-xl text-base font-semibold font-heading text-sale hover:bg-red-50 transition-colors"
            >
              Разпродажба
            </Link>
          </>
        )}

        {/* Mobile Account Links */}
        <div className="border-t border-neutral-100 pt-4 mt-4">
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50"
          >
            <svg className="w-5 h-5 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold font-heading">Моят акаунт</span>
          </Link>
          <Link
            href="/wishlist"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50"
          >
            <svg className="w-5 h-5 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold font-heading">Любими</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default MobileMenu
