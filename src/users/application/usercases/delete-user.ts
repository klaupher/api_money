import { IUseCase } from '../../../shared/application/usecases/use-case.interface';
import { IUserRepository } from '../../infrastructure/repositories/contracts/user-repository.interface';

export namespace DeleteUser {
  export type Input = {
    id: string;
  };

  export type Output = void;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(private userRepository: IUserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      await this.userRepository.delete(input.id);
    }
  }
}
