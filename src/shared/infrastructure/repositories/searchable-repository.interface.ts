import { Entity } from 'src/shared/domain/entities/entity';
import { IRepository } from './repository.interface';

export type SortDirection = 'asc' | 'desc';

export type SearchProps<Filter = string> = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: Filter | null;
};

export type SearchResultProps<E extends Entity, Filter> = {
  items: E[];
  total: number;
  currentPage: number;
  perPage: number;
  sort: string | null;
  sortDir: string | null;
  filter: Filter | null;
};

export class SearchParams<Filter = string> {
  protected _page: number;
  protected _perPage = 15;
  protected _sort: string | null;
  protected _sortDir: SortDirection | null;
  protected _filter: Filter | null;

  constructor(props: SearchProps<Filter>) {
    this._page = props.page;
    this._perPage = props.perPage;
    this._sort = props.sort;
    this._sortDir = props.sortDir;
    this._filter = props.filter;
  }

  get page() {
    return this._page;
  }

  private set page(value: number) {}

  get perPage() {
    return this._perPage;
  }

  private set perPage(value: number) {}

  get sort() {
    return this._sort;
  }

  private set sort(value: string | null) {}

  get sortDir() {
    return this._sortDir;
  }

  private set sortDir(value: string | null) {}

  get filter(): Filter | null {
    return this._filter;
  }

  private set filter(value: string | null) {
    this._filter =
      value === null || value === undefined || value === ''
        ? null
        : (`${value}` as any);
  }
}

export class SearchResult<E extends Entity, Filter = string> {
  readonly items: E[];
  readonly total: number;
  readonly currentPage: number;
  readonly perPage: number;
  readonly lastPage: number;
  readonly sort: string | null;
  readonly sortDir: string | null;
  readonly filter: Filter | null;

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items;
    this.total = props.total;
    this.currentPage = props.currentPage;
    this.perPage = props.perPage;
    this.lastPage = Math.ceil(this.total / this.perPage);
    this.sort = props.sort ?? null;
    this.sortDir = props.sortDir ?? null;
    this.filter = props.filter ?? null;
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this.items.map(item => item.toJSON()) : this.items,
      total: this.total,
      currentPage: this.currentPage,
      perPage: this.perPage,
      lastPage: this.lastPage,
      sort: this.sort,
      sortDir: this.sortDir,
      filter: this.filter,
    };
  }
}

export interface ISearchableRepository<
  E extends Entity,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult<E, Filter>,
> extends IRepository<E> {
  sortableFields: string[];

  search(props: SearchInput): Promise<SearchOutput>;
}
