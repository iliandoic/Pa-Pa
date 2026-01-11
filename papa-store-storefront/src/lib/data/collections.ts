"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

// Types for collection responses
interface ProductCollection {
  id: string
  handle: string
  title: string
  products?: any[]
}

export const retrieveCollection = async (id: string) => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<{ collection: ProductCollection }>(`/api/collections/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ collection }) => collection)
    .catch((error) => {
      console.error("Error fetching collection:", error)
      return null
    })
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: ProductCollection[]; count: number }> => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  queryParams.limit = queryParams.limit || "100"
  queryParams.offset = queryParams.offset || "0"

  return sdk.client
    .fetch<{ collections: ProductCollection[]; count: number }>(
      "/api/collections",
      {
        method: "GET",
        query: queryParams,
        next,
        cache: "force-cache",
      }
    )
    .then(({ collections }) => ({ collections, count: collections.length }))
    .catch((error) => {
      console.error("Error fetching collections:", error)
      return { collections: [], count: 0 }
    })
}

export const getCollectionByHandle = async (
  handle: string
): Promise<ProductCollection | null> => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<{ collections: ProductCollection[] }>(`/api/collections`, {
      method: "GET",
      query: { handle },
      next,
      cache: "force-cache",
    })
    .then(({ collections }) => collections[0] || null)
    .catch((error) => {
      console.error("Error fetching collection by handle:", error)
      return null
    })
}
