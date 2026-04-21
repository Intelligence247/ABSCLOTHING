"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Product } from "@/lib/products"
import { ShopHeader } from "@/components/shop/shop-header"
import { FilterSidebar } from "@/components/shop/filter-sidebar"
import { ProductGrid } from "@/components/shop/product-grid"
import { fetchProducts } from "@/lib/product-api"
import { collectionNameToSlug } from "@/lib/collections-public"
import { usePublicCollections } from "@/lib/public-collections-context"

export default function CollectionBySlugPage() {
  const params = useParams()
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
        ? params.slug[0]
        : ""

  const allCollections = usePublicCollections()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCollection, setSelectedCollection] = useState("")
  const [selectedPriceRange, setSelectedPriceRange] = useState({ min: 0, max: Infinity })
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [showBestSellers, setShowBestSellers] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [gridView, setGridView] = useState<"grid" | "large">("grid")
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const collectionMeta = useMemo(() => {
    if (!slug) return null
    return allCollections.find((c) => collectionNameToSlug(c.name) === slug) ?? null
  }, [slug, allCollections])

  const resolveError = useMemo(() => {
    if (!slug) return ""
    return collectionMeta ? "" : "Collection not found"
  }, [slug, collectionMeta])

  useEffect(() => {
    if (collectionMeta) setSelectedCollection(collectionMeta.name)
  }, [collectionMeta])

  const collectionName = collectionMeta?.name ?? ""

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!collectionName) {
        setProducts([])
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      setError("")
      try {
        const result = await fetchProducts({ collection: collectionName, sort: sortBy })
        if (!cancelled) setProducts(result)
      } catch (err) {
        if (!cancelled) {
          setProducts([])
          setError(err instanceof Error ? err.message : "Could not load products")
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [collectionName, sortBy])

  const filteredProducts = useMemo(() => {
    let filtered = products

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    filtered = filtered.filter((p) => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max)

    if (showNewOnly) {
      filtered = filtered.filter((p) => p.isNew)
    }

    if (showBestSellers) {
      filtered = filtered.filter((p) => p.isBestSeller)
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        default:
          return 0
      }
    })
  }, [selectedCategory, selectedPriceRange, showNewOnly, showBestSellers, sortBy, products])

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))]

  const heroLabel = collectionMeta?.name ?? ""
  const heroBg = collectionMeta?.heroImage

  if (resolveError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <p className="text-center text-muted-foreground">{resolveError}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden bg-[#05120F]">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="collection-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#collection-grid)" />
          </svg>
        </div>
        {heroBg ? (
          <div className="absolute inset-0">
            <Image src={heroBg} alt="" fill className="object-cover opacity-40" sizes="100vw" priority />
            <div className="absolute inset-0 bg-linear-to-b from-[#05120F]/70 to-[#05120F]/60" />
          </div>
        ) : null}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-7xl font-serif font-bold text-[#F9F8F6] mb-4 uppercase tracking-tight"
          >
            {heroLabel}
          </motion.h1>
          {collectionMeta?.description ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#F9F8F6]/80 text-lg md:text-xl max-w-2xl"
            >
              {collectionMeta.description}
            </motion.p>
          ) : null}
        </div>
        <div className="absolute inset-0 stroke-text text-8xl md:text-9xl font-serif font-bold opacity-10 pointer-events-none flex items-center justify-center z-0">
          {heroLabel.slice(0, 12)}
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          <FilterSidebar
            availableCategories={categories}
            hideCollectionFilter={true}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
            selectedPriceRange={selectedPriceRange}
            setSelectedPriceRange={setSelectedPriceRange}
            showNewOnly={showNewOnly}
            setShowNewOnly={setShowNewOnly}
            showBestSellers={showBestSellers}
            setShowBestSellers={setShowBestSellers}
            isOpen={showMobileFilter}
            onClose={() => setShowMobileFilter(false)}
          />

          <div className="flex-1">
            <ShopHeader
              totalProducts={filteredProducts.length}
              sortBy={sortBy}
              setSortBy={setSortBy}
              gridView={gridView}
              setGridView={setGridView}
              onOpenFilters={() => setShowMobileFilter(true)}
            />

            {error ? (
              <div className="text-center py-16 text-red-600">{error}</div>
            ) : isLoading ? (
              <div className="text-center py-16 text-muted-foreground">Loading products...</div>
            ) : filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} gridView={gridView} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-muted-foreground text-lg">No products found matching your criteria</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
