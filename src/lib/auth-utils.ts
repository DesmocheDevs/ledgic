import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "./auth"
import prisma from "@/shared/infrastructure/database/prisma"

/**
 * Server-side utility to get current session with user validation
 */
export async function getValidatedSession() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login")
  }

  return session
}

/**
 * Server-side utility to get current user from database
 */
export async function getCurrentUser() {
  const session = await getValidatedSession()

  if (!session.user.email) {
    redirect("/login")
  }

  const user = await prisma.usuario.findUnique({
    where: {
      correo: session.user.email,
      activo: true
    },
    include: {
      persona: true
    }
  })

  if (!user) {
    redirect("/login")
  }

  return {
    ...session,
    user: {
      ...session.user,
      id: user.id,
      personaId: user.personaId,
      activo: user.activo,
      persona: user.persona
    }
  }
}

/**
 * Check if current user has active session
 */
export async function hasValidSession(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return false
    }

    // Verify user exists and is active in database
    const user = await prisma.usuario.findUnique({
      where: {
        correo: session.user.email,
        activo: true
      }
    })

    return !!user
  } catch {
    return false
  }
}

/**
 * Redirect to login if no valid session
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login")
  }

  // Verify user exists and is active in database
  const user = await prisma.usuario.findUnique({
    where: {
      correo: session.user.email,
      activo: true
    }
  })

  if (!user) {
    redirect("/login")
  }

  return session
}

/**
 * Get user role/permissions (for future role-based access control)
 */
export async function getUserPermissions() {
  const session = await getCurrentUser()

  // For now, all authenticated users have basic permissions
  // This can be extended for role-based access control
  return {
    canViewDashboard: true,
    canManageProducts: true,
    canManageInventory: true,
    canViewReports: true,
    userId: session.user.id,
    personaId: session.user.personaId
  }
}

/**
 * Validate if user can access specific resource
 */
export async function canAccessResource(resourceOwnerId?: string) {
  const permissions = await getUserPermissions()

  // For now, users can only access their own resources
  // This can be extended for admin users or shared resources
  if (resourceOwnerId && resourceOwnerId !== permissions.userId.toString()) {
    return false
  }

  return true
}