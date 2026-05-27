export class ApiError extends Error {
  constructor(message, status, code, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data; 
  }
}

export class ValidationError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = "ValidationError";
    this.status = status;
    this.errors = errors;
  }
}