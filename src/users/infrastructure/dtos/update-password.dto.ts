import { UpdatePassword } from 'src/users/application/usercases/update-password';

export class UpdatePasswordDto implements Omit<UpdatePassword.Input, 'id'> {
  password: string;
  oldPassword: string;
}
