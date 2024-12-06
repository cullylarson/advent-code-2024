import { compose, report, map } from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readInput } from "./lib.js";
import { rel } from "../lib.js";

const guardDirections = [
  { char: "^", stepMutation: { x: 0, y: -1 } },
  { char: ">", stepMutation: { x: 1, y: 0 } },
  { char: "v", stepMutation: { x: 0, y: 1 } },
  { char: "<", stepMutation: { x: -1, y: 0 } },
];

const guardDirectionChars = guardDirections.map(({ char }) => char);

const VISITED_CHAR = "X";
const OBSTACLE_CHAR = "#";

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

function step(layout) {
  const guard = findGuard(layout);

  if (!guard) {
    throw Error("Guard not found");
  }

  const nextCharacter =
    layout[guard.y + guard.stepMutation.y]?.[guard.x + guard.stepMutation.x];

  // off the board
  if (!nextCharacter) {
    layout[guard.y][guard.x] = VISITED_CHAR;
    return { layout, state: "done" };
  } else if (nextCharacter === OBSTACLE_CHAR) {
    layout[guard.y][guard.x] = getTurnGuardCharacter(guard.char);
    return { layout, state: "turned" };
  } else {
    layout[guard.y][guard.x] = VISITED_CHAR;
    layout[guard.y + guard.stepMutation.y][guard.x + guard.stepMutation.x] =
      guard.char;
    return { layout, state: "moved" };
  }
}

function stepUntilDone(layout) {
  while (true) {
    const stepInfo = step(layout);

    if (stepInfo.state === "done") {
      return stepInfo.layout;
    }

    layout = stepInfo.layout;
  }
}

function countVisited(layout) {
  return layout.reduce(
    (acc, row) =>
      acc +
      row.reduce((acc, char) => (char === VISITED_CHAR ? acc + 1 : acc), 0),
    0
  );
}

then(
  compose(report, countVisited, stepUntilDone),
  readInput(rel(import.meta.url, "input.txt"))
);
