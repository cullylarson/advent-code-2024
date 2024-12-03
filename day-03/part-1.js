import { compose, report, join, split, map } from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readInput, findStatements } from "./lib.js";
import { rel, sum } from "../lib.js";

function applyStatement(statement) {
  if (statement.type === "mul") {
    return statement.first * statement.second;
  } else {
    return 0;
  }
}

then(
  compose(
    report,
    sum,
    map(applyStatement),
    findStatements,
    split(""),
    join(""),
  ),
  readInput(rel(import.meta.url, "input.txt")),
);
