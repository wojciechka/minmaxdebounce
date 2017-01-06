import { MinMaxDebounce } from "../index";

import { sleep, retrieveCallbacks } from "./helpers";

import { expect } from "chai";

// helper test values
const firstValue = "value01";
const secondValue = "value02";
const thirdValue = "value03";

describe("MinMaxDebounce#minimum", () => {
  it("does not send any event if no events emitted", async () => {
    const result = await retrieveCallbacks(200, async (callback) => {
      const d = new MinMaxDebounce<any>({minimumDelay: 50, callback: callback});
    });
    expect(result.length).to.equal(0);
  });

  it("sends a single event if single emitted", async () => {
    const result = await retrieveCallbacks(200, async (callback) => {
      const d = new MinMaxDebounce<any>({minimumDelay: 50, callback: callback});
      d.emit(firstValue);
    });
    expect(result.length).to.equal(1);
    expect(result[0].value).to.equal(firstValue);
  });

  it("sends a single event if multiple events emitted instantly", async () => {
    const result = await retrieveCallbacks(200, async (callback) => {
      const d = new MinMaxDebounce<any>({minimumDelay: 50, callback: callback});
      d.emit(firstValue);
      d.emit(secondValue);
      d.emit(thirdValue);
    });
    expect(result.length).to.equal(1);
    expect(result[0].value).to.equal(thirdValue);
  });

  it("sends a two events if multiple events emitted with a delay", async () => {
    const result = await retrieveCallbacks(200, async (callback) => {
      const d = new MinMaxDebounce<any>({minimumDelay: 50, callback: callback});
      d.emit(firstValue);
      d.emit(secondValue);
      await sleep(100);
      d.emit(thirdValue);
    });
    expect(result.length).to.equal(2);
    expect(result[0].value).to.equal(secondValue);
    expect(result[1].value).to.equal(thirdValue);
  });

  it("sends single if events sent continuously", async () => {
    const result = await retrieveCallbacks(500, async (callback) => {
      let i;
      const d = new MinMaxDebounce<any>({minimumDelay: 100, callback: callback});
      for (i = 0 ; i < 10 ; i++) {
        d.emit(firstValue);
        await sleep(30);
      }
    });
    expect(result.length).to.equal(1);
  });
});
