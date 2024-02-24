import { UpdateUser } from 'src/users/application/usercases/update-user';

export class UpdateUserDto implements Omit<UpdateUser.Input, 'id'> {
  name: string;
}
