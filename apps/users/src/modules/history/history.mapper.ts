import * as Domain from './domain';
import * as Persistence from './persistence';
import { UniqueEntityID } from 'libs/base/domain/UniqueEntityID';

export class HistoryMapper {
  static toDomain(raw: Persistence.History): Domain.History {
    return Domain.History.create({
      ...raw,
      id: new UniqueEntityID(raw.id),
    });
  }

  static toPersistence(history: Domain.History): Persistence.History {
    return {
      id: history.id.toString(),
      action: history.action,
      user: history.user,
      eventDate: history.eventDate,
      data: history.data,
    };
  }
}
