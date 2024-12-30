import { Controller, Get, Render } from '@nestjs/common';
import { FrontEndService } from './front-end.service';

@Controller()
export class FrontEndController {
  constructor(private readonly frontEndService: FrontEndService) {}

  @Get()
  @Render('index.hbs')
  root() {
    return { message: 'Hello world!' };
  }
}
