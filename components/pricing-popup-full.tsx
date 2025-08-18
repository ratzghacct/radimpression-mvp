"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check, Star, X, Crown } from "lucide-react"

interface PricingPopupFullProps {
  isOpen: boolean
  onClose: () => void
  onPurchase: (planId: string, planName: string, price: string) => void
}

const plans = [
  {
    id: "professional",
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
    buttonText: "Choose Professional",
    popular: true,
    icon: <Check className="w-6 h-6 text-blue-500" />,
  },
  {
    id: "enterprise",
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
    buttonText: "Choose Enterprise",
    popular: false,
    icon: <Crown className="w-6 h-6 text-purple-500" />,
  },
]

export function PricingPopupFull({ isOpen, onClose, onPurchase }: PricingPopupFullProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Choose Your Plan</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? "border-2 border-blue-500 shadow-lg" : "border border-gray-200"}`}
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
                  {plan.icon}
                  <CardTitle className="text-xl ml-2">{plan.name}</CardTitle>
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
                  onClick={() => onPurchase(plan.id, plan.name, plan.price)}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-4">All plans include a 14-day free trial. Cancel anytime.</p>
          <Button variant="ghost" onClick={onClose} className="text-gray-500">
            I'll decide later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
