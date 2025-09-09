import { useEffect, useMemo, useRef, useState } from 'react';
import { askAI } from '@/lib/ai';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { MessageCircle, Send } from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function AIChatFab() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const activeLabel = useMemo(() => {
    try {
      return localStorage.getItem('demo_active_label');
    } catch {
      return null;
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (q: string) => {
    if (!q.trim() || streaming) return;
    setMessages((m) => [...m, { role: 'user', content: q }, { role: 'assistant', content: '' }]);
    setInput('');
    setStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;
    const city = undefined; // could be captured from UI later
    try {
      await askAI({ question: q, city, label: activeLabel || undefined }, (chunk) => {
        setMessages((m) => {
          const last = m[m.length - 1];
          if (!last || last.role !== 'assistant') return m;
          const copy = m.slice();
          copy[copy.length - 1] = { role: 'assistant', content: (last.content || '') + chunk };
          return copy;
        });
      }, { signal: controller.signal });
    } catch (e) {
      // write a fallback error message
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I could not complete that request.' }]);
    } finally {
      setStreaming(false);
    }
  };

  // Abort stream on close
  useEffect(() => {
    if (!open && abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open AI chat"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-50 rounded-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg flex items-center gap-2 hover:opacity-90"
      >
        <MessageCircle className="h-5 w-5" />
        Ask AI
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>AI Assistant</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex flex-wrap gap-2 mb-3">
              {['Where can I recycle in my city?', 'Hazards of batteries?', 'What do the impact numbers mean?'].map((s) => (
                <button
                  key={s}
                  className="text-xs rounded-full border px-2 py-1 hover:bg-accent"
                  onClick={() => setInput(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-auto space-y-3 pr-1">
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div className={m.role === 'user' ? 'inline-block rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm' : 'inline-block rounded-lg bg-muted px-3 py-2 text-sm'}>
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <form
              className="mt-3 flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                type="text"
                placeholder="Ask a question…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded border px-3 py-2 text-sm bg-background"
              />
              <Button type="submit" size="sm" disabled={streaming || !input.trim()}>
                <Send className="h-4 w-4 mr-1" />
                Send
              </Button>
            </form>
            <div className="mt-2 text-[10px] text-muted-foreground">
              Context: {activeLabel ? `label=${activeLabel}` : 'no label'}. City optional.
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

