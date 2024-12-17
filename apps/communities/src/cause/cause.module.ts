import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CauseService } from './cause.service';
import { CauseController } from './cause.controller';
import { Cause, CauseSchema } from './schemas/cause.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cause.name, schema: CauseSchema }])],
  controllers: [CauseController],
  providers: [CauseService],
})
export class CauseModule {}
