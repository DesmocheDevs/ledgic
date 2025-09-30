import { NextAuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "@/shared/infrastructure/database/prisma"

declare module "next-auth" {
  interface User {
    id: number
    personaId: number
    activo: boolean
    persona?: {
      id: number
      nombreCompleto: string
      primerNombre: string
      segundoNombre?: string
      primerApellido: string
      segundoApellido?: string
      correo?: string
    }
  }

  interface Session {
    user: User & {
      id: number
      personaId: number
      activo: boolean
      persona?: {
        id: number
        nombreCompleto: string
        primerNombre: string
        segundoNombre?: string
        primerApellido: string
        segundoApellido?: string
        correo?: string
      }
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    personaId?: number
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.usuario.findUnique({
          where: {
            correo: credentials.email
          },
          include: {
            persona: true
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.contrasena)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.correo,
          name: user.persona.nombreCompleto,
          personaId: user.personaId,
          activo: user.activo,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.personaId = user.personaId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = parseInt(token.sub!)
        session.user.personaId = token.personaId as number
      }
      return session
    }
  }
}