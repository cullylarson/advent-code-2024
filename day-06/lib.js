import { compose, trim, split, map } from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readFile } from "../lib.js";

export const readInput = (filename) =>
  then(
    compose(map(split("")), split("\n"), trim),
    readFile(filename, { encoding: "utf8" })
  );

const guardDirections = [
  { char: "^", visitedChar: "w", stepMutation: { x: 0, y: -1 } },
  { char: ">", visitedChar: "d", stepMutation: { x: 1, y: 0 } },
  { char: "v", visitedChar: "x", stepMutation: { x: 0, y: 1 } },
  { char: "<", visitedChar: "a", stepMutation: { x: -1, y: 0 } },
];

const guardDirectionChars = guardDirections.map(({ char }) => char);
const visitedChars = guardDirections.map(({ visitedChar }) => visitedChar);

export const OBSTACLE_CHAR = "#";
export const OPEN_CHAR = ".";

export function getIsVisitedChar(char) {
  return visitedChars.includes(char);
}

function findGuard(layout) {
  for (let y = 0; y < layout.length; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      const guard = guardDirections.find(({ char }) => char === layout[y][x]);

      if (guard) {
        return { x, y, ...guard };
      }
    }
  }
}

function getTurnGuardCharacter(currentCharacter) {
  const currentIndex = guardDirectionChars.indexOf(currentCharacter);

  return guardDirectionChars[(currentIndex + 1) % guardDirectionChars.length];
}

export function step(layout) {
  const guard = findGuard(layout);

  if (!guard) {
    throw Error("Guard not found");
  }

  const nextCharacter =
    layout[guard.y + guard.stepMutation.y]?.[guard.x + guard.stepMutation.x];

  // off the board
  if (!nextCharacter) {
    layout[guard.y][guard.x] = guard.visitedChar;
    return { layout, state: "done" };
  } else if (nextCharacter === guard.visitedChar) {
    return { layout, state: "loop" };
  } else if (nextCharacter === OBSTACLE_CHAR) {
    layout[guard.y][guard.x] = getTurnGuardCharacter(guard.char);
    return { layout, state: "turned" };
  } else {
    layout[guard.y][guard.x] = guard.visitedChar;
    layout[guard.y + guard.stepMutation.y][guard.x + guard.stepMutation.x] =
      guard.char;
    return { layout, state: "moved" };
  }
}
