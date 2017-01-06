/// <reference path="node_modules/@types/node/index.d.ts" />

import { MinMaxDebounce } from "./min_max_debounce";

import { createInterface } from "readline";

const t = new MinMaxDebounce<string>({
  minimumDelay: 1000,
  maximumDelay: 3000,
  callback: (event) => {
    console.log("EVENT MORE=", event.hasMore, "MAX=",event.isMaximumDelay, "=", event.value);
  }
});

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", (line) => {
  t.emit(line);
});
