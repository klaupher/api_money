import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpCode,
  Query,
  Put,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SignUp } from '../application/usercases/signup';
import { SignIn } from '../application/usercases/signin';
import { GetUser } from '../application/usercases/get-user';
import { ListUser } from '../application/usercases/list-user';
import { UpdateUser } from '../application/usercases/update-user';
import { UpdatePassword } from '../application/usercases/update-password';
import { DeleteUser } from '../application/usercases/delete-user';
import { SignInDto } from './dtos/signin.dto';
import { ListUserDto } from './dtos/list-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UserOutput } from '../application/dtos/user-output';
import {
  UserCollectionPresenter,
  UserPresenter,
} from './presenters/user.presenter';

@Controller('users')
export class UsersController {
  @Inject(SignUp.UseCase)
  private signupUseCase: SignUp.UseCase;
  @Inject(SignIn.UseCase)
  private siginUseCase: SignIn.UseCase;
  @Inject(GetUser.UseCase)
  private getUserUseCase: GetUser.UseCase;
  @Inject(ListUser.UseCase)
  private listUserUseCase: ListUser.UseCase;
  @Inject(UpdateUser.UseCase)
  private updateUserUseCase: UpdateUser.UseCase;
  @Inject(UpdatePassword.UseCase)
  private updatePassUseCase: UpdatePassword.UseCase;
  @Inject(DeleteUser.UseCase)
  private deleteUserUseCase: DeleteUser.UseCase;

  static userToResponse(output: UserOutput) {
    return new UserPresenter(output);
  }

  static listUserResponse(output: ListUser.Output) {
    return new UserCollectionPresenter(output);
  }

  @Post()
  async create(@Body() signupDto: SignupDto) {
    const output = await this.signupUseCase.execute(signupDto);
    return UsersController.userToResponse(output);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() signIn: SignInDto) {
    const output = await this.siginUseCase.execute(signIn);
    return UsersController.userToResponse(output);
  }

  @Get()
  async search(@Query() searchParams: ListUserDto) {
    const output = await this.listUserUseCase.execute(searchParams);
    return UsersController.listUserResponse(output);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id });
    return UsersController.userToResponse(output);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    });
    return UsersController.userToResponse(output);
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const output = await this.updatePassUseCase.execute({
      id,
      ...updatePasswordDto,
    });
    return UsersController.userToResponse(output);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.deleteUserUseCase.execute({ id });
  }
}
