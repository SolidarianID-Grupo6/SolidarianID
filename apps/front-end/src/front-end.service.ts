import { Injectable } from '@nestjs/common';

@Injectable()
export class FrontEndService {
  getHello(): string {
    return 'Hello, this is the front-end!';
  }
}
