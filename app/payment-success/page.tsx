"use client"

import { useEffect } from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

function PaymentSuccessContentComponent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  const [paymentDetails, setPaymentDetails] = useState({
    plan: "",
    amount: "",
    name: "",
  })

  useEffect(() => {
    const plan = searchParams.get("plan") || ""
    const amount = searchParams.get("amount") || ""
    const name = searchParams.get("name") || ""

    setPaymentDetails({ plan, amount, name })
  }, [searchParams])

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "basic":
        return "bg-blue-100 text-blue-700"
      case "pro":
        return "bg-purple-100 text-purple-700"
      case "rad-plus":
        return "bg-gold-100 text-gold-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getPlanFeatures = (plan: string) => {
    switch (plan) {
      case "basic":
        return ["50,000 tokens/month", "Email support", "Standard processing"]
      case "pro":
        return ["200,000 tokens/month", "Priority support", "Fast processing", "Advanced features"]
      case "rad-plus":
        return [
          "1,000,000 tokens/month",
          "24/7 premium support",
          "Fastest processing",
          "All features",
          "Custom integrations",
        ]
      default:
        return []
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Thank you for your purchase. Your account has been upgraded.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessionId && <p className="text-sm text-muted-foreground">Session ID: {sessionId}</p>}
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/impression">Start Generating Impressions</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/history">View History</Link>
            </Button>
          </div>
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Plan</label>
                <div className="mt-1">
                  <span className={getPlanColor(paymentDetails.plan)}>
                    {paymentDetails.name || paymentDetails.plan}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <div className="mt-1 flex items-center">
                  <span className="text-lg font-semibold text-gray-900">{paymentDetails.amount}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Billing</label>
                <div className="mt-1 flex items-center">
                  <span className="text-gray-900">Monthly</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Features */}
          {paymentDetails.plan && (
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Plan Includes:</h3>
              <ul className="space-y-2">
                {getPlanFeatures(paymentDetails.plan).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="h-4 w-4 text-green-600 mr-2 flex-shrink-0">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
            <div className="space-y-3 text-gray-700">
              <p>✓ Your account has been upgraded automatically</p>
              <p>✓ New token limits are now active</p>
              <p>✓ You can start generating impressions immediately</p>
              <p>📧 A confirmation email has been sent to your inbox</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PaymentSuccessContentComponent />
    </Suspense>
  )
}
