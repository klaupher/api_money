import { Transform } from 'class-transformer';
import { CollectionPresenter } from 'src/shared/infrastructure/presenters/collection.presenter';
import { UserOutput } from 'src/users/application/dtos/user-output';
import { ListUser } from 'src/users/application/usercases/list-user';

export class UserPresenter {
  id: string;
  name: string;
  email: string;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: UserOutput) {
    this.id = output.id;
    this.name = output.name;
    this.email = output.email;
    this.createdAt = output.createdAt;
  }
}

export class UserCollectionPresenter extends CollectionPresenter {
  data: UserPresenter[];

  constructor(output: ListUser.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map(item => new UserPresenter(item));
  }
}
