'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Product, PageResponse, getAdminProducts, updateProductStatus, updateProductTitle } from '@lib/api'
import ImageUploader from '@/components/admin/ImageUploader'

interface Category {
  id: string
  name: string
  handle: string
}

export default function AdminProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<PageResponse<Product> | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)

  // Quick edit modal state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [quickEditData, setQuickEditData] = useState({
    title: '',
    description: '',
    price: '',
    compareAtPrice: '',
    stock: '',
    weight: '',
    status: '',
    brand: '',
    ingredients: '',
    ageRange: '',
    categoryId: '',
    images: [] as string[]
  })
  const [quickEditSaving, setQuickEditSaving] = useState(false)

  // Image hover preview state
  const [hoverImage, setHoverImage] = useState<{ url: string; x: number; y: number } | null>(null)

  const page = parseInt(searchParams.get('page') || '0')
  const size = parseInt(searchParams.get('size') || '20')
  const status = searchParams.get('status') || ''
  const search = searchParams.get('search') || ''

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAdminProducts({
            page,
            size,
            status: status || undefined,
            search: search || undefined,
          }),
          fetch(`${API_URL}/api/admin/categories/all`).then(res => res.ok ? res.json() : [])
        ])
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [page, size, status, search, API_URL])

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingId])

  async function handleStatusChange(productId: string, newStatus: string) {
    setUpdating(productId)
    try {
      await updateProductStatus(productId, newStatus)
      // Reload products
      const data = await getAdminProducts({
        page,
        size,
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

  async function handleTitleSave(productId: string) {
    if (!editingTitle.trim()) return
    setUpdating(productId)
    try {
      await updateProductTitle(productId, editingTitle.trim())
      // Update local state
      if (products) {
        setProducts({
          ...products,
          content: products.content.map(p =>
            p.id === productId ? { ...p, title: editingTitle.trim() } : p
          )
        })
      }
      setEditingId(null)
    } catch (error) {
      console.error('Failed to update title:', error)
    } finally {
      setUpdating(null)
    }
  }

  function handleTitleKeyDown(e: React.KeyboardEvent, productId: string) {
    if (e.key === 'Enter') {
      handleTitleSave(productId)
    } else if (e.key === 'Escape') {
      setEditingId(null)
    }
  }

  function startEditing(product: Product) {
    setEditingId(product.id)
    setEditingTitle(product.title)
  }

  function openQuickView(product: Product) {
    setQuickViewProduct(product)
    setQuickEditData({
      title: product.title,
      description: product.description || '',
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || '',
      stock: product.stock.toString(),
      weight: product.weight?.toString() || '',
      status: product.status,
      brand: product.brand || '',
      ingredients: product.ingredients || '',
      ageRange: product.ageRange || '',
      categoryId: product.categoryId || '',
      images: product.images || []
    })
  }

  function closeQuickView() {
    setQuickViewProduct(null)
  }

  async function handleQuickEditSave() {
    if (!quickViewProduct) return
    setQuickEditSaving(true)
    try {
      const payload = {
        title: quickEditData.title,
        description: quickEditData.description || null,
        price: quickEditData.price ? parseFloat(quickEditData.price) : null,
        compareAtPrice: quickEditData.compareAtPrice ? parseFloat(quickEditData.compareAtPrice) : null,
        stock: quickEditData.stock ? parseInt(quickEditData.stock) : null,
        weight: quickEditData.weight ? parseFloat(quickEditData.weight) : null,
        status: quickEditData.status,
        brand: quickEditData.brand || null,
        ingredients: quickEditData.ingredients || null,
        ageRange: quickEditData.ageRange || null,
        categoryId: quickEditData.categoryId || '',
        images: JSON.stringify(quickEditData.images)
      }

      const res = await fetch(`${API_URL}/api/admin/products/${quickViewProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to save')

      // Find category name
      const category = categories.find(c => c.id === quickEditData.categoryId)

      // Update local state
      const updatedProduct: Product = {
        ...quickViewProduct,
        title: quickEditData.title,
        description: quickEditData.description || null,
        price: parseFloat(quickEditData.price) || 0,
        compareAtPrice: quickEditData.compareAtPrice ? parseFloat(quickEditData.compareAtPrice) : null,
        stock: parseInt(quickEditData.stock) || 0,
        weight: quickEditData.weight ? parseFloat(quickEditData.weight) : null,
        status: quickEditData.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
        brand: quickEditData.brand || null,
        ingredients: quickEditData.ingredients || null,
        ageRange: quickEditData.ageRange || null,
        categoryId: quickEditData.categoryId || null,
        categoryName: category?.name || null,
        images: quickEditData.images,
        thumbnail: quickEditData.images[0] || null
      }
      setQuickViewProduct(updatedProduct)
      if (products) {
        setProducts({
          ...products,
          content: products.content.map(p =>
            p.id === quickViewProduct.id ? updatedProduct : p
          )
        })
      }
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setQuickEditSaving(false)
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

  function handleImageHover(e: React.MouseEvent, imageUrl: string | null) {
    if (!imageUrl) return
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setHoverImage({
      url: imageUrl,
      x: rect.right + 10,
      y: rect.top
    })
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
        <div className="flex flex-wrap gap-4 items-center">
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

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-500">Show:</span>
            <select
              value={size}
              onChange={(e) => updateParams({ size: e.target.value, page: '0' })}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-500">per page</span>
          </div>
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
          <div className="max-h-[calc(100vh-320px)] overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products?.content.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => openQuickView(product)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg relative"
                          onMouseEnter={(e) => handleImageHover(e, product.thumbnail)}
                          onMouseLeave={() => setHoverImage(null)}
                        >
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
                        <div className="flex-1 min-w-0">
                          {editingId === product.id ? (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <input
                                ref={editInputRef}
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={(e) => handleTitleKeyDown(e, product.id)}
                                onBlur={() => handleTitleSave(product.id)}
                                disabled={updating === product.id}
                                className="w-full px-2 py-1 text-sm border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 group/title">
                              <p className="font-medium text-gray-800 line-clamp-1">
                                {product.title}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  startEditing(product)
                                }}
                                className="text-gray-300 hover:text-primary-500 opacity-0 group-hover/title:opacity-100 transition-opacity flex-shrink-0"
                                title="Edit title"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                            </div>
                          )}
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
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
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
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
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
          </div>
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

      {/* Image Hover Preview */}
      {hoverImage && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: hoverImage.x, top: hoverImage.y }}
        >
          <div className="bg-white rounded-lg shadow-xl p-1 border">
            <img
              src={hoverImage.url}
              alt=""
              className="w-48 h-48 object-cover rounded"
            />
          </div>
        </div>
      )}

      {/* Quick Edit Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeQuickView}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Edit Product</h3>
                {quickViewProduct.supplierSku && (
                  <p className="text-xs text-gray-400">SKU: {quickViewProduct.supplierSku}</p>
                )}
              </div>
              <button
                onClick={closeQuickView}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Info Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={quickEditData.title}
                      onChange={(e) => setQuickEditData({ ...quickEditData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {quickViewProduct.supplierTitle && quickViewProduct.supplierTitle !== quickEditData.title && (
                      <p className="text-xs text-gray-400 mt-1">Supplier: {quickViewProduct.supplierTitle}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={quickEditData.description}
                      onChange={(e) => setQuickEditData({ ...quickEditData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (EUR)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={quickEditData.price}
                      onChange={(e) => setQuickEditData({ ...quickEditData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compare at Price (EUR)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={quickEditData.compareAtPrice}
                      onChange={(e) => setQuickEditData({ ...quickEditData, compareAtPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Original price for discounts"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      value={quickEditData.stock}
                      onChange={(e) => setQuickEditData({ ...quickEditData, stock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={quickEditData.weight}
                      onChange={(e) => setQuickEditData({ ...quickEditData, weight: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="For shipping"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={quickEditData.status}
                      onChange={(e) => setQuickEditData({ ...quickEditData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={quickEditData.categoryId}
                      onChange={(e) => setQuickEditData({ ...quickEditData, categoryId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">No Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Details Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Product Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                      type="text"
                      value={quickEditData.brand}
                      onChange={(e) => setQuickEditData({ ...quickEditData, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                    <input
                      type="text"
                      value={quickEditData.ageRange}
                      onChange={(e) => setQuickEditData({ ...quickEditData, ageRange: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 0-6 months, 1-3 years"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                    <textarea
                      value={quickEditData.ingredients}
                      onChange={(e) => setQuickEditData({ ...quickEditData, ingredients: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Images</h4>
                <ImageUploader
                  images={quickEditData.images}
                  onChange={(urls) => setQuickEditData({ ...quickEditData, images: urls })}
                  maxImages={10}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50 sticky bottom-0">
              <button
                onClick={closeQuickView}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickEditSave}
                disabled={quickEditSaving}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                {quickEditSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
