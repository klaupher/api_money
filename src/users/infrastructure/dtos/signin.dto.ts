import { SignIn } from 'src/users/application/usercases/signin';

export class SignInDto implements SignIn.Input {
  name: string;
  email: string;
  password: string;
}
