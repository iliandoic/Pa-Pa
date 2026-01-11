"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

// Types for category responses
interface ProductCategory {
  id: string
  handle: string
  name: string
  description: string | null
  parent_category: ProductCategory | null
  category_children: ProductCategory[]
  products?: any[]
}

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: ProductCategory[] }>("/api/categories", {
      method: "GET",
      query: {
        limit,
        ...query,
      },
      next,
      cache: "force-cache",
    })
    .then(({ product_categories }) => product_categories)
    .catch((error) => {
      console.error("Error fetching categories:", error)
      return []
    })
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<{ product_categories: ProductCategory[] }>(`/api/categories`, {
      method: "GET",
      query: {
        handle,
      },
      next,
      cache: "force-cache",
    })
    .then(({ product_categories }) => product_categories[0])
    .catch((error) => {
      console.error("Error fetching category:", error)
      return null
    })
}
