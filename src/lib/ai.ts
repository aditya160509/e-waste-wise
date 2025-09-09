export type ClassifyResponse = {
  label: string;
  confidence: number;
  rationale?: string;
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? (import.meta.env.DEV ? 'http://localhost:8787' : '');

export async function classifyDevice(text: string): Promise<ClassifyResponse> {
  const res = await fetch(`${API_BASE}/api/ai/classify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Classify failed: ${res.status}`);
  return res.json();
}

export async function explainImpact(label: string): Promise<{ markdown: string }> {
  const res = await fetch(`${API_BASE}/api/ai/explain-impact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label }),
  });
  if (!res.ok) throw new Error(`Explain failed: ${res.status}`);
  return res.json();
}

export type AskPayload = { question: string; city?: string | null; label?: string | null };

export function askAI(
  payload: AskPayload,
  onToken: (chunk: string) => void,
  opts?: { signal?: AbortSignal }
): Promise<void> {
  const controller = new AbortController();
  const signal = opts?.signal || controller.signal;

  const run = async () => {
    const res = await fetch(`${API_BASE}/api/ai/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify(payload),
      signal,
    });
    if (!res.ok || !res.body) throw new Error(`Ask failed: ${res.status}`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf('\n\n')) !== -1) {
          const frame = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const lines = frame.split('\n');
          let event: string | null = null;
          let data = '';
          for (const l of lines) {
            if (l.startsWith('event:')) event = l.slice(6).trim();
            else if (l.startsWith('data:')) data += l.slice(5).trim();
          }
          if (event === 'token') {
            try {
              const chunk = JSON.parse(data);
              if (typeof chunk === 'string') onToken(chunk);
            } catch {}
          } else if (event === 'done') {
            return;
          }
        }
      }
    } finally {
      try { reader.releaseLock(); } catch {}
    }
  };

  // Attach abort to return promise for convenience
  const promise = run();
  (promise as any).abort = () => controller.abort();
  return promise;
}
