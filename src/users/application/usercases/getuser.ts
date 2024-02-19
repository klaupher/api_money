import { IUseCase } from '../../../shared/application/usecases/use-case.interface';
import { IUserRepository } from '../../infrastructure/repositories/user-repository.interface';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';

export namespace GetUser {
  export type Input = {
    id: string;
  };

  export type Output = UserOutput;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(private userRepository: IUserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id);
      return UserOutputMapper.toOutput(entity);
    }
  }
}
