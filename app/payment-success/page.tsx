"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft, Mail } from 'lucide-react'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [planName, setPlanName] = useState("")
  const [amount, setAmount] = useState("")

  useEffect(() => {
    const plan = searchParams.get('plan')
    const amt = searchParams.get('amount')
    const name = searchParams.get('name')
    
    const planNames: { [key: string]: string } = {
      'starter': 'Starter Plan',
      'pro': 'Pro Plan', 
      'radplus': 'Rad Plus'
    }
    
    setPlanName(name || planNames[plan || ''] || 'Premium Plan')
    setAmount(amt || '')
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-gray-600">
              Thank you for upgrading to <strong>{planName}</strong>
            </p>
            {amount && (
              <p className="text-lg font-semibold text-green-600">
                Amount Paid: {amount}
              </p>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-center space-x-2 text-blue-700">
              <Mail className="w-5 h-5" />
              <span className="font-medium">What's Next?</span>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              Thank you for your payment!
Your subscription is being activated and will be reviewed shortly.
You'll receive an email confirmation within 24 hours.
We're excited to help you save more time, boost your productivity,
and simplify your radiology reporting — the smart way!
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/impression')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Continue to Dashboard
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}