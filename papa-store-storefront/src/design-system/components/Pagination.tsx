"use client"

import { clx } from "@medusajs/ui"

// =============================================================================
// PAGINATION COMPONENT
// Pa-Pa Baby Shop Design System
// =============================================================================

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  showFirstLast?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  size = "md",
  className,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "...")[] = []

    // Always show first page
    pages.push(1)

    // Calculate range around current page
    const leftSibling = Math.max(currentPage - siblingCount, 2)
    const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1)

    // Add ellipsis after first page if needed
    if (leftSibling > 2) {
      pages.push("...")
    }

    // Add pages around current page
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i)
      }
    }

    // Add ellipsis before last page if needed
    if (rightSibling < totalPages - 1) {
      pages.push("...")
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const sizeClasses = {
    sm: "h-8 min-w-8 text-sm",
    md: "h-10 min-w-10 text-base",
    lg: "h-12 min-w-12 text-lg",
  }

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) {
    return null
  }

  return (
    <nav
      aria-label="Pagination"
      className={clx("flex items-center justify-center gap-1", className)}
    >
      {/* First Page Button */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={clx(
            "flex items-center justify-center rounded-lg",
            "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
            "transition-colors",
            sizeClasses[size]
          )}
          aria-label="Първа страница"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={clx(
          "flex items-center justify-center rounded-lg",
          "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
          "transition-colors",
          sizeClasses[size]
        )}
        aria-label="Предишна страница"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => (
        <span key={index}>
          {page === "..." ? (
            <span className={clx("flex items-center justify-center text-neutral-400", sizeClasses[size])}>
              ...
            </span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={clx(
                "flex items-center justify-center rounded-lg font-medium transition-all",
                sizeClasses[size],
                currentPage === page
                  ? "bg-primary text-white shadow-primary"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              {page}
            </button>
          )}
        </span>
      ))}

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={clx(
          "flex items-center justify-center rounded-lg",
          "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
          "transition-colors",
          sizeClasses[size]
        )}
        aria-label="Следваща страница"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Last Page Button */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={clx(
            "flex items-center justify-center rounded-lg",
            "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
            "transition-colors",
            sizeClasses[size]
          )}
          aria-label="Последна страница"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  )
}

// =============================================================================
// SIMPLE PAGINATION (Previous/Next only)
// =============================================================================

interface SimplePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageInfo?: boolean
  className?: string
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageInfo = true,
  className,
}: SimplePaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={clx("flex items-center justify-between gap-4", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={clx(
          "flex items-center gap-2 px-4 py-2 rounded-xl",
          "text-neutral-700 hover:bg-neutral-100",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
          "transition-colors font-medium"
        )}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Предишна
      </button>

      {showPageInfo && (
        <span className="text-neutral-500 text-sm">
          Страница <span className="font-medium text-neutral-900">{currentPage}</span> от{" "}
          <span className="font-medium text-neutral-900">{totalPages}</span>
        </span>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={clx(
          "flex items-center gap-2 px-4 py-2 rounded-xl",
          "text-neutral-700 hover:bg-neutral-100",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
          "transition-colors font-medium"
        )}
      >
        Следваща
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

// =============================================================================
// LOAD MORE BUTTON (Alternative to pagination)
// =============================================================================

interface LoadMoreButtonProps {
  onClick: () => void
  isLoading?: boolean
  hasMore: boolean
  loadedCount: number
  totalCount: number
  className?: string
}

export function LoadMoreButton({
  onClick,
  isLoading = false,
  hasMore,
  loadedCount,
  totalCount,
  className,
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <p className={clx("text-center text-neutral-500 text-sm", className)}>
        Показани са всички {totalCount} продукта
      </p>
    )
  }

  return (
    <div className={clx("flex flex-col items-center gap-3", className)}>
      <p className="text-neutral-500 text-sm">
        Показани {loadedCount} от {totalCount} продукта
      </p>
      <button
        onClick={onClick}
        disabled={isLoading}
        className={clx(
          "px-6 py-3 rounded-xl font-medium",
          "bg-neutral-100 text-neutral-700",
          "hover:bg-neutral-200 active:bg-neutral-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors"
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Зареждане...
          </span>
        ) : (
          `Покажи още (${totalCount - loadedCount})`
        )}
      </button>
    </div>
  )
}

export default Pagination
