import { spawn } from "child_process";
import cases from "jest-in-case";
import { jest } from "@jest/globals";

jest.setTimeout(15000);

const parts = {
  "day 1, part 1": {
    part: "day-01/part-1.js",
    answer: "3574690",
  },
  "day 1, part 2": {
    part: "day-01/part-2.js",
    answer: "22565391",
  },
  "day 2, part 1": {
    part: "day-02/part-1.js",
    answer: "479",
  },
  "day 2, part 2": {
    part: "day-02/part-2.js",
    answer: "",
  },
};

const run = async (scriptPath) => {
  return new Promise((resolve, reject) => {
    let result = "";

    const prc = spawn("node", [scriptPath], {
      env: process.env,
    });

    prc.stdout.setEncoding("utf8");

    prc.stdout.on("data", (data) => {
      result += data.toString();
    });

    prc.on("error", (err) => {
      reject(err);
    });

    prc.on("exit", () => {
      resolve(result);
    });
  });
};

cases(
  "days",
  async ({ part, answer }) => {
    const result = (await run(part)).trim();

    expect(result).toBe(answer);
  },
  parts,
);
