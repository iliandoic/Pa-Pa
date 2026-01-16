'use client'

import { useEffect, useState } from 'react'
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
} from '@/lib/api'

type Tab = 'queue' | 'enriched'

export default function EnrichmentPage() {
  const [stats, setStats] = useState<EnrichmentStats | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('enriched')
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [enriching, setEnriching] = useState(false)
  const [enrichCount, setEnrichCount] = useState(10)
  const [lastResults, setLastResults] = useState<EnrichmentResult[] | null>(null)
  const [bulkApproving, setBulkApproving] = useState(false)
  const [minConfidence, setMinConfidence] = useState(0.9)

  useEffect(() => {
    loadStats()
    loadProducts()
  }, [activeTab, page])

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
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-medium text-gray-800 truncate">{product.title}</h4>
                          <p className="text-sm text-gray-500">
                            SKU: {product.supplierSku || '-'} | Barcode: {product.barcodes?.join(', ') || '-'}
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
                      {activeTab === 'enriched' && (
                        <div className="flex items-center gap-2 mt-3">
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
                          <a
                            href={`/admin/products/${product.id}`}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                          >
                            Edit
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
    </div>
  )
}
