"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowLeft, CreditCard, Calendar, DollarSign } from "lucide-react"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Success Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur mb-8">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Thank you for upgrading to RadImpression Pro
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Payment Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Plan</label>
                  <div className="mt-1">
                    <Badge className={getPlanColor(paymentDetails.plan)}>
                      {paymentDetails.name || paymentDetails.plan}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <div className="mt-1 flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-lg font-semibold text-gray-900">{paymentDetails.amount}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Billing</label>
                  <div className="mt-1 flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-1" />
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
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
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
                <p>✅ Your account has been upgraded automatically</p>
                <p>✅ New token limits are now active</p>
                <p>✅ You can start generating impressions immediately</p>
                <p>📧 A confirmation email has been sent to your inbox</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={() => router.push("/impression")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                Start Generating Impressions
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
              >
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support Card */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">Our support team is here to help you get the most out of RadImpression</p>
            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payment details...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}
