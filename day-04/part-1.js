import { compose, report, join, split, map } from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readInput } from "./lib.js";
import { rel } from "../lib.js";

const SEARCH_CHARS = "XMAS".split("");

const searchMutations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

function findSolution(direction, foundChars, location, matrix) {
  const { x, y } = location;

  let numSolutions = 0;

  const lookingFor = SEARCH_CHARS[foundChars.length];

  if (matrix[y]?.[x] !== lookingFor) {
    return 0;
  } else if (foundChars.length === SEARCH_CHARS.length - 1) {
    return 1;
  }

  const [dx, dy] = direction;
  const newX = x + dx;
  const newY = y + dy;

  const newLocation = { x: newX, y: newY };

  numSolutions += findSolution(
    direction,
    [...foundChars, lookingFor],
    newLocation,
    matrix
  );

  return numSolutions;
}

function findSolutions(matrix) {
  let numSolutions = 0;

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      for (const direction of searchMutations) {
        numSolutions += findSolution(direction, [], { x, y }, matrix);
      }
    }
  }

  return numSolutions;
}

then(
  compose(report, findSolutions, map(split(""))),
  readInput(rel(import.meta.url, "input.txt"))
);
