"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingBag } from "lucide-react"
import type { Product } from "@/lib/products"
import { fetchProducts } from "@/lib/product-api"
import { useWishlist } from "@/lib/wishlist-context"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { ProductCard } from "@/components/shop/product-card"

export default function WishlistPage() {
  const { ids, isHydrated } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setIsLoading(true)
      setError("")
      try {
        const rows = await fetchProducts({ sort: "featured" })
        if (!cancelled) setProducts(rows)
      } catch (err) {
        if (!cancelled) {
          setProducts([])
          setError(err instanceof Error ? err.message : "Could not load wishlist products")
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  const wishlistProducts = useMemo(() => {
    const byId = new Map(products.map((product) => [product.id, product]))
    return ids.map((id) => byId.get(id)).filter((product): product is Product => Boolean(product))
  }, [ids, products])

  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />

      <section className="relative h-[34vh] min-h-[250px] overflow-hidden bg-[#05120F]">
        <div className="absolute inset-0 opacity-5">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="wishlist-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#wishlist-grid)" />
          </svg>
        </div>
        <div className="container relative z-10 mx-auto flex h-full flex-col justify-center px-4">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C5A059]/25 bg-[#F9F8F6]/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C5A059]">
              <Heart className="h-3.5 w-3.5 fill-current" />
              Saved pieces
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#F9F8F6] sm:text-4xl md:text-6xl">Your Wishlist</h1>
            <p className="mt-3 max-w-xl text-sm text-[#F9F8F6]/70 sm:text-base md:text-lg">
              Keep your favourite ABS pieces in one place before adding them to cart.
            </p>
          </motion.div>
        </div>
        <div className="stroke-text pointer-events-none absolute inset-0 flex items-center justify-center font-serif text-8xl font-bold opacity-10 md:text-9xl">
          WISHLIST
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        {!isHydrated || isLoading ? (
          <div className="py-20 text-center text-muted-foreground">Loading wishlist...</div>
        ) : error ? (
          <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-800">
            {error}
          </div>
        ) : wishlistProducts.length > 0 ? (
          <>
            <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {wishlistProducts.length} saved item{wishlistProducts.length === 1 ? "" : "s"}
                </p>
                <h2 className="mt-2 font-serif text-2xl text-foreground sm:text-3xl">Ready when you are</h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex w-full items-center justify-center gap-2 border border-primary px-5 py-3 text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:w-auto"
              >
                Continue shopping
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {wishlistProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-xl py-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Heart className="h-9 w-9 text-muted-foreground" />
            </div>
            <h2 className="mb-3 font-serif text-2xl text-foreground sm:text-3xl">Your wishlist is empty</h2>
            <p className="mb-8 text-muted-foreground">
              Tap the heart on any product to save it here, then return when you are ready to shop.
            </p>
            <Link
              href="/shop"
              className="inline-flex w-full items-center justify-center gap-2 bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              <ShoppingBag className="h-4 w-4" />
              Browse products
            </Link>
          </motion.div>
        )}
      </section>

      <Footer />
    </main>
  )
}
