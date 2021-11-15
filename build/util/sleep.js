"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
const sleep = (timeMs, unref = true) => new Promise(resolve => {
    const timer = setTimeout(resolve, timeMs);
    if (unref) {
        timer.unref();
    }
});
exports.sleep = sleep;
//# sourceMappingURL=sleep.js.map