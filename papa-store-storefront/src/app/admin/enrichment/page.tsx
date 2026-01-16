'use client'

import { useEffect, useState, useRef } from 'react'
import {
  EnrichmentStats,
  EnrichmentResult,
  Product,
  PageResponse,
  getEnrichmentStats,
  getEnrichmentQueue,
  getEnrichedProducts,
  enrichNextProducts,
  approveProduct,
  rejectProduct,
  bulkApproveProducts,
  updateProductTitle,
} from '@/lib/api'
import ImageUploader from '@/components/admin/ImageUploader'

type Tab = 'queue' | 'enriched'

interface Category {
  id: string
  name: string
  handle: string
}

export default function EnrichmentPage() {
  const [stats, setStats] = useState<EnrichmentStats | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('enriched')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [enriching, setEnriching] = useState(false)
  const [enrichCount, setEnrichCount] = useState(10)
  const [lastResults, setLastResults] = useState<EnrichmentResult[] | null>(null)
  const [bulkApproving, setBulkApproving] = useState(false)
  const [minConfidence, setMinConfidence] = useState(0.9)

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  useEffect(() => {
    loadStats()
    loadProducts()
    loadCategories()
  }, [activeTab, page])

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingId])

  async function loadCategories() {
    try {
      const res = await fetch(`${API_URL}/api/admin/categories/all`)
      if (res.ok) {
        setCategories(await res.json())
      }
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  async function loadStats() {
    try {
      const data = await getEnrichmentStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  async function loadProducts() {
    setLoading(true)
    try {
      const data: PageResponse<Product> = activeTab === 'queue'
        ? await getEnrichmentQueue(page, 20)
        : await getEnrichedProducts(page, 20)
      setProducts(data.content)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleEnrichNext() {
    setEnriching(true)
    setLastResults(null)
    try {
      const result = await enrichNextProducts(enrichCount)
      setLastResults(result.results)
      loadStats()
      loadProducts()
    } catch (err) {
      console.error('Failed to enrich:', err)
    } finally {
      setEnriching(false)
    }
  }

  async function handleApprove(productId: string) {
    try {
      await approveProduct(productId)
      loadStats()
      loadProducts()
    } catch (err) {
      console.error('Failed to approve:', err)
    }
  }

  async function handleReject(productId: string) {
    try {
      await rejectProduct(productId)
      loadStats()
      loadProducts()
    } catch (err) {
      console.error('Failed to reject:', err)
    }
  }

  async function handleBulkApprove() {
    if (!confirm(`Approve all products with ${(minConfidence * 100).toFixed(0)}%+ confidence?`)) return
    setBulkApproving(true)
    try {
      const result = await bulkApproveProducts(minConfidence)
      alert(`Approved ${result.approved} products`)
      loadStats()
      loadProducts()
    } catch (err) {
      console.error('Failed to bulk approve:', err)
    } finally {
      setBulkApproving(false)
    }
  }

  // Inline title editing
  function startEditing(product: Product) {
    setEditingId(product.id)
    setEditingTitle(product.title)
  }

  async function handleTitleSave(productId: string) {
    if (!editingTitle.trim()) return
    setUpdating(productId)
    try {
      await updateProductTitle(productId, editingTitle.trim())
      setProducts(products.map(p =>
        p.id === productId ? { ...p, title: editingTitle.trim() } : p
      ))
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

  // Quick edit modal
  function openQuickView(product: Product) {
    // Parse images from JSON string if needed
    let images: string[] = []
    try {
      images = typeof product.images === 'string'
        ? JSON.parse(product.images)
        : (product.images || [])
    } catch { images = [] }

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
      images
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

      // Update local state
      const category = categories.find(c => c.id === quickEditData.categoryId)
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
        images: quickEditData.images as unknown as string[],
      }
      setQuickViewProduct(updatedProduct)
      setProducts(products.map(p =>
        p.id === quickViewProduct.id ? updatedProduct : p
      ))
      closeQuickView()
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setQuickEditSaving(false)
    }
  }

  function getConfidenceColor(score: number | null): string {
    if (score === null) return 'text-gray-400'
    if (score >= 0.9) return 'text-green-600'
    if (score >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  function getConfidenceBg(score: number | null): string {
    if (score === null) return 'bg-gray-100'
    if (score >= 0.9) return 'bg-green-100'
    if (score >= 0.7) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  function parseImages(product: Product): string[] {
    try {
      return typeof product.images === 'string'
        ? JSON.parse(product.images)
        : (product.images || [])
    } catch { return [] }
  }

  function parseBarcodes(product: Product): string[] {
    try {
      return typeof product.barcodes === 'string'
        ? JSON.parse(product.barcodes)
        : (product.barcodes || [])
    } catch { return [] }
  }

  return (
    <div className="max-w-6xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Enrichment</h2>

      {/* Stats */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Enrichment Progress</h3>
          <div className="grid grid-cols-6 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Products</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.enriched}</p>
              <p className="text-sm text-gray-500">Enriched</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.notEnriched}</p>
              <p className="text-sm text-gray-500">Not Enriched</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.highConfidence}</p>
              <p className="text-sm text-gray-500">High Confidence</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.withBarcodes}</p>
              <p className="text-sm text-gray-500">With Barcodes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">{stats.enrichmentProgress.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Progress</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-500"
              style={{ width: `${stats.enrichmentProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Actions</h3>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Enrich Next */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Enrich next</label>
            <input
              type="number"
              min="1"
              max="100"
              value={enrichCount}
              onChange={(e) => setEnrichCount(parseInt(e.target.value) || 10)}
              className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center"
            />
            <button
              onClick={handleEnrichNext}
              disabled={enriching}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              {enriching ? 'Enriching...' : 'Start'}
            </button>
          </div>

          <div className="w-px h-8 bg-gray-200" />

          {/* Bulk Approve */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Bulk approve</label>
            <select
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="0.95">95%+</option>
              <option value="0.9">90%+</option>
              <option value="0.85">85%+</option>
              <option value="0.8">80%+</option>
            </select>
            <button
              onClick={handleBulkApprove}
              disabled={bulkApproving}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {bulkApproving ? 'Approving...' : 'Bulk Approve'}
            </button>
          </div>
        </div>
      </div>

      {/* Last Results */}
      {lastResults && lastResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Last Enrichment Results
          </h3>
          <div className="max-h-48 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lastResults.map((result, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-mono text-gray-800">{result.supplierSku || '-'}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {result.success ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {result.matchScore !== null ? `${(result.matchScore * 100).toFixed(0)}%` : '-'}
                    </td>
                    <td className="px-3 py-2 text-gray-500">{result.source || '-'}</td>
                    <td className="px-3 py-2 text-gray-500 truncate max-w-xs">{result.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b flex">
          <button
            onClick={() => { setActiveTab('enriched'); setPage(0) }}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'enriched'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Enriched Products ({stats?.enriched || 0})
          </button>
          <button
            onClick={() => { setActiveTab('queue'); setPage(0) }}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'queue'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Enrichment Queue ({stats?.notEnriched || 0})
          </button>
        </div>

        {/* Products List */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {activeTab === 'queue' ? 'No products in queue' : 'No enriched products'}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => {
                const images = parseImages(product)
                const barcodes = parseBarcodes(product)
                const thumbnail = images.length > 0 ? images[0] : null

                return (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-4">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {/* Title with inline edit */}
                            {editingId === product.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  ref={editInputRef}
                                  type="text"
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  onKeyDown={(e) => handleTitleKeyDown(e, product.id)}
                                  onBlur={() => handleTitleSave(product.id)}
                                  disabled={updating === product.id}
                                  className="flex-1 px-2 py-1 text-sm border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 group/title">
                                <h4 className="font-medium text-gray-800 truncate">{product.title}</h4>
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
                            <p className="text-sm text-gray-500">
                              SKU: {product.supplierSku || '-'} | Barcode: {barcodes.join(', ') || '-'}
                            </p>
                            {product.enrichmentSource && (
                              <p className="text-xs text-gray-400 mt-1">
                                Source: {product.enrichmentSource}
                              </p>
                            )}
                          </div>

                          {/* Confidence Score */}
                          {activeTab === 'enriched' && (
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceBg(product.enrichmentMatchScore)} ${getConfidenceColor(product.enrichmentMatchScore)}`}>
                              {product.enrichmentMatchScore !== null
                                ? `${(product.enrichmentMatchScore * 100).toFixed(0)}%`
                                : '-'}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          {activeTab === 'enriched' && (
                            <>
                              <button
                                onClick={() => handleApprove(product.id)}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(product.id)}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => openQuickView(product)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Help */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4">
        <h4 className="font-medium text-blue-800 mb-2">How Enrichment Works</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. Products with barcodes are searched on Bulgarian e-commerce sites (eMag, Gladen)</li>
          <li>2. Matching products provide better titles, descriptions, and images</li>
          <li>3. High confidence (90%+) matches can be bulk approved</li>
          <li>4. Lower confidence matches should be manually reviewed</li>
        </ul>
      </div>

      {/* Quick Edit Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeQuickView}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Edit Product</h3>
                <div className="flex gap-4 text-xs text-gray-400">
                  {quickViewProduct.supplierSku && <span>SKU: {quickViewProduct.supplierSku}</span>}
                  {quickViewProduct.enrichmentSource && <span>Source: {quickViewProduct.enrichmentSource}</span>}
                  {quickViewProduct.enrichmentMatchScore && (
                    <span>Match: {(quickViewProduct.enrichmentMatchScore * 100).toFixed(0)}%</span>
                  )}
                </div>
              </div>
              <button
                onClick={closeQuickView}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Two Column Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Column - Images */}
              <div className="w-80 flex-shrink-0 border-r bg-gray-50 p-4 overflow-y-auto">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Images</h4>
                <ImageUploader
                  images={quickEditData.images}
                  onChange={(urls) => setQuickEditData({ ...quickEditData, images: urls })}
                  maxImages={10}
                  compact
                />
              </div>

              {/* Right Column - Form Fields */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  {/* Title */}
                  <div>
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

                  {/* Row: Price, Compare Price, Stock */}
                  <div className="grid grid-cols-3 gap-3">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={quickEditData.compareAtPrice}
                        onChange={(e) => setQuickEditData({ ...quickEditData, compareAtPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Original"
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
                  </div>

                  {/* Row: Status, Category, Weight */}
                  <div className="grid grid-cols-3 gap-3">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={quickEditData.weight}
                        onChange={(e) => setQuickEditData({ ...quickEditData, weight: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  {/* Row: Brand, Age Range */}
                  <div className="grid grid-cols-2 gap-3">
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
                        placeholder="e.g., 0-6 months"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={quickEditData.description}
                      onChange={(e) => setQuickEditData({ ...quickEditData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Ingredients */}
                  <div>
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
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 flex-shrink-0">
              <div className="flex gap-2">
                {activeTab === 'enriched' && (
                  <>
                    <button
                      onClick={() => { handleApprove(quickViewProduct.id); closeQuickView() }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => { handleReject(quickViewProduct.id); closeQuickView() }}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
              <div className="flex gap-3">
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
        </div>
      )}
    </div>
  )
}
