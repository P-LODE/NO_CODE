import { isArray, isElement, isFunction, isUndefined, keys } from "underscore";

const obj = {};
const isObject = (val: any): val is any =>
  val && !Array.isArray(val) && typeof val === "object";

const reEscapeChar = /\\(\\)?/g;
const rePropName =
  /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

const castPath = (value: string | string[], object: any) => {
  if (isArray(value)) return value;

  return object.hasOwnProperty(value) ? [value] : stringToPath(value);
};

export const stringToPath = (str: string) => {
  const result = [];
  if (str.charCodeAt(0) === 46) result.push("");

  str.replace(rePropName, (match: string, number, quote, subString) => {
    result.push(
      quote ? subString.replace(reEscapeChar, "$1") : number || match
    );
    return "";
  });
  return result;
};

export const get = (object: any, path: string | string[], def?: any) => {
  const paths = castPath(path, object);

  let index = 0;
  for (; index < paths.length && object != null; index++) {
    object = object[paths[index]];
  }

  return (index === paths.length ? object : undefined) ?? def;
};

export const set = (
  object: any,
  path: string | string[],
  value: any
): boolean => {
  if (!isObject(object)) return false;
  const paths = castPath(path, object);
  const length = paths.length;

  switch (length) {
    case 0:
      return false;

    case 1:
      object[paths[0]] = value;
      return true;

    default:
      const parentPath = paths.slice(0, -1);
      const lastKey = paths[length - 1];
      const parent = get(object, parentPath);

      if (parent) {
        if (Array.isArray(parent)) {
          const idx = +lastKey;
          if (!isNaN(idx)) {
            parent[idx] = value;
            return true;
          }
        } else if (isObject(parent)) {
          (parent as any)[lastKey] = value;
          return true;
        }
      }
      return false;
  }
};

export const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

export const isBultInMethod = (obj: any, key: string) => isFunction(obj[key]);

export const normalizeKey = (obj: any, key: string) =>
  isBultInMethod(obj, key) ? `_${key}` : key;

export const wait = (mls: number = 0) =>
  new Promise((res) => setTimeout(res, mls));

export const isDef = (value: any) => typeof value !== "undefined";

export const hasWin = () => typeof window !== "undefined";

export const getGlobal = () =>
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
      ? window
      : (globalThis as any);

export const toLowerCase = (str: string) => (str || "").toLowerCase();

const elProt = hasWin() ? window.Element.prototype : {};
