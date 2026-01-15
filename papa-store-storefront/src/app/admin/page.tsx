'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  totalProducts: number
  publishedProducts: number
  draftProducts: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

        const [allRes, publishedRes, draftRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/products?size=1`),
          fetch(`${API_URL}/api/admin/products?size=1&status=PUBLISHED`),
          fetch(`${API_URL}/api/admin/products?size=1&status=DRAFT`),
        ])

        const [all, published, draft] = await Promise.all([
          allRes.json(),
          publishedRes.json(),
          draftRes.json(),
        ])

        setStats({
          totalProducts: all.totalElements,
          publishedProducts: published.totalElements,
          draftProducts: draft.totalElements,
        })
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon="📦"
          href="/admin/products"
        />
        <StatCard
          title="Published"
          value={stats?.publishedProducts || 0}
          icon="✅"
          color="green"
          href="/admin/products?status=PUBLISHED"
        />
        <StatCard
          title="Draft"
          value={stats?.draftProducts || 0}
          icon="📝"
          color="yellow"
          href="/admin/products?status=DRAFT"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/sync"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Sync from Mistral
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color = 'primary',
  href,
}: {
  title: string
  value: number
  icon: string
  color?: 'primary' | 'green' | 'yellow'
  href: string
}) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  }

  return (
    <Link
      href={href}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </Link>
  )
}
