// Advanced TypeScript Types Exercise
//
// Complete these type definitions and functions:
//
// 1. Define a union type Status = "pending" | "success" | "error"
//
// 2. Define a type Result<T> that is either:
//    { success: true, data: T } or { success: false, error: string }
//
// 3. Define ApiResponse<T> using the Result type and add a 'status' field of type Status
//
// 4. Define a ReadonlyUser type using Readonly<> utility type on User
//    User has: id: number, name: string, email: string
//
// 5. Define a PartialUser type using Partial<> utility type on User
//
// 6. Implement unwrapResult<T>(result: Result<T>): T | null
//    Returns data if success, null if error
//
// 7. Implement createSuccess<T>(data: T): Result<T>
//    Creates a successful Result
//
// 8. Implement createError<T>(message: string): Result<T>
//    Creates an error Result

// Define your types here:


// Define User interface:


// Implement functions here:

function unwrapResult<T>(result: Result<T>): T | null {
  // Your code here
}

function createSuccess<T>(data: T): Result<T> {
  // Your code here
}

function createError<T>(message: string): Result<T> {
  // Your code here
}

export { unwrapResult, createSuccess, createError };
