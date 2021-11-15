"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCacheOptions = void 0;
exports.defaultCacheOptions = {
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
//# sourceMappingURL=cache-options.js.map