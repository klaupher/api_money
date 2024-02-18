import { UserEntity } from 'src/users/domain/entities/user.entity';
import { IUserRepository } from './user-repository.interface';
import { InMemorySearchableRepository } from 'src/shared/infrastructure/repositories/in-memory.searchable-repository';
import { NotFoundError } from 'src/shared/domain/errors/not-found-error';
import { ConflictError } from 'src/shared/domain/errors/conflic-error';
import { SortDirection } from 'src/shared/infrastructure/repositories/searchable-repository.interface';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements IUserRepository.Repository
{
  sortableFields: string[] = ['name', 'created_at'];

  async findByEmail(email: string): Promise<UserEntity> {
    const entity = this.items.find(item => item.id === email);
    if (!entity) {
      throw new NotFoundError(`Entity not  - ${email}`);
    }
    return entity;
  }

  async emailExists(email: string): Promise<void> {
    const entity = this.items.find(item => item.id === email);
    if (entity) {
      throw new ConflictError(`Email address already used`);
    }
  }

  protected async applyFilter(
    items: UserEntity[],
    filter: IUserRepository.Filter,
  ): Promise<UserEntity[]> {
    if (!filter) {
      return items;
    }
    return items.filter(item => {
      return item.props.name.toLowerCase().includes(filter.toLowerCase());
    });
  }

  protected async applySort(
    items: UserEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<UserEntity[]> {
    return !sort
      ? super.applySort(items, 'created_at', 'desc')
      : super.applySort(items, sort, sortDir);
  }
}
