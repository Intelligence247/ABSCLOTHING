"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { FilterSidebar } from "@/components/shop/filter-sidebar"
import { ProductGrid } from "@/components/shop/product-grid"
import { ShopHeader } from "@/components/shop/shop-header"
import { products as allProducts } from "@/lib/products"

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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory)
    }

    // Apply collection filter
    if (selectedCollection !== "All") {
      result = result.filter((p) => p.collection === selectedCollection)
    }

    // Apply price range filter
    result = result.filter(
      (p) => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
    )

    // Apply quick filters
    if (showNewOnly) {
      result = result.filter((p) => p.isNew)
    }
    if (showBestSellers) {
      result = result.filter((p) => p.isBestSeller)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result = result.filter((p) => p.isNew).concat(result.filter((p) => !p.isNew))
        break
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "best-selling":
        result = result.filter((p) => p.isBestSeller).concat(result.filter((p) => !p.isBestSeller))
        break
      default:
        // Featured - keep original order
        break
    }

    return result
  }, [
    selectedCategory,
    selectedCollection,
    selectedPriceRange,
    showNewOnly,
    showBestSellers,
    sortBy,
  ])

  return (
    <main className="min-h-screen bg-[#F9F8F6]">
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

            <ProductGrid products={filteredProducts} />
          </div>

          {/* Pagination Placeholder */}
          {filteredProducts.length > 0 && (
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
