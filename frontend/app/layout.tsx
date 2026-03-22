import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ABS Clothing | Bespoke Nigerian Fashion',
  description: 'Exquisite tailoring and bespoke design for the modern Nigerian. Hand-crafted in Ilorin. CAC Registered: BN 3573316',
  keywords: ['Nigerian fashion', 'bespoke tailoring', 'Agbada', 'African fashion', 'custom suits', 'Ilorin tailor'],
  authors: [{ name: 'ABS Clothing' }],
  openGraph: {
    title: 'ABS Clothing | Bespoke Nigerian Fashion',
    description: 'Exquisite tailoring and bespoke design for the modern Nigerian. Hand-crafted in Ilorin.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A3D2E',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <Analytics />
        </CartProvider>
      </body>
    </html>
  )
}
