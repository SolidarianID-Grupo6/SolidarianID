export class RefreshTokenNotValidError extends Error {
    constructor(message: string = 'Refresh token is not valid.') {
      super(message);
      this.name = 'RefreshTokenNotValidError';
      Object.setPrototypeOf(this, RefreshTokenNotValidError.prototype);
    }
  }
  