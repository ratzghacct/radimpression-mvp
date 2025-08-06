"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInDemo: (demoUser: User) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for demo user first
    const demoUser = localStorage.getItem("demo_user")
    if (demoUser) {
      try {
        setUser(JSON.parse(demoUser))
        setLoading(false)
        return
      } catch (error) {
        localStorage.removeItem("demo_user")
      }
    }

    // Then check Firebase auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    try {
      // Clear any demo user
      localStorage.removeItem("demo_user")
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Error signing in with Google:", error)
      throw error
    }
  }

  const signInDemo = (demoUser: User) => {
    // Ensure the demo user has all required fields
    const enhancedDemoUser = {
      ...demoUser,
      uid: demoUser.uid || "demo-user", // Ensure uid is always present
      id: demoUser.uid || "demo-user", // Add id as fallback
    }

    localStorage.setItem("demo_user", JSON.stringify(enhancedDemoUser))
    setUser(enhancedDemoUser as User)
  }

  const logout = async () => {
    try {
      // Clear demo user
      localStorage.removeItem("demo_user")

      // Sign out from Firebase if authenticated
      if (auth.currentUser) {
        await signOut(auth)
      } else {
        // Just clear the user state for demo mode
        setUser(null)
      }
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInDemo,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
