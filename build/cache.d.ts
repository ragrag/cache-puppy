import { CacheOpts } from './cache-options';
declare class CachePuppy<T> {
    private cache;
    private revalidationInterval?;
    private options;
    constructor(options: CacheOpts<T>);
    private init;
    private initializeDefaultOptions;
    private initializeCache;
    private scheduleCacheRevalidate;
    revalidate(tries?: number): Promise<void>;
    set(data: (() => T | Promise<T>) | T | undefined): Promise<void>;
    get(): T | undefined;
    private teardown;
}
export { CachePuppy };
