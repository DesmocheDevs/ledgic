"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AuthLoading } from "./AuthLoading"
import { AuthError } from "./AuthError"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
  showError?: boolean
  errorMessage?: string
}

/**
 * Component that protects routes by checking authentication status
 */
export function AuthGuard({
  children,
  fallback,
  redirectTo = "/login",
  showError = false,
  errorMessage
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, status } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  if (isLoading) {
    return fallback || <AuthLoading message="Verificando autenticación..." />
  }

  if (!isAuthenticated) {
    if (showError) {
      return <AuthError error={errorMessage} />
    }
    return null
  }

  return <>{children}</>
}