export type SexoDTO = 'MASCULINO' | 'FEMENINO' | 'OTRO';

export interface ClientDTO {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  numero: string | null;
  correo: string;
  direccion: string;
  sexo: SexoDTO;
  createdAt: Date;
  updatedAt: Date;
}