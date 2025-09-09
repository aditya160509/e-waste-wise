import { useEffect, useMemo, useRef, useState } from 'react';
import facts from '@/data/facts.json';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DidYouKnowPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef?: React.RefObject<HTMLElement>;
}

export default function DidYouKnowPanel({ open, onOpenChange, returnFocusRef }: DidYouKnowPanelProps) {
  const [idx, setIdx] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const total = facts.length;
  const fact = useMemo(() => facts[idx], [idx]);

  useEffect(() => {
    if (open) {
      // focus heading when opened
      setTimeout(() => headingRef.current?.focus(), 0);
    }
  }, [open]);

  // Restore focus to FAB when closed
  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next && returnFocusRef?.current) {
      // wait for dialog to unmount
      setTimeout(() => returnFocusRef.current?.focus(), 0);
    }
  };

  const go = (delta: number) => {
    setIdx((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next >= total) return total - 1;
      return next;
    });
  };

  // Keyboard navigation: Left/Right arrows, Esc handled by Dialog
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent role="dialog" aria-label="Did you know facts" aria-modal="true">
        <DialogHeader>
          <DialogTitle
            ref={headingRef}
            tabIndex={-1}
            className="outline-none"
          >
            Did you know?
          </DialogTitle>
          <DialogDescription>
            Explore e-waste facts. Use arrow keys to navigate.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <div className="text-3xl mb-4" aria-hidden>
            {/* Use simple emoji as large icon */}
            💡
          </div>
          <p className="text-base leading-relaxed">
            {fact.fact}
          </p>
          <div className="mt-6 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              aria-label="Previous fact"
              onClick={() => go(-1)}
              disabled={idx === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground" aria-live="polite">
              Fact {idx + 1} of {total}
            </span>
            <Button
              type="button"
              aria-label="Next fact"
              onClick={() => go(1)}
              disabled={idx === total - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

