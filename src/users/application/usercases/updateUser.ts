import { UserOutput, UserOutputMapper } from '../dtos/user-output';
import { IUserRepository } from 'src/users/infrastructure/repositories/user-repository.interface';
import { IUseCase } from './../../../shared/application/usecases/use-case.interface';
import { BadRequest } from './../errors/bad-request-error';

export namespace UpdateUser {
  export type Input = {
    id: string;
    name: string;
  };

  export type Output = UserOutput;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(private userRepository: IUserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.name) {
        throw new BadRequest('Name not provided');
      }
      const entity = await this.userRepository.findById(input.id);
      entity.update(input.name);
      await this.userRepository.update(entity);
      return UserOutputMapper.toOutput(entity);
    }
  }
}
