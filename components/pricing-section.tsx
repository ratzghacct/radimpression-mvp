"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown } from "lucide-react"

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out RadImpression",
    features: ["10 AI impressions per month", "Basic radiology templates", "Standard response time", "Email support"],
    buttonText: "Current Plan",
    popular: false,
    disabled: true,
  },
  {
    name: "Professional",
    price: "$29",
    period: "month",
    description: "Ideal for individual radiologists",
    features: [
      "500 AI impressions per month",
      "Advanced templates & formats",
      "Priority processing",
      "24/7 chat support",
      "Export to PACS systems",
      "Custom impression styles",
    ],
    buttonText: "Upgrade Now",
    popular: true,
    disabled: false,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "month",
    description: "For radiology departments & hospitals",
    features: [
      "Unlimited AI impressions",
      "Multi-user dashboard",
      "Advanced analytics",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    buttonText: "Contact Sales",
    popular: false,
    disabled: false,
  },
]

export function PricingSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan, index) => (
        <Card
          key={plan.name}
          className={`relative ${
            plan.popular ? "border-2 border-blue-500 shadow-lg scale-105" : "border border-gray-200"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 text-white px-3 py-1">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>
          )}

          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-2">
              {index === 0 && <Zap className="w-6 h-6 text-green-500 mr-2" />}
              {index === 1 && <Check className="w-6 h-6 text-blue-500 mr-2" />}
              {index === 2 && <Crown className="w-6 h-6 text-purple-500 mr-2" />}
              <CardTitle className="text-xl">{plan.name}</CardTitle>
            </div>
            <div className="flex items-baseline justify-center">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-gray-500 ml-1">/{plan.period}</span>
            </div>
            <CardDescription className="mt-2">{plan.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full ${
                plan.popular
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
              disabled={plan.disabled}
            >
              {plan.buttonText}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
