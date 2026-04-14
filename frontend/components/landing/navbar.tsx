"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingBag, Menu, X, User, ChevronDown } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useCustomerAuth } from "@/lib/customer-auth-context"
import { BrandLogo } from "@/components/brand/logo"
import {
  collectionNameToSlug,
  fetchPublicCollectionsClient,
  isCollectionsSectionPath,
  type PublicCollection,
} from "@/lib/collections-public"

const primaryLinks = [
  { name: "HOME", href: "/" },
  { name: "SHOP", href: "/shop" },
  { name: "ABOUT", href: "/about" },
  { name: "CONTACT", href: "/contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false)
  const [collections, setCollections] = useState<PublicCollection[]>([])
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const { items } = useCart()
  const { user: customer, logout: logoutCustomer } = useCustomerAuth()
  const cartCount = items.length
  const collectionsActive = isCollectionsSectionPath(pathname)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchPublicCollectionsClient().then((c) => {
      if (!cancelled) setCollections(c)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const showSolidBg = !isHomePage || isScrolled
  const linkClass = `relative inline-block text-xs font-semibold tracking-widest transition-colors duration-300 ${
    showSolidBg ? "text-[#1A1A1A]" : "text-[#F9F8F6]"
  } hover:text-[#C5A059]`

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showSolidBg ? "bg-[#F9F8F6]/98 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div whileHover={{ scale: 1.02 }} className="shrink-0">
              <BrandLogo
                href="/"
                compact={false}
                showBadge={!showSolidBg}
                theme={showSolidBg ? "dark" : "gold"}
              />
            </motion.div>

            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {primaryLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={linkClass}
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

              <div className="relative group">
                <Link
                  href="/collections"
                  className={`${linkClass} inline-flex items-center gap-1`}
                >
                  COLLECTIONS
                  <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:translate-y-0.5 transition-transform" />
                  {collectionsActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C5A059]"
                    />
                  )}
                </Link>
                <div
                  className="absolute left-0 top-full pt-2 min-w-[220px] opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50"
                  role="menu"
                >
                  <div className="bg-[#F9F8F6] border border-[#E8E6E3] shadow-lg py-2 text-left">
                    <Link
                      href="/collections"
                      className="block px-4 py-2.5 text-xs font-semibold tracking-wider text-[#1A1A1A] hover:bg-[#E8E6E3] hover:text-[#0A3D2E]"
                    >
                      All collections
                    </Link>
                    {collections.map((c) => (
                      <Link
                        key={c.id}
                        href={`/collections/${collectionNameToSlug(c.name)}`}
                        className="block px-4 py-2.5 text-xs tracking-wider text-[#1A1A1A]/90 hover:bg-[#E8E6E3] hover:text-[#0A3D2E]"
                      >
                        {c.name}
                      </Link>
                    ))}
                    {collections.length === 0 ? (
                      <p className="px-4 py-2 text-[11px] text-[#666666]">No collections yet</p>
                    ) : null}
                  </div>
                </div>
              </div>

              {primaryLinks.slice(2).map((link) => (
                <Link key={link.name} href={link.href} className={linkClass}>
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

            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/shop"
                className={`p-2.5 transition-all duration-300 ${
                  showSolidBg ? "text-[#1A1A1A] hover:bg-[#E8E6E3]" : "text-[#F9F8F6] hover:bg-white/10"
                }`}
                aria-label="Shop"
              >
                <Search className="w-5 h-5" />
              </Link>
              <Link
                href={customer ? "/shop" : "/account/login"}
                title={customer ? customer.email : "Sign in"}
                className={`p-2.5 transition-all duration-300 ${
                  showSolidBg ? "text-[#1A1A1A] hover:bg-[#E8E6E3]" : "text-[#F9F8F6] hover:bg-white/10"
                }`}
              >
                <User className="w-5 h-5" />
              </Link>
              {customer && (
                <button
                  type="button"
                  onClick={() => logoutCustomer()}
                  className={`hidden lg:inline text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded border transition-colors ${
                    showSolidBg
                      ? "border-[#E8E6E3] text-[#666666] hover:border-[#0A3D2E] hover:text-[#0A3D2E]"
                      : "border-white/30 text-[#F9F8F6]/90 hover:bg-white/10"
                  }`}
                >
                  Sign out
                </button>
              )}
              <Link
                href="/cart"
                className={`p-2.5 transition-all duration-300 relative ${
                  showSolidBg ? "text-[#1A1A1A] hover:bg-[#E8E6E3]" : "text-[#F9F8F6] hover:bg-white/10"
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
                className={`p-2.5 text-xs font-semibold tracking-wider transition-all duration-300 ${
                  showSolidBg
                    ? "text-[#666666] hover:bg-[#E8E6E3] hover:text-[#1A1A1A]"
                    : "text-[#F9F8F6]/60 hover:bg-white/10 hover:text-[#F9F8F6]"
                }`}
                title="Admin"
              >
                Admin
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 transition-colors ${
                showSolidBg ? "text-[#1A1A1A] hover:bg-[#E8E6E3]" : "text-[#F9F8F6] hover:bg-white/10"
              }`}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#F9F8F6] md:hidden overflow-y-auto"
          >
            <div className="h-20" />
            <nav className="container mx-auto px-6 py-8 pb-24">
              <div className="flex flex-col gap-1">
                {primaryLinks.slice(0, 2).map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-4 font-serif text-3xl transition-colors ${
                        pathname === link.href ? "text-[#C5A059]" : "text-[#1A1A1A] hover:text-[#0A3D2E]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="border-t border-[#E8E6E3] mt-2 pt-4"
                >
                  <button
                    type="button"
                    onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                    className="flex w-full items-center justify-between py-2 font-serif text-3xl text-[#1A1A1A]"
                  >
                    COLLECTIONS
                    <ChevronDown
                      className={`w-6 h-6 transition-transform ${mobileCollectionsOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileCollectionsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-2"
                      >
                        <Link
                          href="/collections"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-3 text-lg text-[#666666] hover:text-[#0A3D2E]"
                        >
                          All collections
                        </Link>
                        {collections.map((c) => (
                          <Link
                            key={c.id}
                            href={`/collections/${collectionNameToSlug(c.name)}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block py-3 text-lg text-[#666666] hover:text-[#0A3D2E]"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {primaryLinks.slice(2).map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-4 font-serif text-3xl transition-colors ${
                        pathname === link.href ? "text-[#C5A059]" : "text-[#1A1A1A] hover:text-[#0A3D2E]"
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
                transition={{ delay: 0.25 }}
                className="mt-12 pt-8 border-t border-[#E8E6E3]"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/shop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-[#E8E6E3] text-[#1A1A1A] py-4 text-sm font-semibold tracking-wider"
                  >
                    <Search className="w-5 h-5" />
                    SHOP
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-[#0A3D2E] text-[#F9F8F6] py-4 text-sm font-semibold tracking-wider"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    CART ({cartCount})
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
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
                  Tanke ilorin Kwara state
                </p>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
