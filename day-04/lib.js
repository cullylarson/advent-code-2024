import { compose, trim, split } from "@cullylarson/f";
import { then } from "@cullylarson/p";
import { readFile } from "../lib.js";

export const readInput = (filename) =>
  then(compose(split("\n"), trim), readFile(filename, { encoding: "utf8" }));
