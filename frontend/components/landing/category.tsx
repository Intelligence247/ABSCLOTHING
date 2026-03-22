"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import Image from "next/image"

const categories = ["ALL", "AGBADA", "NEW IN", "BEST SELLER", "WOMEN"]

const products = [
  {
    id: 1,
    name: "BROWN AGBADA",
    price: 65000,
    discount: "10% OFF",
    colors: ["#8B4513", "#0A3D2E", "#1A1A1A"],
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=500&fit=crop",
    category: "AGBADA",
  },
  {
    id: 2,
    name: "FORMAL SHIRT",
    price: 25000,
    discount: "15% OFF",
    colors: ["#F5F5DC", "#0A3D2E", "#C5A059"],
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
    category: "NEW IN",
  },
  {
    id: 3,
    name: "CHOCO SUIT",
    price: 95000,
    discount: "10% OFF",
    colors: ["#5C4033", "#1A1A1A", "#8B4513"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    category: "BEST SELLER",
  },
  {
    id: 4,
    name: "GREEN AGBADA",
    price: 85000,
    discount: "20% OFF",
    colors: ["#0A3D2E", "#C5A059", "#1A1A1A"],
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop",
    category: "AGBADA",
  },
  {
    id: 5,
    name: "FORMAL SUIT",
    price: 76000,
    discount: "10% OFF",
    colors: ["#1A1A1A", "#0A3D2E", "#5C4033"],
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop",
    category: "BEST SELLER",
  },
  {
    id: 6,
    name: "CASUAL SHIRT",
    price: 18000,
    discount: "15% OFF",
    colors: ["#F9F8F6", "#0A3D2E", "#C5A059"],
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
    category: "NEW IN",
  },
]

export function Category() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeCategory, setActiveCategory] = useState("ALL")

  const filteredProducts =
    activeCategory === "ALL"
      ? products
      : products.filter((p) => p.category === activeCategory)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section ref={ref} id="shop" className="bg-[#F9F8F6] py-20 lg:py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-4xl lg:text-6xl text-[#1A1A1A] mb-12 lg:mb-16"
        >
          EXPLORE OUR CATEGORY
        </motion.h2>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 text-xs font-medium tracking-wider transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#0A3D2E] text-[#F9F8F6]"
                  : "bg-transparent border border-[#1A1A1A]/20 text-[#1A1A1A] hover:border-[#0A3D2E] hover:text-[#0A3D2E]"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Discount Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-[#0A3D2E] text-[#F9F8F6] px-3 py-1.5 text-[10px] font-medium tracking-wider">
                    {product.discount}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-lg lg:text-xl text-[#1A1A1A] mb-1 group-hover:text-[#0A3D2E] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[#C5A059] font-medium text-sm lg:text-base">
                    {formatPrice(product.price)}
                  </p>
                </div>

                {/* Color Options */}
                <div className="flex gap-1">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      className="w-3 h-3 rounded-full border border-[#1A1A1A]/10 hover:scale-125 transition-transform"
                      style={{ backgroundColor: color }}
                      aria-label={`Color option ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
