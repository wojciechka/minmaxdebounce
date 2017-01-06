import { MinMaxDebounce } from "../min_max_debounce";

import { sleep, retrieveCallbacks } from "./helpers";

import { expect } from "chai";

// helper test values
const firstValue = "value01";
const secondValue = "value02";
const thirdValue = "value03";
const fourthValue = "value04";
const fifthValue = "value05";
const sixthValue = "value06";

describe("MinMaxDebounce#minimum_maximum", () => {
  it("sends a single event if single emitted", async () => {
    const result = await retrieveCallbacks(250, async (callback) => {
      const d = new MinMaxDebounce<any>({minimumDelay: 50, maximumDelay: 150, callback: callback});
      d.emit(firstValue);
    });
    expect(result.length).to.equal(1);
    expect(result[0].hasMore).to.equal(false);
    expect(result[0].isMaximumDelay).to.equal(false);
    expect(result[0].value).to.equal(firstValue);
  });

  it("sends maximum delay event when sent too many events continuously", async () => {
    const result = await retrieveCallbacks(500, async (callback) => {
      const d = new MinMaxDebounce<any>({minimumDelay: 50, maximumDelay: 150, callback: callback});
      d.emit(firstValue);
      await sleep(40);
      d.emit(secondValue);
      await sleep(40);
      d.emit(thirdValue);
      await sleep(40);
      d.emit(fourthValue);
      await sleep(40);
      d.emit(fifthValue);
    });
    expect(result.length).to.equal(2);
    expect(result[0].isMaximumDelay).to.equal(true);
    expect(result[0].value).to.equal(fourthValue);
    expect(result[1].isMaximumDelay).to.equal(false);
    expect(result[1].value).to.equal(fifthValue);
  });
});
