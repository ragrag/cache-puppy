export const sleep = (timeMs: number, unref = true) =>
  new Promise(resolve => {
    const timer = setTimeout(resolve, timeMs);
    if (unref) {
      timer.unref();
    }
  });
