import { SortDirection } from 'src/shared/infrastructure/repositories/searchable-repository.interface';
import { ListUser } from 'src/users/application/usercases/list-user';

export class ListUserDto implements ListUser.Input {
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: SortDirection;
  filter?: string;
}
