import * as Domain from './domain';
import { Repo } from 'libs/base/infra/Repo';

export interface RepoUsers extends Repo<Domain.User> {
  findByFirstName(firstName: string): Promise<Domain.User>;
  findAllUsers(): Promise<Domain.User[]>;

}
