import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { genSalt, hash, compare } from 'bcrypt';

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string): Promise<string> {
    const salt = await genSalt();
    return await hash(data, salt);
  }

  async compare(data: string, hash: string): Promise<boolean> {
    return await compare(data, hash);
  }
}
