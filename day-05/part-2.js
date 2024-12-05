import { compose, report, map, curry } from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readInput, isValidUpdate, getMiddleValue } from "./lib.js";
import { rel, sum, not } from "../lib.js";

function fixUpdateForOrdering(update, ordering) {
  const [a, b] = ordering;

  const aIndex = update.indexOf(a);
  const bIndex = update.indexOf(b);

  if (aIndex === -1 || bIndex === -1) {
    return update;
  }

  if (aIndex < bIndex) {
    return update;
  }

  const newUpdate = [...update];
  newUpdate[aIndex] = b;
  newUpdate[bIndex] = a;

  return newUpdate;
}

function getAreArraysEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

const fixUpdate = curry((orderings, update) => {
  const result = orderings.reduce(fixUpdateForOrdering, update);

  // We might need to run this a few times since changing the order once might
  // cause some other numbers to be out of order. So, run until there aren't any
  // changes made.
  if (getAreArraysEqual(result, update)) {
    return result;
  } else {
    return fixUpdate(orderings, result);
  }
});

then(
  compose(
    report,
    sum,
    map(getMiddleValue),
    ({ orderings, updates }) => updates.map(fixUpdate(orderings)),
    ({ orderings, updates }) => ({
      orderings,
      updates: updates.filter(not(isValidUpdate(orderings))),
    })
  ),
  readInput(rel(import.meta.url, "input.txt"))
);
