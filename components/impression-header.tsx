"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, Activity, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import { isAdmin } from "@/lib/admin"

interface User {
  uid?: string
  id?: string
  email?: string
  displayName?: string
  name?: string
}

interface ImpressionHeaderProps {
  user: User
  onShowFullPricing: () => void
}

function NavigationButton() {
  const router = useRouter()

  return (
    <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-600 hover:text-gray-900 p-2">
      <ArrowLeft className="w-5 h-5" />
    </Button>
  )
}

function PageTitle() {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
        <Brain className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Impression Generator</h1>
        <p className="text-gray-600">Generate professional radiology impressions with AI</p>
      </div>
    </div>
  )
}

function ActionButtons({ user, onShowFullPricing }: { user: User; onShowFullPricing: () => void }) {
  const router = useRouter()

  return (
    <div className="flex items-center space-x-4">
      <Button
        onClick={onShowFullPricing}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-lg"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        View Pricing
      </Button>

      {isAdmin(user.email) && (
        <Button
          variant="outline"
          onClick={() => router.push("/admin")}
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          Admin Panel
        </Button>
      )}
    </div>
  )
}

function UserBadge({ user }: { user: User }) {
  return (
    <Badge className="bg-blue-100 text-blue-700">
      <Activity className="w-4 h-4 mr-1" />
      {user.displayName || user.email}
    </Badge>
  )
}

export function ImpressionHeader({ user, onShowFullPricing }: ImpressionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <NavigationButton />
        <PageTitle />
      </div>
      <div className="flex items-center space-x-4">
        <ActionButtons user={user} onShowFullPricing={onShowFullPricing} />
        <UserBadge user={user} />
      </div>
    </div>
  )
}

export default ImpressionHeader
