// API types for Papa Store - Spring Boot backend

export interface Product {
  id: string
  handle: string
  title: string
  description: string | null
  thumbnail: string | null
  images: ProductImage[]
  variants: ProductVariant[]
  categories: ProductCategory[]
  collection: ProductCollection | null
  collection_id: string | null
  status: "draft" | "published"
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
  tags?: ProductTag[]
}

export interface ProductImage {
  id: string
  url: string
  alt?: string
}

export interface ProductVariant {
  id: string
  title: string
  sku: string | null
  barcode: string | null
  prices: Price[]
  inventory_quantity: number
  allow_backorder: boolean
  manage_inventory: boolean
  options: ProductOption[]
  calculated_price?: CalculatedPrice
}

export interface CalculatedPrice {
  calculated_amount: number
  original_amount: number
  currency_code: string
}

export interface Price {
  id: string
  amount: number
  currency_code: string
}

export interface ProductOption {
  id: string
  value: string
  option_id: string
}

export interface ProductTag {
  id: string
  value: string
}

export interface ProductCategory {
  id: string
  handle: string
  name: string
  description: string | null
  parent_category: ProductCategory | null
  category_children: ProductCategory[]
  products?: Product[]
}

export interface ProductCollection {
  id: string
  handle: string
  title: string
}

export interface Region {
  id: string
  name: string
  currency_code: string
  tax_rate: number
  countries: Country[]
}

export interface Country {
  id: string
  iso_2: string
  name: string
  display_name: string
}

export interface Cart {
  id: string
  items: CartItem[]
  region: Region | null
  region_id: string | null
  email: string | null
  shipping_address: Address | null
  billing_address: Address | null
  subtotal: number
  shipping_total: number
  tax_total: number
  total: number
  promotions?: Promotion[]
  shipping_methods?: ShippingMethod[]
}

export interface CartItem {
  id: string
  cart_id: string
  variant_id: string
  variant: ProductVariant
  product: Product
  quantity: number
  unit_price: number
  total: number
  thumbnail: string | null
  title: string
  metadata?: Record<string, any>
}

export interface Address {
  id?: string
  first_name: string
  last_name: string
  company?: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
  phone?: string
}

export interface ShippingMethod {
  id: string
  name: string
  price: number
  shipping_option_id: string
}

export interface ShippingOption {
  id: string
  name: string
  price_type: "flat_rate" | "calculated"
  amount: number
  is_return: boolean
}

export interface Promotion {
  id: string
  code: string
  value: number
  type: "percentage" | "fixed"
}

export interface Order {
  id: string
  display_id: number
  status: "pending" | "processing" | "completed" | "cancelled"
  email: string
  items: OrderItem[]
  shipping_address: Address
  billing_address: Address
  shipping_methods: ShippingMethod[]
  subtotal: number
  shipping_total: number
  tax_total: number
  total: number
  currency_code: string
  created_at: string
  fulfillment_status?: string
  payment_status?: string
}

export interface OrderItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  total: number
  thumbnail: string | null
  variant: ProductVariant
  product: Product
}

export interface Customer {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  billing_address: Address | null
  shipping_addresses: Address[]
  created_at: string
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[]
  count: number
  offset: number
  limit: number
}

export interface ProductListResponse {
  products: Product[]
  count: number
}

export interface CategoryListResponse {
  product_categories: ProductCategory[]
}

export interface CollectionListResponse {
  collections: ProductCollection[]
}

export interface RegionListResponse {
  regions: Region[]
}

export interface CartResponse {
  cart: Cart
}

export interface OrderResponse {
  order: Order
}
