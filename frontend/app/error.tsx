"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
    toast.error(error.message || "Something went wrong", { duration: 6000 })
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 bg-[#F9F8F6]">
      <p className="text-xs font-semibold tracking-widest text-[#0A3D2E] uppercase mb-3">
        Unexpected error
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] text-center text-balance">
        We couldn&apos;t complete that action
      </h1>
      <p className="mt-4 text-[#666666] text-center max-w-md text-sm leading-relaxed">
        {error.message || "Please try again. If the problem continues, refresh the page or come back later."}
      </p>
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={() => reset()}
          className="px-8 py-3 bg-[#0A3D2E] text-white text-sm font-semibold rounded-lg hover:bg-[#082F23] transition-colors"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") window.location.href = "/"
          }}
          className="px-8 py-3 border border-[#1A1A1A]/20 text-[#1A1A1A] text-sm font-semibold rounded-lg hover:bg-white transition-colors"
        >
          Back to home
        </button>
      </div>
    </div>
  )
}
