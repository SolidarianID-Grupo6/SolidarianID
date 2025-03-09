export class UserNotFoundError extends Error {
  constructor(message: string = 'User not found') {
    super(message);
    this.name = 'UserNotFoundError';
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}
