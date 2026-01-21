// Solution

function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

function validateUser(user) {
  if (!user.name || user.name.trim() === '') {
    throw new Error("Name is required");
  }
  if (user.age <= 0) {
    throw new Error("Age must be positive");
  }
  if (!user.email || user.email.trim() === '') {
    throw new Error("Email is required");
  }
  return true;
}

function safeDivide(a, b) {
  try {
    if (b === 0) {
      throw new Error("Cannot divide by zero");
    }
    return { success: true, value: a / b };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

module.exports = { divide, parseJSON, validateUser, safeDivide };
