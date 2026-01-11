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
          <h1 className="font-heading text-lg font-semibold">Design System</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Colors */}
        <section>
          <h2 className="font-heading text-2xl font-bold mb-6">Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Primary */}
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-primary shadow-primary"></div>
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-neutral-500">#FF6B52</p>
            </div>
            {/* Secondary */}
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-secondary shadow-secondary"></div>
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs text-neutral-500">#0EA5E9</p>
            </div>
            {/* Mint */}
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-mint"></div>
              <p className="text-sm font-medium">Mint</p>
              <p className="text-xs text-neutral-500">#14B8A6</p>
            </div>
            {/* Sunny */}
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-sunny"></div>
              <p className="text-sm font-medium">Sunny</p>
              <p className="text-xs text-neutral-500">#EAB308</p>
            </div>
            {/* Lavender */}
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-lavender"></div>
              <p className="text-sm font-medium">Lavender</p>
              <p className="text-xs text-neutral-500">#A855F7</p>
            </div>
            {/* Peach */}
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-peach"></div>
              <p className="text-sm font-medium">Peach</p>
              <p className="text-xs text-neutral-500">#F97316</p>
            </div>
          </div>

          {/* Semantic Colors */}
          <h3 className="font-heading text-lg font-semibold mt-8 mb-4">Semantic Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-16 rounded-xl bg-success"></div>
              <p className="text-sm font-medium">Success</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-xl bg-warning"></div>
              <p className="text-sm font-medium">Warning</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-xl bg-error"></div>
              <p className="text-sm font-medium">Error</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-xl bg-info"></div>
              <p className="text-sm font-medium">Info</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
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
        <section>
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
