import { BadRequest } from '../../../shared/application/errors/bad-request-error';
import { IUserRepository } from '../../infrastructure/repositories/user-repository.interface';
import { IHashProvider } from 'src/shared/application/providers/hash-provider';
import { IUseCase } from 'src/shared/application/usecases/use-case.interface';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';

export namespace SignIn {
  export type Input = {
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
      const { email, password } = input;
      if (!email || !password) {
        throw new BadRequest('Input data not provided');
      }
      const entity = await this.userRepository.findByEmail(email);

      const hashPass = await this.hashProvider.compareHash(
        password,
        entity.password,
      );

      if (!hashPass) {
        throw new BadRequest('Invalid credentials');
      }

      return UserOutputMapper.toOutput(entity);
    }
  }
}
