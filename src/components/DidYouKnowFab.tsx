import { forwardRef } from 'react';
import { BookOpen } from 'lucide-react';

interface DidYouKnowFabProps {
  onOpen: () => void;
}

const DidYouKnowFab = forwardRef<HTMLButtonElement, DidYouKnowFabProps>(
  ({ onOpen }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label="Open Did you know panel"
        onClick={onOpen}
        className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white flex items-center gap-2 hover:opacity-90 focus-visible:outline"
      >
        <BookOpen className="h-5 w-5" aria-hidden="true" />
        <span>Did you know?</span>
      </button>
    );
  }
);

DidYouKnowFab.displayName = 'DidYouKnowFab';

export default DidYouKnowFab;

