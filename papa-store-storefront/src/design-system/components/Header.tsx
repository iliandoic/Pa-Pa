"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { clx } from "@medusajs/ui"
import { SearchBar } from "./Input"
import { IconButton } from "./Button"

// =============================================================================
// HEADER COMPONENT
// Pa-Pa Baby Shop Design System
// =============================================================================

interface NavItem {
  label: string
  href: string
  children?: {
    label: string
    href: string
    description?: string
    icon?: React.ReactNode
  }[]
  featured?: {
    title: string
    href: string
    image: string
  }
}

interface HeaderProps {
  logo?: React.ReactNode
  navItems?: NavItem[]
  cartItemCount?: number
  isLoggedIn?: boolean
  onSearch?: (query: string) => void
  className?: string
}

// Default navigation items for demo
const defaultNavItems: NavItem[] = [
  {
    label: "Дрехи",
    href: "/categories/clothes",
    children: [
      { label: "Бодита", href: "/categories/bodysuits", description: "0-24 месеца" },
      { label: "Пижами", href: "/categories/pajamas", description: "Меки и удобни" },
      { label: "Рокли", href: "/categories/dresses", description: "За малки принцеси" },
      { label: "Панталони", href: "/categories/pants", description: "За активни бебета" },
      { label: "Блузи и тениски", href: "/categories/tops", description: "Ежедневни и празнични" },
      { label: "Комплекти", href: "/categories/sets", description: "Всичко в един пакет" },
      { label: "Якета и горнища", href: "/categories/jackets", description: "За студените дни" },
      { label: "Шапки и аксесоари", href: "/categories/accessories", description: "Завършващи детайли" },
    ],
  },
  {
    label: "Играчки",
    href: "/categories/toys",
    children: [
      { label: "Плюшени играчки", href: "/categories/plush", description: "Меки приятели" },
      { label: "Образователни", href: "/categories/educational", description: "Учене чрез игра" },
      { label: "Музикални", href: "/categories/musical", description: "Звуци и мелодии" },
      { label: "За баня", href: "/categories/bath-toys", description: "Забавление във водата" },
      { label: "Конструктори", href: "/categories/blocks", description: "Строй и създавай" },
      { label: "Кукли и фигурки", href: "/categories/dolls", description: "За ролеви игри" },
      { label: "Превозни средства", href: "/categories/vehicles", description: "Колички и влакчета" },
    ],
  },
  {
    label: "Хранене",
    href: "/categories/feeding",
    children: [
      { label: "Бебешки шишета", href: "/categories/bottles", description: "За кърмачета" },
      { label: "Биберони и залъгалки", href: "/categories/pacifiers", description: "Успокояващи" },
      { label: "Детски съдове", href: "/categories/dishes", description: "Чинии и купички" },
      { label: "Прибори", href: "/categories/cutlery", description: "Лъжички и виличи" },
      { label: "Столчета за хранене", href: "/categories/high-chairs", description: "Удобни и безопасни" },
      { label: "Лигавници", href: "/categories/bibs", description: "Защита при хранене" },
    ],
  },
  {
    label: "Грижа",
    href: "/categories/care",
    children: [
      { label: "Пелени", href: "/categories/diapers", description: "За всяка възраст" },
      { label: "Мокри кърпички", href: "/categories/wipes", description: "Нежни и хипоалергенни" },
      { label: "Козметика", href: "/categories/cosmetics", description: "Кремове и лосиони" },
      { label: "Къпане", href: "/categories/bathing", description: "Вани и аксесоари" },
      { label: "Здраве", href: "/categories/health", description: "Термометри и грижа" },
      { label: "Безопасност", href: "/categories/safety", description: "Защита в дома" },
    ],
  },
  {
    label: "Спане",
    href: "/categories/sleep",
    children: [
      { label: "Кошари и легла", href: "/categories/cribs", description: "Сладки сънища" },
      { label: "Матраци", href: "/categories/mattresses", description: "Комфорт и подкрепа" },
      { label: "Спално бельо", href: "/categories/bedding", description: "Чаршафи и одеяла" },
      { label: "Спални чувалчета", href: "/categories/sleeping-bags", description: "Топло и уютно" },
      { label: "Нощни лампи", href: "/categories/night-lights", description: "Мека светлина" },
    ],
  },
  {
    label: "Разходка",
    href: "/categories/strollers",
    children: [
      { label: "Колички", href: "/categories/strollers-main", description: "За всяка нужда" },
      { label: "Столчета за кола", href: "/categories/car-seats", description: "Безопасно пътуване" },
      { label: "Раници и кенгура", href: "/categories/carriers", description: "Близост с бебето" },
      { label: "Чанти за памперси", href: "/categories/diaper-bags", description: "Организация навън" },
    ],
  },
  {
    label: "Разпродажба",
    href: "/sale",
  },
]

export function Header({
  logo,
  navItems = defaultNavItems,
  cartItemCount = 0,
  isLoggedIn = false,
  onSearch,
  className,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Close dropdown with delay (for better UX)
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setActiveDropdown(label)
  }

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
    <header className={clx("bg-white sticky top-0 z-50 shadow-sm", className)}>
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 mx-4 flex-1 min-w-0">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href}
                  className={clx(
                    "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold font-heading transition-colors whitespace-nowrap",
                    "hover:bg-primary-50 hover:text-primary",
                    item.label === "Разпродажба" && "text-sale hover:bg-red-50",
                    activeDropdown === item.label && "bg-primary-50 text-primary"
                  )}
                >
                  {item.label}
                  {item.children && (
                    <svg
                      className={clx(
                        "w-4 h-4 transition-transform duration-200",
                        activeDropdown === item.label && "rotate-180"
                      )}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.children && activeDropdown === item.label && (
                  <>
                    {/* Invisible bridge to prevent dropdown from closing */}
                    <div className="absolute top-full left-0 h-2 w-full" />
                    <div
                      className={clx(
                        "absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl",
                        "border border-neutral-100 py-2 z-50",
                        "max-h-[70vh] overflow-y-auto",
                        "animate-dropdown-in"
                      )}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
                        >
                          {child.icon && (
                            <span className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary">
                              {child.icon}
                            </span>
                          )}
                          <div>
                            <p className="font-semibold font-heading text-neutral-900">{child.label}</p>
                            {child.description && (
                              <p className="text-sm text-neutral-500">{child.description}</p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search - Desktop */}
            <div className="hidden lg:block w-64">
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
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 animate-fade-in-top">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clx(
                    "flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold font-heading",
                    "hover:bg-primary-50 hover:text-primary transition-colors",
                    item.label === "Разпродажба" && "text-sale"
                  )}
                >
                  {item.label}
                  {item.children && (
                    <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>
              </div>
            ))}

            {/* Mobile Account Links */}
            <div className="border-t border-neutral-100 pt-4 mt-4">
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50"
              >
                <svg className="w-5 h-5 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold font-heading">Моят акаунт</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
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
      )}
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
