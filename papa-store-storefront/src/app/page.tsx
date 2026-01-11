import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-primary">
            Pa-Pa
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/products" className="text-neutral-600 hover:text-primary transition-colors">
              Продукти
            </Link>
            <Link href="/cart" className="text-neutral-600 hover:text-primary transition-colors">
              Кошница
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-5xl md:text-7xl font-bold text-neutral-900 mb-6">
          Добре дошли в{" "}
          <span className="text-primary">Pa-Pa</span>
        </h1>
        <p className="font-body text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
          Всичко за вашето бебе на едно място. Качествени продукти на достъпни цени.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl"
        >
          Разгледай продуктите
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2">Качествени продукти</h3>
            <p className="text-neutral-600">Внимателно подбрани продукти от водещи марки</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2">Достъпни цени</h3>
            <p className="text-neutral-600">Конкурентни цени и редовни промоции</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="w-12 h-12 bg-mint-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2">Бърза доставка</h3>
            <p className="text-neutral-600">Доставка до адрес или офис на Speedy/Econt</p>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-neutral-50 rounded-3xl p-12">
          <h2 className="font-heading text-3xl font-bold mb-4">Очаквайте скоро</h2>
          <p className="text-neutral-600 text-lg mb-6">
            Работим усилено по добавянето на продукти. Скоро ще можете да разгледате пълния ни каталог!
          </p>
          <div className="inline-flex items-center gap-2 text-primary font-medium">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Зареждане на продукти...
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-neutral-50 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-display text-xl font-bold text-primary">Pa-Pa</div>
            <p className="text-neutral-500 text-sm">
              © 2024 Pa-Pa Baby Shop. Всички права запазени.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
