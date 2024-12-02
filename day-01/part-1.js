import {
  compose,
  report,
  map,
  filter,
  toInt,
  split,
  reduce,
} from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readInput, unpair } from "./lib.js";
import { rel, sort, sum } from "../lib.js";

function pair([listA, listB]) {
  return listA.map((itemA, index) => [itemA, listB[index]]);
}

then(
  compose(
    report,
    sum,
    map(([a, b]) => Math.abs(a - b)),
    pair,
    map(sort((a, b) => a - b)),
    reduce(unpair, [[], []]),
    map(map(toInt(undefined))),
    map(filter(Boolean)),
    map(split(" ")),
  ),
  readInput(rel(import.meta.url, "input.txt")),
);
