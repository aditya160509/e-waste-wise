import { useEffect, useState } from 'react';

/**
 * useLocalStorage is a small helper hook that persists state to
 * localStorage. If parsing fails or localStorage is unavailable the
 * provided initial value will be used instead. Updates will always
 * attempt to stringify and store the new value.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const v = localStorage.getItem(key);
      return v ? (JSON.parse(v) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* noop */
    }
  }, [key, value]);
  return [value, setValue] as const;
}