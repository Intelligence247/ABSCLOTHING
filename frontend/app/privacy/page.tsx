"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function PrivacyPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.h1 {...fadeInUp} className="text-5xl font-serif mb-12">
          Privacy Policy
        </motion.h1>

        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.1 }}
          className="space-y-8 text-foreground/80"
        >
          <section className="space-y-4">
            <h2 className="text-3xl font-serif text-foreground mb-4">1. Introduction</h2>
            <p>
              ABS Clothing ("we", "us", "our", or "Company") operates the website. This page informs you of our 
              policies regarding the collection, use, and disclosure of personal data when you use our Service and 
              the choices you have associated with that data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-serif text-foreground mb-4">2. Information Collection and Use</h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our 
              service to you:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Personal Data: Name, email address, phone number, address</li>
              <li>Usage Data: Browser type, IP address, pages visited, time and date of visit</li>
              <li>Cookies and tracking technologies for website analytics and user experience improvement</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-serif text-foreground mb-4">3. Use of Data</h2>
            <p>ABS Clothing uses the collected data for various purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our service</li>
              <li>To monitor the usage of our service</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-serif text-foreground mb-4">4. Security of Data</h2>
            <p>
              The security of your data is important to us but remember that no method of transmission over the 
              internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable 
              means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-serif text-foreground mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-muted p-6 space-y-2">
              <p><strong>Email:</strong> info@absclothing.com</p>
              <p><strong>Phone:</strong> 08087891756</p>
              <p><strong>Address:</strong> 2 Mogaji Compound, Tanke Iledu, Kwara State, Nigeria</p>
            </div>
          </section>

          <p className="text-sm text-foreground/60 mt-12">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
