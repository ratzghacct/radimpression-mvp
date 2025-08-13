"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowLeft, Sparkles, CreditCard } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [planDetails, setPlanDetails] = useState({
    plan: "",
    amount: "",
    name: "",
  })

  useEffect(() => {
    const plan = searchParams.get("plan") || ""
    const amount = searchParams.get("amount") || ""
    const name = searchParams.get("name") || ""

    setPlanDetails({ plan, amount, name })
  }, [searchParams])

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "starter":
        return "bg-green-100 text-green-800"
      case "professional":
        return "bg-blue-100 text-blue-800"
      case "enterprise":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPlanFeatures = (plan: string) => {
    switch (plan) {
      case "starter":
        return ["50,000 tokens/month", "Basic support", "Standard processing"]
      case "professional":
        return ["200,000 tokens/month", "Priority support", "Fast processing", "Advanced features"]
      case "enterprise":
        return [
          "1,000,000 tokens/month",
          "24/7 dedicated support",
          "Fastest processing",
          "All features",
          "Custom integrations",
        ]
      default:
        return ["Plan features"]
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-xl text-gray-600">Welcome to your new plan</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <CreditCard className="w-6 h-6 text-green-600" />
              <CardTitle className="text-2xl text-gray-900">Subscription Activated</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Your {planDetails.name} plan is now active and ready to use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Badge className={`text-lg px-4 py-2 ${getPlanBadgeColor(planDetails.plan)}`}>{planDetails.name}</Badge>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">${planDetails.amount}</span>
                <span className="text-gray-600 ml-2">per month</span>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Your Plan Includes:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getPlanFeatures(planDetails.plan).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Your account has been automatically upgraded</li>
                  <li>• Start generating impressions with your new token allowance</li>
                  <li>• Access premium features immediately</li>
                  <li>• Check your usage in the dashboard</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={() => router.push("/impression")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Generating Impressions
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="flex-1 text-gray-600 border-gray-300 hover:bg-gray-50 py-3"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-gray-600 mb-2">
            Logged in as: <span className="font-medium">{user?.email || "Demo User"}</span>
          </p>
          <p className="text-sm text-gray-500">
            Need help? Contact our support team for assistance with your new plan.
          </p>
        </div>
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
            <p className="mt-4 text-gray-600">Loading payment confirmation...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}
