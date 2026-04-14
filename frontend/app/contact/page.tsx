"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { submitContactMessage } from "@/lib/contact-api"
import { toast } from "sonner"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSubmitError("")
    try {
      await submitContactMessage(formData)
      toast.success("Message sent successfully. We will reply by email soon.")
      setSubmitted(true)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (e) {
      setSubmitted(false)
      setSubmitError(e instanceof Error ? e.message : "Could not send message right now. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[38vh] min-h-[280px] bg-[#05120F] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="contact-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#contact-grid)" />
          </svg>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex items-center justify-center text-[16vw] font-serif tracking-wider stroke-text select-none"
        >
          CONTACT
        </motion.span>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-serif font-bold text-[#F9F8F6] mb-4"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#F9F8F6]/75 text-lg md:text-xl max-w-2xl"
          >
            We'd love to hear from you. Reach out with any questions or inquiries.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Contact Info Cards */}
          {[
            {
              icon: Phone,
              title: "Phone",
              content: "08087891756",
              link: "tel:+2348087891756",
              description: "Available Monday to Friday, 9 AM - 6 PM",
            },
            {
              icon: Mail,
              title: "Email",
              content: "info@absclothing.com",
              link: "mailto:info@absclothing.com",
              description: "We'll respond within 24 hours",
            },
            {
              icon: MapPin,
              title: "Location",
              content: "Tanke ilorin Kwara state",
              description: "Kwara State, Nigeria",
            },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: 0.1 * i }}
                className="space-y-4"
              >
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                  <Icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-serif">{item.title}</h3>
                {item.link ? (
                  <a
                    href={item.link}
                    className="text-lg font-semibold text-accent hover:text-accent/80 transition-colors"
                  >
                    {item.content}
                  </a>
                ) : (
                  <p className="text-lg font-semibold">{item.content}</p>
                )}
                <p className="text-foreground/70">{item.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Contact Form & Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="lg:col-span-2">
            <h2 className="text-3xl font-serif mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold tracking-widest uppercase mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-muted border border-border focus:border-accent focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold tracking-widest uppercase mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-muted border border-border focus:border-accent focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold tracking-widest uppercase mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-muted border border-border focus:border-accent focus:outline-none transition-colors"
                    placeholder="+234 808 789 1756"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold tracking-widest uppercase mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-muted border border-border focus:border-accent focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select a subject</option>
                    <option value="Order Inquiry">Order Inquiry</option>
                    <option value="Product Information">Product Information</option>
                    <option value="Custom Orders">Custom Orders</option>
                    <option value="Bulk Purchase">Bulk Purchase</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold tracking-widest uppercase mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-muted border border-border focus:border-accent focus:outline-none transition-colors resize-none"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-4 text-lg font-semibold tracking-widest uppercase hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </motion.button>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded"
                >
                  Thank you! Your message has been sent successfully.
                </motion.div>
              )}
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded"
                >
                  {submitError}
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Business Hours */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-serif mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-accent" />
                Business Hours
              </h3>
              <div className="space-y-4 text-foreground/80">
                <div>
                  <p className="font-semibold">Monday - Friday</p>
                  <p>9:00 AM - 6:00 PM WAT</p>
                </div>
                <div>
                  <p className="font-semibold">Saturday</p>
                  <p>10:00 AM - 4:00 PM WAT</p>
                </div>
                <div>
                  <p className="font-semibold">Sunday</p>
                  <p>Closed</p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-6 space-y-4">
              <h4 className="text-lg font-serif">Quick Response</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>✓ We respond to emails within 24 hours</li>
                <li>✓ Phone support available during business hours</li>
                <li>✓ Same-day responses for urgent inquiries</li>
                <li>✓ Custom orders consultations available</li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-serif mb-4">Follow Us</h4>
              <div className="space-y-2 text-sm">
                <a href="https://instagram.com/abs_fashiondesign" target="_blank" rel="noopener noreferrer" className="block text-foreground/80 hover:text-accent">
                  IG: @abs_fashiondesign
                </a>
                <a href="https://www.youtube.com/@absclothing" target="_blank" rel="noopener noreferrer" className="block text-foreground/80 hover:text-accent">
                  YouTube: @absclothing
                </a>
                <a href="https://www.tiktok.com/@absclothing1" target="_blank" rel="noopener noreferrer" className="block text-foreground/80 hover:text-accent">
                  TikTok: @absclothing1
                </a>
                <a href="https://wa.me/2348087891756" target="_blank" rel="noopener noreferrer" className="block text-foreground/80 hover:text-accent">
                  WhatsApp: 08087891756
                </a>
                <a href="https://www.pinterest.com/absclothing1" target="_blank" rel="noopener noreferrer" className="block text-foreground/80 hover:text-accent">
                  Pinterest: Absclothing1
                </a>
                <a href="https://x.com/sodiqabidemi23" target="_blank" rel="noopener noreferrer" className="block text-foreground/80 hover:text-accent">
                  X: @sodiqabidemi23
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
