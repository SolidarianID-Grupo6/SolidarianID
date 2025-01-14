import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

}
