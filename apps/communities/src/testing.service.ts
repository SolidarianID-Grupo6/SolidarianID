import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Community } from './community/schemas/community.schema';

@Injectable()
export class TestingService {
    constructor(
        @InjectModel('Community') private readonly noteModel: Model<Community>,
    ) { }
    async resetDatabase(): Promise<void> {
        await this.noteModel.deleteMany({});
    }
}