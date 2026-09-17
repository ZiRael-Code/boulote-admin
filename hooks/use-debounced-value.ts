import { useEffect, useState } from "react";

/**
 * Delays propagating a rapidly-changing value (typically search input) so it
 * can be used as part of a query key without firing a request per keystroke.
 */
export function useDebouncedValue<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
