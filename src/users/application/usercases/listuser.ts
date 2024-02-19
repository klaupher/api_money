import { IUseCase } from 'src/shared/application/usecases/use-case.interface';
import { IUserRepository } from 'src/users/infrastructure/repositories/user-repository.interface';
import { SearchInput } from 'src/shared/application/dtos/search-input';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from 'src/shared/application/dtos/pagination-output';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';

export namespace ListUser {
  export type Input = SearchInput;

  export type Output = PaginationOutput<UserOutput>;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(private userRepository: IUserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new IUserRepository.SearchParams(input);
      const searchResult = await this.userRepository.search(params);
      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: IUserRepository.SearchResult): Output {
      const items = searchResult.items.map(item => {
        return UserOutputMapper.toOutput(item);
      });
      return PaginationOutputMapper.toOutput(items, searchResult);
    }
  }
}
