"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

// Types for product responses
interface Product {
  id: string
  handle: string
  title: string
  description: string | null
  thumbnail: string | null
  images: { id: string; url: string }[]
  variants: ProductVariant[]
  categories?: { id: string; handle: string; name: string }[]
  collection?: { id: string; handle: string; title: string }
  collection_id?: string
  status: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
  tags?: { id: string; value: string }[]
}

interface ProductVariant {
  id: string
  title: string
  sku: string | null
  prices: { amount: number; currency_code: string }[]
  inventory_quantity: number
  calculated_price?: {
    calculated_amount: number
    original_amount: number
    currency_code: string
  }
  options?: { id: string; value: string }[]
}

interface Region {
  id: string
  name: string
  currency_code: string
  countries?: { iso_2: string }[]
}

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: Record<string, any>
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: Product[]; count: number }
  nextPage: number | null
  queryParams?: Record<string, any>
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: Region | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: Product[]; count: number }>(`/api/products`, {
      method: "GET",
      query: {
        limit,
        offset,
        region_id: region?.id,
        currency_code: region?.currency_code,
        ...queryParams,
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
    .catch((error) => {
      console.error("Error fetching products:", error)
      return {
        response: { products: [], count: 0 },
        nextPage: null,
        queryParams,
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: Record<string, any>
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: Product[]; count: number }
  nextPage: number | null
  queryParams?: Record<string, any>
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products as any, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts as Product[],
      count,
    },
    nextPage,
    queryParams,
  }
}

export const getProductByHandle = async (handle: string) => {
  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ product: Product }>(`/api/products/${handle}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ product }) => product)
    .catch((error) => {
      console.error("Error fetching product:", error)
      return null
    })
}

export const getProductsList = async ({
  pageParam = 0,
  queryParams,
  countryCode,
}: {
  pageParam?: number
  queryParams?: Record<string, any>
  countryCode: string
}): Promise<{
  response: { products: Product[]; count: number }
  nextPage: number | null
  queryParams?: Record<string, any>
}> => {
  const limit = queryParams?.limit || 12

  const region = await getRegion(countryCode)

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  return sdk.client
    .fetch<{ products: Product[]; count: number }>(`/api/products`, {
      method: "GET",
      query: {
        limit,
        offset: pageParam,
        region_id: region.id,
        currency_code: region.currency_code,
        ...queryParams,
      },
      cache: "force-cache",
    })
    .then(({ products, count }) => {
      const nextPage = count > pageParam + limit ? pageParam + limit : null

      return {
        response: {
          products,
          count,
        },
        nextPage,
        queryParams,
      }
    })
    .catch((error) => {
      console.error("Error fetching products list:", error)
      return {
        response: { products: [], count: 0 },
        nextPage: null,
        queryParams,
      }
    })
}
