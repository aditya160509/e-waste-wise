import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '@/lib/a11y';
import {
  Globe,
  BatteryCharging,
  Laptop,
  RefreshCw,
  Recycle,
  MapPin,
  AlertTriangle,
  Trash2,
  Package,
  Zap,
} from 'lucide-react';

type IconName =
  | 'globe'
  | 'battery-charging'
  | 'laptop'
  | 'refresh-cw'
  | 'recycle'
  | 'map-pin'
  | 'alert-triangle'
  | 'trash-2'
  | 'package'
  | 'zap';

const iconMap: Record<IconName, React.ComponentType<{ className?: string }>> = {
  globe: Globe,
  'battery-charging': BatteryCharging,
  laptop: Laptop,
  'refresh-cw': RefreshCw,
  recycle: Recycle,
  'map-pin': MapPin,
  'alert-triangle': AlertTriangle,
  'trash-2': Trash2,
  package: Package,
  zap: Zap,
};

export interface FlashCardProps {
  fact: string;
  icon?: string;
  color?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'teal' | 'violet';
}

export default function FlashCard({ fact, icon, color = 'emerald' }: FlashCardProps) {
  const Icon = icon && icon in iconMap ? (iconMap as any)[icon] : null;
  const reduce = prefersReducedMotion();

  const gradientMap: Record<NonNullable<FlashCardProps['color']>, string> = {
    emerald: 'bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-emerald-900/15 dark:to-sky-900/10',
    indigo: 'bg-gradient-to-br from-indigo-50 to-sky-50 dark:from-indigo-900/15 dark:to-sky-900/10',
    amber: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/15 dark:to-orange-900/10',
    rose: 'bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/15 dark:to-pink-900/10',
    teal: 'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/15 dark:to-cyan-900/10',
    violet: 'bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/15 dark:to-fuchsia-900/10',
  };

  return (
    <motion.div whileHover={reduce ? undefined : { y: -2 }} transition={{ duration: 0.15 }}>
      <Card
        tabIndex={0}
        className={cn(
          'group relative rounded-2xl border shadow-sm hover:shadow-md transition-colors p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
          gradientMap[color]
        )}
      >
        {Icon && (
          <div className="absolute right-3 top-3 text-muted-foreground/40 opacity-30 pointer-events-none">
            <Icon className="h-7 w-7" aria-hidden="true" />
          </div>
        )}
        <div className="text-[15px] md:text-base leading-relaxed">
          {fact}
        </div>
      </Card>
    </motion.div>
  );
}
