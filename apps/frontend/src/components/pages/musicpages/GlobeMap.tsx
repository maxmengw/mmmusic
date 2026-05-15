import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Globe from 'react-globe.gl';
import type { MusicMapCountry } from '@shared/types/musicMap';

type GlobeMapProps = {
  countries: MusicMapCountry[];
  selectedCountryCode?: string;
  onSelectCountry: (code: string) => void;
};

export default function GlobeMap({ countries, selectedCountryCode, onSelectCountry }: GlobeMapProps) {
  // Globe ref typing is not exported by react-globe.gl; allow only this line to use `any`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = false;
        controls.enableZoom = true;
      }
    }

    // load nicer textures (color, bump/height, specular) for a more realistic globe
    const mat = globeRef.current?.globeMaterial?.();
    if (mat) {
      const loader = new THREE.TextureLoader();
      // color / albedo map
      loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', (tex: THREE.Texture) => {
        mat.map = tex;
        mat.needsUpdate = true;
      });
      // bump / height map to give surface relief
      loader.load('https://unpkg.com/three-globe/example/img/earth-topology.png', (tex: THREE.Texture) => {
        mat.bumpMap = tex;
        mat.bumpScale = 0.06;
        mat.needsUpdate = true;
      });
      // specular map for ocean highlights
      loader.load('https://unpkg.com/three-globe/example/img/earth-specular.gif', (tex: THREE.Texture) => {
        mat.specularMap = tex;
        mat.specular = new THREE.Color('grey');
        mat.shininess = 10;
        mat.needsUpdate = true;
      });
    }
  }, []);

  type PointData = {
    id: string;
    lat: number;
    lng: number;
    size: number;
    color: string;
    country: MusicMapCountry;
  };

  const points: PointData[] = countries.map((c) => ({
    id: c.code,
    lat: c.lat ?? 0,
    lng: c.lng ?? 0,
    size: c.code === selectedCountryCode ? 0.9 : 0.6,
    color: c.code === selectedCountryCode ? 'rgba(98,210,162,0.95)' : 'rgba(255,209,102,0.95)',
    country: c,
  }));

  return (
    <div style={{ width: '100%', height: '680px' }}>
      <Globe
        ref={globeRef}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor={(obj: object) => (obj as PointData).color}
        pointRadius={(obj: object) => (obj as PointData).size}
        pointAltitude={0.02}
        pointLabel={(obj: object) => {
          const point = obj as PointData;
          return `${point.country.name}: ${point.country.region}`;
        }}
        onPointClick={(point: object) => onSelectCountry((point as PointData).country.code)}
      />
    </div>
  );
}
