import { compose, trim, split, map, toInt, curry } from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readFile } from "../lib.js";

function getStructuredInput([orderingsRaw, updatesRaw]) {
  return {
    orderings: compose(
      map(map(toInt(undefined))),
      map(split("|"))
    )(orderingsRaw),
    updates: compose(map(map(toInt(undefined))), map(split(",")))(updatesRaw),
  };
}

export const readInput = (filename) =>
  then(
    compose(getStructuredInput, map(split("\n")), split("\n\n"), trim),
    readFile(filename, { encoding: "utf8" })
  );

function isValidUpdateForOrdering(ordering, update) {
  const [a, b] = ordering;

  const aIndex = update.indexOf(a);
  const bIndex = update.indexOf(b);

  // if either number isn't there, this order doesn't count against this update
  if (aIndex === -1 || bIndex === -1) {
    return true;
  } else {
    return aIndex < bIndex;
  }
}

export const isValidUpdate = curry((orderings, update) => {
  return orderings.every((ordering) =>
    isValidUpdateForOrdering(ordering, update)
  );
});

export function getMiddleValue(update) {
  const middleIndex = Math.floor((update.length - 1) / 2);

  return update[middleIndex];
}
