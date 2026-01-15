const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export interface Product {
  id: string
  handle: string
  title: string
  description: string | null
  thumbnail: string | null
  images: string[]
  price: number
  compareAtPrice: number | null
  supplierSku: string | null
  supplierTitle: string | null
  brand: string | null
  ingredients: string | null
  ageRange: string | null
  matchScore: number | null
  stock: number
  weight: number | null
  categoryId: string | null
  categoryName: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

// Public API
export async function getProducts(params?: {
  page?: number
  size?: number
  search?: string
  categoryId?: string
}): Promise<PageResponse<Product>> {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', params.page.toString())
  if (params?.size) searchParams.set('size', params.size.toString())
  if (params?.search) searchParams.set('search', params.search)
  if (params?.categoryId) searchParams.set('categoryId', params.categoryId)

  const res = await fetch(`${API_BASE_URL}/api/products?${searchParams}`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function getProductByHandle(handle: string): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/api/products/${handle}`)
  if (!res.ok) throw new Error('Product not found')
  return res.json()
}

// Admin API
export async function getAdminProducts(params?: {
  page?: number
  size?: number
  status?: string
  search?: string
}): Promise<PageResponse<Product>> {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', params.page.toString())
  if (params?.size) searchParams.set('size', params.size.toString())
  if (params?.status) searchParams.set('status', params.status)
  if (params?.search) searchParams.set('search', params.search)

  const res = await fetch(`${API_BASE_URL}/api/admin/products?${searchParams}`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function getAdminProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}`)
  if (!res.ok) throw new Error('Product not found')
  return res.json()
}

export async function updateProductStatus(id: string, status: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}/status?status=${status}`, {
    method: 'PATCH',
  })
  if (!res.ok) throw new Error('Failed to update status')
}

export async function publishAllProducts(): Promise<{ updated: number }> {
  const res = await fetch(`${API_BASE_URL}/api/admin/products/publish-all`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error('Failed to publish products')
  return res.json()
}

export async function updateProductTitle(id: string, title: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  if (!res.ok) throw new Error('Failed to update title')
}

// Sync API
export async function syncProducts(startCode: number, endCode: number): Promise<{
  created: number
  updated: number
  errors: number
  total: number
}> {
  const res = await fetch(
    `${API_BASE_URL}/api/admin/sync/products/range?startCode=${startCode}&endCode=${endCode}`,
    { method: 'POST' }
  )
  if (!res.ok) throw new Error('Failed to sync products')
  return res.json()
}
