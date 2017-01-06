/// <reference path="../node_modules/@types/node/index.d.ts" />

import { MinMaxDebounceCallback, MinMaxDebounceEvent } from "../index";

export function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export interface RetrieveCallbacksCallback { (callback: MinMaxDebounceCallback<any>): Promise<void> };

export async function retrieveCallbacks(
  ms: number, callback: RetrieveCallbacksCallback
): Promise<Array<MinMaxDebounceEvent<any>>> {
  let log: Array<MinMaxDebounceEvent<any>> = [];
  callback((event: MinMaxDebounceEvent<any>) => {
    log.push(event);
  });
  await sleep(ms);
  return log;
}
