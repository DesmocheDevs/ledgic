import { Client, Sexo } from '../../domain';
import { ClientDTO, SexoDTO } from '../dtos/ClientDTO';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export class ClientMapper {
  private static mapSexoFromDTO(sexoDTO: SexoDTO): Sexo {
    const sexoMap: Record<SexoDTO, Sexo> = {
      MASCULINO: Sexo.MASCULINO,
      FEMENINO: Sexo.FEMENINO,
      OTRO: Sexo.OTRO,
    };
    
    const sexo = sexoMap[sexoDTO];
    if (!sexo) {
      throw new DomainError(`Sexo inválido: ${sexoDTO}`);
    }
    
    return sexo;
  }

  private static mapSexoToDTO(sexo: Sexo): SexoDTO {
    const sexoMap: Record<Sexo, SexoDTO> = {
      [Sexo.MASCULINO]: 'MASCULINO',
      [Sexo.FEMENINO]: 'FEMENINO',
      [Sexo.OTRO]: 'OTRO',
    };
    
    return sexoMap[sexo];
  }

  static toEntity(dto: ClientDTO): Client {
    try {
      return new Client(
        UUID.fromString(dto.id),
        dto.nombre,
        dto.apellido,
        dto.cedula,
        dto.numero,
        dto.correo, // correo a email
        dto.direccion,
        this.mapSexoFromDTO(dto.sexo),
        dto.createdAt,
        dto.updatedAt,
      );
    } catch (error) {
      console.error('Error mapping DTO to Entity:', error);
      throw new DomainError('Error al convertir datos del cliente');
    }
  }

  static toDTO(client: Client): ClientDTO {
    try {
      return {
        id: client.id.getValue(),
        nombre: client.nombre,
        apellido: client.apellido,
        cedula: client.cedula,
        numero: client.numero,
        correo: client.email, // email a correo
        direccion: client.direccion,
        sexo: this.mapSexoToDTO(client.sexo),
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      };
    } catch (error) {
      console.error('Error mapping Entity to DTO:', error);
      throw new DomainError('Error al preparar datos del cliente');
    }
  }
}