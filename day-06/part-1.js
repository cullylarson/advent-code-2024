import { compose, report } from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readInput, step, getIsVisitedChar } from "./lib.js";
import { rel } from "../lib.js";

function stepUntilDone(layout) {
  while (true) {
    const stepInfo = step(layout);

    if (stepInfo.state === "done" || stepInfo.state === "loop") {
      return stepInfo.layout;
    }

    layout = stepInfo.layout;
  }
}

function countVisited(layout) {
  return layout.reduce(
    (acc, row) =>
      acc +
      row.reduce((acc, char) => (getIsVisitedChar(char) ? acc + 1 : acc), 0),
    0
  );
}

then(
  compose(report, countVisited, stepUntilDone),
  readInput(rel(import.meta.url, "input.txt"))
);
