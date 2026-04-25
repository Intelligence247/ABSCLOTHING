import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppProviders } from '@/app/providers'
import { ScrollToTop } from '@/components/scroll-to-top'
import { getPublicCollections } from '@/lib/collections-public'
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
  icons: {
    icon: '/logo2.webp',
  },
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialCollections = await getPublicCollections()

  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased">
        <AppProviders initialCollections={initialCollections}>
          <ScrollToTop />
          {children}
          <Analytics />
        </AppProviders>
      </body>
    </html>
  )
}
