"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check, Star, X, AlertTriangle } from "lucide-react"

interface PricingPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function PricingPopup({ isOpen, onClose }: PricingPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
              Upgrade Required
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              You've reached your usage limit. Upgrade to continue generating AI impressions.
            </p>
          </div>

          <Card className="border-2 border-blue-500 shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 text-white px-3 py-1">
                <Star className="w-3 h-3 mr-1" />
                Recommended
              </Badge>
            </div>

            <CardHeader className="text-center pb-4 pt-6">
              <CardTitle className="text-xl">Professional Plan</CardTitle>
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <CardDescription>Perfect for active radiologists</CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">500 AI impressions/month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Priority processing</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Advanced templates</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">24/7 support</span>
                </li>
              </ul>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Upgrade Now</Button>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button variant="ghost" onClick={onClose} className="text-gray-500">
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
