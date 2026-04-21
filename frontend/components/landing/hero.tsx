import { ArrowRight, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export type HeroCollectionPreview = {
  name: string
  slug: string
  description: string
  heroImage: string
}

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1200&h=1500&fit=crop&q=80"

function collectionLinks(collections: HeroCollectionPreview[]) {
  if (collections.length === 0) {
    return [
      { label: "Shop all", href: "/shop" },
      { label: "Collections", href: "/collections" },
      { label: "About", href: "/about" },
    ]
  }
  return collections.slice(0, 5).map((c) => ({
    label: c.name,
    href: `/collections/${c.slug}`,
  }))
}

export function Hero({ collections = [] }: { collections?: HeroCollectionPreview[] }) {
  const links = collectionLinks(collections)
  const featuredImage =
    collections[0]?.heroImage?.trim() && collections[0].heroImage.length > 0
      ? collections[0].heroImage
      : DEFAULT_HERO_IMAGE

  return (
    <section className="relative min-h-[calc(100dvh-5rem)] bg-[#F9F8F6] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_75%_15%,rgba(197,160,89,0.08),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_10%_90%,rgba(10,61,46,0.06),transparent_45%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(249,248,246,0)_0%,rgba(232,230,227,0.55)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-5rem)] max-w-7xl flex-col justify-center px-6 pb-16 pt-28 md:px-8 md:pt-32 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C5A059]">
              Premium Nigerian tailoring
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-[#05120F] md:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              Bespoke pieces, crafted with precision
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#1A1A1A]/75 md:text-lg">
              Discover agbada, suits, and contemporary menswear and womenswear — made in Ilorin with the quality your
              occasion deserves.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-[#C5A059] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-[#05120F] transition-colors hover:bg-[#d4b068]"
              >
                Shop collection
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center gap-2 border border-[#05120F]/18 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-[#05120F] transition-colors hover:border-[#0A3D2E]/35 hover:text-[#0A3D2E]"
              >
                View collections
              </Link>
            </div>

            <p className="mt-8 text-xs text-[#1A1A1A]/50">
              Handcrafted in Kwara · Secure checkout · Nationwide delivery
            </p>
          </div>

          <div className="relative lg:col-span-7">
            <div className="relative mx-auto aspect-4/5 max-w-md overflow-hidden rounded-sm border border-[#C5A059]/30 bg-white shadow-xl shadow-[#05120F]/08 ring-1 ring-[#05120F]/05 lg:max-w-none">
              <Image
                src={featuredImage}
                alt="ABS Clothing — bespoke tailoring"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#05120F]/90 via-[#05120F]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="font-serif text-xl text-[#F9F8F6] md:text-2xl">Made to measure. Made to last.</p>
                <Link
                  href="/about"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#C5A059] hover:text-[#d4b068]"
                >
                  Our story
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-[#05120F]/10 pt-10">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1A1A1A]/45">Explore</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="text-sm font-medium text-[#1A1A1A]/80 transition-colors hover:text-[#C5A059]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
