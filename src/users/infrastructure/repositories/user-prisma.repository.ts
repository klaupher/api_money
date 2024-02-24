import { UserEntity } from 'src/users/domain/entities/user.entity';
import { IUserRepository } from './contracts/user-repository.interface';
import { PrismaService } from 'src/shared/infrastructure/database/prisma/prisma.service';
import { NotFoundError } from 'src/shared/domain/errors/not-found-error';
import { UserModelMapper } from './model/user-model-prisma.mapper';
import { ConflictError } from 'src/shared/domain/errors/conflic-error';

export class UserPrismaRepository implements IUserRepository.Repository {
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity> {
    return await this._getEmail(email);
  }

  async emailExists(email: string): Promise<void> {
    const user = await this._getEmail(email);
    if (user) {
      throw new ConflictError('Email address already used');
    }
  }

  async search(
    props: IUserRepository.SearchParams,
  ): Promise<IUserRepository.SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort) || false;
    const orderByField = sortable ? props.sort : 'createdAt';
    const orderByDir = sortable ? props.sortDir : 'desc';

    const count = await this.prismaService.user.count({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
    });

    const models = await this.prismaService.user.findMany({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
        orderBy: {
          [orderByField]: orderByDir,
        },
        skip:
          props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
        take: props.perPage && props.perPage > 0 ? props.perPage : 15,
      }),
    });

    return new IUserRepository.SearchResult({
      items: models.map(model => UserModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filter: props.filter,
    });
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({
      data: entity.toJSON(),
    });
  }

  async findById(id: string): Promise<UserEntity> {
    return this._get(id);
  }

  async findAll(): Promise<UserEntity[]> {
    const models = await this.prismaService.user.findMany();
    return models.map(model => UserModelMapper.toEntity(model));
  }

  async update(entity: UserEntity): Promise<void> {
    await this._get(entity.id);
    await this.prismaService.user.update({
      data: entity.toJSON(),
      where: {
        id: entity.id,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  protected async _get(id: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id } });
      return UserModelMapper.toEntity(user);
    } catch {
      throw new NotFoundError(`UserMode not found using ID ${id}`);
    }
  }

  protected async _getEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (!user) {
        return null;
      }
      return UserModelMapper.toEntity(user);
    } catch {
      throw new NotFoundError(`UserMode not found using email ${email}`);
    }
  }
}
