"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Product } from "./products"
import { useAdmin } from "./admin-context"
import {
  fetchProducts,
  buildProductWritePayload,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "./product-api"
import {
  fetchCollectionsApi,
  buildCollectionWritePayload,
  createCollectionApi,
  updateCollectionApi,
  deleteCollectionApi,
} from "./collection-api"
import { fetchAdminOrdersFromApi } from "./admin-orders-api"
import type { FulfillmentStatus, PaymentVerificationStatus } from "./admin-orders-api"
import { ApiError } from "./api"
import {
  fetchAdminContactMessages,
  replyAdminContactMessage,
  type ContactMessage as ApiContactMessage,
} from "./contact-api"

export interface Collection {
  id: string
  name: string
  description: string
  heroImage: string
  productIds: string[]
  createdAt: Date
}

/** Normalized admin order row (matches API + storefront admin orders UI). */
export interface Order {
  id: string
  customerName: string
  email: string
  products: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  total: number
  status: FulfillmentStatus
  createdAt: Date
  shippingAddress: string
  isPaid: boolean
  paymentMethod: string
  paymentVerificationStatus: PaymentVerificationStatus
  receiptUrl?: string
  paymentRejectionReason?: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: "new" | "replied"
  adminReply: string
  repliedAt: Date | null
  createdAt: Date
}

function normalizeOrdersFromApi(
  rows: Awaited<ReturnType<typeof fetchAdminOrdersFromApi>>
): Order[] {
  return rows.map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt),
  }))
}

function normalizeContactMessages(rows: ApiContactMessage[]): ContactMessage[] {
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone || "",
    subject: r.subject,
    message: r.message,
    status: r.status,
    adminReply: r.adminReply || "",
    repliedAt: r.repliedAt ? new Date(r.repliedAt) : null,
    createdAt: new Date(r.createdAt),
  }))
}

function normalizeCollection(raw: unknown): Collection {
  const r = raw as Record<string, unknown>
  const productIds = Array.isArray(r.productIds)
    ? r.productIds.map((item) => {
        if (typeof item === "string") return item
        if (item && typeof item === "object") {
          const o = item as Record<string, unknown>
          if (typeof o.id === "string") return o.id
          if (o._id != null) return String(o._id)
        }
        return String(item)
      })
    : []
  const createdRaw = r.createdAt
  const createdAt =
    createdRaw instanceof Date
      ? createdRaw
      : typeof createdRaw === "string"
        ? new Date(createdRaw)
        : new Date()

  return {
    id: String(r.id ?? ""),
    name: String(r.name ?? ""),
    description: String(r.description ?? ""),
    heroImage: String(r.heroImage ?? ""),
    productIds,
    createdAt,
  }
}

interface AdminDataContextType {
  products: Product[]
  productsLoading: boolean
  productsError: string | null
  refreshProducts: () => Promise<void>

  collections: Collection[]
  collectionsLoading: boolean
  collectionsError: string | null
  refreshCollections: () => Promise<void>

  orders: Order[]
  ordersLoading: boolean
  ordersError: string | null
  refreshOrders: () => Promise<void>
  contactMessages: ContactMessage[]
  contactMessagesLoading: boolean
  contactMessagesError: string | null
  refreshContactMessages: () => Promise<void>
  replyToContactMessage: (id: string, reply: string) => Promise<void>

  addProduct: (product: Omit<Product, "id">) => Promise<void>
  updateProduct: (id: string, product: Omit<Product, "id">) => Promise<void>
  deleteProduct: (id: string) => Promise<void>

  addCollection: (collection: Omit<Collection, "id" | "createdAt">) => Promise<void>
  updateCollection: (id: string, collection: Omit<Collection, "id" | "createdAt">) => Promise<void>
  deleteCollection: (id: string) => Promise<void>

