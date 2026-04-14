import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { collectionNameToSlug, getPublicCollections } from "@/lib/collections-public"

export default async function CollectionsIndexPage() {
  const collections = await getPublicCollections()

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="relative h-[38vh] min-h-[280px] bg-[#05120F] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="collections-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#collections-grid)" />
          </svg>
        </div>
        <span className="absolute inset-0 flex items-center justify-center text-[16vw] font-serif tracking-wider stroke-text select-none">
          COLLECTIONS
        </span>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-serif text-4xl md:text-6xl text-[#F9F8F6] mb-4">Collections</h1>
          <p className="text-[#F9F8F6]/75 max-w-2xl mx-auto text-lg">
            Browse every line we carry. New collections you add in admin appear here automatically.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        {collections.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            No collections yet. Add one in the admin dashboard.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((c) => {
              const slug = collectionNameToSlug(c.name)
              const href = `/collections/${slug}`
              return (
                <Link
                  key={c.id}
                  href={href}
                  className="group block rounded-sm border border-[#E8E6E3] overflow-hidden bg-[#F9F8F6] hover:border-[#0A3D2E]/40 transition-colors"
                >
                  <div className="relative aspect-4/3 bg-[#E8E6E3]">
                    {c.heroImage ? (
                      <Image
                        src={c.heroImage}
                        alt={c.name}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-linear-to-t from-[#05120F]/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
                      <h2 className="font-serif text-2xl text-[#F9F8F6] drop-shadow-sm">{c.name}</h2>
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#F9F8F6] text-[#0A3D2E] group-hover:bg-[#C5A059] transition-colors">
                        <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                      </span>
                    </div>
                  </div>
                  {c.description ? (
                    <p className="p-4 text-sm text-[#666666] line-clamp-2">{c.description}</p>
                  ) : null}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
