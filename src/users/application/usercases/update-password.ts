import { IUseCase } from 'src/shared/application/usecases/use-case.interface';
import { IUserRepository } from 'src/users/infrastructure/repositories/user-repository.interface';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';
import { BadRequest } from 'src/shared/application/errors/bad-request-error';
import { IHashProvider } from 'src/shared/application/providers/hash-provider';

export namespace UpdatePassword {
  export type Input = {
    id: string;
    password: string;
    oldPassword: string;
  };

  export type Output = UserOutput;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      private userRepository: IUserRepository.Repository,
      private hashProvider: IHashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id);
      if (!input.password || !input.oldPassword) {
        throw new BadRequest('Old password and new password is required');
      }
      if (
        await this.hashProvider.compareHash(input.oldPassword, entity.password)
      ) {
        throw new BadRequest('Old password does not match');
      }
      const hashPass = await this.hashProvider.generateHash(input.password);
      entity.updatePass(hashPass);
      await this.userRepository.update(entity);
      return UserOutputMapper.toOutput(entity);
    }
  }
}
