export const asyncValue = async <T>(fnOrValue: (() => T | Promise<T>) | T): Promise<T> => {
  let res;
  if (typeof fnOrValue === 'function') {
    res = await (fnOrValue as () => T | Promise<T>)();
  } else {
    res = fnOrValue;
  }
  return res;
};
