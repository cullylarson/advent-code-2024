import { compose, report, join, split, map } from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readInput } from "./lib.js";
import { rel } from "../lib.js";

const MATCHES = ["MAS", "SAM"];

const searchLocations = [
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [2, 0],
    [1, 1],
    [0, 2],
  ],
];

function findSolution(location, matrix) {
  const { x, y } = location;

  const lineOne = searchLocations[0]
    .map(([dx, dy]) => matrix[y + dy]?.[x + dx])
    .filter(Boolean)
    .join("");

  const lineTwo = searchLocations[1]
    .map(([dx, dy]) => matrix[y + dy]?.[x + dx])
    .filter(Boolean)
    .join("");

  if (MATCHES.includes(lineOne) && MATCHES.includes(lineTwo)) {
    return 1;
  } else {
    return 0;
  }
}

function findSolutions(matrix) {
  let numSolutions = 0;

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      numSolutions += findSolution({ x, y }, matrix);
    }
  }

  return numSolutions;
}

then(
  compose(report, findSolutions, map(split(""))),
  readInput(rel(import.meta.url, "input.txt"))
);
