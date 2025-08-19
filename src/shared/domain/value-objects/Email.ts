import { DomainError } from '../errors/DomainError';

export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    if (!value || typeof value !== 'string') {
      throw new DomainError('El email es requerido');
    }
    
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      throw new DomainError('El email no puede estar vacío');
    }
    
    if (!trimmedValue.includes('@')) {
      throw new DomainError('El email debe contener el símbolo @');
    }
    
    if (!trimmedValue.includes('.')) {
      throw new DomainError('El email debe contener un dominio válido');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedValue)) {
      throw new DomainError('El formato del email no es válido');
    }
    
    return new Email(trimmedValue.toLowerCase());
  }

  getValue(): string {
    return this.value;
  }
}