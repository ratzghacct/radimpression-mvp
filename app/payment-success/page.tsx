"use client"
import { Suspense } from "react"
import PaymentSuccessContent from "./payment-success-content"

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
