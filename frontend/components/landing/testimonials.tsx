"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    content: "ABS Clothing has completely transformed my wardrobe. The quality is exceptional, and every piece feels like it was made just for me. The tailoring and fabric quality is exactly what I've been looking for.",
    author: "Adebayo Oluwaseun",
    role: "Business Executive",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 2,
    content: "ABS Clothing has completely transformed my wardrobe. The quality is exceptional and every piece fits like it was made just for me. The tailoring aesthetic is exactly what I've been looking for.",
    author: "Chief Abubakar Ibrahim",
    role: "Entrepreneur",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 3,
    content: "ABS Clothing has completely transformed my wardrobe. The quality is exceptional, and every piece feels like it was made just for me. Their attention to detail is unmatched in the industry.",
    author: "Dr. Fatima Yusuf",
    role: "Medical Director",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
]

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="bg-[#F9F8F6] py-20 lg:py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="font-serif text-4xl lg:text-6xl text-[#1A1A1A] mb-4">
            WHAT OUR CUSTOMERS SAY
          </h2>
          <p className="text-[#1A1A1A]/60 text-base lg:text-lg">Real stories from real people</p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-sm p-8 lg:p-10 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <svg
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                  fill="none"
                  className="text-[#0A3D2E]/20"
                >
                  <path
                    d="M0 20.8C0 13.0667 2.66667 7.46667 8 4C10.6667 2.13333 13.0667 1.2 15.2 1.2C16.2667 1.2 17.0667 1.46667 17.6 2C18.1333 2.53333 18.4 3.2 18.4 4C18.4 4.8 18.1333 5.6 17.6 6.4C17.0667 7.2 16.2667 8.26667 15.2 9.6C12.8 12.5333 11.6 15.4667 11.6 18.4C11.6 19.4667 11.8667 20.4 12.4 21.2C12.9333 22 13.3333 22.6667 13.6 23.2C13.8667 23.7333 14 24.2667 14 24.8C14 26.1333 13.3333 27.2 12 28C10.6667 28.8 9.2 29.2 7.6 29.2C5.46667 29.2 3.6 28.4 2 26.8C0.666667 25.2 0 23.2 0 20.8ZM21.6 20.8C21.6 13.0667 24.2667 7.46667 29.6 4C32.2667 2.13333 34.6667 1.2 36.8 1.2C37.8667 1.2 38.6667 1.46667 39.2 2C39.7333 2.53333 40 3.2 40 4C40 4.8 39.7333 5.6 39.2 6.4C38.6667 7.2 37.8667 8.26667 36.8 9.6C34.4 12.5333 33.2 15.4667 33.2 18.4C33.2 19.4667 33.4667 20.4 34 21.2C34.5333 22 34.9333 22.6667 35.2 23.2C35.4667 23.7333 35.6 24.2667 35.6 24.8C35.6 26.1333 34.9333 27.2 33.6 28C32.2667 28.8 30.8 29.2 29.2 29.2C27.0667 29.2 25.2 28.4 23.6 26.8C22.2667 25.2 21.6 23.2 21.6 20.8Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              {/* Testimonial Content */}
              <p className="text-[#1A1A1A]/70 text-sm lg:text-base leading-relaxed mb-8">
                {`"${testimonial.content}"`}
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1A1A1A]">{testimonial.author}</h4>
                  <p className="text-sm text-[#1A1A1A]/50">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center gap-2 mt-12"
        >
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                i === 0 ? "bg-[#0A3D2E]" : "bg-[#1A1A1A]/10 hover:bg-[#0A3D2E]/50"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
