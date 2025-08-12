"use client"

import { Suspense } from "react"
import ImpressionPageContent from "./impression-content"

export default function ImpressionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading impression generator...</p>
          </div>
        </div>
      }
    >
      <ImpressionPageContent />
    </Suspense>
  )
}
