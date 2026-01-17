"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { clx } from "@lib/util/clx"
import { SearchBar } from "./Input"
import { IconButton } from "./Button"
import { MegaMenu } from "./MegaMenu"
import { MobileMenu } from "./MobileMenu"

// =============================================================================
// HEADER COMPONENT
// Pa-Pa Baby Shop Design System
// =============================================================================

interface HeaderProps {
  logo?: React.ReactNode
  cartItemCount?: number
  isLoggedIn?: boolean
  onSearch?: (query: string) => void
  className?: string
}

export function Header({
  logo,
  cartItemCount = 0,
  isLoggedIn = false,
  onSearch,
  className,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false)
        setIsSearchOpen(false)
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  return (
    <header
      className={clx("bg-white sticky top-0 z-50 shadow-sm", className)}
      style={{ '--header-height': '104px' } as React.CSSProperties}
    >
      {/* Top Bar - Promo Banner */}
      <div className="bg-primary text-white text-center py-2 px-4 text-sm font-medium">
        <p>🎉 Безплатна доставка за поръчки над 80 лв! 🎉</p>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-neutral-600 hover:text-neutral-900"
            aria-label="Меню"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            {logo || (
              <>
                <Image
                  src="/logo.png"
                  alt="Pa-Pa Baby Shop"
                  width={56}
                  height={56}
                  className="h-12 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform"
                  priority
                />
                <div className="hidden sm:flex flex-col">
                  <span className="font-display font-bold text-2xl text-primary leading-tight">
                    Па-Па
                  </span>
                  <span className="text-xs text-neutral-500 font-medium -mt-0.5">
                    Бебешки Магазин
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation - Mega Menu */}
          <MegaMenu className="mx-4" />

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search - Desktop */}
            <div className="hidden xl:block w-48">
              <SearchBar
                placeholder="Търсене..."
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>

            {/* Search - Mobile Toggle */}
            <IconButton
              aria-label="Търсене"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              icon={
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              }
            />

            {/* User Account */}
            <IconButton
              aria-label="Акаунт"
              icon={
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              }
            />

            {/* Wishlist */}
            <IconButton
              aria-label="Любими"
              className="hidden sm:flex"
              icon={
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              }
            />

            {/* Cart */}
            <div className="relative">
              <IconButton
                aria-label="Кошница"
                variant="primary"
                icon={
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                }
              />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden pb-4 animate-fade-in-top">
            <SearchBar
              placeholder="Търсене на продукти..."
              onChange={(e) => onSearch?.(e.target.value)}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  )
}

// =============================================================================
// CATEGORY BAR - Secondary navigation for categories
// =============================================================================

interface CategoryBarProps {
  categories: { label: string; href: string; icon?: React.ReactNode }[]
  className?: string
}

export function CategoryBar({ categories, className }: CategoryBarProps) {
  return (
    <div className={clx("bg-neutral-50 border-b border-neutral-100", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <Link
              key={category.label}
              href={category.href}
              className={clx(
                "flex items-center gap-2 px-4 py-2 rounded-full",
                "bg-white border border-neutral-200",
                "text-sm font-semibold font-heading text-neutral-700",
                "hover:border-primary hover:text-primary hover:bg-primary-50",
                "transition-colors whitespace-nowrap"
              )}
            >
              {category.icon && <span className="w-4 h-4">{category.icon}</span>}
              {category.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Header
