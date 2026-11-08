import { useEffect, useState } from "react";

/**
 * Returns `value`, but only after it has stopped changing for `delay` ms.
 * Typing stays instant (the input itself is not debounced); only the expensive
 * work that depends on the returned value (filtering 1,000+ rows, a request)
 * waits until the user pauses.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
