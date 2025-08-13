"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

function PaymentSuccessInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>

          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your account has been upgraded and you can now start generating impressions.
          </p>

          {sessionId && <p className="text-sm text-gray-500 mb-6">Session ID: {sessionId}</p>}

          <div className="space-y-3">
            <Button onClick={() => router.push("/impression")} className="w-full bg-blue-600 hover:bg-blue-700">
              Start Generating Impressions
            </Button>

            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessInner />
    </Suspense>
  )
}
