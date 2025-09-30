"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

/**
 * Hook for client-side authentication status
 */
export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false)
    }
  }, [status])

  const isAuthenticated = !!session?.user
  const user = session?.user

  return {
    user,
    session,
    isAuthenticated,
    isLoading: isLoading || status === "loading",
    status
  }
}

/**
 * Hook that redirects to login if not authenticated
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  return {
    isAuthenticated,
    isLoading
  }
}

/**
 * Hook for authentication actions
 */
export function useAuthActions() {
  const { data: session } = useSession()

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" })
      window.location.href = "/login"
    } catch (error) {
      console.error("Error signing out:", error)
      // Fallback to client-side signout
      window.location.href = "/login"
    }
  }

  const refreshSession = async () => {
    try {
      await fetch("/api/auth/session", { method: "POST" })
    } catch (error) {
      console.error("Error refreshing session:", error)
    }
  }

  return {
    signOut,
    refreshSession,
    isAuthenticated: !!session?.user,
    user: session?.user
  }
}

/**
 * Hook for checking user permissions (client-side)
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuth()

  // For now, all authenticated users have basic permissions
  // This can be extended for role-based access control
  const permissions = {
    canViewDashboard: isAuthenticated,
    canManageProducts: isAuthenticated,
    canManageInventory: isAuthenticated,
    canViewReports: isAuthenticated,
    userId: user?.id,
    personaId: user?.personaId
  }

  return permissions
}

/**
 * Hook for handling authentication errors
 */
export function useAuthError() {
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const setAuthError = (message: string) => setError(message)

  useEffect(() => {
    if (error) {
      // Auto-clear error after 5 seconds
      const timer = setTimeout(() => {
        setError(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [error])

  return {
    error,
    setAuthError,
    clearError
  }
}