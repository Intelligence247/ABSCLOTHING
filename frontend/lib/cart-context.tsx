"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "./products"

export interface CartItem {
  product: Product
  quantity: number
  color: string
  size: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, color: string, size: string, quantity: number) => void
  removeItem: (productId: string, color: string, size: string) => void
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void
  clearCart: () => void
  total: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch {
        setItems([])
      }
    }
  }, [])

  // Save to localStorage when items change
  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, color: string, size: string, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id && item.color === color && item.size === size
      )

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id && item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prevItems, { product, quantity, color, size }]
    })
  }

  const removeItem = (productId: string, color: string, size: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product.id === productId && item.color === color && item.size === size)
      )
    )
  }

  const updateQuantity = (productId: string, color: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, color, size)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && item.color === color && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shippingCost = subtotal > 100000 ? 0 : 5000
  const total = subtotal + shippingCost

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
