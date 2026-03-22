"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, SlidersHorizontal, Grid3X3, LayoutGrid } from "lucide-react"
import { sortOptions } from "@/lib/products"

interface ShopHeaderProps {
  totalProducts: number
  sortBy: string
  setSortBy: (sort: string) => void
  gridView: "grid" | "large"
  setGridView: (view: "grid" | "large") => void
  onOpenFilters: () => void
}

export function ShopHeader({
  totalProducts,
  sortBy,
  setSortBy,
  gridView,
  setGridView,
  onOpenFilters,
}: ShopHeaderProps) {
  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 text-sm"
      >
        <Link
          href="/"
          className="text-[#666666] hover:text-[#0A3D2E] transition-colors"
        >
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-[#666666]" />
        <span className="text-[#1A1A1A] font-medium">Shop</span>
      </motion.nav>

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4"
      >
        <h1 className="font-serif text-4xl lg:text-6xl text-[#1A1A1A]">
          Our Collection
        </h1>
        <p className="text-[#666666] max-w-2xl text-lg">
          Discover our curated selection of bespoke pieces, handcrafted with precision
          and care in Ilorin. Each garment tells a story of Nigerian heritage and
          contemporary elegance.
        </p>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#E8E6E3]"
      >
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenFilters}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#1A1A1A]/20 text-[#1A1A1A] text-sm font-medium hover:border-[#0A3D2E] hover:text-[#0A3D2E] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <p className="text-sm text-[#666666]">
            Showing{" "}
            <span className="text-[#1A1A1A] font-medium">{totalProducts}</span>{" "}
            {totalProducts === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#666666] hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-[#E8E6E3] bg-transparent text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0A3D2E] cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Grid Toggle */}
          <div className="hidden sm:flex items-center border border-[#E8E6E3]">
            <button
              onClick={() => setGridView("grid")}
              className={`p-2 transition-colors ${
                gridView === "grid"
                  ? "bg-[#0A3D2E] text-white"
                  : "text-[#666666] hover:text-[#1A1A1A]"
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setGridView("large")}
              className={`p-2 transition-colors ${
                gridView === "large"
                  ? "bg-[#0A3D2E] text-white"
                  : "text-[#666666] hover:text-[#1A1A1A]"
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
