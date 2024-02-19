import { compare, hash } from 'bcryptjs';
import { IHashProvider } from 'src/shared/application/providers/hash-provider';

export class BcryptHashProvider implements IHashProvider {
  async generateHash(payload: string): Promise<string> {
    return hash(payload, 6);
  }

  async compareHash(payload: string, hash: string): Promise<boolean> {
    return compare(payload, hash);
  }
}
