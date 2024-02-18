import { Entity } from 'src/shared/domain/entities/entity';
import { UserValidatorFactory } from '../validators/user.validator';
import { EntityValidationError } from 'src/shared/domain/errors/validation-error';
import { error } from 'console';

export type UserProps = {
  name: string;
  email: string;
  password: string;
  created_at: Date;
};

export class UserEntity extends Entity<UserProps> {
  constructor(
    public readonly props: UserProps,
    id?: string,
  ) {
    UserEntity.validate(props);
    super(props, id);
    this.props.created_at = this.props.created_at ?? new Date();
  }

  update(value: string): void {
    UserEntity.validate({ ...this.props, name: value });
    this.name = value;
  }

  updatePass(value: string): void {
    UserEntity.validate({ ...this.props, password: value });
    this.password = value;
  }

  get name() {
    return this.props.name;
  }

  private set name(v: string) {
    this.name = v;
  }

  get password() {
    return this.props.password;
  }

  private set password(v: string) {
    this.password = v;
  }

  get email() {
    return this.props.email;
  }

  static validate(props: UserProps) {
    const validator = UserValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
