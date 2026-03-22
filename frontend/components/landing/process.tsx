"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { ArrowRight, Play, Pause } from "lucide-react"
import Image from "next/image"

const processSteps = [
  {
    number: "01",
    title: "DESIGN & CONCEPT",
    description: "Every collection starts with inspiration from Nigerian heritage and contemporary global fashion aesthetics.",
  },
  {
    number: "02",
    title: "MATERIAL SELECTION",
    description: "We carefully source premium fabrics from trusted local and international suppliers for quality.",
  },
  {
    number: "03",
    title: "EXPERT TAILORING",
    description: "Master craftsmen with decades of experience bring each design to life with precision stitching.",
  },
]

export function Process() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10%" })
  const [isPlaying, setIsPlaying] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const contentY = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section ref={ref} className="bg-[#F9F8F6] py-24 lg:py-40 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <span className="inline-flex items-center gap-3 border border-[#1A1A1A]/20 px-5 py-2.5 text-xs font-medium tracking-widest text-[#1A1A1A] rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#0A3D2E] animate-pulse" />
            OUR PROCESS
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-[#1A1A1A] mb-20 lg:mb-28 leading-tight max-w-4xl"
        >
          <span className="text-balance">CRAFTED WITH CARE,</span>
          <br />
          <span className="text-[#0A3D2E]">FROM START TO FINISH.</span>
        </motion.h2>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Video/Image Placeholder */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-sm overflow-hidden group shadow-2xl shadow-[#1A1A1A]/10">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1000&fit=crop"
                alt="Master tailor at work creating bespoke garments"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#05120F]/60 via-transparent to-transparent" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-[#F9F8F6]/10 backdrop-blur-md flex items-center justify-center hover:bg-[#C5A059] hover:scale-110 transition-all duration-500 group/play border border-[#F9F8F6]/20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 lg:w-10 lg:h-10 text-[#F9F8F6] group-hover/play:text-[#05120F]" />
                  ) : (
                    <Play className="w-8 h-8 lg:w-10 lg:h-10 text-[#F9F8F6] fill-[#F9F8F6] ml-1 group-hover/play:text-[#05120F] group-hover/play:fill-[#05120F]" />
                  )}
                </motion.button>
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-[#C5A059]/50" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-[#C5A059]/50" />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ delay: 0.8 }}
              className="absolute -right-4 top-1/4 bg-[#0A3D2E] text-[#F9F8F6] px-6 py-4 shadow-xl hidden lg:block"
            >
              <p className="text-3xl font-serif font-bold">15+</p>
              <p className="text-xs tracking-wider opacity-70">YEARS EXPERIENCE</p>
            </motion.div>
          </motion.div>

          {/* Process Steps */}
          <motion.div 
            style={{ y: contentY }}
            className="flex flex-col justify-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[#1A1A1A]/70 text-base lg:text-lg leading-relaxed mb-14 max-w-lg"
            >
              Take a peek behind the curtain and discover how we create each piece with meticulous attention to detail, premium materials, and a deep respect for the art of tailoring.
            </motion.p>

            <div className="space-y-10">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.15 }}
                  className="flex gap-6 group cursor-pointer"
                >
                  <div className="flex-shrink-0 relative">
                    <div className="w-14 h-14 rounded-full bg-[#0A3D2E] flex items-center justify-center group-hover:bg-[#C5A059] transition-all duration-500 shadow-lg shadow-[#0A3D2E]/20 group-hover:shadow-[#C5A059]/30">
                      <span className="text-sm font-bold text-[#F9F8F6] group-hover:text-[#05120F] transition-colors">{step.number}</span>
                    </div>
                    {index < processSteps.length - 1 && (
                      <motion.div 
                        className="absolute top-16 left-1/2 w-px h-10 bg-gradient-to-b from-[#0A3D2E]/30 to-transparent -translate-x-1/2"
                        initial={{ scaleY: 0 }}
                        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ delay: 0.6 + index * 0.2, duration: 0.5 }}
                        style={{ transformOrigin: "top" }}
                      />
                    )}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-serif text-xl lg:text-2xl text-[#1A1A1A] mb-2 group-hover:text-[#0A3D2E] transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-sm lg:text-base text-[#1A1A1A]/60 leading-relaxed max-w-sm">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-14"
            >
              <a
                href="#"
                className="group inline-flex items-center gap-4 border-2 border-[#1A1A1A]/20 px-10 py-5 text-sm font-medium tracking-widest text-[#1A1A1A] hover:bg-[#0A3D2E] hover:border-[#0A3D2E] hover:text-[#F9F8F6] transition-all duration-500 relative overflow-hidden"
              >
                <span className="relative z-10">Discover Our Values</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
