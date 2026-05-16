import { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import type { MusicMapCountry } from '@shared/types/musicMap';
import { getFeatureName, resolveCountryCenter, buildCountryCode } from './globeMapUtils';
import { useGlobeData } from './useGlobeData';
import { applyGlobeAssets, focusGlobeOnCountry, resetGlobeView } from './globeMapScene';

type GlobeMapProps = {
  countries: MusicMapCountry[];
  selectedCountryCode?: string;
  selectedCountryName?: string;
  onSelectCountry: (code: string, lat?: number, lng?: number, name?: string) => void;
  resetViewSignal?: number;
};

export default function GlobeMap({ countries, selectedCountryCode, selectedCountryName, onSelectCountry, resetViewSignal }: GlobeMapProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const prevPovRef = useRef<{ lat: number; lng: number; altitude: number } | null>(null);
  const { polygons, points } = useGlobeData(countries, selectedCountryCode);

  useEffect(() => {
    applyGlobeAssets(globeRef);
  }, []);

  useEffect(() => {
    if (typeof resetViewSignal === 'undefined') return;
    resetGlobeView(globeRef, prevPovRef);
  }, [resetViewSignal]);

  const resolvedSelectedCountryName = selectedCountryName ?? countries.find((c) => c.code === selectedCountryCode)?.name;

  return (
    <div className="globe-canvas-wrap">
      <Globe
        ref={globeRef}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor="#40c9ff"
        atmosphereAltitude={0.22}
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor={(obj: object) => (obj as import('./globeMapUtils').PointData).color}
        pointRadius={(obj: object) => (obj as import('./globeMapUtils').PointData).size}
        pointAltitude={0.02}
        pointLabel={(obj: object) => {
          const point = obj as import('./globeMapUtils').PointData;
          return `${point.name}: ${point.region}`;
        }}
        onPointClick={(point: object) => {
          const p = point as import('./globeMapUtils').PointData;
          focusGlobeOnCountry({ globeRef, countries, polygons, lat: p.lat, lng: p.lng, code: p.code, name: p.name, onSelectCountry, prevPovRef });
        }}
        polygonsData={polygons}
        polygonCapColor={(feat: any) => {
          const name = getFeatureName(feat);
          return name === resolvedSelectedCountryName ? 'rgba(70,220,255,0.95)' : 'rgba(255,255,255,0.05)';
        }}
        polygonSideColor={() => 'rgba(34,92,140,0.22)'}
        polygonStrokeColor={() => 'rgba(118,219,255,0.34)'}
        polygonAltitude={(feat: any) => {
          const name = getFeatureName(feat);
          return name === resolvedSelectedCountryName ? 0.015 : 0.0005;
        }}
        polygonLabel={(feat: any) => {
          return getFeatureName(feat) || 'Country';
        }}
        onPolygonClick={(feat: any) => {
          const name = getFeatureName(feat);
          if (!name) return;
          const match = countries.find((c) => c.name.toLowerCase() === String(name).toLowerCase());
          if (match) {
            focusGlobeOnCountry({ globeRef, countries, polygons, lat: match.lat ?? 0, lng: match.lng ?? 0, code: match.code, name: match.name, onSelectCountry, prevPovRef });
            return;
          }

          const centroid = resolveCountryCenter(String(name), feat);
          if (!centroid) return;
          const generatedCode = buildCountryCode(String(name));
          focusGlobeOnCountry({ globeRef, countries, polygons, lat: centroid.lat, lng: centroid.lng, code: generatedCode || 'country', name: String(name), onSelectCountry, prevPovRef });
        }}
      />
    </div>
  );
}
