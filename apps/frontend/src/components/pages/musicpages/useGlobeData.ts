import { useEffect, useMemo, useState } from 'react';
import * as topojson from 'topojson-client';
import type { MusicMapCountry } from '@shared/types/musicMap';
import { buildGlobePoints, type PointData } from './globeMapUtils';

type UseGlobeDataResult = {
  polygons: any[];
  points: PointData[];
};

export function useGlobeData(countries: MusicMapCountry[], selectedCountryCode?: string): UseGlobeDataResult {
  const [polygons, setPolygons] = useState<any[]>([]);

  useEffect(() => {
    let canceled = false;

    fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
      .then((response) => response.json())
      .then((topo) => {
        if (canceled) return;
        try {
          const geo = (topojson as any).feature(topo, topo.objects.countries).features;
          setPolygons(geo);
        } catch {
          // ignore malformed geojson payloads
        }
      })
      .catch(() => {
        // ignore network errors
      });

    return () => {
      canceled = true;
    };
  }, []);

  const points = useMemo(() => buildGlobePoints(countries, polygons, selectedCountryCode), [countries, polygons, selectedCountryCode]);

  return { polygons, points };
}
