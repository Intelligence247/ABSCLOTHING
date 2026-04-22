"use client"

import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export type HeroCollectionPreview = {
  name: string
  slug: string
  description: string
  heroImage: string
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=700&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=700&fit=crop&q=80",
]

const MARQUEE_ITEMS = [
  "Premium Nigerian Tailoring",
  "Bespoke Agbada",
  "Contemporary Menswear",
  "Luxury Womenswear",
  "Handcrafted in Kwara",
  "Made to Measure",
  "Secure Checkout",
  "Nationwide Delivery",
]

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

function getGridImages(collections: HeroCollectionPreview[]): [string, string, string] {
  const imgs = collections.filter((c) => c.heroImage?.trim()).map((c) => c.heroImage)
  return [
    imgs[0] ?? FALLBACK_IMAGES[0],
    imgs[1] ?? FALLBACK_IMAGES[1],
    imgs[2] ?? FALLBACK_IMAGES[2],
  ]
}

function CornerBrackets() {
  return (
    <>
      {(["tl", "tr", "bl", "br"] as const).map((c) => (
        <div
          key={c}
          className="absolute z-30 pointer-events-none"
          style={{
            width: 24, height: 24,
            top:    c.startsWith("t") ? 0 : "auto",
            bottom: c.startsWith("b") ? 0 : "auto",
            left:   c.endsWith("l")   ? 0 : "auto",
            right:  c.endsWith("r")   ? 0 : "auto",
          }}
          aria-hidden
        >
          <div style={{
            position: "absolute", width: "1.5px", height: 24, background: "#C5A059",
            [c.endsWith("l") ? "left" : "right"]: 0,
            [c.startsWith("t") ? "top" : "bottom"]: 0,
          }} />
          <div style={{
            position: "absolute", height: "1.5px", width: 24, background: "#C5A059",
            [c.startsWith("t") ? "top" : "bottom"]: 0,
            [c.endsWith("l") ? "left" : "right"]: 0,
          }} />
        </div>
      ))}
    </>
  )
}

