"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { Instagram, Youtube, Phone, MapPin, Mail } from "lucide-react"
import { collectionNameToSlug } from "@/lib/collections-public"
import { usePublicCollections } from "@/lib/public-collections-context"
import { BrandLogo } from "@/components/brand/logo"
import Image from "next/image"

const footerLinks = {
  menu: [
    { name: "Shop", href: "/shop" },
    { name: "Collections", href: "/collections" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
}

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const collections = usePublicCollections()

  const catalogueLinks =
    collections.length > 0
      ? collections.map((c) => ({
          name: c.name,
          href: `/collections/${collectionNameToSlug(c.name)}`,
        }))
      : [{ name: "All collections", href: "/collections" }]

  return (
    <footer ref={ref} className="bg-[#05120F] text-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="mb-6">
  <Image src="/logo2.webp" alt="ABS Clothing" width={100} height={100} className="h-auto w-20 md:w-[100px]" />
            </div>
            <p className="text-[#F9F8F6]/60 mb-8 max-w-sm leading-relaxed text-sm lg:text-base">
              ABS Clothing is a premium fashion brand that emphasizes quality craftsmanship, attention to detail, and
              timeless style for the modern Nigerian.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/abs_fashiondesign"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#F9F8F6]/10 rounded-full flex items-center justify-center hover:bg-[#C5A059] transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@absclothing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#F9F8F6]/10 rounded-full flex items-center justify-center hover:bg-[#C5A059] transition-colors duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/sodiqabidemi23"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#F9F8F6]/10 rounded-full flex items-center justify-center hover:bg-[#C5A059] transition-colors duration-300"
                aria-label="X"
              >
                <span className="font-semibold text-sm">X</span>
              </a>
            </div>
            <div className="mt-5 space-y-1 text-xs text-[#F9F8F6]/60">
              <a href="https://www.tiktok.com/@absclothing1" target="_blank" rel="noopener noreferrer" className="block hover:text-[#C5A059]">TikTok: @absclothing1</a>
              <a href="https://wa.me/2348087891756" target="_blank" rel="noopener noreferrer" className="block hover:text-[#C5A059]">WhatsApp: 08087891756</a>
              <a href="https://www.pinterest.com/absclothing1" target="_blank" rel="noopener noreferrer" className="block hover:text-[#C5A059]">Pinterest: Absclothing1</a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-semibold text-sm tracking-wider mb-6">MENU</h4>
            <ul className="space-y-3">
              {footerLinks.menu.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#F9F8F6]/60 hover:text-[#C5A059] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold text-sm tracking-wider mb-6">CATALOGUE</h4>
            <ul className="space-y-3">
              {catalogueLinks.map((link) => (
                <li key={link.href + link.name}>
                  <Link
                    href={link.href}
                    className="text-[#F9F8F6]/60 hover:text-[#C5A059] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/cart" className="text-[#F9F8F6]/60 hover:text-[#C5A059] transition-colors text-sm">
                  Cart
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-semibold text-sm tracking-wider mb-6">CONTACT</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C5A059] mt-1 shrink-0" />
                <span className="text-[#F9F8F6]/60 text-sm">08087891756</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C5A059] mt-1 shrink-0" />
                <span className="text-[#F9F8F6]/60 text-sm">info@absclothing.ng</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A059] mt-1 shrink-0" />
                <span className="text-[#F9F8F6]/60 text-sm">Tanke ilorin Kwara state</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 border-t border-[#F9F8F6]/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#F9F8F6]/40 text-xs">
              {`© ${new Date().getFullYear()} ABS Clothing. All Rights Reserved. RC: 3573316`}
            </p>
            <div className="flex gap-6 text-xs">
              <Link href="/terms" className="text-[#F9F8F6]/40 hover:text-[#C5A059] transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="text-[#F9F8F6]/40 hover:text-[#C5A059] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-[#F9F8F6]/40 hover:text-[#C5A059] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.03 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 overflow-hidden"
        >
          <p className="font-serif text-[6rem] md:text-[10rem] lg:text-[14rem] font-bold text-[#F9F8F6] leading-none tracking-tighter whitespace-nowrap">
            ABS CLOTHING
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
