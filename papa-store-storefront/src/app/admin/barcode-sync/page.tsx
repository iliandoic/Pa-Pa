'use client'

import { useCallback, useEffect, useState } from 'react'

interface UploadResult {
  line: string
  sku?: string
  barcode?: string
  status: 'updated' | 'created' | 'not_found' | 'error' | 'skipped'
  message?: string
}

interface UploadResponse {
  status: string
  updated: number
  created: number
  notFound: number
  errors: number
  skipped: number
  total: number
  results: UploadResult[]
}

interface Stats {
  totalProducts: number
  withBarcode: number
  withoutBarcode: number
  coverage: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function BarcodeSyncPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [response, setResponse] = useState<UploadResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)

  // CSV options
  const [delimiter, setDelimiter] = useState(',')
  const [hasHeader, setHasHeader] = useState(true)
  const [skuColumn, setSkuColumn] = useState(0)
  const [nameColumn, setNameColumn] = useState(1)
  const [barcodeColumn, setBarcodeColumn] = useState(3)
  const [createMissing, setCreateMissing] = useState(false)

  // Load stats on mount
  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const res = await fetch(`${API_URL}/api/admin/barcodes/stats`)
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.type === 'text/csv')) {
      setFile(droppedFile)
      setError(null)
      setResponse(null)
    } else {
      setError('Please upload a CSV file')
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setResponse(null)
    }
  }

  async function handleUpload() {
    if (!file) return

    setUploading(true)
    setError(null)
    setResponse(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const params = new URLSearchParams({
        delimiter,
        hasHeader: hasHeader.toString(),
        skuColumn: skuColumn.toString(),
        nameColumn: nameColumn.toString(),
        barcodeColumn: barcodeColumn.toString(),
        createMissing: createMissing.toString()
      })

      const res = await fetch(`${API_URL}/api/admin/barcodes/upload?${params}`, {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (res.ok) {
        setResponse(data)
        loadStats() // Refresh stats
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (err) {
      setError('Failed to upload file')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Barcode Sync</h2>

      {/* Stats */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Current Coverage</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
              <p className="text-sm text-gray-500">Total Products</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.withBarcode}</p>
              <p className="text-sm text-gray-500">With Barcode</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.withoutBarcode}</p>
              <p className="text-sm text-gray-500">Without Barcode</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">{stats.coverage.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Coverage</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Upload CSV</h3>

        {/* CSV Options */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delimiter</label>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="\t">Tab</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Has Header</label>
            <select
              value={hasHeader ? 'yes' : 'no'}
              onChange={(e) => setHasHeader(e.target.value === 'yes')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU Column</label>
            <input
              type="number"
              min="0"
              value={skuColumn}
              onChange={(e) => setSkuColumn(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name Column</label>
            <input
              type="number"
              min="0"
              value={nameColumn}
              onChange={(e) => setNameColumn(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Barcode Column</label>
            <input
              type="number"
              min="0"
              value={barcodeColumn}
              onChange={(e) => setBarcodeColumn(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Create Missing Products */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={createMissing}
              onChange={(e) => setCreateMissing(e.target.checked)}
              className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Create missing products</span>
            <span className="text-xs text-gray-500">(Products not found will be created as drafts)</span>
          </label>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={(e) => { e.preventDefault(); setDragOver(false) }}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-4 ${
            dragOver
              ? 'border-primary-500 bg-primary-50'
              : file
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            {file ? (
              <div>
                <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-800 font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                <p className="text-xs text-primary-600 mt-2">Click to change file</p>
              </div>
            ) : (
              <div>
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600 mb-1">
                  <span className="text-primary-600 font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">CSV file with SKU and Barcode columns</p>
              </div>
            )}
          </label>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {uploading ? 'Uploading...' : 'Upload and Sync Barcodes'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Results */}
      {response && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Results</h3>

          {/* Summary */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-gray-800">{response.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-green-600">{response.updated}</p>
              <p className="text-xs text-gray-500">Updated</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-blue-600">{response.created}</p>
              <p className="text-xs text-gray-500">Created</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-yellow-600">{response.notFound}</p>
              <p className="text-xs text-gray-500">Not Found</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-red-600">{response.errors}</p>
              <p className="text-xs text-gray-500">Errors</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-gray-500">{response.skipped}</p>
              <p className="text-xs text-gray-500">Skipped</p>
            </div>
          </div>

          {/* Details Table */}
          {response.results.length > 0 && (
            <div className="max-h-96 overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Line</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Barcode</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {response.results.map((result, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-500">{result.line}</td>
                      <td className="px-3 py-2 text-gray-800">{result.sku || '-'}</td>
                      <td className="px-3 py-2 text-gray-800 font-mono">{result.barcode || '-'}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          result.status === 'updated' ? 'bg-green-100 text-green-700' :
                          result.status === 'created' ? 'bg-blue-100 text-blue-700' :
                          result.status === 'not_found' ? 'bg-yellow-100 text-yellow-700' :
                          result.status === 'error' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {result.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-500">{result.message || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Help */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4">
        <h4 className="font-medium text-blue-800 mb-2">CSV Format</h4>
        <p className="text-sm text-blue-700 mb-2">
          Your CSV file should contain SKU and Barcode columns. Example:
        </p>
        <pre className="bg-white rounded p-2 text-xs text-gray-600 overflow-x-auto">
{`sku,barcode
4385,5201234567890
4384,5209876543210
4383,5201111222333`}
        </pre>
      </div>
    </div>
  )
}
