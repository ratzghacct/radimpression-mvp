"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check, Star, X } from "lucide-react"

interface PricingPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function PricingPopup({ isOpen, onClose }: PricingPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Choose Your Plan</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg">Free</CardTitle>
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <CardDescription>Perfect for trying out</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">5 AI impressions/month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Basic templates</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Email support</span>
                </li>
              </ul>
              <Button className="w-full bg-transparent" variant="outline">
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Basic Plan */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg">Basic</CardTitle>
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold">$19</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <CardDescription>For occasional use</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">50 AI impressions/month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Standard templates</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Priority email support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">History tracking</span>
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Upgrade</Button>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card className="border-2 border-green-500 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-green-500 text-white px-3 py-1">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-4 pt-6">
              <CardTitle className="text-lg">Professional</CardTitle>
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold">$49</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <CardDescription>For active radiologists</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">200 AI impressions/month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Advanced templates</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Priority processing</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">24/7 chat support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Custom templates</span>
                </li>
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Upgrade</Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-2 border-purple-200">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg">Enterprise</CardTitle>
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold">$99</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <CardDescription>For large practices</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Unlimited impressions</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">All templates</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Fastest processing</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Dedicated support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">API access</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Team management</span>
                </li>
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">All plans include secure data handling and HIPAA compliance</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
