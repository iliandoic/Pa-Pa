'use client'

import { useState } from 'react'

export default function AdminSyncPage() {
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
      const res = await fetch(
        `${API_URL}/api/admin/sync/products/range?startCode=${startCode}&endCode=${endCode}`,
        { method: 'POST' }
      )

      if (!res.ok) {
        throw new Error('Sync failed')
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

        <p className="text-sm text-gray-500 mb-6">
          Import products from Mistral by specifying a code range. Each code
          represents a unique product in the Mistral system.
        </p>

        <div className="space-y-4">
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
            Range: {endCode - startCode + 1} codes (may take a while for large ranges)
          </p>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>

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
