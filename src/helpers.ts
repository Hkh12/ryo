type Fn<T, U> = (x: T) => U;
export function memoize<T, U>(fn: Fn<T, U>): Fn<T, U> {
  const cache = new Map<T, U>();
  return (x: T) => {
    if (!cache.has(x))
      cache.set(x, fn(x));
    return cache.get(x);
  };
}

export function flatUnique<T>(nestedArray: T[][]): T[] {
  const output = [];
  for (const array of nestedArray)
    for (const item of array)
      if (!output.includes(item))
        output.push(item);
  return output;
}

function getDeep(object: any, path: string[]) {
  let val = object;
  for (const section of path)
    val = val?.[section];
  return val;
}

export function setDeep(object: any, path: string[], value: any) {
  getDeep(object, path.slice(0, -1))[path[path.length - 1]] = value;
}

export function eq(a: any, b: any): boolean {
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a))
    return a.length === b.length && a.every((x, i) => eq(b[i], x));
  if (typeof a === 'object')
    return eq(Object.entries(a), Object.entries(b));
  return a === b;
}

export function deepClone(object: any): any {
  if (typeof object !== 'object') return object;
  if (Array.isArray(object))
    return [...object].map(deepClone);
  const r = {};
  for (const key in object)
    r[key] = deepClone(object[key]);
  return r;
}
