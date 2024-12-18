import { Controller, Get } from '@nestjs/common';
import { FrontEndService } from './front-end.service';

@Controller()
export class FrontEndController {
  constructor(private readonly frontEndService: FrontEndService) {}

  @Get()
  getHello(): string {
    return this.frontEndService.getHello();
  }
}
