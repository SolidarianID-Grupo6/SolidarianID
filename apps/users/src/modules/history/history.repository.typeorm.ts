import { InjectRepository } from '@nestjs/typeorm';
import * as Domain from './domain';
import * as Persistence from './persistence';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { HistoryMapper } from './history.mapper';
import { Either, left, right } from 'libs/base/logic/Result';
import { UserNotFoundError } from './errors/UserNotFoundError';
import { CommunityEvent } from 'libs/events/enums/community.events.enum';
import { HistoryRepo } from './history.repository';

export class HistoryRepoTypeORM implements HistoryRepo {
  public constructor(
    @InjectRepository(Persistence.History)
    private readonly historyRepository: Repository<Persistence.History>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public exists(t: Domain.History): Promise<boolean> {
    return this.historyRepository
      .findOne({
        where: { id: t.id.toString() },
      })
      .then((history) => !!history);
  }

  public async save(t: Domain.History): Promise<Domain.History> {
    const historyPers = await this.historyRepository.save(
      HistoryMapper.toPersistence(t),
    );
    return HistoryMapper.toDomain(historyPers);
  }

  public async findAll(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<Either<UserNotFoundError, Domain.History[]>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return left(new UserNotFoundError(`User with ID ${userId} not found`));
    }

    const histories: Persistence.History[] = await this.historyRepository.find({
      where: { user: user },
      take: limit,
      skip: offset,
    });

    return right(histories.map((history) => HistoryMapper.toDomain(history)));
  }

  public async userExists(userId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    return !!user;
  }

  public async registerHistoryRecord(
    event: CommunityEvent,
    userId: string,
    dto: any,
  ): Promise<Either<UserNotFoundError, Domain.History>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return left(new UserNotFoundError(`User with ID ${userId} not found`));
    }

    const history = this.historyRepository.create({
      action: event,
      user,
      data: dto,
      eventDate: new Date(),
    });

    const historyPers = await this.historyRepository.save(history);

    return right(HistoryMapper.toDomain(historyPers));
  }
}
