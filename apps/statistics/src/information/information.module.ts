import { Module } from '@nestjs/common';
import { InformationController } from './information.controller';
import { InformationService } from './information.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunityStats, CommunityStatsSchema } from './schemas/Information.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CommunityStats.name, schema: CommunityStatsSchema }]),

  ],
  controllers: [InformationController],
  providers: [InformationService],
})
export class InformationModule {}
