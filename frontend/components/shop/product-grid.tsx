"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/products"

interface ProductGridProps {
  products: Product[]
  gridView: "grid" | "large"
}

export function ProductGrid({ products, gridView }: ProductGridProps) {
  return (
    <div className="flex-1">
      <AnimatePresence mode="wait">
        {products.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 mb-6 rounded-full bg-[#E8E6E3] flex items-center justify-center">
              <svg
                className="w-12 h-12 text-[#666666]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-2">
              No products found
            </h3>
            <p className="text-[#666666] max-w-md">
              We could not find any products matching your current filters.
              Try adjusting your search criteria.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={gridView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              gridView === "large"
                ? "grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
                : "grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            }
          >
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
