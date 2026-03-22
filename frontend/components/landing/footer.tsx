"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { Instagram, Facebook, Twitter, Phone, MapPin, Mail } from "lucide-react"

const footerLinks = {
  menu: [
    { name: "Shop", href: "/shop" },
    { name: "Collections", href: "/collections" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  catalogue: [
    { name: "Men's Collection", href: "/collections/men" },
    { name: "Women's Collection", href: "/collections/women" },
    { name: "Accessories", href: "/collections/accessories" },
    { name: "Cart", href: "/cart" },
  ],
}

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <footer ref={ref} className="bg-[#05120F] text-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <h3 className="font-serif text-3xl lg:text-4xl font-semibold mb-6">
              ABS<span className="text-[#C5A059]">.</span>
            </h3>
            <p className="text-[#F9F8F6]/60 mb-8 max-w-sm leading-relaxed text-sm lg:text-base">
              ABS Clothing is a premium fashion brand that emphasizes quality craftsmanship, attention to detail, and timeless style for the modern Nigerian.
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
                href="#"
                className="w-10 h-10 bg-[#F9F8F6]/10 rounded-full flex items-center justify-center hover:bg-[#C5A059] transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#F9F8F6]/10 rounded-full flex items-center justify-center hover:bg-[#C5A059] transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Menu Column */}
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

          {/* Catalogue Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold text-sm tracking-wider mb-6">CATALOGUE</h4>
            <ul className="space-y-3">
              {footerLinks.catalogue.map((link) => (
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

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-semibold text-sm tracking-wider mb-6">CONTACT</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C5A059] mt-1 flex-shrink-0" />
                <span className="text-[#F9F8F6]/60 text-sm">08087891756</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C5A059] mt-1 flex-shrink-0" />
                <span className="text-[#F9F8F6]/60 text-sm">info@absclothing.ng</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A059] mt-1 flex-shrink-0" />
                <span className="text-[#F9F8F6]/60 text-sm">2 Mogaji Compound, Tanke Iledu, Kwara State</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
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

        {/* Large Background Text */}
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
