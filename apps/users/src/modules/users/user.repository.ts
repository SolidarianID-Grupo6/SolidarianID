export abstract class RepoUsers extends Repo<Domain.User> {
  // ad hoc
  abstract findByFirstName(firstName: string): Promise<Domain.User>;
  abstract findAllUsers(): Promise<Domain.User[]>;

  // abstract findByLastName(lastName: string): User
  // abstract findByAge(age: number): User
}
