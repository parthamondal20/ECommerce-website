class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.message = message;
    this.success = statusCode >= 400;
    if (stack) {
      this.stack = stack;
    }
    Error.captureStackTrace(this, this.constructor);
  }
}
export {ApiError};
