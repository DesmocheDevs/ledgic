import "reflect-metadata";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { container, configureContainer } from "../../../shared/container";
import { GetAllClientsUseCase, CreateClientUseCase } from "../../../modules/clients/application/use-cases";
import { DomainError } from "../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../shared/infrastructure/utils/errorResponse";

// Configurar el contenedor de dependencias
configureContainer();

export async function GET() {
  try {
    const useCase = container.resolve(GetAllClientsUseCase);
    const clients = await useCase.execute();
    
    const response = clients.map((client) => ({
      id: client.id.getValue(),
      nombre: client.nombre,
      apellido: client.apellido,
      email: client.email,
      sexo: client.sexo,
      cedula: client.cedula,
      numero: client.numero,
      direccion: client.direccion,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }));
    
    return createSuccessResponse(response);
  } catch (error: any) {
    console.error('Error en GET /api/clients:', error);
    return createErrorResponse('No se pudieron obtener los clientes', 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validación básica del payload
    const required = ["nombre", "apellido", "cedula", "correo", "direccion", "sexo"] as const;
    for (const field of required) {
      if (!body[field] || typeof body[field] !== "string") {
        return createErrorResponse(`Campo inválido o faltante: ${field}`, 400);
      }
    }

    // Validaciones específicas
    if (body.nombre.trim().length < 2) {
      return createErrorResponse("Nombre debe tener al menos 2 caracteres", 400);
    }
    if (body.apellido.trim().length < 2) {
      return createErrorResponse("Apellido debe tener al menos 2 caracteres", 400);
    }
    if (body.cedula.trim().length < 5) {
      return createErrorResponse("Cédula debe tener al menos 5 caracteres", 400);
    }
    if (body.direccion.trim().length < 5) {
      return createErrorResponse("Dirección debe tener al menos 5 caracteres", 400);
    }
    if (!["MASCULINO", "FEMENINO", "OTRO"].includes(body.sexo)) {
      return createErrorResponse("Sexo inválido", 400);
    }

    // Normalización
    const numero = body.numero === "" ? null : body.numero;

    const useCase = container.resolve(CreateClientUseCase);
    const client = await useCase.execute({
      nombre: body.nombre,
      apellido: body.apellido,
      cedula: body.cedula,
      numero,
      correo: body.correo,
      direccion: body.direccion,
      sexo: body.sexo,
    });

    // Solo si no hubo excepción, se construye y retorna la respuesta
    return createSuccessResponse({
      id: client.id.getValue(),
      nombre: client.nombre,
      apellido: client.apellido,
      email: client.email,
      sexo: client.sexo,
      cedula: client.cedula,
      numero: client.numero,
      direccion: client.direccion,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }, 201);

  } catch (error: any) {
    console.error('Error en POST /api/clients:', error);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);

    // Errores de dominio
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }

    // Errores de Prisma (violación de unicidad)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = (error.meta?.target as string[])?.join(", ") ?? "desconocido";
        const errorMessage = `Ya existe un cliente con este ${target}`;
        return createErrorResponse(errorMessage, 409);
      }
    }

    // Otros errores
    return createErrorResponse("Error interno del servidor", 500);
  }
}
