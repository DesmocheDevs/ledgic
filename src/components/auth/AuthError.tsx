"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthErrorProps {
  error?: string
  onRetry?: () => void
  showLoginButton?: boolean
}

/**
 * Error component for authentication failures
 */
export function AuthError({
  error = "Error de autenticación",
  onRetry,
  showLoginButton = true
}: AuthErrorProps) {
  const router = useRouter()

  const handleLoginRedirect = () => {
    router.push("/login")
  }

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Error de Autenticación
        </h2>

        <p className="text-gray-600 mb-6">
          {error || "Ha ocurrido un error durante la autenticación. Por favor, inténtalo de nuevo."}
        </p>

        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          )}

          {showLoginButton && (
            <button
              onClick={handleLoginRedirect}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Ir al Login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}