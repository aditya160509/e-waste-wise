import { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import impactData from '@/data/impact_factors.json';
import ImpactCard from '@/components/ImpactCard';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '@/lib/a11y';
import { classifyDevice, explainImpact } from '@/lib/ai';
import { Card, CardContent } from '@/components/ui/card';
import { Surface } from '@/components/ui/Surface';

/**
 * Demo component allows users to select an electronic device category from
 * the provided impact_factors.json file and view detailed impact metrics.
 * There is no image upload or AI classification in this version. A
 * celebration animation plays when the selected device is a battery.
 */
type Item = {
  label: string;
  co2_kg: number;
  water_liters: number;
  energy_kwh: number;
  metals: { copper_g: number; aluminium_g: number; rare_earths_g: number };
  monetary_value_usd: number;
  global_recycling_rate_pct: number;
  lifecycle_co2_kg: number;
  hazards: string[];
  note: string;
  disposal_guidance: string;
};

export default function Demo() {
  const list: Item[] = impactData as Item[];
  const labels = useMemo(() => list.map((i) => i.label), [list]);

  const [selectedLabel, setSelectedLabel] = useState<string>(labels[0] || 'battery');
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [aiText, setAiText] = useState('');
  const [aiPending, setAiPending] = useState(false);
  const [aiClassified, setAiClassified] = useState<string | null>(null);
  const [explainPending, setExplainPending] = useState(false);
  const [explainMd, setExplainMd] = useState<string | null>(null);

  const metrics = useMemo(() => {
    if (!activeLabel) return null;
    return list.find((i) => i.label === activeLabel) ?? null;
  }, [list, activeLabel]);

  // Confetti only when active selection is Battery
  useEffect(() => {
    if (activeLabel === 'battery' && !prefersReducedMotion()) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
    // expose active for site-wide chat
    if (activeLabel) {
      try { localStorage.setItem('demo_active_label', activeLabel); } catch {}
    }
  }, [activeLabel]);

  // Persist simple history with de-duplication
  useEffect(() => {
    if (!activeLabel) return;
    const STORAGE_KEY = 'demo_history_labels';
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      const filtered = arr.filter((l) => l !== activeLabel);
      const next = [activeLabel, ...filtered].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, [activeLabel]);

  const prettyLabel = (l: string) => {
    const map: Record<string, string> = {
      laptop_desktop: 'Laptop / Desktop',
      mobile_tablet: 'Mobile / Tablet',
      battery: 'Battery',
      charger: 'Charger',
      television_monitor: 'Television / Monitor',
      audio_devices: 'Audio Devices',
      wearables_accessories: 'Wearables / Accessories',
      peripherals: 'Peripherals',
      other: 'Other',
    };
    return map[l] ?? l.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <section id="demo" className="py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">Try the Demo</h2>
          <p className="font-body text-lg text-muted-foreground">
            Select your device type to see environmental impact and disposal guidance.
          </p>
        </motion.div>

        <div className="max-w-md mx-auto mb-4">
          <label htmlFor="ai-text" className="block mb-2 text-sm text-muted-foreground">
            Describe your device (optional, AI will classify)
          </label>
          <textarea
            id="ai-text"
            aria-label="Describe your device for AI classification"
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            className="w-full p-3 rounded-lg border bg-background min-h-[84px]"
            placeholder="e.g., Old Android phone with cracked screen and dead battery"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              aria-label="Use AI to classify"
              disabled={!aiText.trim() || aiPending}
              onClick={async () => {
                if (!aiText.trim()) return;
                setAiPending(true);
                setAiClassified(null);
                try {
                  const r = await classifyDevice(aiText.trim());
                  setActiveLabel(r.label);
                  setSelectedLabel(r.label);
                  setAiClassified(`AI classified (${(r.confidence * 100).toFixed(0)}%)`);
                  setExplainMd(null);
                } catch (e) {
                  // no-op; could toast
                } finally {
                  setAiPending(false);
                }
              }}
              className="inline-flex justify-center items-center rounded-lg border border-primary/30 bg-primary/90 text-primary-foreground px-3 py-2 text-sm hover:opacity-90 disabled:opacity-50"
            >
              {aiPending ? 'Classifying…' : 'Use AI to classify'}
            </button>
            {aiClassified && (
              <span className="text-xs rounded-full px-2 py-1 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100">
                {aiClassified}
              </span>
            )}
          </div>
        </div>

        <Surface className="max-w-md mx-auto p-5 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
          <div>
            <label htmlFor="device-select" className="block mb-2 text-sm text-muted-foreground">
              Choose device type
            </label>
            <select
              id="device-select"
              aria-label="Choose device type"
              value={selectedLabel}
              onChange={(e) => setSelectedLabel(e.target.value)}
              className="w-full p-3 rounded-lg border bg-background"
            >
              {labels.map((l) => (
                <option key={l} value={l} className="capitalize">
                  {prettyLabel(l)}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            aria-label="Get impact data"
            onClick={() => setActiveLabel(selectedLabel)}
            className="inline-flex justify-center items-center rounded-lg border border-primary/30 bg-primary text-primary-foreground px-4 py-3 hover:opacity-90"
          >
            Get Impact Data
          </button>
        </div>
        </Surface>

        <div className="mt-8">
          {activeLabel && metrics && (
            <div className="space-y-3">
              <ImpactCard label={activeLabel} m={metrics} />
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Explain this impact"
                  onClick={async () => {
                    if (!activeLabel) return;
                    setExplainPending(true);
                    try {
                      const r = await explainImpact(activeLabel);
                      setExplainMd(r.markdown);
                    } catch (e) {
                      setExplainMd(null);
                    } finally {
                      setExplainPending(false);
                    }
                  }}
                  className="inline-flex justify-center items-center rounded-lg border px-3 py-2 text-sm hover:bg-accent"
                >
                  {explainPending ? 'Explaining…' : 'Explain this impact (AI)'}
                </button>
              </div>
              {explainMd && (
                <Card>
                  <CardContent>
                    <div className="prose max-w-none whitespace-pre-wrap text-sm">
                      {explainMd}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
