"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "./products"

export interface Collection {
  id: string
  name: string
  description: string
  heroImage: string
  productIds: string[]
  createdAt: Date
}

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
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  shippingAddress: string
}

interface AdminDataContextType {
  products: Product[]
  collections: Collection[]
  orders: Order[]
  
  // Product operations
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  
  // Collection operations
  addCollection: (collection: Omit<Collection, "id" | "createdAt">) => void
  updateCollection: (id: string, collection: Partial<Collection>) => void
  deleteCollection: (id: string) => void
  
  // Order operations
  updateOrderStatus: (id: string, status: Order["status"]) => void
  deleteOrder: (id: string) => void
  
  // Stats
  getTotalRevenue: () => number
  getTotalOrders: () => number
  getTotalProducts: () => number
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined)

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    const savedProducts = localStorage.getItem("adminProducts")
    const savedCollections = localStorage.getItem("adminCollections")
    const savedOrders = localStorage.getItem("adminOrders")

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts))
      } catch {
        setProducts([])
      }
    }
    if (savedCollections) {
      try {
        setCollections(JSON.parse(savedCollections))
      } catch {
        setCollections([])
      }
    }
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch {
        setOrders([])
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("adminProducts", JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("adminCollections", JSON.stringify(collections))
  }, [collections])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("adminOrders", JSON.stringify(orders))
  }, [orders])

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    }
    setProducts([...products, newProduct])
  }

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, ...productData } : p))
    )
  }

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const addCollection = (collection: Omit<Collection, "id" | "createdAt">) => {
    const newCollection = {
      ...collection,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setCollections([...collections, newCollection])
  }

  const updateCollection = (id: string, collectionData: Partial<Collection>) => {
    setCollections(
      collections.map((c) => (c.id === id ? { ...c, ...collectionData } : c))
    )
  }

  const deleteCollection = (id: string) => {
    setCollections(collections.filter((c) => c.id !== id))
  }

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status } : o))
    )
  }

  const deleteOrder = (id: string) => {
    setOrders(orders.filter((o) => o.id !== id))
  }

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
        collections,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        addCollection,
        updateCollection,
        deleteCollection,
        updateOrderStatus,
        deleteOrder,
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
