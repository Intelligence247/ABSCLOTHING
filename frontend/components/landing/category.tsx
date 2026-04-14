"use client"

import { motion, useInView } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/products"
import { fetchProducts } from "@/lib/product-api"

const TAB_ALL = "ALL"
const TAB_NEW = "NEW IN"
const TAB_BEST = "BEST SELLER"

export function Category() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeCategory, setActiveCategory] = useState(TAB_ALL)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setError("")
      try {
        const list = await fetchProducts({ sort: "featured" })
        if (!cancelled) setProducts(list)
      } catch (e) {
        if (!cancelled) {
          setProducts([])
          setError(e instanceof Error ? e.message : "Could not load products")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  const categoryTabs = useMemo(() => {
    const fromData = Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort()
    return [TAB_ALL, TAB_NEW, TAB_BEST, ...fromData]
  }, [products])

  const filteredProducts = useMemo(() => {
    let list = products
    if (activeCategory === TAB_NEW) {
      list = list.filter((p) => p.isNew)
    } else if (activeCategory === TAB_BEST) {
      list = list.filter((p) => p.isBestSeller)
    } else if (activeCategory !== TAB_ALL) {
      list = list.filter((p) => p.category === activeCategory)
    }
    return list.slice(0, 6)
  }, [products, activeCategory])

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
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-4xl lg:text-6xl text-[#1A1A1A] mb-12 lg:mb-16"
        >
          EXPLORE OUR CATEGORY
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {categoryTabs.map((category) => (
            <button
              key={category}
              type="button"
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

        {error ? (
          <p className="text-center text-red-600 py-8">{error}</p>
        ) : loading ? (
          <p className="text-center text-muted-foreground py-16">Loading products…</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No products in this filter yet.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Link href={`/shop/${product.id}`} className="group block cursor-pointer">
                  <div className="relative aspect-[3/4] rounded-sm overflow-hidden mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                    {product.discount ? (
                      <div className="absolute top-4 left-4">
                        <span className="inline-block bg-[#0A3D2E] text-[#F9F8F6] px-3 py-1.5 text-[10px] font-medium tracking-wider">
                          {product.discount}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-lg lg:text-xl text-[#1A1A1A] mb-1 group-hover:text-[#0A3D2E] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[#C5A059] font-medium text-sm lg:text-base">{formatPrice(product.price)}</p>
                    </div>

                    <div className="flex gap-1">
                      {product.colors.slice(0, 4).map((color, i) => (
                        <span
                          key={`${product.id}-c-${i}`}
                          className="w-3 h-3 rounded-full border border-[#1A1A1A]/10"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
