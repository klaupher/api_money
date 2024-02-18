export class ValidationError extends Error {}
import { FieldErrors } from '../validators/validator-fields.interface';

export class EntityValidationError extends Error {
  constructor(public error: FieldErrors) {
    super('Entity Validation Error');
    this.name = 'EntityValidationError';
  }
}
