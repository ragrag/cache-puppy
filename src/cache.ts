import { CacheOpts, defaultCacheOptions } from './cache-options';
import { mergeDeep, asyncValue, sleep } from './util';

class CachePuppy<T> {
  private cache: T | undefined;
  private revalidationInterval?: NodeJS.Timer;
  private options: CacheOpts<T>;

  constructor(options: CacheOpts<T>) {
    this.options = options;
    this.init();
  }

  private async init() {
    this.initializeDefaultOptions();
    await this.initializeCache();
    this.scheduleCacheRevalidate();
  }

  private async initializeDefaultOptions() {
    this.options = mergeDeep(defaultCacheOptions, this.options);
    if (+Boolean(this.options.getterFn) + +Boolean(this.options.setterFn) === 1) {
      throw new Error('Cannot provide one of getterFn/setterFn, provide both or nothing');
    }
  }

  private async initializeCache() {
    await this.set(this.options.initialData);
  }

  private async scheduleCacheRevalidate() {
    if (this.options.revalidateOpts?.interval) {
      this.revalidationInterval = setInterval(async () => {
        await this.revalidate;
      }, this.options.revalidateOpts.interval);
    }
  }

  public async revalidate(tries = 0): Promise<void> {
    try {
      await this.set(this.options.revalidateFn);
      if (this.options.revalidateOpts?.onSuccess) {
        await this.options.revalidateOpts.onSuccess(this.cache!);
      }
    } catch (err) {
      const { retries: maxRetries, backOff, exponentialBackoff, strategy: retryStrategy } = this.options.revalidateOpts!;

      if (tries >= maxRetries!) {
        if (this.options.fallbackFn) {
          await this.set(this.options.fallbackFn);
        }

        if (this.options?.revalidateOpts?.onRetriesReached) {
          await this.options.revalidateOpts.onRetriesReached(this.cache!, err);
        }
      }

      if (retryStrategy === 'exponential') {
        await sleep(2 ** maxRetries! * backOff! + Math.random() * exponentialBackoff!, false);
      }
      this.revalidate(tries + 1);
    }
  }

  public async set(data: (() => T | Promise<T>) | T | undefined): Promise<void> {
    data = await asyncValue(data);
    if (this.options.setterFn) {
      this.options.setterFn(data);
    } else {
      this.cache = data;
    }
  }

  public get(): T | undefined {
    if (this.options.getterFn) {
      return this.options.getterFn();
    }
    return this.cache;
  }

  private teardown = () => {
    if (this.revalidationInterval) {
      clearInterval(this.revalidationInterval);
    }
  };
}

export { CachePuppy };
