export class Result<T> {
  private readonly _isSuccess: boolean;
  private readonly _errorValue: string;
  private readonly _value: T;
  protected constructor({
    isSuccess,
    errorValue,
    value,
  }: {
    isSuccess: boolean;
    errorValue?: string;
    value?: T;
  }) {
    if (isSuccess && errorValue) {
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain an error',
      );
    }
    if (!isSuccess && !errorValue) {
      throw new Error(
        'InvalidOperation: A failing result needs to contain an error message',
      );
    }
    this._isSuccess = isSuccess;
    this._errorValue = errorValue;
    this._value = value;
  }
  // propiedades: success, failure, errorValue, value
  get success(): boolean {
    return this._isSuccess;
  }

  get value(): T {
    return this._value;
  }

  get errorValue(): string {
    return this._errorValue;
  }

  // ...
  static ok<U>(value?: U): Result<U> {
    return new Result<U>({ isSuccess: true, value });
  }
  static fail<U>(errorValue: string): Result<U> {
    return new Result<U>({ isSuccess: false, errorValue });
  }
}
