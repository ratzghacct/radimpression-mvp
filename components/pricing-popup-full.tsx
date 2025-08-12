"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Zap, Crown, Rocket } from "lucide-react"

interface PricingPopupFullProps {
  isOpen: boolean
  onClose: () => void
  onPurchase: (planId: string, planName: string, price: string) => void
}

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "$19",
    description: "Perfect for individual radiologists",
    icon: Zap,
    features: ["50,000 tokens/month", "Email support", "Standard processing"],
    popular: false,
  },
  {
    id: "pro",
    name: "Professional",
    price: "$49",
    description: "Ideal for busy practices",
    icon: Crown,
    features: ["200,000 tokens/month", "Priority support", "Fast processing", "Advanced features"],
    popular: true,
  },
  {
    id: "rad-plus",
    name: "Rad Plus",
    price: "$99",
    description: "For large institutions",
    icon: Rocket,
    features: ["1,000,000 tokens/month", "24/7 support", "Fastest processing", "Enterprise features"],
    popular: false,
  },
]

export function PricingPopupFull({ isOpen, onClose, onPurchase }: PricingPopupFullProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">Choose Your Plan</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-600">
            Upgrade your RadImpression account to unlock more features and higher limits.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
          {plans.map((plan) => {
            const IconComponent = plan.icon
            return (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular ? "border-2 border-blue-500 shadow-lg" : "border border-gray-200"
                } transition-all duration-200`}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-2 py-1 text-xs">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-xs text-gray-600">{plan.description}</CardDescription>
                  <div className="mt-3">
                    <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 text-sm">/month</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => onPurchase(plan.id, plan.name, plan.price)}
                    className={`w-full ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                  >
                    Choose {plan.name}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-gray-500 text-center">
            All plans include a 7-day free trial. Cancel anytime. No setup fees.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
