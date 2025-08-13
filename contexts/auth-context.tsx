"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInDemo: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error("Error signing in with Google:", error)
      throw error
    }
  }

  const signInDemo = async () => {
    try {
      // Create a demo user object that mimics Firebase User
      const demoUser = {
        uid: "demo-user-123",
        email: "demo@radimpression.com",
        displayName: "Demo User",
        photoURL: null,
        emailVerified: true,
        isAnonymous: false,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
        },
        providerData: [],
        refreshToken: "",
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => "demo-token",
        getIdTokenResult: async () => ({
          token: "demo-token",
          authTime: new Date().toISOString(),
          issuedAtTime: new Date().toISOString(),
          expirationTime: new Date(Date.now() + 3600000).toISOString(),
          signInProvider: "demo",
          signInSecondFactor: null,
          claims: {},
        }),
        reload: async () => {},
        toJSON: () => ({}),
      } as User

      setUser(demoUser)
      setLoading(false)
    } catch (error) {
      console.error("Error with demo login:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      if (user?.uid === "demo-user-123") {
        // Handle demo user logout
        setUser(null)
      } else {
        await signOut(auth)
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
