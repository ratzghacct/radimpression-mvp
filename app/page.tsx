"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Shield, Clock, Star, ArrowRight, CheckCircle } from "lucide-react"
import { EarlyAccessModal } from "@/components/early-access-modal"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [showEarlyAccess, setShowEarlyAccess] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (user) {
      router.push("/impression")
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  RadImpression
                </h1>
                <p className="text-xs text-gray-600">AI-Powered Radiology</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button onClick={() => router.push("/impression")} className="bg-blue-600 hover:bg-blue-700">
                  Go to App
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => router.push("/login")}>
                    Sign In
                  </Button>
                  <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">🚀 Now in Beta - Join Early Access</Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Radiology
            </span>{" "}
            Impressions
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Generate professional, accurate radiology impressions in seconds. Powered by advanced AI to enhance your
            workflow and improve patient care.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
              Start Generating
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShowEarlyAccess(true)} className="text-lg px-8 py-3">
              Request Early Access
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose RadImpression?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for radiologists, by radiologists. Experience the future of medical reporting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>Generate comprehensive impressions in under 10 seconds</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>HIPAA Compliant</CardTitle>
                <CardDescription>Enterprise-grade security with full HIPAA compliance</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>AI-Powered</CardTitle>
                <CardDescription>Advanced language models trained on medical literature</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Save Time</CardTitle>
                <CardDescription>Reduce report writing time by up to 70%</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>High Accuracy</CardTitle>
                <CardDescription>Clinically validated with 95%+ accuracy rate</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Easy Integration</CardTitle>
                <CardDescription>Seamlessly integrates with existing workflows</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Workflow?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of radiologists already using RadImpression to enhance their practice.
          </p>
          <Button size="lg" onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
            Get Started Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">RadImpression</span>
          </div>
          <p className="text-gray-400 mb-4">AI-powered radiology impression generation for modern healthcare.</p>
          <p className="text-sm text-gray-500">© 2024 RadImpression. All rights reserved.</p>
        </div>
      </footer>

      <EarlyAccessModal isOpen={showEarlyAccess} onClose={() => setShowEarlyAccess(false)} />
    </div>
  )
}
