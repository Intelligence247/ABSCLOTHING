"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Heart, Eye, ShoppingBag } from "lucide-react"
import { useState } from "react"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#E8E6E3] mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.discount && (
            <span className="inline-block bg-[#0A3D2E] text-[#F9F8F6] px-3 py-1.5 text-[10px] font-semibold tracking-wider">
              {product.discount}
            </span>
          )}
          {product.isNew && (
            <span className="inline-block bg-[#C5A059] text-[#05120F] px-3 py-1.5 text-[10px] font-semibold tracking-wider">
              NEW
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="inline-block bg-[#1A1A1A] text-[#F9F8F6] px-3 py-1.5 text-[10px] font-semibold tracking-wider">
              BEST SELLER
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center transition-colors ${
            isLiked
              ? "bg-[#C5A059] text-[#05120F]"
              : "bg-white/90 text-[#1A1A1A] hover:bg-[#0A3D2E] hover:text-white"
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
        </motion.button>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-4 left-4 right-4 flex gap-2"
        >
          <Link
            href={`/shop/${product.id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-[#1A1A1A] py-3 text-xs font-semibold tracking-wider hover:bg-[#0A3D2E] hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
            QUICK VIEW
          </Link>
          <Link
            href={`/shop/${product.id}`}
            className="w-12 h-12 flex items-center justify-center bg-[#0A3D2E] text-white hover:bg-[#C5A059] hover:text-[#05120F] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        {/* Color Options */}
        <div className="flex items-center gap-2">
          {product.colors.map((color, i) => (
            <button
              key={i}
              onClick={() => setSelectedColor(i)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                selectedColor === i
                  ? "ring-2 ring-offset-2 ring-[#0A3D2E]"
                  : "hover:scale-110"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>

        {/* Name & Category */}
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-[#666666] uppercase mb-1">
            {product.category}
          </p>
          <Link href={`/shop/${product.id}`}>
            <h3 className="font-serif text-lg text-[#1A1A1A] group-hover:text-[#0A3D2E] transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-[#C5A059]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[#666666] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Sizes */}
        <div className="flex flex-wrap gap-1">
          {product.sizes.slice(0, 4).map((size) => (
            <span
              key={size}
              className="text-[10px] text-[#666666] border border-[#E8E6E3] px-2 py-0.5"
            >
              {size}
            </span>
          ))}
          {product.sizes.length > 4 && (
            <span className="text-[10px] text-[#666666]">
              +{product.sizes.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
