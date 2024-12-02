import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs";
import { promisify, inspect } from "util";
import { curry } from "@cullylarson/f";

export const dir = (url) => {
  const filename = fileURLToPath(url);
  return dirname(filename);
};

export const rel = (url, filename) => {
  return resolve(dir(url), filename);
};

export const readFile = promisify(fs.readFile);

export const add = (a, b) => a + b;

export const max = (xs) => Math.max(...xs);

export const min = (xs) => Math.min(...xs);

export const sum = (xs) => xs.reduce(add, 0);

export const mult = (xs) => xs.reduce((a, b) => a * b, 1);

export const length = (xs) => xs.length;

export const sort = curry((compare, xs) => [...xs].sort(compare));

export const extraReport = (x) =>
  console.log(inspect(x, { showHidden: false, depth: null, colors: true }));
