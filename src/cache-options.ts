export type RevalidateOpts<T> = {
  strategy?: 'linear' | 'exponential';
  interval?: number;
  backOff?: number;
  exponentialBackoff?: number;
  retries?: number;
  onSuccess?: (cache: T) => Promise<void> | void;
  onRetriesReached?: (cache: T, err: any) => Promise<void> | void;
};

export type CacheOpts<T> = {
  initialData?: (() => T | Promise<T>) | T;
  revalidateFn?: (() => T | Promise<T>) | T;
  fallbackFn?: (() => T | Promise<T>) | T;
  getterFn?: () => T | undefined;
  setterFn?: (data: T | undefined) => void;
  revalidateOpts?: RevalidateOpts<T>;
};

export const defaultCacheOptions = {
  initialData: undefined,
  revalidateFn: undefined,
  setterFn: undefined,
  getterFn: undefined,
  revalidateOpts: {
    strategy: 'linear',
    interval: 1000 * 60,
    backOff: 300,
    exponentialBackoff: 10,
    retries: 3,
  },
};
