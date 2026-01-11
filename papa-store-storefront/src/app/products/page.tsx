import Link from "next/link"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-primary">
            Pa-Pa
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/products" className="text-primary font-medium">
              Продукти
            </Link>
            <Link href="/cart" className="text-neutral-600 hover:text-primary transition-colors">
              Кошница
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl font-bold mb-8">Продукти</h1>

        <div className="bg-neutral-50 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl font-semibold mb-4">Продуктите се зареждат</h2>
          <p className="text-neutral-600 mb-6">
            Скоро тук ще намерите над 10,000 продукта за вашето бебе.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Обратно към началото
          </Link>
        </div>
      </main>
    </div>
  )
}
