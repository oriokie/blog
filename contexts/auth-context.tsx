"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  avatar: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const { data } = await authAPI.getCurrentUser()
        setUser(data)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await authAPI.login({ email, password })
      setUser(data)
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: any) => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await authAPI.register(userData)
      setUser(data)
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await authAPI.logout()
      setUser(null)
      router.push("/login")
    } catch (error: any) {
      setError(error.response?.data?.message || "Logout failed")
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
