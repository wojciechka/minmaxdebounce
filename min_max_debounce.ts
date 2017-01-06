/// <reference path="node_modules/@types/node/index.d.ts" />

export interface MinMaxDebounceEvent<T> {
  hasMore: boolean;
  isMaximumDelay: boolean;
  value: T;
}

export interface MinMaxDebounceCallback<T> { (event: MinMaxDebounceEvent<T>): void; };

export interface MinMaxDebounceOptions<T> {
  minimumDelay?: number;
  maximumDelay?: number;
  callback?: MinMaxDebounceCallback<T>;
}

export class MinMaxDebounce<T> {
  minimumDelay: number;
  maximumDelay: number;
  callback: MinMaxDebounceCallback<T>;
  counter: number = 0;
  latestCounter: number = 0;
  latestEmittedCounter: number = 0;
  enabled: boolean = true;
  value: T;
  protected minTimeout = undefined;
  protected maxTimeout = undefined;

  constructor(options?: MinMaxDebounceOptions<T>) {
    options = Object.assign({}, {minimumDelay: undefined, maximumDelay: undefined}, options);
    this.minimumDelay = options.minimumDelay;
    this.maximumDelay = options.maximumDelay;
    this.callback = options.callback;
  }

  emit(value?: T): void {
    this.counter++;
    this.createTimeouts();
    this.value = value;
  }

  protected clearTimeouts(): void {
    this.clearMinTimeout();
    this.clearMaxTimeout();
  }

  protected createTimeouts(): void {
    const currentCounter = this.counter;
    if (this.minimumDelay > 0) {
      this.clearMinTimeout();
      this.minTimeout = setTimeout(() => {
        this.invokeCallback(false, currentCounter);
      }, this.minimumDelay);
    }

    if (this.maximumDelay > 0) {
      if (this.maxTimeout === undefined) {
        this.maxTimeout = setTimeout(() => {
          this.invokeCallback(true, currentCounter);
        }, this.maximumDelay);
      }
    }
  }

  protected invokeCallback(isMaximumDelay: boolean, counter: number): void {
    if (isMaximumDelay || (counter === this.counter)) {
      this.clearMaxTimeout();
    }
    if ((counter === this.counter)) {
      this.clearMinTimeout();
    }
    if (this.callback !== undefined) {
      this.callback({
        hasMore: counter !== this.counter,
        isMaximumDelay: isMaximumDelay,
        value: this.value
      });
    }
  }

  protected clearMinTimeout() {
    if (this.minTimeout !== undefined) {
      clearTimeout(this.minTimeout);
      this.minTimeout = undefined;
    }
  }

  protected clearMaxTimeout() {
    if (this.maxTimeout !== undefined) {
      clearTimeout(this.maxTimeout);
      this.maxTimeout = undefined;
    }
  }
}
