"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

function PaymentSuccessInner() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const success = searchParams.get("success")

  const isSuccess = success === "true"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {isSuccess ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
              <CardDescription>Thank you for your purchase. Your account has been upgraded.</CardDescription>
            </>
          ) : (
            <>
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-2xl text-red-700">Payment Failed</CardTitle>
              <CardDescription>There was an issue processing your payment. Please try again.</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {sessionId && (
            <div className="text-sm text-gray-600">
              <p>Session ID: {sessionId}</p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/impression">{isSuccess ? "Start Creating Impressions" : "Try Again"}</Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/">Back to Home</Link>
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading payment status...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessInner />
    </Suspense>
  )
}
