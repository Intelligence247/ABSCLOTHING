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

      <div className="container mx-auto px-4 py-10 md:py-16">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <h2 className="mb-4 text-2xl font-serif md:text-3xl">Your cart is empty</h2>
            <p className="text-foreground/70 mb-8">Start shopping to add items to your cart</p>
            <Link
              href="/shop"
              className="inline-block bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90 md:px-12 md:py-4"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Cart Items */}
            <div className="space-y-6 lg:col-span-2">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.product.id}-${item.color}-${item.size}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="border-b border-border pb-6"
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* Image */}
                    <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-muted sm:h-32 sm:w-24">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <Link href={`/shop/${item.product.id}`}>
                          <h3 className="mb-2 font-serif text-base transition-colors hover:text-primary sm:text-lg">
                            {item.product.name}
                          </h3>
                        </Link>
                        <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/70">
                          <span>
                            Color:{" "}
                            <span
                              className="ml-1 inline-block h-3 w-3 align-middle"
                              style={{
                                backgroundColor: item.product.colors.find((c) => c.name === item.color)?.hex,
                              }}
                            />
                          </span>
                          <span>Size: {item.size}</span>
                        </div>
                        <p className="text-sm text-foreground/70">Price</p>
                        <p className="text-base font-semibold text-accent sm:text-lg">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      {/* Price & Quantity */}
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
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
                            className="flex h-8 w-8 items-center justify-center border border-border transition-colors hover:bg-muted"
                            aria-label={`Decrease quantity for ${item.product.name}`}
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
                            className="flex h-8 w-8 items-center justify-center border border-border transition-colors hover:bg-muted"
                            aria-label={`Increase quantity for ${item.product.name}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id, item.color, item.size)}
                          className="text-foreground/50 transition-colors hover:text-red-500"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 sm:justify-end sm:gap-4 sm:border-t-0 sm:pt-0">
                    <p className="text-sm text-foreground/70 sm:mb-1">Subtotal</p>
                    <p className="text-base font-semibold sm:text-lg">
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
              className="h-fit space-y-6 lg:sticky lg:top-24"
            >
              <div className="space-y-4 bg-muted p-5 sm:p-8">
                <h2 className="mb-6 font-serif text-xl sm:text-2xl">Order Summary</h2>

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
                  className="block w-full bg-primary py-3 text-center text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90 sm:py-4"
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
                  className="block border border-border py-3 text-center text-xs font-semibold uppercase tracking-widest transition-colors hover:border-primary sm:text-sm"
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
