export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication error: invalid credentials') {
    super(message);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
