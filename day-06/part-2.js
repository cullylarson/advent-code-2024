import { compose, report } from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readInput, step, OPEN_CHAR, OBSTACLE_CHAR } from "./lib.js";
import { rel } from "../lib.js";

function getIsLoop(layout) {
  while (true) {
    const stepInfo = step(layout, true);

    if (stepInfo.state === "loop") {
      return true;
    } else if (stepInfo.state === "done") {
      return false;
    }

    layout = stepInfo.layout;
  }
}

function lookForLoops(layout) {
  let numLoops = 0;

  for (let y = 0; y < layout.length; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      console.log({ x, y }); //stub
      const character = layout[y][x];

      if (character !== OPEN_CHAR) {
        continue;
      }

      const layoutCopy = layout.map((row) => row.slice());
      layoutCopy[y][x] = OBSTACLE_CHAR;

      if (getIsLoop(layoutCopy)) {
        numLoops++;
      }
    }
  }

  return numLoops;
}

then(
  compose(report, lookForLoops),
  readInput(rel(import.meta.url, "input.txt"))
);
