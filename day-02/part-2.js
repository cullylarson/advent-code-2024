import { compose, report, map, toInt, split, reduce } from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readInput } from "./lib.js";
import { rel } from "../lib.js";

function getIsSafeWithRemoval(levels) {
  const isSafe = getIsSafe(levels);

  if (isSafe) {
    return true;
  }

  for (let i = 0; i < levels.length; i++) {
    const newLevels = [...levels];
    newLevels.splice(i, 1);

    if (getIsSafe(newLevels)) {
      return true;
    }
  }

  return false;
}

function getIsSafe(levels) {
  let direction = undefined;

  for (let i = 1; i < levels.length; i++) {
    const levelThis = levels[i];
    const levelPrev = levels[i - 1];

    const diff = levelThis - levelPrev;

    if (diff === 0) {
      return false;
    }

    if (Math.abs(diff) > 3) {
      return false;
    }

    const thisDirection = diff > 0 ? 1 : -1;

    if (direction === undefined) {
      direction = thisDirection;
    }

    if (direction !== thisDirection) {
      return false;
    }
  }

  return true;
}

then(
  compose(
    report,
    reduce((acc, x) => (x === true ? acc + 1 : acc), 0),
    map(getIsSafeWithRemoval),
    map(map(toInt(undefined))),
    map(split(" ")),
  ),
  readInput(rel(import.meta.url, "input.txt")),
);
