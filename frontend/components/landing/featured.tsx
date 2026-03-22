"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const featuredProducts = [
  {
    id: 1,
    name: "SENATOR SUIT",
    price: 85000,
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=500&fit=crop",
    colors: ["#1A1A1A", "#0A3D2E", "#8B4513"],
  },
  {
    id: 2,
    name: "AGBADA SET",
    price: 120000,
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop",
    colors: ["#F5F5DC", "#0A3D2E", "#1A1A1A"],
  },
  {
    id: 3,
    name: "KAFTAN DELUXE",
    price: 75000,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    colors: ["#0A3D2E", "#1A1A1A", "#8B4513"],
    badge: "Premium Quality",
  },
]

export function Featured() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section ref={ref} className="bg-[#F9F8F6] py-20 lg:py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-4xl lg:text-6xl text-[#1A1A1A] mb-12 lg:mb-16"
        >
          OUR FEATURED PRODUCTS
        </motion.h2>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
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
                {product.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-block bg-[#C5A059] text-[#05120F] px-3 py-1.5 text-[10px] font-medium tracking-wider">
                      {product.badge}
                    </span>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#0A3D2E]/0 group-hover:bg-[#0A3D2E]/20 transition-colors duration-300" />
                
                {/* Quick View Button */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-[#F9F8F6] text-[#1A1A1A] py-3 text-sm font-medium tracking-wide hover:bg-[#C5A059] transition-colors">
                    Quick View
                  </button>
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

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 lg:mt-16 text-center"
        >
          <a
            href="#"
            className="group inline-flex items-center gap-3 bg-[#0A3D2E] text-[#F9F8F6] px-10 py-4 text-sm font-medium tracking-wide hover:bg-[#05120F] transition-all duration-300"
          >
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
