import { Hero } from "@/components/landing/hero"
import { Statement } from "@/components/landing/statement"
import { Process } from "@/components/landing/process"
import { Category } from "@/components/landing/category"
import { Featured } from "@/components/landing/featured"
import { Testimonials } from "@/components/landing/testimonials"
import { Footer } from "@/components/landing/footer"
import { Navbar } from "@/components/landing/navbar"
import { collectionNameToSlug, getPublicCollections } from "@/lib/collections-public"

export default async function Home() {
  const collections = await getPublicCollections()
  const heroCollections = collections.map((c) => ({
    name: c.name,
    slug: collectionNameToSlug(c.name),
    description: c.description,
    heroImage: c.heroImage,
  }))

  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero collections={heroCollections} />
      <Statement />
      <Process />
      <Category />
      <Featured />
      <Testimonials />
      <Footer />
    </main>
  )
}
