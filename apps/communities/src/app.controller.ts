import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

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

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-event')
  async testEvent() {
    this.client.emit('test-event', 'Test event');
    console.log('Event sent');
    return 'Event sent';
  }
}
