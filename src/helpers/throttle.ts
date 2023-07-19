export default function throttle<A = unknown, R = void>(
  fn: (args: A) => R,
  ms: number
): [(args: A) => Promise<R>, () => void] {
  let isThrottled = false;

  const throttledFunc = (args: A): Promise<R> =>
    new Promise((resolve) => {
      if (!isThrottled) {
        isThrottled = true;
        resolve(fn(args));

        setTimeout(() => {
          isThrottled = false;
        }, ms);
      }
    });

  const teardown = () => {
    isThrottled = false;
  };

  return [throttledFunc, teardown];
}
