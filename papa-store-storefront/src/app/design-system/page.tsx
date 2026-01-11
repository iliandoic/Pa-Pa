"use client"

import Link from "next/link"
import { Button, IconButton, AddToCartButton } from "@design-system/components/Button"
import { Badge, ProductBadge, StockIndicator, Tag } from "@design-system/components/Badge"
import { Input, SearchBar, QuantitySelector } from "@design-system/components/Input"

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-primary">
            Pa-Pa
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#palettes" className="text-neutral-600 hover:text-primary transition-colors">Цветове</a>
            <a href="#typography" className="text-neutral-600 hover:text-primary transition-colors">Типография</a>
            <a href="#buttons" className="text-neutral-600 hover:text-primary transition-colors">Бутони</a>
            <a href="#products" className="text-neutral-600 hover:text-primary transition-colors">Продукти</a>
            <a href="#animations" className="text-neutral-600 hover:text-primary transition-colors">Анимации</a>
          </nav>
          <h1 className="font-heading text-lg font-semibold">Design System</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Color Palettes */}
        <section id="palettes">
          <h2 className="font-heading text-2xl font-bold mb-6">Color Palettes</h2>

          {/* Primary Palette */}
          <div className="mb-8">
            <h3 className="font-heading text-lg font-semibold mb-4">Primary (Soft Coral Pink)</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-primary-50"></div>
                <p className="text-xs text-center">50</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-primary-100"></div>
                <p className="text-xs text-center">100</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-primary-200"></div>
                <p className="text-xs text-center">200</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-primary-300"></div>
                <p className="text-xs text-center">300</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-primary-400"></div>
                <p className="text-xs text-center">400</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-primary-500 ring-2 ring-offset-2 ring-primary-500"></div>
                <p className="text-xs text-center font-bold">500</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-primary-600"></div>
                <p className="text-xs text-center">600</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-primary-700"></div>
                <p className="text-xs text-center">700</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-primary-800"></div>
                <p className="text-xs text-center">800</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-primary-900"></div>
                <p className="text-xs text-center">900</p>
              </div>
            </div>
          </div>

          {/* Secondary Palette */}
          <div className="mb-8">
            <h3 className="font-heading text-lg font-semibold mb-4">Secondary (Baby Blue)</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-secondary-50"></div>
                <p className="text-xs text-center">50</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-secondary-100"></div>
                <p className="text-xs text-center">100</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-secondary-200"></div>
                <p className="text-xs text-center">200</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-secondary-300"></div>
                <p className="text-xs text-center">300</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-secondary-400"></div>
                <p className="text-xs text-center">400</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-secondary-500 ring-2 ring-offset-2 ring-secondary-500"></div>
                <p className="text-xs text-center font-bold">500</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-secondary-600"></div>
                <p className="text-xs text-center">600</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-secondary-700"></div>
                <p className="text-xs text-center">700</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-secondary-800"></div>
                <p className="text-xs text-center">800</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-secondary-900"></div>
                <p className="text-xs text-center">900</p>
              </div>
            </div>
          </div>

          {/* Mint Palette */}
          <div className="mb-8">
            <h3 className="font-heading text-lg font-semibold mb-4">Mint Green</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-mint-50"></div>
                <p className="text-xs text-center">50</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-mint-100"></div>
                <p className="text-xs text-center">100</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-mint-200"></div>
                <p className="text-xs text-center">200</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-mint-300"></div>
                <p className="text-xs text-center">300</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-mint-400"></div>
                <p className="text-xs text-center">400</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-mint-500 ring-2 ring-offset-2 ring-mint-500"></div>
                <p className="text-xs text-center font-bold">500</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-mint-600"></div>
                <p className="text-xs text-center">600</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-mint-700"></div>
                <p className="text-xs text-center">700</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-mint-800"></div>
                <p className="text-xs text-center">800</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-mint-900"></div>
                <p className="text-xs text-center">900</p>
              </div>
            </div>
          </div>

          {/* Sunny Palette */}
          <div className="mb-8">
            <h3 className="font-heading text-lg font-semibold mb-4">Sunny Yellow</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-sunny-50"></div>
                <p className="text-xs text-center">50</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-sunny-100"></div>
                <p className="text-xs text-center">100</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-sunny-200"></div>
                <p className="text-xs text-center">200</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-sunny-300"></div>
                <p className="text-xs text-center">300</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-sunny-400"></div>
                <p className="text-xs text-center">400</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-sunny-500 ring-2 ring-offset-2 ring-sunny-500"></div>
                <p className="text-xs text-center font-bold">500</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-sunny-600"></div>
                <p className="text-xs text-center">600</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-sunny-700"></div>
                <p className="text-xs text-center">700</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-sunny-800"></div>
                <p className="text-xs text-center">800</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-sunny-900"></div>
                <p className="text-xs text-center">900</p>
              </div>
            </div>
          </div>

          {/* Lavender Palette */}
          <div className="mb-8">
            <h3 className="font-heading text-lg font-semibold mb-4">Lavender</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-lavender-50"></div>
                <p className="text-xs text-center">50</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-lavender-100"></div>
                <p className="text-xs text-center">100</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-lavender-200"></div>
                <p className="text-xs text-center">200</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-lavender-300"></div>
                <p className="text-xs text-center">300</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-lavender-400"></div>
                <p className="text-xs text-center">400</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-lavender-500 ring-2 ring-offset-2 ring-lavender-500"></div>
                <p className="text-xs text-center font-bold">500</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-lavender-600"></div>
                <p className="text-xs text-center">600</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-lavender-700"></div>
                <p className="text-xs text-center">700</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-lavender-800"></div>
                <p className="text-xs text-center">800</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-lavender-900"></div>
                <p className="text-xs text-center">900</p>
              </div>
            </div>
          </div>

          {/* Peach Palette */}
          <div className="mb-8">
            <h3 className="font-heading text-lg font-semibold mb-4">Peach</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-peach-50"></div>
                <p className="text-xs text-center">50</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-peach-100"></div>
                <p className="text-xs text-center">100</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-peach-200"></div>
                <p className="text-xs text-center">200</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-peach-300"></div>
                <p className="text-xs text-center">300</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-peach-400"></div>
                <p className="text-xs text-center">400</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-peach-500 ring-2 ring-offset-2 ring-peach-500"></div>
                <p className="text-xs text-center font-bold">500</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-peach-600"></div>
                <p className="text-xs text-center">600</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-peach-700"></div>
                <p className="text-xs text-center">700</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-peach-800"></div>
                <p className="text-xs text-center">800</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-peach-900"></div>
                <p className="text-xs text-center">900</p>
              </div>
            </div>
          </div>

          {/* Neutral Palette */}
          <div className="mb-8">
            <h3 className="font-heading text-lg font-semibold mb-4">Neutral (Warm Grays)</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-neutral-50 border"></div>
                <p className="text-xs text-center">50</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-neutral-100"></div>
                <p className="text-xs text-center">100</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-neutral-200"></div>
                <p className="text-xs text-center">200</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-neutral-300"></div>
                <p className="text-xs text-center">300</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-neutral-400"></div>
                <p className="text-xs text-center">400</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-neutral-500"></div>
                <p className="text-xs text-center">500</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-neutral-600"></div>
                <p className="text-xs text-center">600</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-neutral-700"></div>
                <p className="text-xs text-center">700</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-neutral-800"></div>
                <p className="text-xs text-center">800</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-neutral-900"></div>
                <p className="text-xs text-center">900</p>
              </div>
            </div>
          </div>

          {/* Semantic Colors */}
          <h3 className="font-heading text-lg font-semibold mt-8 mb-4">Semantic Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="h-16 flex-1 rounded-xl bg-success-light"></div>
                <div className="h-16 flex-1 rounded-xl bg-success"></div>
                <div className="h-16 flex-1 rounded-xl bg-success-dark"></div>
              </div>
              <p className="text-sm font-medium">Success</p>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="h-16 flex-1 rounded-xl bg-warning-light"></div>
                <div className="h-16 flex-1 rounded-xl bg-warning"></div>
                <div className="h-16 flex-1 rounded-xl bg-warning-dark"></div>
              </div>
              <p className="text-sm font-medium">Warning</p>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="h-16 flex-1 rounded-xl bg-error-light"></div>
                <div className="h-16 flex-1 rounded-xl bg-error"></div>
                <div className="h-16 flex-1 rounded-xl bg-error-dark"></div>
              </div>
              <p className="text-sm font-medium">Error</p>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="h-16 flex-1 rounded-xl bg-info-light"></div>
                <div className="h-16 flex-1 rounded-xl bg-info"></div>
                <div className="h-16 flex-1 rounded-xl bg-info-dark"></div>
              </div>
              <p className="text-sm font-medium">Info</p>
            </div>
          </div>

          {/* Badge Colors */}
          <h3 className="font-heading text-lg font-semibold mt-8 mb-4">Badge Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-12 rounded-xl bg-sale"></div>
              <p className="text-sm font-medium">Sale (#EF4444)</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-xl bg-new"></div>
              <p className="text-sm font-medium">New (#10B981)</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-xl bg-bestseller"></div>
              <p className="text-sm font-medium">Bestseller (#F59E0B)</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-xl bg-lowstock"></div>
              <p className="text-sm font-medium">Low Stock (#F97316)</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section id="typography">
          <h2 className="font-heading text-2xl font-bold mb-6">Typography</h2>
          <div className="bg-white rounded-2xl p-8 space-y-6">
            <div>
              <p className="text-xs text-neutral-500 mb-2">Display Font (Shantell Sans)</p>
              <p className="font-display text-4xl font-bold text-primary">Pa-Pa Baby Shop</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 mb-2">Heading Font (Comfortaa)</p>
              <p className="font-heading text-2xl font-semibold">Бебешки колички и аксесоари</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 mb-2">Body Font (Nunito)</p>
              <p className="font-body text-base text-neutral-600">
                Качествени продукти за вашето бебе. Доставка до адрес или офис на куриер.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section id="buttons">
          <h2 className="font-heading text-2xl font-bold mb-6">Buttons</h2>
          <div className="bg-white rounded-2xl p-8 space-y-8">
            {/* Variants */}
            <div>
              <p className="text-sm text-neutral-500 mb-4">Variants</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-sm text-neutral-500 mb-4">Sizes</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            {/* States */}
            <div>
              <p className="text-sm text-neutral-500 mb-4">States</p>
              <div className="flex flex-wrap gap-4">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button isLoading>Loading</Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div>
              <p className="text-sm text-neutral-500 mb-4">Add to Cart Button</p>
              <div className="max-w-xs space-y-4">
                <AddToCartButton />
                <AddToCartButton isAdded />
                <AddToCartButton isLoading />
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="font-heading text-2xl font-bold mb-6">Badges</h2>
          <div className="bg-white rounded-2xl p-8 space-y-8">
            {/* Variants */}
            <div>
              <p className="text-sm text-neutral-500 mb-4">Variants</p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="sale">Намаление</Badge>
                <Badge variant="new">Ново</Badge>
                <Badge variant="bestseller">Бестселър</Badge>
                <Badge variant="lowstock">Последни бройки</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </div>

            {/* Product Badges */}
            <div>
              <p className="text-sm text-neutral-500 mb-4">Product Badges (positioned)</p>
              <div className="relative w-48 h-48 bg-neutral-100 rounded-xl">
                <ProductBadge type="sale" value={20} />
              </div>
            </div>

            {/* Stock Indicator */}
            <div>
              <p className="text-sm text-neutral-500 mb-4">Stock Indicator</p>
              <div className="space-y-3">
                <StockIndicator stock={50} />
                <StockIndicator stock={3} />
                <StockIndicator stock={0} />
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="text-sm text-neutral-500 mb-4">Tags</p>
              <div className="flex flex-wrap gap-2">
                <Tag color="primary">Бебешки колички</Tag>
                <Tag color="secondary">Играчки</Tag>
                <Tag color="mint">Дрехи</Tag>
                <Tag color="lavender">Аксесоари</Tag>
                <Tag color="neutral" onRemove={() => {}}>Removable</Tag>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="font-heading text-2xl font-bold mb-6">Inputs</h2>
          <div className="bg-white rounded-2xl p-8 space-y-8">
            {/* Basic Input */}
            <div className="max-w-md space-y-4">
              <Input label="Име" placeholder="Въведете вашето име" />
              <Input label="Email" type="email" placeholder="email@example.com" />
              <Input label="С грешка" error="Това поле е задължително" />
              <Input label="Disabled" disabled value="Не може да се редактира" />
            </div>

            {/* Search */}
            <div>
              <p className="text-sm text-neutral-500 mb-4">Search Input</p>
              <div className="max-w-md">
                <SearchBar placeholder="Търсене на продукти..." />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm text-neutral-500 mb-4">Quantity Input</p>
              <QuantitySelector value={1} min={1} max={10} onChange={() => {}} />
            </div>
          </div>
        </section>

        {/* Shadows */}
        <section>
          <h2 className="font-heading text-2xl font-bold mb-6">Shadows</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <p className="text-sm">shadow-sm</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow text-center">
              <p className="text-sm">shadow</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <p className="text-sm">shadow-md</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <p className="text-sm">shadow-lg</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-primary text-center">
              <p className="text-sm">shadow-primary</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-secondary text-center">
              <p className="text-sm">shadow-secondary</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-card text-center">
              <p className="text-sm">shadow-card</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-card-hover text-center">
              <p className="text-sm">shadow-card-hover</p>
            </div>
          </div>
        </section>

        {/* Border Radius */}
        <section>
          <h2 className="font-heading text-2xl font-bold mb-6">Border Radius</h2>
          <div className="flex flex-wrap gap-6">
            <div className="w-20 h-20 bg-primary rounded-sm flex items-center justify-center text-white text-xs">sm</div>
            <div className="w-20 h-20 bg-primary rounded flex items-center justify-center text-white text-xs">default</div>
            <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center text-white text-xs">lg</div>
            <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center text-white text-xs">xl</div>
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-white text-xs">2xl</div>
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-xs">full</div>
          </div>
        </section>

        {/* Product Cards */}
        <section id="products">
          <h2 className="font-heading text-2xl font-bold mb-6">Product Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product Card - Standard */}
            <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden group">
              <div className="relative aspect-square bg-neutral-100">
                <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <ProductBadge type="new" />
              </div>
              <div className="p-4">
                <p className="text-xs text-neutral-500 mb-1">Бебешки колички</p>
                <h3 className="font-heading font-semibold text-neutral-800 mb-2 group-hover:text-primary transition-colors">
                  Детска количка Премиум
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-heading font-bold text-lg text-primary">459.00 лв</span>
                </div>
                <AddToCartButton />
              </div>
            </div>

            {/* Product Card - On Sale */}
            <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden group">
              <div className="relative aspect-square bg-neutral-100">
                <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <ProductBadge type="sale" value={25} />
              </div>
              <div className="p-4">
                <p className="text-xs text-neutral-500 mb-1">Играчки</p>
                <h3 className="font-heading font-semibold text-neutral-800 mb-2 group-hover:text-primary transition-colors">
                  Плюшена играчка Мече
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-heading font-bold text-lg text-primary">29.99 лв</span>
                  <span className="text-sm text-neutral-400 line-through">39.99 лв</span>
                </div>
                <AddToCartButton />
              </div>
            </div>

            {/* Product Card - Low Stock */}
            <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden group">
              <div className="relative aspect-square bg-neutral-100">
                <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <Badge variant="lowstock" className="absolute top-3 left-3">Последни 2 бр.</Badge>
              </div>
              <div className="p-4">
                <p className="text-xs text-neutral-500 mb-1">Дрехи</p>
                <h3 className="font-heading font-semibold text-neutral-800 mb-2 group-hover:text-primary transition-colors">
                  Бебешко боди органичен памук
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-heading font-bold text-lg text-primary">19.90 лв</span>
                </div>
                <StockIndicator stock={2} />
              </div>
            </div>

            {/* Product Card - Bestseller */}
            <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden group">
              <div className="relative aspect-square bg-neutral-100">
                <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <Badge variant="bestseller" className="absolute top-3 left-3">Бестселър</Badge>
              </div>
              <div className="p-4">
                <p className="text-xs text-neutral-500 mb-1">Аксесоари</p>
                <h3 className="font-heading font-semibold text-neutral-800 mb-2 group-hover:text-primary transition-colors">
                  Бебешко одеяло мериносова вълна
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-heading font-bold text-lg text-primary">89.00 лв</span>
                </div>
                <AddToCartButton isAdded />
              </div>
            </div>
          </div>
        </section>

        {/* Animations */}
        <section id="animations">
          <h2 className="font-heading text-2xl font-bold mb-6">Animations</h2>
          <div className="bg-white rounded-2xl p-8 space-y-8">
            {/* Playful Animations */}
            <div>
              <p className="text-sm text-neutral-500 mb-4">Playful Animations (hover to see)</p>
              <div className="flex flex-wrap gap-6">
                <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center text-white text-xs font-medium hover:animate-bounce-soft cursor-pointer">
                  bounce-soft
                </div>
                <div className="w-24 h-24 bg-secondary rounded-2xl flex items-center justify-center text-white text-xs font-medium hover:animate-pulse-soft cursor-pointer">
                  pulse-soft
                </div>
                <div className="w-24 h-24 bg-mint rounded-2xl flex items-center justify-center text-white text-xs font-medium hover:animate-wiggle cursor-pointer">
                  wiggle
                </div>
              </div>
            </div>

            {/* Running Animations */}
            <div>
              <p className="text-sm text-neutral-500 mb-4">Always Running Animations</p>
              <div className="flex flex-wrap gap-6">
                <div className="w-24 h-24 bg-lavender rounded-2xl flex items-center justify-center text-white text-xs font-medium animate-bounce-soft">
                  bounce-soft
                </div>
                <div className="w-24 h-24 bg-sunny rounded-2xl flex items-center justify-center text-white text-xs font-medium animate-pulse-soft">
                  pulse-soft
                </div>
                <div className="w-24 h-24 bg-peach rounded-2xl flex items-center justify-center text-white text-xs font-medium animate-ring">
                  ring (spin)
                </div>
              </div>
            </div>

            {/* Transition Animations */}
            <div>
              <p className="text-sm text-neutral-500 mb-4">Transition Effects (built-in)</p>
              <div className="flex flex-wrap gap-4">
                <div className="px-6 py-4 bg-primary-100 rounded-xl text-primary-700 font-medium transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-primary hover:scale-105 cursor-pointer">
                  Scale + Shadow
                </div>
                <div className="px-6 py-4 bg-secondary-100 rounded-xl text-secondary-700 font-medium transition-all duration-300 hover:bg-secondary hover:text-white hover:-translate-y-1 cursor-pointer">
                  Lift Up
                </div>
                <div className="px-6 py-4 bg-mint-100 rounded-xl text-mint-700 font-medium transition-all duration-500 hover:bg-mint hover:text-white hover:rotate-3 cursor-pointer">
                  Rotate
                </div>
              </div>
            </div>

            {/* Fade In Animations */}
            <div>
              <p className="text-sm text-neutral-500 mb-4">Fade In Animations (applied on load)</p>
              <div className="flex flex-wrap gap-4">
                <div className="px-6 py-4 bg-white border rounded-xl animate-fade-in-right">
                  fade-in-right
                </div>
                <div className="px-6 py-4 bg-white border rounded-xl animate-fade-in-top">
                  fade-in-top
                </div>
                <div className="px-6 py-4 bg-white border rounded-xl animate-dropdown-in">
                  dropdown-in
                </div>
                <div className="px-6 py-4 bg-white border rounded-xl animate-enter">
                  enter
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back link */}
        <div className="pt-8 border-t">
          <Link href="/" className="text-primary hover:underline font-medium">
            ← Обратно към началната страница
          </Link>
        </div>
      </main>
    </div>
  )
}
