"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { FilterSidebar } from "@/components/shop/filter-sidebar"
import { ProductGrid } from "@/components/shop/product-grid"
import { ShopHeader } from "@/components/shop/shop-header"
import type { Product } from "@/lib/products"
import { fetchProducts } from "@/lib/product-api"

export default function ShopPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCollection, setSelectedCollection] = useState("All")
  const [selectedPriceRange, setSelectedPriceRange] = useState({
    min: 0,
    max: Infinity,
  })
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [showBestSellers, setShowBestSellers] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [gridView, setGridView] = useState<"grid" | "large">("grid")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [availableCategories, setAvailableCategories] = useState<string[]>(["All"])
  const [availableCollections, setAvailableCollections] = useState<string[]>(["All"])

  useEffect(() => {
    let cancelled = false
    const loadFilterOptions = async () => {
      try {
        const base = await fetchProducts({ sort: "featured" })
        if (cancelled) return
        const categories = ["All", ...Array.from(new Set(base.map((p) => p.category).filter(Boolean)))]
        const collections = ["All", ...Array.from(new Set(base.map((p) => p.collection).filter(Boolean)))]
        setAvailableCategories(categories)
        setAvailableCollections(collections)
      } catch {
        if (!cancelled) {
          setAvailableCategories(["All"])
          setAvailableCollections(["All"])
        }
      }
    }
    loadFilterOptions()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setIsLoading(true)
      setError("")
      try {
        const result = await fetchProducts({
          collection: selectedCollection,
          category: selectedCategory,
          isNew: showNewOnly ? true : undefined,
          isBestSeller: showBestSellers ? true : undefined,
          minPrice: selectedPriceRange.min,
          maxPrice: selectedPriceRange.max,
          sort: sortBy,
        })
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
  }, [
    selectedCategory,
    selectedCollection,
    selectedPriceRange,
    showNewOnly,
    showBestSellers,
    sortBy,
  ])

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return products
    return products.filter((p) =>
      [p.name, p.category, p.collection, p.description].some((value) =>
        value.toLowerCase().includes(term)
      )
    )
  }, [products, searchTerm])

  return (
    <main className="min-h-screen bg-[#F9F8F6] pt-20">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[300px] bg-[#05120F] flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Large Background Text */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex items-center justify-center text-[20vw] font-serif tracking-wider stroke-text select-none"
        >
          SHOP
        </motion.span>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="font-serif text-4xl md:text-6xl text-[#F9F8F6] mb-4">
            The Collection
          </h1>
          <p className="text-[#F9F8F6]/70 text-lg max-w-xl mx-auto">
            Bespoke tailoring crafted with precision and passion
          </p>
        </motion.div>
      </section>

      {/* Shop Content */}
      <section className="px-6 lg:px-12 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <ShopHeader
            totalProducts={filteredProducts.length}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            gridView={gridView}
            setGridView={setGridView}
            onOpenFilters={() => setIsFilterOpen(true)}
          />

          <div className="mt-12 flex gap-8">
            <FilterSidebar
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              availableCategories={availableCategories}
              availableCollections={availableCollections}
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
            />

            {error ? (
              <div className="flex-1 text-center text-red-600 py-16">{error}</div>
            ) : isLoading ? (
              <div className="flex-1 text-center py-16 text-[#666666]">Loading products...</div>
            ) : (
              <ProductGrid products={filteredProducts} gridView={gridView} />
            )}
          </div>

          {/* Pagination Placeholder */}
          {!isLoading && !error && filteredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex items-center justify-center gap-2"
            >
              <button className="w-10 h-10 flex items-center justify-center bg-[#0A3D2E] text-white text-sm font-medium">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-[#E8E6E3] text-[#1A1A1A] text-sm font-medium hover:border-[#0A3D2E] hover:text-[#0A3D2E] transition-colors">
                2
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-[#E8E6E3] text-[#1A1A1A] text-sm font-medium hover:border-[#0A3D2E] hover:text-[#0A3D2E] transition-colors">
                3
              </button>
              <span className="px-2 text-[#666666]">...</span>
              <button className="px-4 h-10 flex items-center justify-center border border-[#E8E6E3] text-[#1A1A1A] text-sm font-medium hover:border-[#0A3D2E] hover:text-[#0A3D2E] transition-colors">
                Next
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
