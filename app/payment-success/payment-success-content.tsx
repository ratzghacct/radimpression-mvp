"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

function PaymentSuccessInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const success = searchParams.get("success")
  const sessionId = searchParams.get("session_id")

  const isSuccess = success === "true"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {isSuccess ? (
              <CheckCircle className="w-16 h-16 text-green-500" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">{isSuccess ? "Payment Successful!" : "Payment Failed"}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {isSuccess
              ? "Thank you for your purchase. Your account has been upgraded successfully."
              : "There was an issue processing your payment. Please try again."}
          </p>
          {sessionId && <p className="text-sm text-gray-500">Session ID: {sessionId}</p>}
          <div className="space-y-2">
            <Button onClick={() => router.push("/impression")} className="w-full">
              {isSuccess ? "Start Generating Impressions" : "Try Again"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
              Go to Home
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading payment status...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessInner />
    </Suspense>
  )
}
