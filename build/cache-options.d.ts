export declare type RevalidateOpts<T> = {
    strategy?: 'linear' | 'exponential';
    interval?: number;
    backOff?: number;
    exponentialBackoff?: number;
    retries?: number;
    onSuccess?: (cache: T) => Promise<void> | void;
    onRetriesReached?: (cache: T, err: any) => Promise<void> | void;
};
export declare type CacheOpts<T> = {
    initialData?: (() => T | Promise<T>) | T;
    revalidateFn?: (() => T | Promise<T>) | T;
    fallbackFn?: (() => T | Promise<T>) | T;
    getterFn?: () => T | undefined;
    setterFn?: (data: T | undefined) => void;
    revalidateOpts?: RevalidateOpts<T>;
};
export declare const defaultCacheOptions: {
    initialData: undefined;
    revalidateFn: undefined;
    setterFn: undefined;
    getterFn: undefined;
    revalidateOpts: {
        strategy: string;
        interval: number;
        backOff: number;
        exponentialBackoff: number;
        retries: number;
    };
};
