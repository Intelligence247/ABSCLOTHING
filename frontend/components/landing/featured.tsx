"use client"

import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/lib/products"
import { fetchProducts } from "@/lib/product-api"

export function Featured() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      try {
        const list = await fetchProducts({ sort: "featured" })
        if (!cancelled) setProducts(list.slice(0, 3))
      } catch {
        if (!cancelled) setProducts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

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
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-4xl lg:text-6xl text-[#1A1A1A] mb-12 lg:mb-16"
        >
          OUR FEATURED PRODUCTS
        </motion.h2>

        {loading ? (
          <p className="text-center text-muted-foreground py-16">Loading featured products…</p>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No products to feature yet.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
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
                    {product.isBestSeller ? (
                      <div className="absolute top-4 right-4">
                        <span className="inline-block bg-[#C5A059] text-[#05120F] px-3 py-1.5 text-[10px] font-medium tracking-wider">
                          Best seller
                        </span>
                      </div>
                    ) : null}
                    <div className="absolute inset-0 bg-[#0A3D2E]/0 group-hover:bg-[#0A3D2E]/20 transition-colors duration-300" />
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
                          key={`${product.id}-fc-${i}`}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 lg:mt-16 text-center"
        >
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 bg-[#0A3D2E] text-[#F9F8F6] px-10 py-4 text-sm font-medium tracking-wide hover:bg-[#05120F] transition-all duration-300"
          >
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
