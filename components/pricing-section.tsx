"use client"


import { EarlyAccessModal } from "./early-access-modal"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Zap, Crown, Stethoscope } from 'lucide-react'

const plans = [
  {
    name: "Free Plan",
    price: "₹0",
    period: "/month",
    reports: "10",
    tokens: "10,000",
    features: [
      "Basic short impressions only",
      "Standard processing speed", 
      "Email support"
    ],
    icon: Sparkles,
    popular: false,
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
  },
  {
    name: "Basic", 
    price: "₹999",
    period: "/month",
    reports: "100",
    tokens: "100,000",
    features: [
      "Basic short impressions",
      "Faster processing",
      "Email support"
    ],
    icon: Zap,
    popular: false,
    buttonText: "Choose Basic",
    buttonVariant: "outline" as const,
  },
  {
    name: "Pro Plan",
    price: "₹1499", 
    comingSoon: true,
    period: "/month",
    reports: "300",
    tokens: "300,000",
    features: [
      "Formal impression option",
"Faster processing",      
"Priority support"
    ],
    icon: Crown,
    popular: true,
    buttonText: "Choose Pro",
    buttonVariant: "default" as const,
  },
  {
    name: "Rad Plus",
    price: "₹1499",
    comingSoon: true,
    period: "/month",
    reports: "1,000",
    tokens: "1,000,000",
    features: [
      "🔄 Full Findings AI Rephraser",
      "📝 Short + Formal Impression Generator", 
      "📱 Multidevice Access (single user)",
      "🎧 Dedicated Support"
    ],
    icon: Lock,
    popular: false,
    buttonText: "Join Early Access",
    buttonVariant: "outline" as const,
    locked: true,
    earlyAccess: true,  },
]

export function PricingSection() {
  const [showEarlyAccess, setShowEarlyAccess] = useState(false)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((plan) => {
        const IconComponent = plan.icon
        return (
          <Card
            key={plan.name}
            className={`relative ${
              plan.popular
                ? "border-2 border-blue-500 shadow-lg scale-105"
                : "border border-gray-200"
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  plan.popular ? "bg-blue-500" : "bg-gray-100"
                }`}>
                  <IconComponent className={`w-6 h-6 ${
                    plan.popular ? "text-white" : "text-gray-600"
                  }`} />
      <EarlyAccessModal 
        isOpen={showEarlyAccess} 
        onClose={() => setShowEarlyAccess(false)} 
      />
                </div>
      <EarlyAccessModal 
        isOpen={showEarlyAccess} 
        onClose={() => setShowEarlyAccess(false)} 
      />
              </div>
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500 ml-1">{plan.period}</span>
      <EarlyAccessModal 
        isOpen={showEarlyAccess} 
        onClose={() => setShowEarlyAccess(false)} 
      />
              </div>
              <CardDescription className="text-sm">
                {plan.reports} reports • {plan.tokens} tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : ""
                }`}
                variant={plan.buttonVariant}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        )
      })}
      <EarlyAccessModal 
        isOpen={showEarlyAccess} 
        onClose={() => setShowEarlyAccess(false)} 
      />
    </div>
  )
}
