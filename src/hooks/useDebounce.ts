import { useRef, useCallback } from 'react';

export function useDebounce<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      return new Promise<Awaited<ReturnType<T>>>((resolve) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
          const result = await callback(...args);
          resolve(result);
        }, delay);
      });
    },
    [callback, delay]
  );
}