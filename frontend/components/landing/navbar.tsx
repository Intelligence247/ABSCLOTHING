"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingBag, Menu, X, User } from "lucide-react"
import { useCart } from "@/lib/cart-context"

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "SHOP", href: "/shop" },
  { name: "COLLECTIONS", href: "/collections" },
  { name: "ABOUT", href: "/about" },
  { name: "CONTACT", href: "/contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const { items } = useCart()
  const cartCount = items.length

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // On non-home pages, always show solid background
  const showSolidBg = !isHomePage || isScrolled

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showSolidBg
            ? "bg-[#F9F8F6]/98 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <motion.h1
                className={`font-serif text-xl md:text-2xl font-bold tracking-wider transition-colors duration-300 ${
                  showSolidBg ? "text-[#1A1A1A]" : "text-[#F9F8F6]"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                ABS CLOTHING
              </motion.h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-xs font-semibold tracking-widest transition-colors duration-300 ${
                    showSolidBg ? "text-[#1A1A1A]" : "text-[#F9F8F6]"
                  } hover:text-[#C5A059]`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C5A059]"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                className={`p-2.5 transition-all duration-300 ${
                  showSolidBg
                    ? "text-[#1A1A1A] hover:bg-[#E8E6E3]"
                    : "text-[#F9F8F6] hover:bg-white/10"
                }`}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                className={`p-2.5 transition-all duration-300 ${
                  showSolidBg
                    ? "text-[#1A1A1A] hover:bg-[#E8E6E3]"
                    : "text-[#F9F8F6] hover:bg-white/10"
                }`}
              >
                <User className="w-5 h-5" />
              </button>
              <Link
                href="/cart"
                className={`p-2.5 transition-all duration-300 relative ${
                  showSolidBg
                    ? "text-[#1A1A1A] hover:bg-[#E8E6E3]"
                    : "text-[#F9F8F6] hover:bg-white/10"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#C5A059] text-[#05120F] text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href="/admin/login"
                className={`p-2.5 transition-all duration-300 ${
                  showSolidBg
                    ? "text-[#666666] hover:bg-[#E8E6E3] hover:text-[#1A1A1A]"
                    : "text-[#F9F8F6]/60 hover:bg-white/10 hover:text-[#F9F8F6]"
                }`}
                title="Admin Portal"
              >
                <User className="w-5 h-5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 transition-colors ${
                showSolidBg
                  ? "text-[#1A1A1A] hover:bg-[#E8E6E3]"
                  : "text-[#F9F8F6] hover:bg-white/10"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#F9F8F6]"
          >
            <div className="h-20" /> {/* Spacer for header */}
            <nav className="container mx-auto px-6 py-8">
              <div className="flex flex-col gap-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-4 font-serif text-3xl transition-colors ${
                        pathname === link.href
                          ? "text-[#C5A059]"
                          : "text-[#1A1A1A] hover:text-[#0A3D2E]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12 pt-8 border-t border-[#E8E6E3]"
              >
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 bg-[#E8E6E3] text-[#1A1A1A] py-4 text-sm font-semibold tracking-wider">
                    <Search className="w-5 h-5" />
                    SEARCH
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-[#0A3D2E] text-[#F9F8F6] py-4 text-sm font-semibold tracking-wider">
                    <ShoppingBag className="w-5 h-5" />
                    CART (0)
                  </button>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 space-y-4 text-sm text-[#666666]"
              >
                <p>
                  <span className="text-[#1A1A1A] font-medium">Phone: </span>
                  <a href="tel:+2348087891756" className="hover:text-[#C5A059]">
                    +234 808 789 1756
                  </a>
                </p>
                <p>
                  <span className="text-[#1A1A1A] font-medium">Address: </span>
                  2 Mogaji Compound, Tanke Iledu, Kwara State
                </p>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
