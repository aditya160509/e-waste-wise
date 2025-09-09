import { useState } from 'react';
import facts from '@/data/facts.json';

/**
 * DidYouKnow is a simple carousel for random facts. Users can
 * manually advance through the list with Next/Back buttons. Facts
 * do not auto-rotate. A position indicator shows the current index.
 */
export default function DidYouKnow() {
  const [idx, setIdx] = useState(0);

  const go = (delta: number) => {
    setIdx((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next >= facts.length) return facts.length - 1;
      return next;
    });
  };

  const fact = facts[idx];

  return (
    <section className="my-8">
      <h2 className="font-heading font-bold text-2xl mb-4 text-foreground">
        Did you know?
      </h2>
      <div className="rounded-2xl border p-6 bg-muted/30">
        <div className="text-3xl mb-4">💡</div>
        <p className="text-lg leading-relaxed font-body text-foreground">
          {fact.fact}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button
            className="px-3 py-1 rounded border text-sm"
            onClick={() => go(-1)}
            disabled={idx === 0}
          >
            Back
          </button>
          <span className="text-sm text-muted-foreground">
            Fact {idx + 1} of {facts.length}
          </span>
          <button
            className="px-3 py-1 rounded border text-sm"
            onClick={() => go(1)}
            disabled={idx === facts.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}