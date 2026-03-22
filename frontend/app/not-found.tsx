"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-8 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-9xl md:text-[200px] font-serif font-bold text-primary/20 leading-none">
              404
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-serif">Page Not Found</h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/"
              className="inline-block bg-primary text-primary-foreground px-12 py-4 font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/shop"
              className="inline-block bg-foreground text-background px-12 py-4 font-semibold tracking-widest uppercase hover:bg-foreground/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
