import { UserEntity } from 'src/users/domain/entities/user.entity';
import { BadRequest } from '../../../shared/application/errors/bad-request-error';
import { IUserRepository } from '../../infrastructure/repositories/contracts/user-repository.interface';
import { IHashProvider } from 'src/shared/application/providers/hash-provider';
import { IUseCase } from 'src/shared/application/usecases/use-case.interface';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';

export namespace SignUp {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = UserOutput;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      private userRepository: IUserRepository.Repository,
      private hashProvider: IHashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { name, email, password } = input;
      if (!name || !email || !password) {
        throw new BadRequest('Input data not provided');
      }
      await this.userRepository.emailExists(email);
      const entity = new UserEntity(
        Object.assign(input, {
          password: await this.hashProvider.generateHash(password),
        }),
      );
      await this.userRepository.insert(entity);

      return UserOutputMapper.toOutput(entity);
    }
  }
}
