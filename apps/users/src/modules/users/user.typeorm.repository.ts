@Injectable()
export class RepoUsersTypeORM extends RepoUsers {
  constructor(
    @InjectRepository(Persistence.User)
    private repo: Repository<Persistence.User>,
  ) {
    super();
  }

  findById(id: string): Promise<Domain.User> {
    return this.repo
      .findOneBy({ id: Number(id) })
      .then((user) => UserMapper.toDomain(user));
  }

  findByFirstName(firstName: string): Promise<Domain.User> {
    return this.repo
      .findOne({
        where: { firstName },
      })
      .then((user) => UserMapper.toDomain(user));
  }

  async save(entity: Domain.User): Promise<void> {
    await this.repo.save(UserMapper.toPersistence(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  findAllUsers(): Promise<Domain.User[]> {
    return this.repo
      .find()
      .then((users) => users.map((user) => UserMapper.toDomain(user)));
  }
}
