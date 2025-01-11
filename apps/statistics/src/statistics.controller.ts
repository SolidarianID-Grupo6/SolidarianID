import { Controller, Get, Param } from '@nestjs/common';
import { InformationService } from './information/information.service';

@Controller('/statistics')
export class StatisticsController {
  constructor(private readonly informationService: InformationService) { }

  @Get('getCommunitiesByODS')
  async getCommunitiesByODS() {
    return this.informationService.getCommunitiesByODS();
  }

  @Get('getCausesByODS')
  async getCausesByODS() {
    return this.informationService.getCausesByODS();
  }

  @Get('getSupportByODS')
  async getSupportByODS() {
    return this.informationService.getSupportByODS();
  }

  @Get('getSupportByCommunity')
  async getSupportByCommunity() {
    return this.informationService.getSupportByCommunity();
  }

  @Get('getProgressByCommunity')
  async getProgressByCommunity() {
    return this.informationService.getActionProgressByCommunity();
  }

}
