import { Hero } from "@/components/landing/hero"
import { Statement } from "@/components/landing/statement"
import { Process } from "@/components/landing/process"
import { Category } from "@/components/landing/category"
import { Featured } from "@/components/landing/featured"
import { Testimonials } from "@/components/landing/testimonials"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <Statement />
      <Process />
      <Category />
      <Featured />
      <Testimonials />
      <Footer />
    </main>
  )
}
