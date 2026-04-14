"use client"

import { Toaster } from "sonner"
import { CartProvider } from "@/lib/cart-context"
import { CustomerAuthProvider } from "@/lib/customer-auth-context"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CustomerAuthProvider>
      <CartProvider>
        {children}
        <Toaster position="top-center" richColors closeButton duration={5000} />
      </CartProvider>
    </CustomerAuthProvider>
  )
}
