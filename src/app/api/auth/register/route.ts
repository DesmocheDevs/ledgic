import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import prisma from "@/shared/infrastructure/database/prisma"
import { z } from "zod"

const registerSchema = z.object({
  primerNombre: z.string().min(1, "El primer nombre es requerido"),
  segundoNombre: z.string().optional(),
  primerApellido: z.string().min(1, "El primer apellido es requerido"),
  segundoApellido: z.string().optional(),
  nombreCompleto: z.string().min(1, "El nombre completo es requerido"),
  correo: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  tipoEntidadId: z.number().int().positive(),
  tipoPersonaId: z.number().int().positive(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { correo: validatedData.correo }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe" },
        { status: 400 }
      )
    }

    // Verificar si la persona ya existe
    const existingPersona = await prisma.personas.findUnique({
      where: { correo: validatedData.correo }
    })

    if (existingPersona) {
      return NextResponse.json(
        { error: "Ya existe una persona registrada con este correo" },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await hash(validatedData.password, 12)

    // Crear la persona primero
    const persona = await prisma.personas.create({
      data: {
        primerNombre: validatedData.primerNombre,
        segundoNombre: validatedData.segundoNombre,
        primerApellido: validatedData.primerApellido,
        segundoApellido: validatedData.segundoApellido,
        nombreCompleto: validatedData.nombreCompleto,
        correo: validatedData.correo,
        tipoEntidadId: validatedData.tipoEntidadId,
        tipoPersonaId: validatedData.tipoPersonaId,
      }
    })

    // Crear el usuario
    const usuario = await prisma.usuario.create({
      data: {
        personaId: persona.id,
        nombre: validatedData.nombreCompleto,
        contrasena: hashedPassword,
        correo: validatedData.correo,
      }
    })

    // Remover la contraseña de la respuesta
    const { contrasena, ...userWithoutPassword } = usuario

    return NextResponse.json({
      message: "Usuario creado exitosamente",
      user: userWithoutPassword
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error en registro:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}