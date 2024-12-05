import { compose, report, map } from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readInput, isValidUpdate, getMiddleValue } from "./lib.js";
import { rel, sum } from "../lib.js";

then(
  compose(report, sum, map(getMiddleValue), ({ orderings, updates }) =>
    updates.filter(isValidUpdate(orderings))
  ),
  readInput(rel(import.meta.url, "input.txt"))
);
