import { useCallback, useEffect, useRef } from 'react';

export const useDebounceCallback = <CallbackArgs extends any[]>(
  callback: (...args: CallbackArgs) => void,
  wait = 100,
  leading = false
): ((...args: CallbackArgs) => void) => {
  const storedCallback = useRef(callback);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    storedCallback.current = callback;
  });

  useEffect(
    () => () => {
      timeout.current && clearTimeout(timeout.current);
      timeout.current = void 0;
    },
    [wait, leading, storedCallback]
  );

  return useCallback(
    function (...args) {
      const { current } = timeout;

      if (current === void 0 && leading) {
        timeout.current = setTimeout(() => {
          timeout.current = void 0;
        }, wait);
        return storedCallback.current.apply(null, args);
      }

      current && clearTimeout(current);

      timeout.current = setTimeout(() => {
        timeout.current = void 0;
        storedCallback.current.apply(null, args);
      }, wait);
    },
    [leading, wait]
  );
};
