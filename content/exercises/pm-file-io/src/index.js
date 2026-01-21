// File I/O Exercise
//
// Complete these file operations using fs/promises:
//
// 1. readJSON(filepath) - Read and parse a JSON file
//    - Return the parsed object
//    - If file doesn't exist or invalid JSON, return null
//
// 2. writeJSON(filepath, data) - Write data as JSON to file
//    - Format with 2-space indentation
//    - Return true on success, false on failure
//
// 3. appendLine(filepath, line) - Append a line to a file
//    - Add newline character after the line
//    - Create file if it doesn't exist
//    - Return true on success, false on failure
//
// 4. copyFile(src, dest) - Copy a file from src to dest
//    - Return true on success, false on failure

const fs = require('fs/promises');

async function readJSON(filepath) {
  // Your code here
}

async function writeJSON(filepath, data) {
  // Your code here
}

async function appendLine(filepath, line) {
  // Your code here
}

async function copyFile(src, dest) {
  // Your code here
}

module.exports = { readJSON, writeJSON, appendLine, copyFile };
