"use client"

import Link from "next/link"

type LogoTheme = "light" | "dark" | "gold"

type BrandLogoProps = {
  href?: string
  theme?: LogoTheme
  compact?: boolean
  showBadge?: boolean
  className?: string
}

const themeClasses: Record<LogoTheme, string> = {
  light: "text-[#F9F8F6]",
  dark: "text-[#1A1A1A]",
  gold: "text-[#C5A059]",
}

export function BrandLogo({
  href = "/",
  theme = "dark",
  compact = false,
  showBadge = false,
  className = "",
}: BrandLogoProps) {
  const content = (
    <span
      className={`inline-flex items-center ${showBadge ? "px-3 py-2 rounded-md bg-[#05120F] border border-[#C5A059]/25" : ""} ${className}`}
    >
      <span
        className={`font-serif font-bold tracking-[0.16em] ${compact ? "text-lg" : "text-xl md:text-2xl"} ${themeClasses[theme]}`}
      >
        ABS
      </span>
      {!compact ? (
        <span className="ml-2 text-[10px] md:text-xs tracking-[0.35em] text-[#C5A059]">
          CLOTHING
        </span>
      ) : null}
    </span>
  )

  if (!href) return content

  return (
    <Link href={href} className="inline-flex items-center">
      {content}
    </Link>
  )
}
