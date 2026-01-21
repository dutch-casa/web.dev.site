// Solution

function createPerson(name, age) {
  return {
    name,
    age,
    greet() {
      return `Hello, my name is ${this.name}`;
    }
  };
}

function getProperty(obj, path) {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

function mergeObjects(obj1, obj2) {
  return { ...obj1, ...obj2 };
}

function countProperties(obj) {
  return Object.keys(obj).length;
}

module.exports = { createPerson, getProperty, mergeObjects, countProperties };
