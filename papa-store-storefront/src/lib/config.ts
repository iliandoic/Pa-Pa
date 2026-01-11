// API Client for Papa Store - Spring Boot backend

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface FetchOptions extends RequestInit {
  query?: Record<string, any>
  next?: {
    tags?: string[]
    revalidate?: number
  }
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { query, next, ...fetchOptions } = options

    let url = `${this.baseUrl}${endpoint}`

    // Add query parameters
    if (query) {
      const params = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
      const queryString = params.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(fetchOptions.headers as Record<string, string>),
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      next,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || `API error: ${response.status}`)
    }

    return response.json()
  }
}

export const api = new ApiClient(API_BASE_URL)

// Convenience methods that match old sdk patterns
export const sdk = {
  client: {
    fetch: <T>(endpoint: string, options?: FetchOptions) =>
      api.fetch<T>(endpoint, options),
  },
  store: {
    product: {
      list: (query?: Record<string, any>) =>
        api.fetch<{ products: any[]; count: number }>("/api/products", {
          method: "GET",
          query,
        }),
      retrieve: (handle: string, query?: Record<string, any>) =>
        api.fetch<{ product: any }>(`/api/products/${handle}`, {
          method: "GET",
          query,
        }),
    },
    category: {
      list: (query?: Record<string, any>) =>
        api.fetch<{ product_categories: any[] }>("/api/categories", {
          method: "GET",
          query,
        }),
      retrieve: (handle: string, query?: Record<string, any>) =>
        api.fetch<{ product_category: any }>(`/api/categories/${handle}`, {
          method: "GET",
          query,
        }),
    },
    collection: {
      list: (query?: Record<string, any>) =>
        api.fetch<{ collections: any[] }>("/api/collections", {
          method: "GET",
          query,
        }),
      retrieve: (handle: string, query?: Record<string, any>) =>
        api.fetch<{ collection: any }>(`/api/collections/${handle}`, {
          method: "GET",
          query,
        }),
    },
    region: {
      list: () =>
        api.fetch<{ regions: any[] }>("/api/regions", { method: "GET" }),
      retrieve: (id: string) =>
        api.fetch<{ region: any }>(`/api/regions/${id}`, { method: "GET" }),
    },
    cart: {
      create: (data: any, query?: any, headers?: any) =>
        api.fetch<{ cart: any }>("/api/cart", {
          method: "POST",
          body: JSON.stringify(data),
          headers,
        }),
      retrieve: (id: string, query?: any, headers?: any) =>
        api.fetch<{ cart: any }>(`/api/cart/${id}`, {
          method: "GET",
          query,
          headers,
        }),
      update: (id: string, data: any, query?: any, headers?: any) =>
        api.fetch<{ cart: any }>(`/api/cart/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
          headers,
        }),
      createLineItem: (cartId: string, data: any, query?: any, headers?: any) =>
        api.fetch<{ cart: any }>(`/api/cart/${cartId}/items`, {
          method: "POST",
          body: JSON.stringify(data),
          headers,
        }),
      updateLineItem: (
        cartId: string,
        lineId: string,
        data: any,
        query?: any,
        headers?: any
      ) =>
        api.fetch<{ cart: any }>(`/api/cart/${cartId}/items/${lineId}`, {
          method: "PATCH",
          body: JSON.stringify(data),
          headers,
        }),
      deleteLineItem: (cartId: string, lineId: string, query?: any, headers?: any) =>
        api.fetch<void>(`/api/cart/${cartId}/items/${lineId}`, {
          method: "DELETE",
          headers,
        }),
      addShippingMethod: (cartId: string, data: any, query?: any, headers?: any) =>
        api.fetch<{ cart: any }>(`/api/cart/${cartId}/shipping-methods`, {
          method: "POST",
          body: JSON.stringify(data),
          headers,
        }),
      complete: (cartId: string, query?: any, headers?: any) =>
        api.fetch<{ type: string; order?: any; cart?: any }>(
          `/api/cart/${cartId}/complete`,
          {
            method: "POST",
            headers,
          }
        ),
    },
    payment: {
      initiatePaymentSession: (cart: any, data: any, query?: any, headers?: any) =>
        api.fetch<{ payment_session: any }>(
          `/api/cart/${cart.id}/payment-sessions`,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers,
          }
        ),
    },
    customer: {
      retrieve: (headers?: any) =>
        api.fetch<{ customer: any }>("/api/customers/me", {
          method: "GET",
          headers,
        }),
      update: (data: any, headers?: any) =>
        api.fetch<{ customer: any }>("/api/customers/me", {
          method: "PATCH",
          body: JSON.stringify(data),
          headers,
        }),
      listAddresses: (headers?: any) =>
        api.fetch<{ addresses: any[] }>("/api/customers/me/addresses", {
          method: "GET",
          headers,
        }),
      createAddress: (data: any, headers?: any) =>
        api.fetch<{ address: any }>("/api/customers/me/addresses", {
          method: "POST",
          body: JSON.stringify(data),
          headers,
        }),
      updateAddress: (id: string, data: any, headers?: any) =>
        api.fetch<{ address: any }>(`/api/customers/me/addresses/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
          headers,
        }),
      deleteAddress: (id: string, headers?: any) =>
        api.fetch<void>(`/api/customers/me/addresses/${id}`, {
          method: "DELETE",
          headers,
        }),
    },
    order: {
      list: (query?: any, headers?: any) =>
        api.fetch<{ orders: any[]; count: number }>("/api/orders", {
          method: "GET",
          query,
          headers,
        }),
      retrieve: (id: string, query?: any, headers?: any) =>
        api.fetch<{ order: any }>(`/api/orders/${id}`, {
          method: "GET",
          query,
          headers,
        }),
    },
  },
  auth: {
    login: (provider: string, data: { email: string; password: string }) =>
      api.fetch<{ token: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    register: (data: {
      email: string
      password: string
      first_name?: string
      last_name?: string
    }) =>
      api.fetch<{ customer: any; token: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    logout: () => api.fetch<void>("/api/auth/logout", { method: "POST" }),
    getSession: () =>
      api.fetch<{ customer: any } | null>("/api/auth/session", {
        method: "GET",
      }),
  },
}

export default api
