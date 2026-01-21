// Error Handling Exercise
//
// Complete the following functions:
//
// 1. divide(a, b) - Divide a by b
//    - Throw an Error with message "Cannot divide by zero" if b is 0
//
// 2. parseJSON(str) - Parse a JSON string
//    - Return the parsed object if valid
//    - Return null if the JSON is invalid (don't let the error propagate)
//
// 3. validateUser(user) - Validate a user object
//    - Throw Error "Name is required" if user.name is missing or empty
//    - Throw Error "Age must be positive" if user.age <= 0
//    - Throw Error "Email is required" if user.email is missing or empty
//    - Return true if valid
//
// 4. safeDivide(a, b) - Safe division that never throws
//    - Return { success: true, value: result } on success
//    - Return { success: false, error: "error message" } on failure

function divide(a, b) {
  // Your code here
}

function parseJSON(str) {
  // Your code here
}

function validateUser(user) {
  // Your code here
}

function safeDivide(a, b) {
  // Your code here
}

module.exports = { divide, parseJSON, validateUser, safeDivide };
