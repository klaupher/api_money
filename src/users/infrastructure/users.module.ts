import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SignUp } from '../application/usercases/signup';
import { UserInMemoryRepository } from './repositories/user-in-memory.repository';
import { BcryptHashProvider } from './providers/hash-provider/bcrypt-hash.provider';
import { IUserRepository } from './repositories/user-repository.interface';
import { IHashProvider } from 'src/shared/application/providers/hash-provider';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useClass: UserInMemoryRepository,
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
  ],
})
export class UsersModule {}
