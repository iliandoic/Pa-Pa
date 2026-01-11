"use client"

import { useState } from "react"
import { Button, IconButton, AddToCartButton } from "@design-system/components/Button"
import {
  Input,
  Textarea,
  SearchBar,
  Checkbox,
  Radio,
  QuantitySelector,
  Select,
} from "@design-system/components/Input"
import { Badge, ProductBadge, StockIndicator, Tag } from "@design-system/components/Badge"
import { ProductCard, ProductCardSkeleton, ProductGrid } from "@design-system/components/ProductCard"
import { Header, CategoryBar } from "@design-system/components/Header"
import { Footer } from "@design-system/components/Footer"
import { Breadcrumbs } from "@design-system/components/Breadcrumbs"
import { Tabs } from "@design-system/components/Tabs"
import { Accordion } from "@design-system/components/Accordion"
import { Modal, Drawer, ConfirmModal } from "@design-system/components/Modal"
import { Carousel, ImageGallery } from "@design-system/components/Carousel"
import { Pagination, SimplePagination, LoadMoreButton } from "@design-system/components/Pagination"
import { ToastProvider, useToast } from "@design-system/components/Toast"

// =============================================================================
// PA-PA BABY SHOP - DESIGN SYSTEM SHOWCASE
// =============================================================================

// Toast Demo Component (needs to be inside ToastProvider)
function ToastDemo() {
  const toast = useToast()
  return (
    <div className="flex gap-4 flex-wrap">
      <Button variant="primary" onClick={() => toast.success("Успех!", "Продуктът е добавен в кошницата")}>
        Success Toast
      </Button>
      <Button variant="outline" onClick={() => toast.error("Грешка!", "Нещо се обърка")}>
        Error Toast
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Внимание!", "Остават само 3 броя")}>
        Warning Toast
      </Button>
      <Button variant="outline" onClick={() => toast.info("Информация", "Безплатна доставка над 80лв")}>
        Info Toast
      </Button>
    </div>
  )
}

