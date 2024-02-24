import { SignUp } from 'src/users/application/usercases/signup';

export class SignupDto implements SignUp.Input {
  name: string;
  email: string;
  password: string;
}
