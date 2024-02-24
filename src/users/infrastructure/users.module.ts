import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { SignUp } from '../application/usercases/signup';
import { BcryptHashProvider } from './providers/hash-provider/bcrypt-hash.provider';
import { IUserRepository } from './repositories/contracts/user-repository.interface';
import { IHashProvider } from 'src/shared/application/providers/hash-provider';
import { SignIn } from '../application/usercases/signin';
import { GetUser } from '../application/usercases/get-user';
import { ListUser } from '../application/usercases/list-user';
import { UpdateUser } from '../application/usercases/update-user';
import { UpdatePassword } from '../application/usercases/update-password';
import { DeleteUser } from '../application/usercases/delete-user';
import { PrismaService } from 'src/shared/infrastructure/database/prisma/prisma.service';
import { UserPrismaRepository } from './repositories/user-prisma.repository';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new UserPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'HashProvider',
      useClass: BcryptHashProvider,
    },
    {
      provide: SignUp.UseCase, //nome do registro
      useFactory: (
        userRepository: IUserRepository.Repository,
        hashProvider: IHashProvider,
      ) => {
        return new SignUp.UseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SignIn.UseCase, //nome do registro
      useFactory: (
        userRepository: IUserRepository.Repository,
        hashProvider: IHashProvider,
      ) => {
        return new SignIn.UseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUser.UseCase, //nome do registro
      useFactory: (userRepository: IUserRepository.Repository) => {
        return new GetUser.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUser.UseCase, //nome do registro
      useFactory: (userRepository: IUserRepository.Repository) => {
        return new ListUser.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUser.UseCase, //nome do registro
      useFactory: (userRepository: IUserRepository.Repository) => {
        return new UpdateUser.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePassword.UseCase, //nome do registro
      useFactory: (
        userRepository: IUserRepository.Repository,
        hashProvider: IHashProvider,
      ) => {
        return new UpdatePassword.UseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUser.UseCase, //nome do registro
      useFactory: (userRepository: IUserRepository.Repository) => {
        return new DeleteUser.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
