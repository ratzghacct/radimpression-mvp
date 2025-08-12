"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowLeft, CreditCard, Calendar, User, DollarSign } from "lucide-react"

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState({
    plan: "",
    amount: "",
    name: "",
  })

  useEffect(() => {
    const plan = searchParams.get("plan") || "Unknown Plan"
    const amount = searchParams.get("amount") || "0"
    const name = searchParams.get("name") || "Plan"

    setPaymentDetails({ plan, amount, name })
  }, [searchParams])

  const formatAmount = (amount: string) => {
    const num = Number.parseFloat(amount.replace("$", ""))
    return isNaN(num) ? "$0" : `$${num.toFixed(2)}`
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "basic":
        return "bg-blue-100 text-blue-800"
      case "pro":
        return "bg-purple-100 text-purple-800"
      case "rad-plus":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Payment Successful!</CardTitle>
            <CardDescription className="text-gray-600">
              Thank you for upgrading your RadImpression account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Plan
                </span>
                <Badge className={`${getPlanBadgeColor(paymentDetails.plan)} font-medium`}>{paymentDetails.name}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Amount
                </span>
                <span className="font-semibold text-gray-900">{formatAmount(paymentDetails.amount)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date
                </span>
                <span className="text-sm text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Status
                </span>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your account has been upgraded immediately</li>
                <li>• Increased token limits are now active</li>
                <li>• Access to premium features enabled</li>
                <li>• Receipt sent to your email address</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-3">
              <Button
                onClick={() => router.push("/impression")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start Generating Impressions
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payment details...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}
