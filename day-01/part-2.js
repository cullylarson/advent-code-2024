import {
  compose,
  report,
  map,
  filter,
  toInt,
  split,
  curry,
  reduce,
} from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readInput, unpair } from "./lib.js";
import { rel, sum } from "../lib.js";

const findScore = curry((list, item) => {
  const numAppearances = list.reduce(
    (acc, x) => (x === item ? acc + 1 : acc),
    0,
  );
  return item * numAppearances;
});

then(
  compose(
    report,
    sum,
    ([listA, listB]) => listA.map(findScore(listB)),
    reduce(unpair, [[], []]),
    map(map(toInt(undefined))),
    map(filter(Boolean)),
    map(split(" ")),
  ),
  readInput(rel(import.meta.url, "input.txt")),
);
