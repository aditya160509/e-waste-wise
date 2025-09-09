import { motion } from 'framer-motion';
import { prefersReducedMotion } from '@/lib/a11y';
import { useCountUp } from '@/hooks/useCountUp';
import centers from '@/data/recycling_centers_in.json';
import CenterMap from '@/components/CenterMap';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface Metals {
  copper_g: number;
  aluminium_g: number;
  rare_earths_g: number;
}

interface ImpactMetrics {
  co2_kg: number;
  water_liters: number;
  energy_kwh: number;
  metals: Metals;
  monetary_value_usd: number;
  global_recycling_rate_pct: number;
  lifecycle_co2_kg: number;
  hazards: string[];
  note: string;
  disposal_guidance: string;
}

interface ImpactCardProps {
  label: string;
  m: ImpactMetrics;
}

export default function ImpactCard({ label, m }: ImpactCardProps) {
  const reduce = prefersReducedMotion();
  const [openMapIdxs, setOpenMapIdxs] = useState<Set<number>>(new Set());

  const toggleMap = (i: number) => {
    setOpenMapIdxs((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const topCenters = (centers as any[]).slice(0, 6);

  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, y: 8 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border bg-card text-card-foreground shadow p-5 md:p-6"
    >
      <h3 className="text-xl font-semibold mb-4 capitalize">
        Impact of {label.replace(/_/g, ' ')}
      </h3>
      {/* Metric rows */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatedStat title="CO₂" unit=" kg" value={m.co2_kg} color="emerald" />
        <AnimatedStat title="Water" unit=" L" value={m.water_liters} color="sky" />
        <AnimatedStat title="Energy" unit=" kWh" value={m.energy_kwh} color="indigo" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatedStat title="Copper" unit=" g" value={m.metals.copper_g} color="amber" />
        <AnimatedStat title="Aluminium" unit=" g" value={m.metals.aluminium_g} color="slate" />
        <AnimatedStat title="Rare Earths" unit=" g" value={m.metals.rare_earths_g} color="purple" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatedStat title="Value" prefix="$" value={m.monetary_value_usd} color="teal" />
        <AnimatedStat title="Recycling Rate" suffix="%" value={m.global_recycling_rate_pct} color="lime" />
        <AnimatedStat title="Lifecycle CO₂" unit=" kg" value={m.lifecycle_co2_kg} color="rose" />
      </div>
      {/* Hazards */}
      <div className="mt-5 rounded-xl border p-4">
        <h4 className="text-sm font-medium mb-1">Hazards</h4>
        <ul className="list-disc pl-5 text-sm text-muted-foreground">
          {m.hazards.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>
      {/* Note */}
      <div className="mt-4 rounded-xl border p-4 bg-muted/30">
        <h4 className="text-sm font-medium mb-1">Impact Note</h4>
        <p className="text-sm text-foreground leading-relaxed">{m.note}</p>
      </div>
      {/* Disposal Guidance */}
      <div className="mt-4 rounded-xl border p-4">
        <h4 className="text-sm font-medium mb-1">Disposal Guidance</h4>
        <p className="text-sm text-foreground leading-relaxed">{m.disposal_guidance}</p>
      </div>

      {/* Recommended Recycling Centers */}
      <div className="mt-6">
        <div className="flex items-center gap-2 border-t pt-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-muted-foreground"><path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path fillRule="evenodd" d="M12 2.25c-4.97 0-9 3.873-9 8.654 0 2.49 1.246 4.813 3.25 6.35 1.452 1.11 3.181 1.828 4.95 2.44a.75.75 0 0 0 .5-1.414c-1.71-.604-3.29-1.26-4.548-2.222C5.412 14.87 4.5 13.03 4.5 10.904c0-3.83 3.33-6.904 7.5-6.904s7.5 3.074 7.5 6.904c0 2.125-.913 3.966-2.652 5.153-1.26.862-2.84 1.618-4.55 2.222a.75.75 0 0 0 .5 1.414c1.77-.612 3.499-1.33 4.95-2.44 2.004-1.537 3.25-3.86 3.25-6.35 0-4.78-4.03-8.654-9-8.654Z" clipRule="evenodd"/></svg>
          <h4 className="text-sm font-medium">Recommended Recycling Centers</h4>
        </div>
        <div className="space-y-3">
          {topCenters.map((c, i) => {
            const open = openMapIdxs.has(i);
            const query = `${c.name}, ${c.address}, ${c.city}, India`;
            return (
              <div key={`${c.name}-${i}`} className="rounded-xl border p-3 bg-muted/20">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {c.city} • {c.verified ? 'Verified' : 'Unverified'}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={open ? `Hide map for ${c.name}` : `View map for ${c.name}`}
                    onClick={() => toggleMap(i)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    {open ? 'Hide Map' : 'View Map'}
                  </Button>
                </div>
                {open && (
                  <div className="mt-3 overflow-hidden rounded-lg transition-all">
                    <CenterMap query={query} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedStat({
  title,
  value,
  unit = '',
  prefix = '',
  suffix = '',
  color,
}: {
  title: string;
  value: number;
  unit?: string;
  prefix?: string;
  suffix?: string;
  color:
    | 'emerald'
    | 'sky'
    | 'indigo'
    | 'amber'
    | 'slate'
    | 'purple'
    | 'teal'
    | 'lime'
    | 'rose';
}) {
  const v = useCountUp(value, [title]);
  const classMap: Record<string, string> = {
    emerald:
      'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100',
    sky: 'bg-sky-50 dark:bg-sky-900/20 text-sky-900 dark:text-sky-100',
    indigo:
      'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100',
    amber:
      'bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100',
    slate:
      'bg-slate-50 dark:bg-slate-900/20 text-slate-900 dark:text-slate-100',
    purple:
      'bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-100',
    teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-900 dark:text-teal-100',
    lime: 'bg-lime-50 dark:bg-lime-900/20 text-lime-900 dark:text-lime-100',
    rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-900 dark:text-rose-100',
  };
  return (
    <div className={`rounded-xl px-4 py-3 ${classMap[color]} shadow-sm`}>
      <div className="text-xs font-medium opacity-80">{title}</div>
      <div className="text-2xl font-bold font-mono">
        {prefix}
        {v.toLocaleString()}
        {unit}
        {suffix}
      </div>
    </div>
  );
}
