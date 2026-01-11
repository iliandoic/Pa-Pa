import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 - Страницата не е намерена",
  description: "Страницата която търсите не съществува",
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="font-display text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="font-heading text-2xl font-semibold mb-4">Страницата не е намерена</h2>
        <p className="text-neutral-600 mb-8">
          Съжаляваме, но страницата която търсите не съществува.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Към началната страница
        </Link>
      </div>
    </div>
  )
}