export default function DesignSystemPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [tags, setTags] = useState(["Бебешки дрехи", "0-3 месеца", "Розов"])

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)

  const handleAddToCart = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    }, 1000)
  }

  return (
    <ToastProvider>
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-5xl font-extrabold text-neutral-900 mb-4">
            Pa-Pa Design System
          </h1>
          <p className="text-xl text-neutral-600 font-body">
            Playful, warm visual components for our baby shop
          </p>
        </div>

        {/* Color Palette */}
        <Section title="Color Palette" description="Our warm, baby-friendly color scheme">
          <div className="space-y-8">
            {/* Primary Colors */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                Primary - Soft Coral Pink
              </h4>
              <div className="flex gap-2 flex-wrap">
                <ColorSwatch color="bg-primary-50" label="50" />
                <ColorSwatch color="bg-primary-100" label="100" />
                <ColorSwatch color="bg-primary-200" label="200" />
                <ColorSwatch color="bg-primary-300" label="300" />
                <ColorSwatch color="bg-primary-400" label="400" />
                <ColorSwatch color="bg-primary-500" label="500" />
                <ColorSwatch color="bg-primary-600" label="600" />
                <ColorSwatch color="bg-primary-700" label="700" />
                <ColorSwatch color="bg-primary-800" label="800" />
                <ColorSwatch color="bg-primary-900" label="900" />
              </div>
            </div>

            {/* Secondary Colors */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                Secondary - Baby Blue
              </h4>
              <div className="flex gap-2 flex-wrap">
                <ColorSwatch color="bg-secondary-50" label="50" />
                <ColorSwatch color="bg-secondary-100" label="100" />
                <ColorSwatch color="bg-secondary-200" label="200" />
                <ColorSwatch color="bg-secondary-300" label="300" />
                <ColorSwatch color="bg-secondary-400" label="400" />
                <ColorSwatch color="bg-secondary-500" label="500" />
                <ColorSwatch color="bg-secondary-600" label="600" />
                <ColorSwatch color="bg-secondary-700" label="700" />
                <ColorSwatch color="bg-secondary-800" label="800" />
                <ColorSwatch color="bg-secondary-900" label="900" />
              </div>
            </div>

            {/* Accent Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  Mint Green
                </h4>
                <div className="flex gap-2 flex-wrap">
                  <ColorSwatch color="bg-mint-100" label="100" size="sm" />
                  <ColorSwatch color="bg-mint-300" label="300" size="sm" />
                  <ColorSwatch color="bg-mint-500" label="500" size="sm" />
                  <ColorSwatch color="bg-mint-700" label="700" size="sm" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  Sunny Yellow
                </h4>
                <div className="flex gap-2 flex-wrap">
                  <ColorSwatch color="bg-sunny-100" label="100" size="sm" />
                  <ColorSwatch color="bg-sunny-300" label="300" size="sm" />
                  <ColorSwatch color="bg-sunny-500" label="500" size="sm" />
                  <ColorSwatch color="bg-sunny-700" label="700" size="sm" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  Lavender
                </h4>
                <div className="flex gap-2 flex-wrap">
                  <ColorSwatch color="bg-lavender-100" label="100" size="sm" />
                  <ColorSwatch color="bg-lavender-300" label="300" size="sm" />
                  <ColorSwatch color="bg-lavender-500" label="500" size="sm" />
                  <ColorSwatch color="bg-lavender-700" label="700" size="sm" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  Peach
                </h4>
                <div className="flex gap-2 flex-wrap">
                  <ColorSwatch color="bg-peach-100" label="100" size="sm" />
                  <ColorSwatch color="bg-peach-300" label="300" size="sm" />
                  <ColorSwatch color="bg-peach-500" label="500" size="sm" />
                  <ColorSwatch color="bg-peach-700" label="700" size="sm" />
                </div>
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                Semantic Colors
              </h4>
              <div className="flex gap-4 flex-wrap">
                <ColorSwatch color="bg-success" label="Success" showLabel />
                <ColorSwatch color="bg-warning" label="Warning" showLabel />
                <ColorSwatch color="bg-error" label="Error" showLabel />
                <ColorSwatch color="bg-info" label="Info" showLabel />
              </div>
            </div>

            {/* Badge Colors */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                Badge Colors
              </h4>
              <div className="flex gap-4 flex-wrap">
                <ColorSwatch color="bg-sale" label="Sale" showLabel />
                <ColorSwatch color="bg-new" label="New" showLabel />
                <ColorSwatch color="bg-bestseller" label="Bestseller" showLabel />
                <ColorSwatch color="bg-lowstock" label="Low Stock" showLabel />
              </div>
            </div>
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography" description="Nunito for headings, Poppins for body text">
          <div className="space-y-8">
            {/* Display Font */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Display Font (Nunito)
              </h4>
              <div className="space-y-4 bg-white p-6 rounded-2xl shadow-card">
                <h1 className="font-display text-6xl font-extrabold text-neutral-900">
                  Heading 1 - 60px
                </h1>
                <h2 className="font-display text-5xl font-bold text-neutral-900">
                  Heading 2 - 48px
                </h2>
                <h3 className="font-display text-4xl font-bold text-neutral-900">
                  Heading 3 - 36px
                </h3>
                <h4 className="font-display text-3xl font-semibold text-neutral-900">
                  Heading 4 - 30px
                </h4>
                <h5 className="font-display text-2xl font-semibold text-neutral-900">
                  Heading 5 - 24px
                </h5>
                <h6 className="font-display text-xl font-semibold text-neutral-900">
                  Heading 6 - 20px
                </h6>
              </div>
            </div>

            {/* Body Font */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Body Font (Poppins)
              </h4>
              <div className="space-y-4 bg-white p-6 rounded-2xl shadow-card">
                <p className="font-body text-lg text-neutral-700">
                  <strong>Large Body (18px):</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="font-body text-base text-neutral-700">
                  <strong>Base Body (16px):</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="font-body text-sm text-neutral-600">
                  <strong>Small Body (14px):</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="font-body text-xs text-neutral-500">
                  <strong>Caption (12px):</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Navigation Header */}
        <Section title="Navigation Header" description="Main site navigation with search and cart">
          <div className="space-y-8">
            {/* Full Header Demo */}
            <div className="pb-64">
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Full Header (Interactive) - Hover over menu items to see dropdowns
              </h4>
              <div className="rounded-t-2xl shadow-card border border-neutral-200 overflow-visible">
                <Header cartItemCount={3} />
              </div>
            </div>

            {/* Category Bar */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Category Bar
              </h4>
              <div className="rounded-2xl overflow-hidden shadow-card border border-neutral-200">
                <CategoryBar
                  categories={[
                    { label: "Новородени", href: "/categories/newborn" },
                    { label: "0-6 месеца", href: "/categories/0-6" },
                    { label: "6-12 месеца", href: "/categories/6-12" },
                    { label: "1-2 години", href: "/categories/1-2" },
                    { label: "2-3 години", href: "/categories/2-3" },
                    { label: "Подаръци", href: "/categories/gifts" },
                    { label: "Разпродажба", href: "/sale" },
                  ]}
                />
              </div>
            </div>

            {/* Footer */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Footer
              </h4>
              <div className="rounded-2xl overflow-hidden shadow-card">
                <Footer />
              </div>
            </div>
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons" description="Playful buttons with soft rounded corners">
          <div className="space-y-8">
            {/* Button Variants */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Button Variants
              </h4>
              <div className="flex gap-4 flex-wrap items-center bg-white p-6 rounded-2xl shadow-card">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link Button</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Button Sizes
              </h4>
              <div className="flex gap-4 flex-wrap items-center bg-white p-6 rounded-2xl shadow-card">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            {/* Button States */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Button States
              </h4>
              <div className="flex gap-4 flex-wrap items-center bg-white p-6 rounded-2xl shadow-card">
                <Button>Normal</Button>
                <Button isLoading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            {/* Buttons with Icons */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Buttons with Icons
              </h4>
              <div className="flex gap-4 flex-wrap items-center bg-white p-6 rounded-2xl shadow-card">
                <Button
                  leftIcon={
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                    </svg>
                  }
                >
                  Add to Cart
                </Button>
                <Button
                  variant="secondary"
                  rightIcon={
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  Continue
                </Button>
              </div>
            </div>

            {/* Icon Buttons */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Icon Buttons
              </h4>
              <div className="flex gap-4 flex-wrap items-center bg-white p-6 rounded-2xl shadow-card">
                <IconButton
                  aria-label="Favorite"
                  icon={
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  }
                />
                <IconButton
                  aria-label="Search"
                  variant="outline"
                  icon={
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  }
                />
                <IconButton
                  aria-label="Cart"
                  variant="primary"
                  icon={
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                    </svg>
                  }
                />
              </div>
            </div>

            {/* Add to Cart Button */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Add to Cart Button (Interactive Demo)
              </h4>
              <div className="max-w-md bg-white p-6 rounded-2xl shadow-card">
                <AddToCartButton
                  isLoading={isLoading}
                  isAdded={isAdded}
                  onClick={handleAddToCart}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Input Components */}
        <Section title="Input Components" description="Form inputs with playful styling">
          <div className="space-y-8">
            {/* Text Inputs */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Text Inputs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-card">
                <Input label="Име" placeholder="Въведете вашето име" />
                <Input
                  label="Email"
                  type="email"
                  placeholder="example@email.com"
                  leftIcon={
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  }
                />
                <Input
                  label="С грешка"
                  placeholder="Невалидна стойност"
                  error="Това поле е задължително"
                />
                <Input
                  label="Деактивирано"
                  placeholder="Не може да се редактира"
                  disabled
                />
              </div>
            </div>

            {/* Search Bar */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Search Bar
              </h4>
              <div className="max-w-xl bg-white p-6 rounded-2xl shadow-card">
                <SearchBar placeholder="Търсене на продукти..." />
              </div>
            </div>

            {/* Textarea */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Textarea
              </h4>
              <div className="max-w-xl bg-white p-6 rounded-2xl shadow-card">
                <Textarea
                  label="Съобщение"
                  placeholder="Напишете вашето съобщение тук..."
                  hint="Максимум 500 символа"
                />
              </div>
            </div>

            {/* Checkboxes & Radios */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Checkboxes & Radio Buttons
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-card">
                <div className="space-y-4">
                  <p className="text-sm font-medium text-neutral-700 mb-2">Checkboxes</p>
                  <Checkbox label="Безплатна доставка" color="primary" defaultChecked />
                  <Checkbox label="Бърза доставка" color="secondary" />
                  <Checkbox label="Еко опаковка" color="mint" defaultChecked />
                  <Checkbox label="Подаръчна опаковка" color="lavender" />
                  <Checkbox label="Деактивирано" disabled />
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-medium text-neutral-700 mb-2">Radio Buttons</p>
                  <Radio name="delivery" label="Стандартна доставка" color="primary" defaultChecked />
                  <Radio name="delivery" label="Експресна доставка" color="secondary" />
                  <Radio name="delivery" label="Еко доставка" color="mint" />
                  <Radio name="delivery" label="Вземане от магазин" color="lavender" />
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Quantity Selector
              </h4>
              <div className="bg-white p-6 rounded-2xl shadow-card">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-600">Количество:</span>
                  <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={10} />
                  <span className="text-sm text-neutral-500">(Min: 1, Max: 10)</span>
                </div>
              </div>
            </div>

            {/* Select / Dropdown */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Select / Dropdown
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-card">
                <Select
                  label="Размер"
                  placeholder="Изберете размер"
                  value={selectedSize}
                  onChange={setSelectedSize}
                  options={[
                    { value: "xs", label: "XS (0-3 месеца)" },
                    { value: "s", label: "S (3-6 месеца)" },
                    { value: "m", label: "M (6-12 месеца)" },
                    { value: "l", label: "L (12-18 месеца)" },
                    { value: "xl", label: "XL (18-24 месеца)" },
                  ]}
                />
                <Select
                  label="Цвят"
                  placeholder="Изберете цвят"
                  options={[
                    { value: "pink", label: "Розов" },
                    { value: "blue", label: "Син" },
                    { value: "green", label: "Зелен" },
                    { value: "yellow", label: "Жълт" },
                  ]}
                  error="Моля изберете цвят"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Badges & Tags */}
        <Section title="Badges & Tags" description="Labels for products and filtering">
          <div className="space-y-8">
            {/* Product Badges */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Product Badges
              </h4>
              <div className="flex gap-4 flex-wrap items-center bg-white p-6 rounded-2xl shadow-card">
                <Badge variant="sale">-20%</Badge>
                <Badge variant="new">Ново</Badge>
                <Badge variant="bestseller">Бестселър</Badge>
                <Badge variant="lowstock">Последни бройки</Badge>
                <Badge variant="default">Default</Badge>
              </div>
            </div>

            {/* Badge Sizes */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Badge Sizes
              </h4>
              <div className="flex gap-4 flex-wrap items-center bg-white p-6 rounded-2xl shadow-card">
                <Badge size="sm" variant="sale">Small</Badge>
                <Badge size="md" variant="sale">Medium</Badge>
                <Badge size="lg" variant="sale">Large</Badge>
              </div>
            </div>

            {/* Semantic Badges */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Semantic Badges
              </h4>
              <div className="flex gap-4 flex-wrap items-center bg-white p-6 rounded-2xl shadow-card">
                <Badge variant="success">Успешно</Badge>
                <Badge variant="warning">Внимание</Badge>
                <Badge variant="error">Грешка</Badge>
                <Badge variant="info">Информация</Badge>
              </div>
            </div>

            {/* Stock Indicators */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Stock Indicators
              </h4>
              <div className="flex gap-8 flex-wrap items-center bg-white p-6 rounded-2xl shadow-card">
                <StockIndicator stock={50} />
                <StockIndicator stock={3} />
                <StockIndicator stock={0} />
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Filter Tags (Interactive)
              </h4>
              <div className="bg-white p-6 rounded-2xl shadow-card">
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag) => (
                    <Tag
                      key={tag}
                      color="primary"
                      onRemove={() => setTags(tags.filter((t) => t !== tag))}
                    >
                      {tag}
                    </Tag>
                  ))}
                  {tags.length === 0 && (
                    <button
                      onClick={() => setTags(["Бебешки дрехи", "0-3 месеца", "Розов"])}
                      className="text-sm text-primary hover:underline"
                    >
                      Възстанови таговете
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tag Colors */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Tag Colors
              </h4>
              <div className="flex gap-2 flex-wrap bg-white p-6 rounded-2xl shadow-card">
                <Tag color="primary">Primary</Tag>
                <Tag color="secondary">Secondary</Tag>
                <Tag color="mint">Mint</Tag>
                <Tag color="lavender">Lavender</Tag>
                <Tag color="peach">Peach</Tag>
                <Tag color="neutral">Neutral</Tag>
              </div>
            </div>
          </div>
        </Section>

        {/* Product Cards */}
        <Section title="Product Cards" description="E-commerce product display components">
          <div className="space-y-8">
            {/* Product Grid */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Product Grid
              </h4>
              <ProductGrid columns={4}>
                <ProductCard
                  id="1"
                  handle="baby-bodysuit-pink"
                  title="Бебешко боди с дълъг ръкав - Розово"
                  thumbnail="https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=400&fit=crop"
                  price={{ amount: 2499, currencyCode: "BGN" }}
                  compareAtPrice={{ amount: 3499, currencyCode: "BGN" }}
                  rating={4.5}
                  reviewCount={24}
                  stock={3}
                />
                <ProductCard
                  id="2"
                  handle="baby-pants-blue"
                  title="Бебешки панталонки от органичен памук"
                  thumbnail="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop"
                  price={{ amount: 1899, currencyCode: "BGN" }}
                  badge="new"
                  rating={5}
                  reviewCount={12}
                />
                <ProductCard
                  id="3"
                  handle="baby-hat-yellow"
                  title="Бебешка шапка с ушички - Жълта"
                  thumbnail="https://images.unsplash.com/photo-1519985176271-adb1088fa94c?w=400&h=400&fit=crop"
                  price={{ amount: 999, currencyCode: "BGN" }}
                  badge="bestseller"
                  rating={4}
                  reviewCount={56}
                />
                <ProductCard
                  id="4"
                  handle="baby-socks-set"
                  title="Комплект бебешки чорапки (5 чифта)"
                  thumbnail="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop"
                  price={{ amount: 1499, currencyCode: "BGN" }}
                  stock={0}
                />
              </ProductGrid>
            </div>

            {/* Loading State */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Loading State (Skeleton)
              </h4>
              <ProductGrid columns={4}>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </ProductGrid>
            </div>
          </div>
        </Section>

        {/* Shadows */}
        <Section title="Shadows" description="Soft shadows for depth and playfulness">
          <div className="flex gap-6 flex-wrap">
            <ShadowBox shadow="shadow-sm" label="Small" />
            <ShadowBox shadow="shadow" label="Default" />
            <ShadowBox shadow="shadow-md" label="Medium" />
            <ShadowBox shadow="shadow-lg" label="Large" />
            <ShadowBox shadow="shadow-xl" label="XL" />
            <ShadowBox shadow="shadow-card" label="Card" />
            <ShadowBox shadow="shadow-card-hover" label="Card Hover" />
            <ShadowBox shadow="shadow-primary" label="Primary" />
            <ShadowBox shadow="shadow-secondary" label="Secondary" />
          </div>
        </Section>

        {/* Border Radius */}
        <Section title="Border Radius" description="Playful rounded corners">
          <div className="flex gap-6 flex-wrap">
            <RadiusBox radius="rounded-sm" label="Small (4px)" />
            <RadiusBox radius="rounded" label="Default (8px)" />
            <RadiusBox radius="rounded-md" label="Medium (10px)" />
            <RadiusBox radius="rounded-lg" label="Large (12px)" />
            <RadiusBox radius="rounded-xl" label="XL (16px)" />
            <RadiusBox radius="rounded-2xl" label="2XL (20px)" />
            <RadiusBox radius="rounded-3xl" label="3XL (24px)" />
            <RadiusBox radius="rounded-full" label="Full" />
          </div>
        </Section>

        {/* Animations */}
        <Section title="Animations" description="Playful micro-interactions for a baby shop">
          <div className="space-y-8">
            {/* Looping Animations */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Looping Animations
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-2xl shadow-card">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-xl animate-bounce-soft mx-auto mb-3" />
                  <span className="text-sm font-medium text-neutral-700">Bounce Soft</span>
                  <p className="text-xs text-neutral-500 mt-1">animate-bounce-soft</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary rounded-xl animate-pulse-soft mx-auto mb-3" />
                  <span className="text-sm font-medium text-neutral-700">Pulse Soft</span>
                  <p className="text-xs text-neutral-500 mt-1">animate-pulse-soft</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-mint rounded-xl animate-ring mx-auto mb-3" />
                  <span className="text-sm font-medium text-neutral-700">Ring / Spin</span>
                  <p className="text-xs text-neutral-500 mt-1">animate-ring</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-sunny rounded-xl animate-pulse mx-auto mb-3" />
                  <span className="text-sm font-medium text-neutral-700">Pulse</span>
                  <p className="text-xs text-neutral-500 mt-1">animate-pulse</p>
                </div>
              </div>
            </div>

            {/* Interactive Animations */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Interactive Animations (Hover)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-2xl shadow-card">
                <div className="text-center">
                  <div className="w-16 h-16 bg-lavender rounded-xl mx-auto mb-3 cursor-pointer hover:animate-wiggle" />
                  <span className="text-sm font-medium text-neutral-700">Wiggle</span>
                  <p className="text-xs text-neutral-500 mt-1">hover:animate-wiggle</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-peach rounded-xl mx-auto mb-3 cursor-pointer hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium text-neutral-700">Scale Up</span>
                  <p className="text-xs text-neutral-500 mt-1">hover:scale-110</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-3 cursor-pointer hover:-translate-y-2 transition-transform duration-300" />
                  <span className="text-sm font-medium text-neutral-700">Float Up</span>
                  <p className="text-xs text-neutral-500 mt-1">hover:-translate-y-2</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary rounded-xl mx-auto mb-3 cursor-pointer hover:rotate-12 transition-transform duration-300" />
                  <span className="text-sm font-medium text-neutral-700">Rotate</span>
                  <p className="text-xs text-neutral-500 mt-1">hover:rotate-12</p>
                </div>
              </div>
            </div>

            {/* Transition Animations */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Transition Effects (Hover)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-2xl shadow-card">
                <div className="text-center">
                  <div className="w-16 h-16 bg-neutral-200 rounded-xl mx-auto mb-3 cursor-pointer hover:bg-primary hover:shadow-primary transition-all duration-300" />
                  <span className="text-sm font-medium text-neutral-700">Color + Shadow</span>
                  <p className="text-xs text-neutral-500 mt-1">hover:shadow-primary</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white border-2 border-neutral-200 rounded-xl mx-auto mb-3 cursor-pointer hover:border-primary hover:bg-primary-50 transition-all duration-300" />
                  <span className="text-sm font-medium text-neutral-700">Border Color</span>
                  <p className="text-xs text-neutral-500 mt-1">hover:border-primary</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-mint rounded-xl mx-auto mb-3 cursor-pointer shadow-card hover:shadow-card-hover transition-shadow duration-300" />
                  <span className="text-sm font-medium text-neutral-700">Shadow Lift</span>
                  <p className="text-xs text-neutral-500 mt-1">hover:shadow-card-hover</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-lavender rounded-xl mx-auto mb-3 cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-sm font-medium text-neutral-700">Opacity</span>
                  <p className="text-xs text-neutral-500 mt-1">hover:opacity-100</p>
                </div>
              </div>
            </div>

            {/* Entrance Animations */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Entrance Animations (Click boxes to replay)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-2xl shadow-card">
                <div className="text-center">
                  <div
                    className="w-16 h-16 bg-primary rounded-xl mx-auto mb-3 cursor-pointer animate-fade-in-top"
                    onClick={(e) => {
                      const el = e.currentTarget;
                      el.style.animation = 'none';
                      el.offsetHeight;
                      el.style.animation = '';
                    }}
                  />
                  <span className="text-sm font-medium text-neutral-700">Fade In Top</span>
                  <p className="text-xs text-neutral-500 mt-1">animate-fade-in-top</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-16 h-16 bg-secondary rounded-xl mx-auto mb-3 cursor-pointer animate-fade-in-right"
                    onClick={(e) => {
                      const el = e.currentTarget;
                      el.style.animation = 'none';
                      el.offsetHeight;
                      el.style.animation = '';
                    }}
                  />
                  <span className="text-sm font-medium text-neutral-700">Fade In Right</span>
                  <p className="text-xs text-neutral-500 mt-1">animate-fade-in-right</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-16 h-16 bg-mint rounded-xl mx-auto mb-3 cursor-pointer animate-dropdown-in"
                    onClick={(e) => {
                      const el = e.currentTarget;
                      el.style.animation = 'none';
                      el.offsetHeight;
                      el.style.animation = '';
                    }}
                  />
                  <span className="text-sm font-medium text-neutral-700">Dropdown In</span>
                  <p className="text-xs text-neutral-500 mt-1">animate-dropdown-in</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-16 h-16 bg-lavender rounded-xl mx-auto mb-3 cursor-pointer animate-enter"
                    onClick={(e) => {
                      const el = e.currentTarget;
                      el.style.animation = 'none';
                      el.offsetHeight;
                      el.style.animation = '';
                    }}
                  />
                  <span className="text-sm font-medium text-neutral-700">Enter</span>
                  <p className="text-xs text-neutral-500 mt-1">animate-enter</p>
                </div>
              </div>
            </div>

            {/* Button Animation Examples */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Button Animation Examples
              </h4>
              <div className="flex flex-wrap gap-4 bg-white p-8 rounded-2xl shadow-card">
                <button className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-600 hover:scale-105 hover:shadow-primary active:scale-95 transition-all duration-200">
                  Scale + Shadow
                </button>
                <button className="px-6 py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-600 hover:-translate-y-1 active:translate-y-0 transition-all duration-200">
                  Float Up
                </button>
                <button className="px-6 py-3 bg-white border-2 border-mint text-mint font-semibold rounded-xl hover:bg-mint hover:text-white active:scale-95 transition-all duration-200">
                  Fill on Hover
                </button>
                <button className="group px-6 py-3 bg-lavender text-white font-semibold rounded-xl hover:bg-lavender-600 transition-all duration-200">
                  <span className="inline-block group-hover:animate-wiggle">🎉</span> With Icon
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* Breadcrumbs */}
        <Section title="Breadcrumbs" description="Navigation path indicator">
          <div className="bg-white p-6 rounded-2xl shadow-card">
            <Breadcrumbs
              items={[
                { label: "Дрехи", href: "/categories/clothes" },
                { label: "Бодита", href: "/categories/bodysuits" },
                { label: "Бебешко боди с дълъг ръкав" },
              ]}
            />
          </div>
        </Section>

        {/* Tabs */}
        <Section title="Tabs" description="Tabbed content navigation">
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Underline Tabs
              </h4>
              <div className="bg-white p-6 rounded-2xl shadow-card">
                <Tabs
                  variant="underline"
                  tabs={[
                    { id: "desc", label: "Описание", content: <p className="text-neutral-600">Това е описание на продукта. Изработен от 100% органичен памук, меко и нежно за бебешката кожа.</p> },
                    { id: "specs", label: "Характеристики", content: <p className="text-neutral-600">Материал: 100% памук | Размери: S, M, L | Цветове: розово, синьо, бяло</p> },
                    { id: "reviews", label: "Отзиви (24)", content: <p className="text-neutral-600">Много сме доволни от качеството! ⭐⭐⭐⭐⭐</p> },
                  ]}
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Pills Tabs
              </h4>
              <div className="bg-white p-6 rounded-2xl shadow-card">
                <Tabs
                  variant="pills"
                  tabs={[
                    { id: "all", label: "Всички", content: <p className="text-neutral-600">Показване на всички продукти</p> },
                    { id: "new", label: "Нови", content: <p className="text-neutral-600">Нови продукти от тази седмица</p> },
                    { id: "sale", label: "Намаление", content: <p className="text-neutral-600">Продукти с намаление</p> },
                  ]}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Accordion */}
        <Section title="Accordion" description="Collapsible content panels">
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Default Accordion
              </h4>
              <div className="bg-white p-6 rounded-2xl shadow-card">
                <Accordion
                  items={[
                    { id: "shipping", title: "Доставка", content: "Безплатна доставка за поръчки над 80 лв. Стандартна доставка 2-4 работни дни.", defaultOpen: true },
                    { id: "returns", title: "Връщане", content: "Можете да върнете продукта в рамките на 14 дни от получаването." },
                    { id: "payment", title: "Плащане", content: "Приемаме карти Visa, Mastercard, наложен платеж и банков превод." },
                  ]}
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Separated Accordion
              </h4>
              <div className="max-w-xl">
                <Accordion
                  variant="separated"
                  allowMultiple
                  items={[
                    { id: "q1", title: "Как да измеря бебето?", content: "Измерете дължината от темето до петата и обиколката на гърдите." },
                    { id: "q2", title: "Какъв размер да избера?", content: "Препоръчваме да изберете размер, който съответства на теглото на бебето." },
                    { id: "q3", title: "Как да се грижа за дрехите?", content: "Перете на 30°C с нежен препарат. Не използвайте белина." },
                  ]}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Modal & Drawer */}
        <Section title="Modal & Drawer" description="Overlay dialogs and slide-in panels">
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Modal & Drawer Examples
              </h4>
              <div className="flex gap-4 flex-wrap bg-white p-6 rounded-2xl shadow-card">
                <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>Open Drawer</Button>
                <Button variant="outline" onClick={() => setIsConfirmOpen(true)}>Confirm Dialog</Button>
              </div>
            </div>
          </div>

          {/* Modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Добавено в кошницата">
            <div className="space-y-4">
              <p className="text-neutral-600">Продуктът е успешно добавен в кошницата.</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Продължи пазаруването
                </Button>
                <Button onClick={() => setIsModalOpen(false)} className="flex-1">
                  Към кошницата
                </Button>
              </div>
            </div>
          </Modal>

          {/* Drawer */}
          <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Кошница (3)">
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-neutral-50 rounded-xl">
                <div className="w-16 h-16 bg-neutral-200 rounded-lg" />
                <div className="flex-1">
                  <p className="font-medium">Бебешко боди</p>
                  <p className="text-sm text-neutral-500">Размер: M | Цвят: Розов</p>
                  <p className="text-primary font-semibold">24.99 лв</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-neutral-50 rounded-xl">
                <div className="w-16 h-16 bg-neutral-200 rounded-lg" />
                <div className="flex-1">
                  <p className="font-medium">Бебешки чорапки</p>
                  <p className="text-sm text-neutral-500">Комплект 5 чифта</p>
                  <p className="text-primary font-semibold">14.99 лв</p>
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Общо:</span>
                  <span className="font-bold text-lg">39.98 лв</span>
                </div>
                <Button className="w-full">Към плащане</Button>
              </div>
            </div>
          </Drawer>

          {/* Confirm Modal */}
          <ConfirmModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={() => setIsConfirmOpen(false)}
            title="Изтриване на продукт"
            message="Сигурни ли сте, че искате да премахнете този продукт от кошницата?"
            confirmText="Изтрий"
            cancelText="Отказ"
            variant="danger"
          />
        </Section>

        {/* Carousel */}
        <Section title="Carousel & Image Gallery" description="Image sliders and product galleries">
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Product Carousel
              </h4>
              <Carousel slidesToShow={4} gap={16}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl shadow-card">
                    <div className="aspect-square bg-neutral-100 rounded-xl mb-3" />
                    <p className="font-medium">Продукт {i}</p>
                    <p className="text-primary font-semibold">{(i * 10 + 9.99).toFixed(2)} лв</p>
                  </div>
                ))}
              </Carousel>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Image Gallery
              </h4>
              <div className="max-w-md bg-white p-6 rounded-2xl shadow-card">
                <ImageGallery
                  images={[
                    { url: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=600&fit=crop", alt: "Бебешко боди 1" },
                    { url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=600&fit=crop", alt: "Бебешко боди 2" },
                    { url: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?w=600&h=600&fit=crop", alt: "Бебешко боди 3" },
                    { url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop", alt: "Бебешко боди 4" },
                  ]}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Pagination */}
        <Section title="Pagination" description="Page navigation controls">
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Standard Pagination
              </h4>
              <div className="bg-white p-6 rounded-2xl shadow-card">
                <Pagination
                  currentPage={currentPage}
                  totalPages={10}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Simple Pagination
              </h4>
              <div className="bg-white p-6 rounded-2xl shadow-card">
                <SimplePagination
                  currentPage={currentPage}
                  totalPages={10}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
                Load More Button
              </h4>
              <div className="bg-white p-6 rounded-2xl shadow-card">
                <LoadMoreButton
                  onClick={() => {}}
                  hasMore={true}
                  loadedCount={12}
                  totalCount={48}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Toast Notifications */}
        <Section title="Toast Notifications" description="Feedback messages">
          <div className="bg-white p-6 rounded-2xl shadow-card">
            <ToastDemo />
          </div>
        </Section>
      </div>
    </div>
    </ToastProvider>
  )
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-bold text-neutral-900 mb-2">{title}</h2>
        <p className="text-neutral-600">{description}</p>
      </div>
      {children}
    </section>
  )
}

function ColorSwatch({
  color,
  label,
  size = "md",
  showLabel = false,
}: {
  color: string
  label: string
  size?: "sm" | "md"
  showLabel?: boolean
}) {
  const sizeClass = size === "sm" ? "w-12 h-12" : "w-16 h-16"
  return (
    <div className="text-center">
      <div className={`${sizeClass} ${color} rounded-xl shadow-sm`} />
      <span className="text-xs text-neutral-500 mt-1 block">
        {showLabel ? label : label}
      </span>
    </div>
  )
}

function ShadowBox({ shadow, label }: { shadow: string; label: string }) {
  return (
    <div className="text-center">
      <div className={`w-24 h-24 bg-white ${shadow} rounded-xl`} />
      <span className="text-sm text-neutral-600 mt-2 block">{label}</span>
    </div>
  )
}

function RadiusBox({ radius, label }: { radius: string; label: string }) {
  return (
    <div className="text-center">
      <div className={`w-20 h-20 bg-primary-100 border-2 border-primary ${radius}`} />
      <span className="text-sm text-neutral-600 mt-2 block">{label}</span>
    </div>
  )
}
