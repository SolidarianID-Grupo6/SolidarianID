import { Module } from '@nestjs/common';
import { FrontEndController } from './front-end.controller';
import { FrontEndService } from './front-end.service';

@Module({
  imports: [],
  controllers: [FrontEndController],
  providers: [FrontEndService],
})
export class FrontEndModule {}
