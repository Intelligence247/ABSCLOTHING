"use client"

import { Toaster } from "sonner"
import { CartProvider } from "@/lib/cart-context"
import { CustomerAuthProvider } from "@/lib/customer-auth-context"
import { PublicCollectionsProvider } from "@/lib/public-collections-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import type { PublicCollection } from "@/lib/collections-public"

export function AppProviders({
  children,
  initialCollections = [],
}: {
  children: React.ReactNode
  initialCollections?: PublicCollection[]
}) {
  return (
    <PublicCollectionsProvider value={initialCollections}>
      <CustomerAuthProvider>
        <WishlistProvider>
          <CartProvider>
            {children}
            <Toaster position="top-center" richColors closeButton duration={5000} />
          </CartProvider>
        </WishlistProvider>
      </CustomerAuthProvider>
    </PublicCollectionsProvider>
  )
}
