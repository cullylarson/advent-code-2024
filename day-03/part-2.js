import { compose, report, join, split } from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readInput, findStatements } from "./lib.js";
import { rel, sum } from "../lib.js";

function applyStatements(statements) {
  let lastCondition = undefined;

  const results = [];

  for (const statement of statements) {
    if (statement.type === "mul") {
      if (lastCondition === undefined || lastCondition?.type === "do") {
        results.push(statement.first * statement.second);
      }
    } else {
      lastCondition = statement;
    }
  }

  return results;
}

then(
  compose(report, sum, applyStatements, findStatements, split(""), join("")),
  readInput(rel(import.meta.url, "input.txt")),
);
