import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Log para debugging (remover en producción)
    console.log(`Middleware: ${req.method} ${req.nextUrl.pathname}`)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Rutas públicas que no requieren autenticación
        const publicRoutes = [
          "/",
          "/login",
          "/register",
          "/landing",
          "/api/auth",
          "/api/openapi.json",
          "/favicon.ico",
          "/_next",
          "/public"
        ]

        const isPublicRoute = publicRoutes.some(route =>
          req.nextUrl.pathname.startsWith(route)
        )

        // Si es una ruta pública, permitir acceso
        if (isPublicRoute) {
          return true
        }

        // Para rutas protegidas, verificar si hay token válido
        if (!token) {
          console.log(`Acceso denegado a ${req.nextUrl.pathname} - no token`)
          return false
        }

        // Verificar que el usuario esté activo en la base de datos
        // Nota: Esta verificación adicional se hará en las páginas individuales
        // para evitar consultas innecesarias en middleware

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
}