// Solution

type Status = "pending" | "success" | "error";

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

type ApiResponse<T> = Result<T> & { status: Status };

interface User {
  id: number;
  name: string;
  email: string;
}

type ReadonlyUser = Readonly<User>;

type PartialUser = Partial<User>;

function unwrapResult<T>(result: Result<T>): T | null {
  if (result.success) {
    return result.data;
  }
  return null;
}

function createSuccess<T>(data: T): Result<T> {
  return { success: true, data };
}

function createError<T>(message: string): Result<T> {
  return { success: false, error: message };
}

export type { Status, Result, ApiResponse, User, ReadonlyUser, PartialUser };
export { unwrapResult, createSuccess, createError };
