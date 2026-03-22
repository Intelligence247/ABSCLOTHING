"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Menu, Search, ShoppingBag, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

const categoryCards = [
  {
    title: "Men's",
    subtitle: "Agbada & Suits",
    description: "Premium tailored pieces crafted for the distinguished gentleman.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
  },
  {
    title: "Women's",
    subtitle: "Couture",
    description: "Elegant designs that celebrate feminine grace and sophistication.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face",
  },
  {
    title: "Accessories",
    subtitle: "& Fila",
    description: "Complete your look with our curated selection of accessories.",
    image: "https://images.unsplash.com/photo-1521566652839-697aa473761a?w=400&h=500&fit=crop&crop=face",
  },
]

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])

  return (
    <section ref={containerRef} className="relative min-h-screen bg-[#05120F] overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-0 right-0 w-[60%] h-[60%] bg-gradient-radial from-[#0A3D2E]/30 via-transparent to-transparent"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gradient-radial from-[#C5A059]/10 via-transparent to-transparent"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 z-50 px-6 py-6 lg:px-12"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.span 
              className="font-serif text-2xl lg:text-3xl font-semibold tracking-wide text-[#F9F8F6]"
              whileHover={{ scale: 1.05 }}
            >
              ABS<span className="text-[#C5A059] group-hover:animate-pulse">.</span>
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            {["HOME", "SHOP", "COLLECTION", "ABOUT"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
              >
                <Link 
                  href="#" 
                  className={`relative text-xs font-medium tracking-widest ${i === 0 ? "text-[#F9F8F6]" : "text-[#F9F8F6]/60"} hover:text-[#C5A059] transition-colors duration-300 group`}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C5A059] group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            {[
              { icon: Search, label: "Search", showOnMobile: true },
              { icon: User, label: "Account", showOnMobile: true },
              { icon: Menu, label: "Menu", showOnMobile: true, mobileOnly: true },
              { icon: ShoppingBag, label: "Cart", showOnMobile: false },
            ].map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`text-[#F9F8F6]/70 hover:text-[#C5A059] transition-colors ${item.mobileOnly ? "lg:hidden" : ""} ${!item.showOnMobile && !item.mobileOnly ? "hidden lg:block" : ""}`}
                aria-label={item.label}
              >
                <item.icon className="w-5 h-5" />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Background Text - BESPOKE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.h1
          style={{ scale: textScale }}
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.05em" }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="stroke-text font-serif text-[18vw] lg:text-[20vw] font-bold tracking-tighter whitespace-nowrap select-none"
        >
          BESPOKE
        </motion.h1>
      </div>

      {/* Hero Content */}
      <motion.div 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 min-h-screen flex flex-col"
      >
        <div className="flex-1 grid lg:grid-cols-2 gap-8 px-6 lg:px-12 pt-32 lg:pt-40 pb-12 max-w-7xl mx-auto w-full">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            {/* Model Image with Stats */}
            <motion.div
              initial={{ opacity: 0, x: -80, rotate: -5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="relative"
            >
              <div className="relative w-52 h-72 lg:w-64 lg:h-80 rounded-sm overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=500&fit=crop"
                  alt="ABS Clothing Collection"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  priority
                />
                {/* Animated gradient overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-[#05120F]/80 via-transparent to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                />
                
                {/* New Arrivals Badge */}
                <motion.div 
                  className="absolute top-4 left-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <span className="inline-flex items-center gap-2 text-[10px] font-medium text-[#F9F8F6] uppercase tracking-wider bg-[#05120F]/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <motion.span 
                      className="w-2 h-2 rounded-full bg-[#C5A059]"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    New Arrivals
                  </span>
                </motion.div>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-8"
              >
                <motion.span 
                  className="font-serif text-6xl lg:text-7xl font-semibold text-[#F9F8F6] inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  12k
                </motion.span>
                <p className="text-sm text-[#F9F8F6]/60 mt-2 flex items-center gap-2 tracking-widest">
                  <motion.span 
                    className="w-2 h-2 rounded-full bg-[#C5A059]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  NEW COLLECTION
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Content */}
          <div className="flex flex-col justify-center lg:items-end lg:text-right">
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              className="max-w-md"
            >
              <motion.p 
                className="text-[#F9F8F6]/70 text-base lg:text-lg leading-relaxed mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                ABS Clothing is a minimalist style that emphasizes simplicity, naturalness, and calmness. 
                Exquisite tailoring for the modern Nigerian.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <Link
                  href="#shop"
                  className="group inline-flex items-center gap-4 bg-transparent border border-[#F9F8F6]/30 text-[#F9F8F6] px-10 py-5 text-sm font-medium tracking-widest hover:bg-[#C5A059] hover:border-[#C5A059] hover:text-[#05120F] transition-all duration-500 relative overflow-hidden"
                >
                  <span className="relative z-10">SHOP NOW</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                  <motion.div 
                    className="absolute inset-0 bg-[#C5A059] -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                  />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="px-6 lg:px-12 pb-16 max-w-7xl mx-auto w-full">
          <div className="flex gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible scrollbar-hide snap-x snap-mandatory lg:snap-none pb-4">
            {categoryCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 60, rotate: 3 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.9 + index * 0.15,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  y: -10, 
                  rotate: -1,
                  transition: { duration: 0.3 }
                }}
                className="flex-shrink-0 snap-center lg:snap-align-none"
                style={{
                  marginLeft: index > 0 ? "-1.5rem" : "0",
                  zIndex: categoryCards.length - index,
                }}
              >
                <div className="group relative w-60 lg:w-72 bg-gradient-to-br from-[#0A3D2E] to-[#073324] rounded-sm p-6 cursor-pointer shadow-2xl shadow-black/30 hover:shadow-[#C5A059]/10 transition-all duration-500">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="font-serif text-2xl text-[#F9F8F6] font-medium">{card.title}</h3>
                      <p className="text-[#C5A059] text-sm font-medium">{card.subtitle}</p>
                    </div>
                    <motion.button 
                      className="w-10 h-10 rounded-full bg-[#F9F8F6] flex items-center justify-center group-hover:bg-[#C5A059] transition-all duration-300 group-hover:rotate-45"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`View ${card.title} collection`}
                    >
                      <ArrowRight className="w-5 h-5 text-[#0A3D2E] -rotate-45 group-hover:rotate-0 transition-transform" />
                    </motion.button>
                  </div>
                  <p className="text-xs text-[#F9F8F6]/50 leading-relaxed">{card.description}</p>
                  
                  {/* Hover gradient line */}
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A059] via-[#F9F8F6] to-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-[#F9F8F6]/30 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 bg-[#C5A059] rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
