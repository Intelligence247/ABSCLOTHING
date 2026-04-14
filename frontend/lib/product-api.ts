import type { Product } from "@/lib/products"
import { apiFetch } from "@/lib/api"

export type ProductQuery = {
  collection?: string
  category?: string
  isNew?: boolean
  isBestSeller?: boolean
  minPrice?: number
  maxPrice?: number
  sort?: string
}

const toQueryString = (query: ProductQuery) => {
  const params = new URLSearchParams()
  if (query.collection && query.collection !== "All") params.set("collection", query.collection)
  if (query.category && query.category !== "All") params.set("category", query.category)
  if (typeof query.isNew === "boolean") params.set("isNew", String(query.isNew))
  if (typeof query.isBestSeller === "boolean") params.set("isBestSeller", String(query.isBestSeller))
  if (typeof query.minPrice === "number") params.set("minPrice", String(query.minPrice))
  if (typeof query.maxPrice === "number" && Number.isFinite(query.maxPrice)) {
    params.set("maxPrice", String(query.maxPrice))
  }
  if (query.sort) params.set("sort", query.sort)
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export const fetchProducts = async (query: ProductQuery = {}) => {
  return apiFetch<Product[]>(`/api/products${toQueryString(query)}`)
}

export const fetchProductById = async (id: string) => {
  return apiFetch<Product>(`/api/products/${id}`)
}

/** Body for POST / PUT — matches `backend/controllers/productController` + `normalizeBody`. */
export type ProductWritePayload = {
  name: string
  price: number
  originalPrice?: number
  discount?: string
  description: string
  image: string
  category: string
  collectionName: string
  sizes: string[]
  colors: { name: string; hex: string }[]
  isNewProduct: boolean
  isBestSeller: boolean
}

export function buildProductWritePayload(input: Omit<Product, "id">): ProductWritePayload {
  const price = Number(input.price)
  const orig =
    input.originalPrice != null ? Number(input.originalPrice) : NaN
  const colors = input.colors.filter((c) => c.name.trim().length > 0)
  return {
    name: input.name.trim(),
    price: Number.isFinite(price) ? price : 0,
    originalPrice: Number.isFinite(orig) && orig > 0 ? orig : undefined,
    discount: input.discount?.trim() || undefined,
    description: input.description.trim(),
    image: input.image.trim(),
    category: input.category.trim(),
    collectionName: input.collection.trim(),
    sizes: Array.isArray(input.sizes) ? input.sizes : [],
    colors,
    isNewProduct: !!input.isNew,
    isBestSeller: !!input.isBestSeller,
  }
}

export async function createProductApi(payload: ProductWritePayload) {
  return apiFetch<Product>("/api/products", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: true,
  })
}

export async function updateProductApi(id: string, payload: ProductWritePayload) {
  return apiFetch<Product>(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    auth: true,
  })
}

export async function deleteProductApi(id: string) {
  return apiFetch<{ message: string }>(`/api/products/${id}`, {
    method: "DELETE",
    auth: true,
  })
}