  getTotalRevenue: () => number
  getTotalOrders: () => number
  getTotalProducts: () => number
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined)

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAdmin()
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [productsError, setProductsError] = useState<string | null>(null)

  const [collections, setCollections] = useState<Collection[]>([])
  const [collectionsLoading, setCollectionsLoading] = useState(false)
  const [collectionsError, setCollectionsError] = useState<string | null>(null)

  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState<string | null>(null)
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [contactMessagesLoading, setContactMessagesLoading] = useState(false)
  const [contactMessagesError, setContactMessagesError] = useState<string | null>(null)

  const refreshProducts = useCallback(async () => {
    if (!isAuthenticated) return
    setProductsLoading(true)
    setProductsError(null)
    try {
      const list = await fetchProducts({})
      setProducts(list)
    } catch (e) {
      setProductsError(e instanceof ApiError ? e.message : "Failed to load products")
      setProducts([])
    } finally {
      setProductsLoading(false)
    }
  }, [isAuthenticated])

  const refreshCollections = useCallback(async () => {
    if (!isAuthenticated) return
    setCollectionsLoading(true)
    setCollectionsError(null)
    try {
      const rawList = await fetchCollectionsApi()
      setCollections(rawList.map(normalizeCollection))
    } catch (e) {
      setCollectionsError(e instanceof ApiError ? e.message : "Failed to load collections")
      setCollections([])
    } finally {
      setCollectionsLoading(false)
    }
  }, [isAuthenticated])

  const refreshOrders = useCallback(async () => {
    if (!isAuthenticated) return
    setOrdersLoading(true)
    setOrdersError(null)
    try {
      const rows = await fetchAdminOrdersFromApi()
      setOrders(normalizeOrdersFromApi(rows))
    } catch (e) {
      setOrdersError(e instanceof ApiError ? e.message : "Failed to load orders")
      setOrders([])
    } finally {
      setOrdersLoading(false)
    }
  }, [isAuthenticated])

  const refreshContactMessages = useCallback(async () => {
    if (!isAuthenticated) return
    setContactMessagesLoading(true)
    setContactMessagesError(null)
    try {
      const rows = await fetchAdminContactMessages()
      setContactMessages(normalizeContactMessages(rows))
    } catch (e) {
      setContactMessagesError(e instanceof ApiError ? e.message : "Failed to load contact messages")
      setContactMessages([])
    } finally {
      setContactMessagesLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (authLoading || !isAuthenticated) return
    void Promise.all([refreshProducts(), refreshCollections(), refreshOrders(), refreshContactMessages()])
  }, [authLoading, isAuthenticated, refreshProducts, refreshCollections, refreshOrders, refreshContactMessages])

  const replyToContactMessage = useCallback(async (id: string, reply: string) => {
    const updated = await replyAdminContactMessage(id, reply)
    const next = normalizeContactMessages([updated])[0]
    setContactMessages((prev) => prev.map((m) => (m.id === id ? next : m)))
  }, [])

  const addProduct = useCallback(async (product: Omit<Product, "id">) => {
    const payload = buildProductWritePayload(product)
    if (!payload.collectionName) {
      throw new Error("Collection is required.")
    }
    if (payload.colors.length === 0) {
      throw new Error("Add at least one color with a name.")
    }
    const created = await createProductApi(payload)
    setProducts((prev) => [...prev, created])
  }, [])

  const updateProduct = useCallback(async (id: string, product: Omit<Product, "id">) => {
    const payload = buildProductWritePayload(product)
    if (payload.colors.length === 0) {
      throw new Error("Add at least one color with a name.")
    }
    const updated = await updateProductApi(id, payload)
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
  }, [])

  const deleteProduct = useCallback(async (id: string) => {
    await deleteProductApi(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const addCollection = useCallback(async (input: Omit<Collection, "id" | "createdAt">) => {
    const payload = buildCollectionWritePayload(input)
    const raw = await createCollectionApi(payload)
    setCollections((prev) => [...prev, normalizeCollection(raw)])
  }, [])

  const updateCollection = useCallback(
    async (id: string, input: Omit<Collection, "id" | "createdAt">) => {
      const payload = buildCollectionWritePayload(input)
      const raw = await updateCollectionApi(id, payload)
      const next = normalizeCollection(raw)
      setCollections((prev) => prev.map((c) => (c.id === id ? next : c)))
    },
    []
  )

  const deleteCollection = useCallback(async (id: string) => {
    await deleteCollectionApi(id)
    setCollections((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const getTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + order.total, 0)
  }

  const getTotalOrders = () => {
    return orders.length
  }

  const getTotalProducts = () => {
    return products.length
  }

  return (
    <AdminDataContext.Provider
      value={{
        products,
        productsLoading,
        productsError,
        refreshProducts,
        collections,
        collectionsLoading,
        collectionsError,
        refreshCollections,
        orders,
        ordersLoading,
        ordersError,
        refreshOrders,
        contactMessages,
        contactMessagesLoading,
        contactMessagesError,
        refreshContactMessages,
        replyToContactMessage,
        addProduct,
        updateProduct,
        deleteProduct,
        addCollection,
        updateCollection,
        deleteCollection,
        getTotalRevenue,
        getTotalOrders,
        getTotalProducts,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  )
}

export function useAdminData() {
  const context = useContext(AdminDataContext)
  if (!context) {
    throw new Error("useAdminData must be used within AdminDataProvider")
  }
  return context
}
