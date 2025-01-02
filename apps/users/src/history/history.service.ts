import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createHistoryDto: CreateHistoryDto): Promise<History> {
    const user = await this.userRepository.findOne({
      where: { id: createHistoryDto.userId },
    });

    if (!user) {
      throw new NotFoundException(`User #${createHistoryDto.userId} not found`);
    }

    const history = this.historyRepository.create({
      action: createHistoryDto.action,
      user: user,
    });

    return await this.historyRepository.save(history);
  }

  findAll() {
    return `This action returns all history`;
  }

  findOne(id: number) {
    return `This action returns a #${id} history`;
  }

  update(id: number, updateHistoryDto: UpdateHistoryDto) {
    return `This action updates a #${id} history`;
  }

  remove(id: number) {
    return `This action removes a #${id} history`;
  }
}
