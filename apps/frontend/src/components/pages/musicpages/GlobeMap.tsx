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

  const points = countries.map((c) => ({
    id: c.code,
    lat: (c as any).lat,
    lng: (c as any).lng,
    size: c.code === selectedCountryCode ? 0.9 : 0.6,
    color: c.code === selectedCountryCode ? 'rgba(98,210,162,0.95)' : 'rgba(255,209,102,0.95)',
    country: c,
  }));

  return (
    <div style={{ width: '100%', height: '680px' }}>
      <Globe
        ref={globeRef}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor={(d: any) => d.color}
        pointRadius={(d: any) => d.size}
        pointAltitude={0.02}
        pointLabel={(d: any) => `${d.country.name}: ${d.country.region}`}
        onPointClick={(d: any) => onSelectCountry(d.country.code)}
      />
    </div>
  );
}
