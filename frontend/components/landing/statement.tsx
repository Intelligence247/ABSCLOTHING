"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

const statementParts = [
  { type: "text", content: "ELEVATE YOUR" },
  { type: "text", content: "FASHION GAME" },
  { 
    type: "image", 
    src: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=120&h=60&fit=crop",
    alt: "Fashion model"
  },
  { type: "text", content: "WITH" },
  { type: "break" },
  { type: "text", content: "OUR EXPERTLY" },
  { 
    type: "image", 
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=60&fit=crop&crop=face",
    alt: "Tailored suit"
  },
  { type: "text", content: "CURATED COLLECTION" },
  { type: "break" },
  { type: "text", content: "OF BESPOKE PIECES." },
  { 
    type: "image", 
    src: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=120&h=60&fit=crop",
    alt: "Fabric details"
  },
  { type: "text", content: "DISCOVER" },
  { type: "break" },
  { type: "text", content: "THE PERFECT OUTFIT FOR ANY OCCASION," },
  { type: "break" },
  { type: "text", content: "FROM CASUAL" },
  { 
    type: "image", 
    src: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=120&h=60&fit=crop",
    alt: "Casual wear"
  },
  { type: "text", content: "TO FORMAL." },
  { 
    type: "image", 
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=60&fit=crop",
    alt: "Formal attire"
  },
]

export function Statement() {
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-15%" })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  let itemIndex = 0

  return (
    <section 
      ref={containerRef} 
      className="relative bg-[#0A3D2E] py-24 lg:py-40 px-6 lg:px-12 overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwVjBoLTJ2MzRoMnptLTYgMFYwaC0ydjM0aDJ6bS02IDBWMGgtMnYzNGgyem0tNiAwVjBoLTJ2MzRoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-repeat" />
      </div>

      <motion.div 
        style={{ y }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <div className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#F9F8F6] leading-snug lg:leading-snug text-center tracking-wide flex flex-wrap justify-center items-center gap-x-3 gap-y-2 lg:gap-x-4 lg:gap-y-3">
          {statementParts.map((part, index) => {
            if (part.type === "break") {
              return <div key={`break-${index}`} className="w-full h-0" />
            }

            const currentItemIndex = itemIndex++

            if (part.type === "image") {
              return (
                <motion.span
                  key={`image-${index}`}
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.8, rotate: -5 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: currentItemIndex * 0.06,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="inline-block"
                >
                  <span className="inline-block w-16 h-8 sm:w-20 sm:h-10 lg:w-28 lg:h-14 rounded-full overflow-hidden relative shadow-lg shadow-black/20 ring-2 ring-[#C5A059]/30 hover:ring-[#C5A059] hover:scale-110 transition-all duration-300 cursor-pointer">
                    <Image
                      src={part.src || ""}
                      alt={part.alt || ""}
                      fill
                      className="object-cover"
                    />
                  </span>
                </motion.span>
              )
            }

            return (
              <motion.span
                key={`text-${index}`}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 30, filter: "blur(10px)" }}
                transition={{ 
                  duration: 0.5, 
                  delay: currentItemIndex * 0.06,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="inline-block hover:text-[#C5A059] transition-colors duration-300 cursor-default"
              >
                {part.content}
              </motion.span>
            )
          })}
        </div>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-8 left-8 w-32 h-32 border border-[#C5A059] rounded-full"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute top-12 right-12 w-20 h-20 border border-[#F9F8F6] rounded-full"
      />
    </section>
  )
}
