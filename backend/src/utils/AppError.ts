class AppError extends Error {
  public statusCode: number;
  public status: "fail" | "error";
  public isOperational: boolean;

  /**
   * Creates a new operational error.
   * @param message The error message for the client.
   * @param statusCode The HTTP status code.
   */
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    // Status is 'fail' for 4xx errors, 'error' for 5xx errors.
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // Operational errors are predictable issues (e.g., user input), not bugs.
    this.isOperational = true;

    // Capture the stack trace, excluding the constructor call from it.
    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError };
