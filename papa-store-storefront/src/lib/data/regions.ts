"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

// Types for region responses
interface Region {
  id: string
  name: string
  currency_code: string
  tax_rate: number
  countries?: Country[]
}

interface Country {
  id?: string
  iso_2: string
  name?: string
  display_name?: string
}

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  return sdk.client
    .fetch<{ regions: Region[] }>(`/api/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
    .catch((error) => {
      console.error("Error fetching regions:", error)
      // Return default region for Bulgaria
      return [
        {
          id: "reg_bg",
          name: "Bulgaria",
          currency_code: "EUR",
          tax_rate: 20,
          countries: [
            { iso_2: "bg", name: "Bulgaria", display_name: "Bulgaria" },
          ],
        },
      ]
    })
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return sdk.client
    .fetch<{ region: Region }>(`/api/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch((error) => {
      console.error("Error fetching region:", error)
      return null
    })
}

const regionMap = new Map<string, Region>()

export const getRegion = async (countryCode: string) => {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    const regions = await listRegions()

    if (!regions) {
      return null
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("bg") // Default to Bulgaria instead of US

    return region
  } catch (e: any) {
    return null
  }
}
