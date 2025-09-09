import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CenterMap from './CenterMap';
import type { RecyclingCenter } from '@/types';
import { MapPin, Phone, CheckCircle2, ExternalLink } from 'lucide-react';

interface CenterCardProps {
  c: RecyclingCenter;
}

/**
 * Renders a recycling centre card. Displays the centre name, address,
 * verification status, phone number (if present) and a toggle to show
 * an embedded map. The external "Open in Maps" link has been removed
 * to ensure all map views are powered by the Google Places API via the
 * API key.
 */
export default function CenterCard({ c }: CenterCardProps) {
  const [showMap, setShowMap] = useState(false);
  const hasPhone = !!c.phone;
  const query = `${c.name}, ${c.address}, ${c.city}, India`;

  const mapId = `map-${c.name.replace(/\W+/g, '-')}`;

  return (
    <div
      className="rounded-2xl border shadow-soft bg-white/70 dark:bg-slate-900/50 px-5 py-4"
    >
      {/* Header: Name + city + verified */}
      <div className="space-y-1">
        <div className="flex items-start gap-2">
          <h3 className="text-lg font-semibold leading-tight text-foreground truncate">
            {c.name}
          </h3>
          {c.verified && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 px-2 py-0.5 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 opacity-80" />
          <span className="truncate">{c.city}</span>
        </div>
      </div>

      {/* Phone chip (if present) */}
      {hasPhone && (
        <div className="mt-3">
          <a
            href={`tel:${c.phone}`}
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-sm text-foreground hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            aria-label={`Call ${c.name} at ${c.phone}`}
          >
            <Phone className="h-4 w-4" />
            <span className="tabular-nums">{c.phone}</span>
          </a>
        </div>
      )}

      {/* View Map button (full width) */}
      <div className="mt-4">
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl"
          onClick={() => setShowMap((s) => !s)}
          aria-expanded={showMap}
          aria-controls={mapId}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          {showMap ? 'Hide Map' : 'View Map'}
        </Button>
      </div>

      {/* Collapsible map */}
      {showMap && (
        <div id={mapId} className="mt-4 overflow-hidden rounded-xl">
          <CenterMap query={query} />
        </div>
      )}
    </div>
  );
}
