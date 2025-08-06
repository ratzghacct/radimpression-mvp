"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Zap, Crown, Lock, X } from 'lucide-react'
import { EarlyAccessModal } from "./early-access-modal"

const plans = [
  {
    id: "free",
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
    buttonText: "Current Plan",
    buttonVariant: "outline" as const,
  },
  {
    id: "basic",
    name: "Basic Plan", 
    price: "₹399",
    period: "/month",
    reports: "100",
    tokens: "100,000",
    features: [
      "Short impressions",
      "Faster processing",
      "Priority support"
    ],
    icon: Zap,
    popular: false,
    buttonText: "Upgrade to Basic",
    buttonVariant: "outline" as const,
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: "₹999", 
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
    buttonText: "Upgrade to Pro",
    buttonVariant: "default" as const,
  },
  {
    id: "radplus",
    name: "Rad Plus",
    price: "₹1499",
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
    earlyAccess: true,
    comingSoon: true,
  },
]

interface PricingPopupFullProps {
  isOpen: boolean
  onClose: () => void
  onPurchase: (planId: string, planName: string, price: string) => void
}

export function PricingPopupFull({ isOpen, onClose, onPurchase }: PricingPopupFullProps) {
  const [showEarlyAccess, setShowEarlyAccess] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
          <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const IconComponent = plan.icon
              return (
                <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        plan.popular ? "bg-blue-500" : "bg-gray-100"
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          plan.popular ? "text-white" : "text-gray-600"
                        }`} />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-500 ml-1">{plan.period}</span>
                    </div>
                    {plan.comingSoon && (
                      <div className="text-sm text-orange-600 font-medium mt-1">Coming Soon</div>
                    )}
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
                    
                    {plan.earlyAccess && (
                      <p className="text-sm text-gray-600 mb-2 text-center">Want early access?</p>
                    )}
                    
                    <Button
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                        plan.earlyAccess
                          ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                          : plan.id === "free"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : plan.buttonVariant === "default"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
                      }`}
                      variant={plan.buttonVariant}
                      onClick={() => {
                        if (plan.earlyAccess) {
                          setShowEarlyAccess(true)
                        } else if (plan.id !== "free") {
                          onPurchase(plan.id, plan.name, plan.price)
                        }
                      }}
                      disabled={plan.id === "free"}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
      
      <EarlyAccessModal 
        isOpen={showEarlyAccess} 
        onClose={() => setShowEarlyAccess(false)} 
      />
    </div>
  )
}
