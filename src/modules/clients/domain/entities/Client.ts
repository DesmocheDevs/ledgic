import { Email } from '../../../../shared/domain/value-objects/Email';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export enum Sexo {
  MASCULINO = 'MASCULINO',
  FEMENINO = 'FEMENINO',
  OTRO = 'OTRO',
}

export class Client {
  private _email: Email;

  constructor(
    public readonly id: UUID,
    public nombre: string,
    public apellido: string,
    public cedula: string,
    public numero: string | null,
    email: string,
    public direccion: string,
    public sexo: Sexo,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {
    this.validate();
    this._email = Email.create(email);
  }

  get email(): string {
    return this._email.getValue();
  }

  private validate(): void {
    if (!this.nombre || this.nombre.trim().length < 2) {
      throw new DomainError('El nombre debe tener al menos 2 caracteres');
    }
    if (!this.apellido || this.apellido.trim().length < 2) {
      throw new DomainError('El apellido debe tener al menos 2 caracteres');
    }
    if (!this.cedula || this.cedula.trim().length < 5) {
      throw new DomainError('La cédula debe tener al menos 5 caracteres');
    }
    if (!this.direccion || this.direccion.trim().length < 5) {
      throw new DomainError('La dirección debe tener al menos 5 caracteres');
    }
    if (!Object.values(Sexo).includes(this.sexo)) {
      throw new DomainError('El valor de sexo no es válido');
    }
  }

  update(fields: Partial<{
    nombre: string;
    apellido: string;
    cedula: string;
    numero: string | null;
    email: string;
    direccion: string;
    sexo: Sexo;
  }>): void {
    if (fields.nombre) this.nombre = fields.nombre;
    if (fields.apellido) this.apellido = fields.apellido;
    if (fields.cedula) this.cedula = fields.cedula;
    if (fields.numero !== undefined) this.numero = fields.numero;
    if (fields.email) this._email = Email.create(fields.email);
    if (fields.direccion) this.direccion = fields.direccion;
    if (fields.sexo) this.sexo = fields.sexo;
    this.updatedAt = new Date();
    this.validate();
  }
}