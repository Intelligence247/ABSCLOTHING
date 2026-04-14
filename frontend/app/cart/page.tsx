"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useCustomerAuth } from "@/lib/customer-auth-context"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, total, shippingCost } = useCart()
  const { user } = useCustomerAuth()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[36vh] min-h-[260px] bg-[#05120F] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="cart-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#cart-grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-serif font-bold text-[#F9F8F6]"
          >
            Shopping Cart
          </motion.h1>
          <p className="mt-3 text-[#F9F8F6]/75 text-base md:text-lg max-w-xl">
            Review your selected items and continue securely to checkout.
          </p>
        </div>
        <div className="absolute inset-0 stroke-text text-8xl md:text-9xl font-serif font-bold opacity-10 flex items-center justify-center pointer-events-none">
          CART
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <h2 className="text-3xl font-serif mb-4">Your cart is empty</h2>
            <p className="text-foreground/70 mb-8">Start shopping to add items to your cart</p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-primary-foreground px-12 py-4 font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.product.id}-${item.color}-${item.size}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="flex gap-6 border-b border-border pb-6"
                >
                  {/* Image */}
                  <div className="relative w-24 h-32 shrink-0 overflow-hidden bg-muted">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/shop/${item.product.id}`}>
                        <h3 className="font-serif text-lg hover:text-primary transition-colors mb-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      <div className="flex gap-4 text-sm text-foreground/70 mb-2">
                        <span>
                          Color:{" "}
                          <span
                            className="inline-block w-3 h-3 rounded-full ml-1 align-middle"
                            style={{
                              backgroundColor: item.product.colors.find((c) => c.name === item.color)?.hex,
                            }}
                          />
                        </span>
                        <span>Size: {item.size}</span>
                      </div>
                    </div>

                    {/* Price & Quantity */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-foreground/70 mb-1">Price</p>
                        <p className="text-lg font-semibold text-accent">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.color,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="w-8 h-8 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.color,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="w-8 h-8 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id, item.color, item.size)}
                        className="text-foreground/50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-sm text-foreground/70 mb-1">Subtotal</p>
                    <p className="text-lg font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="h-fit sticky top-24 space-y-6"
            >
              <div className="bg-muted p-8 space-y-4">
                <h2 className="text-2xl font-serif mb-6">Order Summary</h2>

                <div className="space-y-3 border-b border-border pb-4">
                  <div className="flex justify-between text-foreground/70">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  {shippingCost === 0 && (
                    <p className="text-sm text-green-600">Free shipping applied</p>
                  )}
                </div>

                <div className="flex justify-between text-xl font-semibold">
                  <span>Total</span>
                  <span className="text-accent">{formatPrice(total)}</span>
                </div>

                <Link
                  href={user ? "/checkout" : "/account/login?returnTo=%2Fcheckout"}
                  className="block w-full text-center bg-primary text-primary-foreground py-4 font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
                >
                  {user ? "Proceed to checkout" : "Sign in to checkout"}
                </Link>
                {!user && (
                  <p className="text-center text-xs text-muted-foreground">
                    <Link href="/account/register?returnTo=%2Fcheckout" className="underline hover:text-foreground">
                      Create an account
                    </Link>{" "}
                    if you don&apos;t have one yet.
                  </p>
                )}

                <Link
                  href="/shop"
                  className="block text-center py-3 border border-border hover:border-primary transition-colors text-sm font-semibold tracking-widest uppercase"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Info Box */}
              <div className="bg-primary/10 p-4 rounded space-y-2 text-sm">
                <p className="font-semibold">Order Information</p>
                <ul className="space-y-1 text-foreground/70 text-xs">
                  <li>✓ Free shipping on orders over 100,000 NGN</li>
                  <li>✓ Secure checkout with encryption</li>
                  <li>✓ 30-day returns on eligible items</li>
                  <li>✓ Authentic ABS products guaranteed</li>
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
