import { Controller, Post, HttpCode } from '@nestjs/common';
import { TestingService } from './testing.service';
@Controller('api/testing')
export class TestingController {
    constructor(private readonly testingService: TestingService) { }
    @Post('reset')
    @HttpCode(204)
    async resetDatabase() {
        await this.testingService.resetDatabase();
    }
}
