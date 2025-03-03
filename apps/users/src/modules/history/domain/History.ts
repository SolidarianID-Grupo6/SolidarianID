import { AggregateRoot } from 'libs/base/domain/AggregateRoot';
import { UniqueEntityID } from 'libs/base/domain/UniqueEntityID';
import { User } from '../../users/persistence/user.entity';

export interface HistoryProps {
  id: UniqueEntityID;
  action: string;
  user: User;
  eventDate: Date;
  data: Object;
}

export class History extends AggregateRoot<HistoryProps> {
  protected constructor(props: HistoryProps) {
    super(props);
  }

  get id(): UniqueEntityID {
    return this.props.id;
  }

  get action(): string {
    return this.props.action;
  }

  get user(): User {
    return this.props.user;
  }

  get eventDate(): Date {
    return this.props.eventDate;
  }

  get data(): Object {
    return this.props.data;
  }

  set id(value: UniqueEntityID) {
    this.props.id = value;
  }

  set action(value: string) {
    this.props.action = value;
  }

  set user(value: User) {
    this.props.user = value;
  }

  set eventDate(value: Date) {
    this.props.eventDate = value;
  }

  set data(value: Object) {
    this.props.data = value;
  }

  public static create(props: HistoryProps): History {
    return new History(props);
  }
}
