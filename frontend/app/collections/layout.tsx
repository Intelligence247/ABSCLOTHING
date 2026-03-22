import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
