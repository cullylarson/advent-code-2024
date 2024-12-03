import { compose, report, join, split, map } from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readInput } from "./lib.js";
import { rel, sum } from "../lib.js";

function findMul(startIndex, chars) {
  if (
    chars[startIndex] === "m" &&
    chars[startIndex + 1] === "u" &&
    chars[startIndex + 2] === "l" &&
    chars[startIndex + 3] === "("
  ) {
    return { index: startIndex + 4, statement: "mul(" };
  } else {
    return undefined;
  }
}

function findNumber(startIndex, chars) {
  let numStr = "";
  let returnIndex = startIndex;

  for (let i = startIndex; i < chars.length; i++) {
    if (/\d/.test(chars[i])) {
      numStr += chars[i];
      returnIndex++;
    } else {
      break;
    }
  }

  if (numStr === "") {
    return undefined;
  } else {
    return { index: returnIndex, statement: Number(numStr) };
  }
}

function findComma(startIndex, chars) {
  if (chars[startIndex] === ",") {
    return { index: startIndex + 1, statement: "," };
  } else {
    return undefined;
  }
}

function findClosingParen(startIndex, chars) {
  if (chars[startIndex] === ")") {
    return { index: startIndex + 1, statement: ")" };
  } else {
    return undefined;
  }
}

function findStatement(startIndex, chars) {
  const mulResult = findMul(startIndex, chars);

  if (mulResult === undefined) {
    return undefined;
  }

  const firstNumResult = findNumber(mulResult.index, chars);

  if (firstNumResult === undefined) {
    return undefined;
  }

  const commaResult = findComma(firstNumResult.index, chars);

  if (commaResult === undefined) {
    return undefined;
  }

  const secondNumResult = findNumber(commaResult.index, chars);

  if (secondNumResult === undefined) {
    return undefined;
  }

  const closingParenResult = findClosingParen(secondNumResult.index, chars);

  if (closingParenResult === undefined) {
    return undefined;
  }

  return {
    index: closingParenResult.index,
    statement: {
      type: "mul",
      first: firstNumResult.statement,
      second: secondNumResult.statement,
    },
  };
}

function findStatements(chars) {
  const statements = [];

  let i = 0;
  while (i < chars.length) {
    const statementResult = findStatement(i, chars);

    if (statementResult !== undefined) {
      statements.push(statementResult.statement);
      i = statementResult.index;
    } else {
      i++;
    }
  }

  return statements;
}

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
