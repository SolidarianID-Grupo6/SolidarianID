import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getHello(): string {
    return this.usersService.getHello();
  }

  @EventPattern('test-event')
  async handleEvent(data: string) {
    console.log('Event received');
    console.log(data);
  }
}
