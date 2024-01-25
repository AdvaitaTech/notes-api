export class RouteError extends Error {
  constructor(message: string, public code: number) {
    super(message);
  }
}

export class TokenError extends RouteError {
  constructor(message: string) {
    super(message, 401);
    this.name = "TokenError";
  }
}

export class AuthError extends RouteError {
  constructor(message: string) {
    super(message, 401);
    this.name = "AuthError";
  }
}

export class ForbiddenError extends RouteError {
  constructor(message: string) {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class BadDataError extends RouteError {
  constructor(message: string) {
    super(message, 400);
    this.name = "BadDataError";
  }
}

export class InternalError extends RouteError {
  constructor(message: string) {
    super(message, 500);
    this.name = "InternalError";
  }
}

export class ValidationError extends RouteError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export class BuildError extends RouteError {
  constructor(message: string) {
    super(message, 400);
    this.name = "BuildError";
  }
}

export class NotFoundError extends RouteError {
  constructor(message: string) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}
