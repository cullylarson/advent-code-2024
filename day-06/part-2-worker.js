import {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} from "node:worker_threads";
import { compose, report } from "@cullylarson/f";
import { nConcurrent, then } from "@cullylarson/p";
import { readInput, step, OPEN_CHAR, OBSTACLE_CHAR } from "./lib.js";
import { rel } from "../lib.js";

const __filename = new URL(import.meta.url).pathname;

const oneMinuteMs = 60 * 1000;

function getIsLoop({ layout, x, y }) {
  console.log("START", { x, y });

  const start = Date.now();
  let steps = 0;

  while (true) {
    const now = Date.now();
    const elapsed = now - start;

    if (elapsed > oneMinuteMs) {
      console.log("TIMEOUT", { x, y });
    }

    const stepInfo = step(layout);
    steps++;

    if (step > 500) {
      console.log("TOO MANY STEPS", { x, y });
    }

    if (stepInfo.state === "loop") {
      return true;
    } else if (stepInfo.state === "done") {
      return false;
    }

    layout = stepInfo.layout;
  }
}

async function getIsLoopWorker({ layout, x, y }) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename, {
      workerData: { layout, x, y },
    });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

const getIsLoopWorkerLimited = nConcurrent(10, getIsLoopWorker);

async function lookForLoops(layout) {
  let getIsLoopPromises = [];
  const results = [];

  /*
  for (let x = 0; x < layout[0].length; x++) {
    const y = 4;
    layout[y][x] = OBSTACLE_CHAR;
    console.log(
      "ASDF",
      await getIsLoopWorker({ layout, x, y }).catch((err) => {
        console.error("ERROR:", err);
        return false;
      })
    );
  }

  return 0;
    */

  for (let y = 4; y < layout.length; y++) {
    for (let x = 5; x < layout[y].length; x++) {
      const character = layout[y][x];

      if (character !== OPEN_CHAR) {
        continue;
      }

      const layoutCopy = layout.map((row) => row.slice());
      layoutCopy[y][x] = OBSTACLE_CHAR;

      getIsLoopPromises.push(
        getIsLoopWorker({ layout: layoutCopy, x, y }).catch((err) => {
          console.error("ERROR:", err);
          return false;
        })
      );

      if (getIsLoopPromises.length === 10) {
        const thisResults = await Promise.all(getIsLoopPromises);
        results.push(...thisResults);
        getIsLoopPromises = [];
      }
    }
  }

  return results.filter((isLoop) => isLoop).length;
}

if (isMainThread) {
  then(
    compose(then(report), lookForLoops),
    readInput(rel(import.meta.url, "input.txt"))
  );
} else {
  parentPort.postMessage(getIsLoop(workerData));
}
