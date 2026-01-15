'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Product, PageResponse, getAdminProducts, updateProductStatus } from '@lib/api'

export default function AdminProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<PageResponse<Product> | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const page = parseInt(searchParams.get('page') || '0')
  const status = searchParams.get('status') || ''
  const search = searchParams.get('search') || ''

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const data = await getAdminProducts({
          page,
          size: 20,
          status: status || undefined,
          search: search || undefined,
        })
        setProducts(data)
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [page, status, search])

  async function handleStatusChange(productId: string, newStatus: string) {
    setUpdating(productId)
    try {
      await updateProductStatus(productId, newStatus)
      // Reload products
      const data = await getAdminProducts({
        page,
        size: 20,
        status: status || undefined,
        search: search || undefined,
      })
      setProducts(data)
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setUpdating(null)
    }
  }

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    router.push(`/admin/products?${params.toString()}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <span className="text-sm text-gray-500">
          {products?.totalElements || 0} total
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search products..."
            defaultValue={search}
            onChange={(e) => {
              const value = e.target.value
              if (value.length === 0 || value.length >= 2) {
                updateParams({ search: value || null, page: '0' })
              }
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />

          <select
            value={status}
            onChange={(e) => updateParams({ status: e.target.value || null, page: '0' })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : products?.content.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No products found
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.content.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt=""
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          '📦'
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 line-clamp-1">
                          {product.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {product.supplierTitle}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.supplierSku}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {product.price.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm ${
                        product.stock > 10
                          ? 'text-green-600'
                          : product.stock > 0
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={product.status}
                      onChange={(e) => handleStatusChange(product.id, e.target.value)}
                      disabled={updating === product.id}
                      className={`text-xs px-2 py-1 rounded-full border-0 ${
                        product.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-700'
                          : product.status === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      } ${updating === product.id ? 'opacity-50' : ''}`}
                    >
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {products && products.totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {products.number + 1} of {products.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => updateParams({ page: (page - 1).toString() })}
                disabled={products.first}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => updateParams({ page: (page + 1).toString() })}
                disabled={products.last}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
