"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const session = searchParams.get("session_id")
    setSessionId(session)
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          <CardDescription>Thank you for your purchase. Your account has been upgraded.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessionId && <p className="text-sm text-muted-foreground">Session ID: {sessionId}</p>}
          <div className="space-y-2">
            <p>Your premium features are now active:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Increased token limits</li>
              <li>• Priority support</li>
              <li>• Advanced formatting options</li>
            </ul>
          </div>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/impression">Start Generating</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
