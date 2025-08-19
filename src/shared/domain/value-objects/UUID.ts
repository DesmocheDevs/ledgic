import { v4 as uuidv4 } from 'uuid';
import { DomainError } from '../errors/DomainError';

export class UUID {
  private constructor(private readonly value: string) {}

  static create(): UUID {
    return new UUID(uuidv4());
  }

  static fromString(value: string): UUID {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
      throw new DomainError('Invalid UUID format');
    }
    return new UUID(value);
  }

  getValue(): string {
    return this.value;
  }
}