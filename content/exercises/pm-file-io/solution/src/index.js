// Solution

const fs = require('fs/promises');

async function readJSON(filepath) {
  try {
    const content = await fs.readFile(filepath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

async function writeJSON(filepath, data) {
  try {
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filepath, content, 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

async function appendLine(filepath, line) {
  try {
    await fs.appendFile(filepath, line + '\n', 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

async function copyFile(src, dest) {
  try {
    await fs.copyFile(src, dest);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = { readJSON, writeJSON, appendLine, copyFile };
