import { useEffect, useMemo, useState } from 'react';
import * as topojson from 'topojson-client';
import type { MusicMapCountry } from '@shared/types/musicMap';
import { buildGlobePoints, type PointData } from './globeMapUtils';

type UseGlobeDataResult = {
  polygons: any[];
  points: PointData[];
};

export function useGlobeData(_countries: MusicMapCountry[], _selectedCountryCode?: string): UseGlobeDataResult {
  const [polygons, setPolygons] = useState<any[]>([]);

  useEffect(() => {
    let canceled = false;
    const load = async () => {
      try {
        const topoRes = await fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json');
        if (!topoRes.ok) return;
        const topo = await topoRes.json();
        if (canceled) return;
        const geo = (topojson as any).feature(topo, topo.objects.countries).features;
        setPolygons(geo);
      } catch (e) {
        // keep empty state if the geojson request fails
      }
    };
    void load();
    return () => { canceled = true; };
  }, []);

  const points = useMemo(
    () => buildGlobePoints(_countries, polygons, _selectedCountryCode),
    [_countries, polygons, _selectedCountryCode],
  );

  return { polygons, points };
}
