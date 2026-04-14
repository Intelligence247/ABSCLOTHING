"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronDown } from "lucide-react"
import { useState } from "react"
import { categories as defaultCategories, collections as defaultCollections, priceRanges } from "@/lib/products"

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedCollection: string
  setSelectedCollection: (collection: string) => void
  selectedPriceRange: { min: number; max: number }
  setSelectedPriceRange: (range: { min: number; max: number }) => void
  showNewOnly: boolean
  setShowNewOnly: (show: boolean) => void
  showBestSellers: boolean
  setShowBestSellers: (show: boolean) => void
  hideCollectionFilter?: boolean
  availableCategories?: string[]
  availableCollections?: string[]
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-[#E8E6E3] pb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <span className="font-serif text-lg text-[#1A1A1A]">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#666666] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FilterSidebar({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  selectedCollection,
  setSelectedCollection,
  selectedPriceRange,
  setSelectedPriceRange,
  showNewOnly,
  setShowNewOnly,
  showBestSellers,
  setShowBestSellers,
  hideCollectionFilter = false,
  availableCategories,
  availableCollections,
}: FilterSidebarProps) {
  const displayCategories = availableCategories || defaultCategories
  const displayCollections = availableCollections || defaultCollections

  const clearAllFilters = () => {
    setSelectedCategory("All")
    setSelectedCollection("All")
    setSelectedPriceRange({ min: 0, max: Infinity })
    setShowNewOnly(false)
    setShowBestSellers(false)
  }

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedCollection !== "All" ||
    selectedPriceRange.min !== 0 ||
    selectedPriceRange.max !== Infinity ||
    showNewOnly ||
    showBestSellers

  const filterContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E8E6E3]">
        <h2 className="font-serif text-2xl text-[#1A1A1A]">Filters</h2>
        <div className="flex items-center gap-4">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-[#C5A059] hover:text-[#0A3D2E] transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-[#E8E6E3] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        {/* Collection */}
        {!hideCollectionFilter && (
          <FilterSection title="Collection">
            {displayCollections.map((collection) => (
              <button
                key={collection}
                onClick={() => setSelectedCollection(collection)}
                className={`block w-full text-left py-2 px-3 text-sm transition-all duration-300 ${
                  selectedCollection === collection
                    ? "bg-[#0A3D2E] text-[#F9F8F6]"
                    : "text-[#1A1A1A] hover:bg-[#E8E6E3]"
                }`}
              >
                {collection}
              </button>
            ))}
          </FilterSection>
        )}

        {/* Category */}
        <FilterSection title="Category">
          {displayCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`block w-full text-left py-2 px-3 text-sm transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-[#0A3D2E] text-[#F9F8F6]"
                  : "text-[#1A1A1A] hover:bg-[#E8E6E3]"
              }`}
            >
              {category}
            </button>
          ))}
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() =>
                setSelectedPriceRange({ min: range.min, max: range.max })
              }
              className={`block w-full text-left py-2 px-3 text-sm transition-all duration-300 ${
                selectedPriceRange.min === range.min &&
                selectedPriceRange.max === range.max
                  ? "bg-[#0A3D2E] text-[#F9F8F6]"
                  : "text-[#1A1A1A] hover:bg-[#E8E6E3]"
              }`}
            >
              {range.label}
            </button>
          ))}
        </FilterSection>

        {/* Quick Filters */}
        <FilterSection title="Quick Filters">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`w-5 h-5 border-2 flex items-center justify-center transition-all duration-300 ${
                showNewOnly
                  ? "bg-[#0A3D2E] border-[#0A3D2E]"
                  : "border-[#1A1A1A]/30 group-hover:border-[#0A3D2E]"
              }`}
              onClick={() => setShowNewOnly(!showNewOnly)}
            >
              {showNewOnly && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm text-[#1A1A1A]">New Arrivals Only</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`w-5 h-5 border-2 flex items-center justify-center transition-all duration-300 ${
                showBestSellers
                  ? "bg-[#0A3D2E] border-[#0A3D2E]"
                  : "border-[#1A1A1A]/30 group-hover:border-[#0A3D2E]"
              }`}
              onClick={() => setShowBestSellers(!showBestSellers)}
            >
              {showBestSellers && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm text-[#1A1A1A]">Best Sellers Only</span>
          </label>
        </FilterSection>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 pr-8">
        {filterContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[#F9F8F6] z-50 p-6 overflow-y-auto"
            >
              {filterContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
