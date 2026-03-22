"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { products } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { Heart, Share2, Truck, Shield, RotateCcw, Check } from "lucide-react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { ProductCard } from "@/components/shop/product-card"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { addItem } = useCart()
  const product = products.find((p) => p.id === params.id)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "")
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [mainImage, setMainImage] = useState(product?.image || "")
  const [addedToCart, setAddedToCart] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Product not found</p>
      </div>
    )
  }

  const relatedProducts = products.filter(
    (p) => p.collection === product.collection && p.id !== product.id
  ).slice(0, 4)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-8 text-sm text-muted-foreground"
        >
          <Link href="/shop" className="hover:text-foreground transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/collections/${product.collection.toLowerCase()}`}
            className="hover:text-foreground transition-colors"
          >
            {product.collection}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Thumbnail - using product image */}
            <button
              onClick={() => setMainImage(product.image)}
              className="w-20 h-28 relative overflow-hidden border-2 border-foreground"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </button>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="space-y-8">
              {/* Title & Category */}
              <div>
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-2">
                  {product.category}
                </p>
                <h1 className="text-4xl md:text-5xl font-serif mb-4">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-3xl font-semibold text-accent">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-3 text-lg text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.discount && (
                    <span className="bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold">
                      {product.discount}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-foreground/80 leading-relaxed text-lg">{product.description}</p>

              {/* Colors */}
              <div>
                <h3 className="text-sm font-semibold tracking-widest uppercase mb-4">
                  Color: {product.colors[selectedColor].name}
                </h3>
                <div className="flex gap-3">
                  {product.colors.map((color, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setSelectedColor(i)}
                      className={`w-12 h-12 rounded-full transition-all border-2 ${
                        selectedColor === i
                          ? "border-foreground scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <h3 className="text-sm font-semibold tracking-widest uppercase mb-4">Size</h3>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 text-sm font-semibold border-2 transition-all ${
                        selectedSize === size
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-semibold tracking-widest uppercase mb-4">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    −
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  addItem(product, product.colors[selectedColor].name, selectedSize, quantity)
                  setAddedToCart(true)
                  setTimeout(() => setAddedToCart(false), 2000)
                }}
                className="w-full bg-primary text-primary-foreground py-4 text-lg font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </>
                ) : (
                  "Add to Cart"
                )}
              </motion.button>

              {/* Wishlist & Share */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 transition-all ${
                    isLiked
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border hover:border-accent"
                  }`}
                >
                  <Heart className={isLiked ? "fill-current" : ""} />
                  Wishlist
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-border hover:border-accent transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </motion.button>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-8 border-t border-border">
                <div className="flex gap-3 items-center text-sm">
                  <Truck className="w-5 h-5 text-accent" />
                  <span>Free delivery on orders over 100,000 NGN</span>
                </div>
                <div className="flex gap-3 items-center text-sm">
                  <Shield className="w-5 h-5 text-accent" />
                  <span>100% Authentic & Handcrafted</span>
                </div>
                <div className="flex gap-3 items-center text-sm">
                  <RotateCcw className="w-5 h-5 text-accent" />
                  <span>30-day returns & exchanges</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <h2 className="text-4xl font-serif mb-12">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}
