export class UnknownError extends Error {
  constructor(message: string = 'Unknown error') {
    super(message);
    this.name = 'UserAlreadyExists';
    Object.setPrototypeOf(this, UnknownError.prototype);
  }
}
