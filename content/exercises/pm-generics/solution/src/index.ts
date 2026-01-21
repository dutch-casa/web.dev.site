// Solution

function identity<T>(value: T): T {
  return value;
}

function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

function reverse<T>(arr: T[]): T[] {
  return [...arr].reverse();
}

function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

interface Pair<T, U> {
  first: T;
  second: U;
}

function makePair<T, U>(first: T, second: U): Pair<T, U> {
  return { first, second };
}

export { identity, first, last, reverse, map, filter, Pair, makePair };
