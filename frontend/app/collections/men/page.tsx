"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { products } from "@/lib/products"
import { ShopHeader } from "@/components/shop/shop-header"
import { FilterSidebar } from "@/components/shop/filter-sidebar"
import { ProductCard } from "@/components/shop/product-card"

export default function MenCollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCollection, setSelectedCollection] = useState("Men")
  const [selectedPriceRange, setSelectedPriceRange] = useState({ min: 0, max: Infinity })
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [showBestSellers, setShowBestSellers] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const menProducts = products.filter((p) => p.collection === "Men")

  const filteredProducts = useMemo(() => {
    let filtered = menProducts

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
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        default:
          return 0
      }
    })
  }, [selectedCategory, selectedPriceRange, showNewOnly, showBestSellers, sortBy])

  const categories = ["All", ...Array.from(new Set(menProducts.map((p) => p.category)))]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 overflow-hidden bg-gradient-to-b from-primary/80 to-primary/40">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-serif font-bold text-primary-foreground mb-4"
          >
            MEN'S COLLECTION
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl"
          >
            Discover our premium selection of traditional and contemporary menswear
          </motion.p>
        </div>
        <div className="absolute inset-0 stroke-text text-8xl md:text-9xl font-serif font-bold opacity-10">
          MEN
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
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

          {/* Main Content */}
          <div className="flex-1">
            <ShopHeader
              productCount={filteredProducts.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onFilterClick={() => setShowMobileFilter(true)}
            />

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
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