export function Hero({ collections = [] }: { collections?: HeroCollectionPreview[] }) {
  const links = collectionLinks(collections)
  const [gridImages, setGridImages] = useState<[string, string, string]>(() =>
    getGridImages(collections)
  )

  useEffect(() => {
    setGridImages(getGridImages(collections))
  }, [collections])

  const handleImageError = (index: 0 | 1 | 2) => {
    setGridImages((prev) => {
      if (prev[index] === FALLBACK_IMAGES[index]) return prev
      const next = [...prev] as [string, string, string]
      next[index] = FALLBACK_IMAGES[index]
      return next
    })
  }

  return (
    <>
      <style>{`
        /* Entry */
        @keyframes abs-fade-up {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes abs-fade-in {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes abs-slide-left {
          from { opacity: 0; transform: translateX(38px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
        @keyframes abs-slide-up {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes abs-badge-in {
          from { opacity: 0; transform: translateX(22px) scale(0.92); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
        @keyframes abs-line-grow {
          from { transform: scaleX(0); } to { transform: scaleX(1); }
        }
        /* Looping */
        @keyframes abs-ken-burns-a {
          0%   { transform: scale(1.00) translate(0%, 0%);        }
          100% { transform: scale(1.09) translate(-1.8%, -1.8%);  }
        }
        @keyframes abs-ken-burns-b {
          0%   { transform: scale(1.00) translate(0%, 0%);    }
          100% { transform: scale(1.08) translate(1.8%, -1%); }
        }
        @keyframes abs-ken-burns-c {
          0%   { transform: scale(1.00) translate(0%, 0%);   }
          100% { transform: scale(1.09) translate(-1%, 1.8%);}
        }
        @keyframes abs-float {
          0%, 100% { transform: translateY(0px);  }
          50%      { transform: translateY(-8px);  }
        }
        @keyframes abs-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(2.4); opacity: 0;   }
        }
        @keyframes abs-shimmer-sweep {
          0%   { transform: translateX(-120%) skewX(-18deg); }
          100% { transform: translateX(320%)  skewX(-18deg); }
        }
        @keyframes abs-marquee {
          0%   { transform: translateX(0);    }
          100% { transform: translateX(-50%); }
        }
        /* Entry bindings */
        .anim-1      { animation: abs-fade-up   0.80s cubic-bezier(0.22,1,0.36,1) 0.10s both; }
        .anim-2      { animation: abs-fade-up   0.80s cubic-bezier(0.22,1,0.36,1) 0.22s both; }
        .anim-3      { animation: abs-fade-up   0.80s cubic-bezier(0.22,1,0.36,1) 0.34s both; }
        .anim-4      { animation: abs-fade-up   0.80s cubic-bezier(0.22,1,0.36,1) 0.46s both; }
        .anim-5      { animation: abs-fade-up   0.80s cubic-bezier(0.22,1,0.36,1) 0.58s both; }
        .anim-6      { animation: abs-fade-up   0.80s cubic-bezier(0.22,1,0.36,1) 0.70s both; }
        .anim-topbar { animation: abs-fade-in   1.0s  ease                        0.05s both; }
        .anim-bottom { animation: abs-fade-in   0.9s  ease                        1.10s both; }
        .anim-line   { animation: abs-line-grow 0.9s  cubic-bezier(0.22,1,0.36,1) 0.05s both; transform-origin: left; }
        .anim-img1   { animation: abs-slide-left 1.05s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .anim-img2   { animation: abs-slide-up   1.05s cubic-bezier(0.22,1,0.36,1) 0.32s both; }
        .anim-img3   { animation: abs-slide-up   1.05s cubic-bezier(0.22,1,0.36,1) 0.50s both; }
        .anim-badge  { animation: abs-badge-in   0.85s cubic-bezier(0.22,1,0.36,1) 0.90s both; }
        /* Ken Burns */
        .kb-a { animation: abs-ken-burns-a 20s ease-in-out        infinite alternate; }
        .kb-b { animation: abs-ken-burns-b 24s ease-in-out        infinite alternate; }
        .kb-c { animation: abs-ken-burns-c 22s ease-in-out 2s     infinite alternate; }
        /* Misc looping */
        .anim-float  { animation: abs-float 4.2s ease-in-out infinite; }
        .pulse-ring::before {
          content: '';
          position: absolute; inset: -4px; border-radius: 50%;
          background: rgba(197,160,89,0.45);
          animation: abs-pulse-ring 1.9s ease-out infinite;
        }
        .shimmer-once::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 32%, rgba(197,160,89,0.13) 50%, transparent 68%);
          animation: abs-shimmer-sweep 1.9s cubic-bezier(0.4,0,0.6,1) 0.35s both;
          z-index: 25; pointer-events: none;
        }
        .marquee-track { animation: abs-marquee 34s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        .img-cell { transition: filter 0.45s ease; }
        .img-cell:hover { filter: brightness(1.07); }
      `}</style>

      <section className="relative min-h-[100dvh] bg-[#05120F] overflow-hidden">

        {/* Atmospheric glows */}
        <div className="pointer-events-none absolute -top-52 -left-52 w-[860px] h-[860px] rounded-full z-0"
          style={{ background: "radial-gradient(circle, rgba(10,61,46,0.58) 0%, transparent 68%)" }} aria-hidden />
        <div className="pointer-events-none absolute -bottom-36 -right-36 w-[700px] h-[700px] rounded-full z-0"
          style={{ background: "radial-gradient(circle, rgba(197,160,89,0.12) 0%, transparent 65%)" }} aria-hidden />
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-full h-[60%] z-0"
          style={{ background: "radial-gradient(ellipse 70% 50% at 65% 50%, rgba(10,61,46,0.11) 0%, transparent 70%)" }} aria-hidden />

        {/* Film grain */}
        <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.028]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }} aria-hidden />

        {/* Content — pt-20 clears the 5rem fixed navbar */}
        <div className="relative z-20 mx-auto max-w-[1440px] min-h-[100dvh] px-6 md:px-10 xl:px-16 flex flex-col pt-20">

          {/* Top metadata bar */}
          <div className="anim-topbar flex items-center justify-between py-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="anim-line h-[1px] w-10 bg-[#C5A059]/55 origin-left" />
              <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#C5A059]/60">
                Est. · Ilorin, Nigeria
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#F9F8F6]/18">
              <span>Premium Tailoring</span>
              <span className="h-3 w-[1px] bg-[#F9F8F6]/12" />
              <span>SS 2025</span>
            </div>
          </div>

          {/* Two-column hero */}
          <div className="flex-1 grid lg:grid-cols-12 gap-10 xl:gap-14 items-center pb-6 lg:pb-0">

            {/* LEFT — copy */}
            <div className="lg:col-span-5 flex flex-col justify-center">

              <div className="anim-1 mb-7 flex items-center gap-3">
                <div className="flex gap-[5px] items-center">
                  <div className="relative h-[6px] w-[6px] rounded-full bg-[#C5A059]">
                    <div className="pulse-ring absolute inset-0 rounded-full" />
                  </div>
                  <div className="h-[3px] w-[3px] rounded-full bg-[#C5A059]/38" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.38em] text-[#C5A059]">
                  Bespoke Nigerian Tailoring
                </span>
              </div>

              <h1 className="font-serif">
                <span className="anim-2 block text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.8rem] font-light italic leading-[1.0] text-[#F9F8F6]">
                  Crafted
                </span>
                <span className="anim-3 block text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.8rem] font-semibold leading-[1.0] tracking-tight text-[#F9F8F6]">
                  With
                </span>
                <span
                  className="anim-4 block text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.8rem] font-semibold leading-[1.0] tracking-tight select-none"
                  style={{
                    WebkitTextStroke: "1.5px rgba(197,160,89,0.58)",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}
                >
                  Precision.
                </span>
              </h1>

              <div className="anim-4 mt-8 flex gap-4 items-start">
                <div className="mt-[3px] h-14 w-[2px] shrink-0 bg-gradient-to-b from-[#C5A059]/80 to-[#C5A059]/0" />
                <p className="text-sm leading-[1.85] text-[#F9F8F6]/48 max-w-[360px]">
                  Discover agbada, suits, and contemporary menswear &amp; womenswear — made in Ilorin with the
                  craftsmanship your occasion truly deserves.
                </p>
              </div>

              <div className="anim-5 mt-9 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/shop"
                  className="group inline-flex items-center justify-center gap-2.5 bg-[#C5A059] px-7 py-[14px] text-[10px] font-bold uppercase tracking-[0.22em] text-[#05120F] transition-all duration-200 hover:bg-[#d4b068]"
                >
                  Shop Collection
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
                </Link>
                <Link
                  href="/collections"
                  className="group inline-flex items-center justify-center gap-2 border border-[#F9F8F6]/10 px-7 py-[14px] text-[10px] font-bold uppercase tracking-[0.22em] text-[#F9F8F6]/50 transition-all duration-200 hover:border-[#C5A059]/35 hover:text-[#C5A059]"
                >
                  View Collections
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" aria-hidden />
                </Link>
              </div>

              <div className="anim-6 mt-10 grid grid-cols-3 border border-[#F9F8F6]/06">
                {[
                  { num: "500+", label: "Garments" },
                  { num: "100%", label: "Handcrafted" },
                  { num: "5 ★",  label: "Rated" },
                ].map((s, i) => (
                  <div key={s.label} className={`flex flex-col items-center py-4 gap-0.5 ${i < 2 ? "border-r border-[#F9F8F6]/06" : ""}`}>
                    <span className="font-serif text-[1.5rem] font-semibold text-[#C5A059] leading-none">{s.num}</span>
                    <span className="text-[8px] font-bold uppercase tracking-[0.24em] text-[#F9F8F6]/24 mt-1">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — 3-image mosaic */}
            <div className="lg:col-span-7 relative flex items-center justify-center lg:justify-end">
              <div
                className="relative w-full max-w-[540px] lg:max-w-none grid gap-2.5"
                style={{
                  gridTemplateColumns: "1.25fr 1fr",
                  gridTemplateRows: "1fr 1fr",
                  height: "clamp(420px, 62vh, 660px)",
                }}
              >
                {/* Image 1 — tall left, row-span-2 */}
                <div className="anim-img1 shimmer-once row-span-2 relative rounded-[2px] overflow-hidden shadow-2xl shadow-[#000]/45 img-cell">
                  <CornerBrackets />
                  <div className="absolute inset-0 overflow-hidden">
                    <Image src={gridImages[0]} alt="ABS Clothing — main collection" fill priority
                      onError={() => handleImageError(0)}
                      sizes="(max-width: 1024px) 55vw, 28vw" className="kb-a object-cover" />
                  </div>
                  <div className="absolute inset-0 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(5,18,15,0.92) 0%, rgba(5,18,15,0.18) 42%, transparent 68%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-5 md:p-6">
                    <div className="border-l-[2px] border-[#C5A059] pl-3.5 mb-3">
                      <p className="font-serif text-[1.05rem] font-light text-[#F9F8F6] leading-snug">Made to measure.</p>
                      <p className="font-serif text-[1.05rem] italic text-[#C5A059] leading-snug">Made to last.</p>
                    </div>
                    <Link href="/about"
                      className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.24em] text-[#F9F8F6]/32 hover:text-[#C5A059] transition-colors duration-200">
                      Our story <ChevronRight className="h-3 w-3" aria-hidden />
                    </Link>
                  </div>
                </div>

                {/* Image 2 — top right */}
                <div className="anim-img2 relative rounded-[2px] overflow-hidden shadow-xl shadow-[#000]/30 img-cell">
                  <div className="absolute inset-0 overflow-hidden">
                    <Image src={gridImages[1]} alt="ABS Clothing — menswear" fill
                      onError={() => handleImageError(1)}
                      sizes="(max-width: 1024px) 40vw, 20vw" className="kb-b object-cover object-top" />
                  </div>
                  <div className="absolute inset-0 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(160deg, transparent 45%, rgba(5,18,15,0.62) 100%)" }} />
                  <div className="absolute top-2.5 right-2.5 z-20 bg-[#05120F]/65 backdrop-blur-[6px] border border-[#C5A059]/20 px-2.5 py-[5px]">
                    <span className="text-[7.5px] font-bold uppercase tracking-[0.24em] text-[#C5A059]/75">Menswear</span>
                  </div>
                </div>

                {/* Image 3 — bottom right */}
                <div className="anim-img3 relative rounded-[2px] overflow-hidden shadow-xl shadow-[#000]/30 img-cell">
                  <div className="absolute inset-0 overflow-hidden">
                    <Image src={gridImages[2]} alt="ABS Clothing — womenswear" fill
                      onError={() => handleImageError(2)}
                      sizes="(max-width: 1024px) 40vw, 20vw" className="kb-c object-cover" />
                  </div>
                  <div className="absolute inset-0 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(160deg, transparent 45%, rgba(5,18,15,0.62) 100%)" }} />
                  <div className="absolute top-2.5 right-2.5 z-20 bg-[#05120F]/65 backdrop-blur-[6px] border border-[#C5A059]/20 px-2.5 py-[5px]">
                    <span className="text-[7.5px] font-bold uppercase tracking-[0.24em] text-[#C5A059]/75">Womenswear</span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1.5 bg-[#05120F]/70 backdrop-blur-[6px] border border-[#C5A059]/15 px-2.5 py-[5px]">
                    <div className="relative h-[6px] w-[6px] rounded-full bg-[#C5A059] shrink-0">
                      <div className="pulse-ring absolute inset-0 rounded-full" />
                    </div>
                    <span className="text-[7.5px] font-bold uppercase tracking-[0.2em] text-[#F9F8F6]/48">Nationwide</span>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="anim-badge anim-float absolute -left-3 lg:-left-8 xl:-left-10 top-[26%] z-30 hidden lg:flex flex-col items-center bg-[#0A3D2E] border border-[#C5A059]/18 px-4 py-4 gap-1 shadow-2xl shadow-[#000]/40">
                <span className="text-[7.5px] font-bold uppercase tracking-[0.28em] text-[#C5A059]/58">Handcrafted</span>
                <span className="font-serif text-[1.7rem] font-semibold text-[#F9F8F6] leading-none">100%</span>
                <span className="text-[7.5px] uppercase tracking-[0.22em] text-[#F9F8F6]/26 mt-0.5">In Kwara</span>
              </div>
            </div>
          </div>

          {/* Bottom — explore + marquee */}
          <div className="anim-bottom shrink-0 border-t border-[#F9F8F6]/06">
            <div className="flex items-center flex-wrap gap-x-5 gap-y-2 py-3 border-b border-[#F9F8F6]/[0.035]">
              <span className="text-[8px] font-bold uppercase tracking-[0.32em] text-[#F9F8F6]/15 shrink-0">Explore</span>
              <div className="h-3 w-[1px] bg-[#F9F8F6]/08 hidden sm:block" />
              {links.map((item) => (
                <Link key={item.href + item.label} href={item.href}
                  className="text-[9.5px] font-medium uppercase tracking-[0.18em] text-[#F9F8F6]/32 transition-colors hover:text-[#C5A059]">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="py-3.5 overflow-hidden" aria-hidden>
              <div className="marquee-track flex items-center whitespace-nowrap w-max">
                {[0, 1].map((rep) => (
                  <span key={rep} className="flex items-center">
                    {MARQUEE_ITEMS.map((txt) => (
                      <span key={txt} className="inline-flex items-center gap-5 px-5">
                        <span className="h-[3px] w-[3px] rounded-full bg-[#C5A059]/38 shrink-0" />
                        <span className="text-[8px] font-semibold uppercase tracking-[0.30em] text-[#F9F8F6]/16">
                          {txt}
                        </span>
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}