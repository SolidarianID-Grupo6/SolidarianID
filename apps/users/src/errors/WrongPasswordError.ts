export class WrongPasswordError extends Error {
  constructor(message: string = 'Wrong password') {
    super(message);
    this.name = 'WrongPasswordError';
    Object.setPrototypeOf(this, WrongPasswordError.prototype);
  }
}
