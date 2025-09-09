import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MAPS_API_KEY } from '@/lib/env';

interface CenterMapProps {
  /**
   * A plain text search query of name + address of the center. The Google
   * Places API will search for this text and centre the map on the first
   * result.
   */
  query: string;
  /** Optional height for the map in pixels */
  height?: number;
}

export default function CenterMap({ query, height = 220 }: CenterMapProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || !MAPS_API_KEY) return;
    const loader = new Loader({
      apiKey: MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places'],
    });
    let map: google.maps.Map | null = null;
    loader.load().then(() => {
      if (!ref.current) return;
      map = new google.maps.Map(ref.current, {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 5,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      });
      const service = new google.maps.places.PlacesService(map);
      service.textSearch({ query }, (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results &&
          results[0]
        ) {
          const place = results[0];
          const loc = place.geometry?.location;
          if (loc) {
            map!.setCenter(loc);
            map!.setZoom(14);
            new google.maps.Marker({ map: map!, position: loc, title: place.name });
          }
        }
      });
    });
    return () => {
      map = null;
    };
  }, [query]);

  if (!MAPS_API_KEY) {
    return (
      <div className="text-xs text-muted-foreground">
        Map unavailable: missing VITE_GOOGLE_MAPS_API_KEY
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{ height }}
      className="w-full rounded-lg border overflow-hidden"
    />
  );
}