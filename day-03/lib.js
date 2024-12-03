import { compose, trim, split } from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readFile } from "../lib.js";

export const readInput = (filename) =>
  then(compose(split("\n"), trim), readFile(filename, { encoding: "utf8" }));

function findStatementString(startIndex, chars, statementString) {
  const charsForStatement = chars.slice(
    startIndex,
    startIndex + statementString.length,
  );

  if (charsForStatement.join("") === statementString) {
    return {
      index: startIndex + statementString.length,
      statement: statementString,
    };
  } else {
    return undefined;
  }
}

function findMul(startIndex, chars) {
  return findStatementString(startIndex, chars, "mul(");
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

function findStatementMul(startIndex, chars) {
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

function findStatementDo(startIndex, chars) {
  const doResult = findStatementString(startIndex, chars, "do()");

  if (doResult) {
    return { index: doResult.index, statement: { type: "do" } };
  }
}

function findStatementDont(startIndex, chars) {
  const dontResult = findStatementString(startIndex, chars, "don't()");

  if (dontResult) {
    return { index: dontResult.index, statement: { type: "don't" } };
  }
}

function findStatement(startIndex, chars) {
  const statementFinders = [
    () => findStatementMul(startIndex, chars),
    () => findStatementDo(startIndex, chars),
    () => findStatementDont(startIndex, chars),
  ];

  for (const statementFinder of statementFinders) {
    const result = statementFinder();

    if (result !== undefined) {
      return result;
    }
  }

  return undefined;
}

export function findStatements(chars) {
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
