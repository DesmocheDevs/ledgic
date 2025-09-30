"use client"

interface AuthLoadingProps {
  message?: string
  size?: "sm" | "md" | "lg"
}

/**
 * Loading component for authentication states
 */
export function AuthLoading({
  message = "Verificando autenticación...",
  size = "md"
}: AuthLoadingProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-32 w-32"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]} mx-auto mb-4`}></div>
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  )
}