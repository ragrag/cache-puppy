"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachePuppy = void 0;
const cache_options_1 = require("./cache-options");
const util_1 = require("./util");
class CachePuppy {
    constructor(options) {
        this.teardown = () => {
            if (this.revalidationInterval) {
                clearInterval(this.revalidationInterval);
            }
        };
        this.options = options;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.initializeDefaultOptions();
            yield this.initializeCache();
            this.scheduleCacheRevalidate();
        });
    }
    initializeDefaultOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            this.options = (0, util_1.mergeDeep)(cache_options_1.defaultCacheOptions, this.options);
            if (+Boolean(this.options.getterFn) + +Boolean(this.options.setterFn) === 1) {
                throw new Error('Cannot provide one of getterFn/setterFn, provide both or nothing');
            }
        });
    }
    initializeCache() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.set(this.options.initialData);
        });
    }
    scheduleCacheRevalidate() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = this.options.revalidateOpts) === null || _a === void 0 ? void 0 : _a.interval) {
                this.revalidationInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.revalidate;
                }), this.options.revalidateOpts.interval);
            }
        });
    }
    revalidate(tries = 0) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.set(this.options.revalidateFn);
                if ((_a = this.options.revalidateOpts) === null || _a === void 0 ? void 0 : _a.onSuccess) {
                    yield this.options.revalidateOpts.onSuccess(this.cache);
                }
            }
            catch (err) {
                const { retries: maxRetries, backOff, exponentialBackoff, strategy: retryStrategy } = this.options.revalidateOpts;
                if (tries >= maxRetries) {
                    if (this.options.fallbackFn) {
                        yield this.set(this.options.fallbackFn);
                    }
                    if ((_c = (_b = this.options) === null || _b === void 0 ? void 0 : _b.revalidateOpts) === null || _c === void 0 ? void 0 : _c.onRetriesReached) {
                        yield this.options.revalidateOpts.onRetriesReached(this.cache, err);
                    }
                }
                if (retryStrategy === 'exponential') {
                    yield (0, util_1.sleep)(Math.pow(2, maxRetries) * backOff + Math.random() * exponentialBackoff, false);
                }
                this.revalidate(tries + 1);
            }
        });
    }
    set(data) {
        return __awaiter(this, void 0, void 0, function* () {
            data = yield (0, util_1.asyncValue)(data);
            if (this.options.setterFn) {
                this.options.setterFn(data);
            }
            else {
                this.cache = data;
            }
        });
    }
    get() {
        if (this.options.getterFn) {
            return this.options.getterFn();
        }
        return this.cache;
    }
}
exports.CachePuppy = CachePuppy;
//# sourceMappingURL=cache.js.map