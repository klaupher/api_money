import { SortDirection } from 'src/shared/infrastructure/repositories/searchable-repository.interface';

export type SearchInput<Filter = string> = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: Filter | null;
};
