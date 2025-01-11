import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  public abstract hash(data: string): Promise<string>;
  public abstract compare(data: string, hash: string): Promise<boolean>;
}
