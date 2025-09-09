import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/a11y';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts from 0 to target over 800ms using requestAnimationFrame.
 * Respects user reduced motion preference by returning target immediately.
 */
export function useCountUp(target: number, deps: any[] = []) {
  const [value, setValue] = useState<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }

    const start = performance.now();
    const duration = 800; // ms
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      setValue(Math.round(eased * target));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    // Start from 0 for each new dependency change
    setValue(0);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ...deps]);

  return value;
}

