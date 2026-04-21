import dynamic from "next/dynamic"
import { Hero } from "@/components/landing/hero"
import { Navbar } from "@/components/landing/navbar"
import { collectionNameToSlug, getPublicCollections } from "@/lib/collections-public"

const Statement = dynamic(
  () => import("@/components/landing/statement").then((m) => ({ default: m.Statement })),
  { loading: () => <div className="min-h-[30vh] bg-[#F9F8F6]" aria-hidden /> }
)
const Process = dynamic(
  () => import("@/components/landing/process").then((m) => ({ default: m.Process })),
  { loading: () => <div className="min-h-[24vh] bg-[#F9F8F6]" aria-hidden /> }
)
const Category = dynamic(
  () => import("@/components/landing/category").then((m) => ({ default: m.Category })),
  { loading: () => <div className="min-h-[28vh] bg-[#F9F8F6]" aria-hidden /> }
)
const Featured = dynamic(
  () => import("@/components/landing/featured").then((m) => ({ default: m.Featured })),
  { loading: () => <div className="min-h-[32vh] bg-[#F9F8F6]" aria-hidden /> }
)
const Testimonials = dynamic(
  () => import("@/components/landing/testimonials").then((m) => ({ default: m.Testimonials })),
  { loading: () => <div className="min-h-[20vh] bg-[#F9F8F6]" aria-hidden /> }
)
const Footer = dynamic(
  () => import("@/components/landing/footer").then((m) => ({ default: m.Footer })),
  { loading: () => <div className="min-h-[40vh] bg-[#05120F]" aria-hidden /> }
)

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
