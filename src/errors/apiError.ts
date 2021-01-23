export default class ApplicationError extends Error {
  public message: string = 'ApplicationError';

  public status: number = 500;

  constructor(message?: string, status?: number, stack?: string) {
    super();
    if (message != null) {
      this.message = message;
    }
    if (status != null) {
      this.status = status;
    }
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
