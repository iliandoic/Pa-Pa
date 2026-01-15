'use client'

import { useState } from 'react'

type SyncMethod = 'rows' | 'codes'

export default function AdminSyncPage() {
  const [syncMethod, setSyncMethod] = useState<SyncMethod>('rows')
  const [fromRow, setFromRow] = useState(1)
  const [toRow, setToRow] = useState(1000)
  const [startCode, setStartCode] = useState(1)
  const [endCode, setEndCode] = useState(100)
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState<{
    created: number
    updated: number
    errors: number
    total: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSync() {
    setSyncing(true)
    setResult(null)
    setError(null)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

      const url = syncMethod === 'rows'
        ? `${API_URL}/api/admin/sync/products/rows?fromRow=${fromRow}&toRow=${toRow}`
        : `${API_URL}/api/admin/sync/products/range?startCode=${startCode}&endCode=${endCode}`

      const res = await fetch(url, { method: 'POST' })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Sync failed')
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Sync</h2>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Sync from Mistral
        </h3>

        {/* Sync Method Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sync Method
          </label>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setSyncMethod('rows')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                syncMethod === 'rows'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              By Row Range (Fast)
            </button>
            <button
              type="button"
              onClick={() => setSyncMethod('codes')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                syncMethod === 'codes'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              By Code Range
            </button>
          </div>
        </div>

        {syncMethod === 'rows' ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Import products using row-based pagination. This is the fastest method
              for bulk imports (~1000 products in 6 minutes).
            </p>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Row
                </label>
                <input
                  type="number"
                  value={fromRow}
                  onChange={(e) => setFromRow(parseInt(e.target.value) || 1)}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Row
                </label>
                <input
                  type="number"
                  value={toRow}
                  onChange={(e) => setToRow(parseInt(e.target.value) || 1000)}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Range: {toRow - fromRow + 1} rows (max 5000 per request)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Import products by searching for specific Mistral product codes.
              Slower but useful for targeting specific products.
            </p>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Code
                </label>
                <input
                  type="number"
                  value={startCode}
                  onChange={(e) => setStartCode(parseInt(e.target.value) || 1)}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Code
                </label>
                <input
                  type="number"
                  value={endCode}
                  onChange={(e) => setEndCode(parseInt(e.target.value) || 100)}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Range: {endCode - startCode + 1} codes (max 50000 per request)
            </p>
          </div>
        )}

        <button
          onClick={handleSync}
          disabled={syncing}
          className="mt-6 w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Syncing...
            </span>
          ) : (
            'Start Sync'
          )}
        </button>

        {/* Result */}
        {result && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Sync Complete</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-green-700">Created: {result.created}</p>
              <p className="text-green-700">Updated: {result.updated}</p>
              <p className="text-green-700">Errors: {result.errors}</p>
              <p className="text-green-700">Total: {result.total}</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
