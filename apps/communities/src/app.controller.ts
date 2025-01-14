import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { Auth } from '@app/iam/authentication/decorators/auth.decorator';
import { AuthType } from '@app/iam/authentication/enums/auth-type.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Client({
    transport: Transport.NATS,
    options: {
      servers: ['nats://nats:4222'],
    },
  })
  client: ClientProxy;

  @Auth(AuthType.None)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Auth(AuthType.None)
  @Get('test-event')
  async testEvent() {
    this.client.emit('test-event', 'Test event');
    console.log('Event sent');
    return 'Event sent';
  }
}
