import "reflect-metadata";
import { NextResponse } from "next/server";
import { container, configureContainer } from "../../../../shared/container";
import { GetClientUseCase, UpdateClientUseCase, DeleteClientUseCase } from "../../../../modules/clients/application/use-cases";
import { DomainError } from "../../../../shared/domain/errors/DomainError";

// Configurar el contenedor de dependencias
configureContainer();

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
  const { id } = await params;
    const useCase = container.resolve(GetClientUseCase);
  const client = await useCase.execute(id);
    
    const response = {
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
    };
    
    return NextResponse.json(response);
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en GET /api/clients/${id}:`, error);
    
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: "No se pudo obtener el cliente" }, 
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    
    // Validar que se proporcionó al menos un campo para actualizar
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron datos para actualizar" }, 
        { status: 400 }
      );
    }
    
  const { id } = await params;
  const useCase = container.resolve(UpdateClientUseCase);
  const client = await useCase.execute(id, body);
    
    const response = {
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
    };
    
    return NextResponse.json(response);
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en PUT /api/clients/${id}:`, error);
    
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: "No se pudo actualizar el cliente" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
  const { id } = await params;
  const useCase = container.resolve(DeleteClientUseCase);
  await useCase.execute(id);
    
    return NextResponse.json({ message: "Cliente eliminado correctamente" });
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en DELETE /api/clients/${id}:`, error);
    
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: "No se pudo eliminar el cliente" }, 
      { status: 500 }
    );
  }
}
