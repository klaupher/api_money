import { v4 as uuidV4 } from 'uuid';

type EntityJson<T> = { id: string } & T;

export abstract class Entity<Props = any> {
  private readonly _id: string;
  readonly props: Props;

  constructor(props: Props, id?: string) {
    this._id = id ?? uuidV4();
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  toJSON(): Required<EntityJson<Props>> {
    return {
      id: this.id,
      ...this.props,
    } as Required<EntityJson<Props>>;
  }
}
