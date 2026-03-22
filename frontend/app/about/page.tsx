"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Award, Heart, Zap } from "lucide-react"

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-b from-primary/80 to-primary/40 flex items-center overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-serif font-bold text-primary-foreground mb-4"
          >
            About ABS Clothing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl"
          >
            Crafting heritage fashion for the modern African
          </motion.p>
        </div>
        <div className="absolute inset-0 stroke-text text-8xl font-serif font-bold opacity-10">ABOUT</div>
      </div>

      <div className="container mx-auto px-4 py-20 space-y-24">
        {/* Brand Story */}
        <motion.section {...fadeInUp} className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif mb-8">Our Story</h2>
          <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
            <p>
              ABS Clothing emerged from a passion for celebrating African heritage through contemporary fashion. 
              Since our establishment, we have dedicated ourselves to crafting bespoke pieces that honor traditional 
              tailoring while embracing modern design sensibilities.
            </p>
            <p>
              Every garment that bears the ABS name is a testament to our commitment to excellence, authenticity, 
              and cultural pride. We believe that fashion should tell a story—of heritage, of craftsmanship, and of 
              the wearer's individuality.
            </p>
            <p>
              Based in Kwara State, Nigeria, we work directly with skilled artisans and tailors who share our vision 
              of creating clothing that transcends seasons and trends. Our CAC registration number 3573316 stands as 
              proof of our legitimacy and commitment to quality assurance.
            </p>
          </div>
        </motion.section>

        {/* Mission & Vision */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="text-3xl font-serif mb-6">Our Mission</h3>
            <p className="text-foreground/80 leading-relaxed text-lg">
              To design and produce authentic, high-quality African fashion that empowers individuals to express 
              their cultural identity with pride and elegance. We are committed to preserving traditional craftsmanship 
              while pushing the boundaries of contemporary style.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-serif mb-6">Our Vision</h3>
            <p className="text-foreground/80 leading-relaxed text-lg">
              To become a globally recognized brand that sets the standard for premium African fashion, celebrating 
              our heritage on the world stage while remaining rooted in our values of quality, authenticity, and 
              ethical production.
            </p>
          </div>
        </motion.section>

        {/* Values */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="py-16">
          <h2 className="text-4xl font-serif mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Excellence",
                description: "We never compromise on quality. Every stitch, every seam, every detail is executed with precision and care.",
              },
              {
                icon: Heart,
                title: "Authenticity",
                description: "We celebrate African culture and heritage. Our designs draw inspiration from our roots and traditions.",
              },
              {
                icon: Zap,
                title: "Innovation",
                description: "We blend traditional craftsmanship with contemporary design, creating pieces that are both timeless and modern.",
              },
            ].map((value, i) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                  className="space-y-4 text-center"
                >
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-accent" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif">{value.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* CAC Certificate Section */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="py-16 border-y border-border">
          <h2 className="text-4xl font-serif mb-12">Officially Registered & Certified</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-serif mb-2">CAC Registration</h3>
                <p className="text-accent font-semibold text-lg mb-4">Registration No. 3573316</p>
                <p className="text-foreground/70 leading-relaxed">
                  ABS Clothing is officially registered with the Corporate Affairs Commission (CAC) of Nigeria. 
                  Our registration certifies our legitimacy as a business entity specializing in the design and 
                  sewing of all different types of clothes.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-serif mb-2">Business Address</h3>
                <p className="text-foreground/70">2 Mogaji Compound, Tanke Iledu, Kwara State, Nigeria</p>
              </div>
              <div>
                <h3 className="text-xl font-serif mb-2">Business Nature</h3>
                <p className="text-foreground/70">Designing and sewing of all different types of clothes</p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-2xl"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-09ACiGkhg8yO2Tmhwo25QdAafGyeNH.png"
                alt="CAC Certificate"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Craftsmanship */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }} className="py-16">
          <h2 className="text-4xl font-serif mb-12">Our Craftsmanship</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-serif mb-4">Design & Concept</h3>
                <p className="text-foreground/70 leading-relaxed">
                  Every piece begins with inspiration drawn from African heritage and contemporary aesthetics. 
                  Our design team carefully conceptualizes each collection to ensure it resonates with our values 
                  and speaks to our audience.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-serif mb-4">Material Selection</h3>
                <p className="text-foreground/70 leading-relaxed">
                  We source only the finest materials—premium fabrics, ethical suppliers, and sustainable options 
                  whenever possible. Every textile is selected for its quality, durability, and aesthetic appeal.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-serif mb-4">Ethical Production</h3>
                <p className="text-foreground/70 leading-relaxed">
                  Our artisans work in fair conditions with fair compensation. We believe that exceptional fashion 
                  starts with respect for the people who create it. Every garment is handcrafted with care and attention 
                  to detail.
                </p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop"
                alt="Craftsmanship"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center py-16 space-y-6"
        >
          <h2 className="text-4xl font-serif">Experience ABS Clothing</h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Browse our collections and discover pieces that celebrate your heritage while defining your style.
          </p>
          <motion.a
            href="/shop"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-primary text-primary-foreground px-12 py-4 text-lg font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
          >
            Shop Now
          </motion.a>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
