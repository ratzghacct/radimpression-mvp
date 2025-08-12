"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Rocket } from "lucide-react"

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "$19",
    period: "month",
    description: "Perfect for individual radiologists getting started",
    icon: Zap,
    features: [
      "50,000 tokens per month",
      "Basic impression generation",
      "Email support",
      "Standard processing speed",
      "History tracking",
    ],
    popular: false,
    buttonText: "Get Started",
  },
  {
    id: "pro",
    name: "Professional",
    price: "$49",
    period: "month",
    description: "Ideal for busy practices and departments",
    icon: Crown,
    features: [
      "200,000 tokens per month",
      "Advanced impression generation",
      "Priority support",
      "Fast processing speed",
      "Advanced history & analytics",
      "Custom templates",
      "API access",
    ],
    popular: true,
    buttonText: "Upgrade Now",
  },
  {
    id: "rad-plus",
    name: "Rad Plus",
    price: "$99",
    period: "month",
    description: "For large institutions and enterprise use",
    icon: Rocket,
    features: [
      "1,000,000 tokens per month",
      "Premium impression generation",
      "24/7 dedicated support",
      "Fastest processing speed",
      "Advanced analytics & reporting",
      "Custom integrations",
      "White-label options",
      "Team management",
    ],
    popular: false,
    buttonText: "Contact Sales",
  },
]

export function PricingSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const IconComponent = plan.icon
        return (
          <Card
            key={plan.id}
            className={`relative ${
              plan.popular ? "border-2 border-blue-500 shadow-lg scale-105" : "border border-gray-200 hover:shadow-md"
            } transition-all duration-200`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-3 py-1">Most Popular</Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <IconComponent className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-sm text-gray-600">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600 ml-1">/{plan.period}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full mt-6 ${
                  plan.popular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
