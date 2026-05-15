import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Globe from 'react-globe.gl';
import * as topojson from 'topojson-client';
import type { MusicMapCountry } from '@shared/types/musicMap';

type GlobeMapProps = {
  countries: MusicMapCountry[];
  selectedCountryCode?: string;
  // pass coordinates back so caller can load images / position overlays
  onSelectCountry: (code: string, lat?: number, lng?: number) => void;
  // increment this number to request the globe reset to the default POV
  resetViewSignal?: number;
};

export default function GlobeMap({ countries, selectedCountryCode, onSelectCountry, resetViewSignal }: GlobeMapProps) {
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

  // when parent updates resetViewSignal, animate camera back to default
  const prevPOVRef = useRef<{ lat: number; lng: number; altitude: number } | null>(null);

  // when parent updates resetViewSignal, animate camera back to previous POV if available
  useEffect(() => {
    if (typeof resetViewSignal === 'undefined') return;
    try {
      if (prevPOVRef.current && globeRef.current?.pointOfView) {
        // animate back to previous POV
        const prev = prevPOVRef.current;
        globeRef.current.pointOfView({ lat: prev.lat, lng: prev.lng, altitude: prev.altitude }, 800);
        // clear after returning
        setTimeout(() => {
          prevPOVRef.current = null;
        }, 850);
      } else if (globeRef.current?.pointOfView) {
        globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 800);
      } else {
        const controls = globeRef.current?.controls?.();
        if (controls) {
          controls.reset?.();
        }
      }
    } catch (err) {
      // ignore
    }
  }, [resetViewSignal]);

  type PointData = {
    id: string;
    lat: number;
    lng: number;
    size: number;
    color: string;
    country: MusicMapCountry;
  };

  const [polygons, setPolygons] = useState<any[]>([]);

  const selectedCountryName = countries.find((c) => c.code === selectedCountryCode)?.name;

  // load world topojson and convert to GeoJSON polygons for country highlighting
  useEffect(() => {
    let canceled = false;
    fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
      .then((r) => r.json())
      .then((topo) => {
        if (canceled) return;
        try {
          const geo = (topojson as any).feature(topo, topo.objects.countries).features;
          setPolygons(geo);
        } catch (err) {
          // ignore
        }
      })
      .catch(() => {
        // ignore network errors
      });

    return () => {
      canceled = true;
    };
  }, []);

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
        polygonsData={polygons}
        polygonCapColor={(feat: any) => {
          const props = feat.properties || {};
          const name = props.name || props.ADMIN || props.admin || props.NAME;
          return name === selectedCountryName ? 'rgba(98,210,162,0.95)' : 'rgba(255,255,255,0.03)';
        }}
        polygonSideColor={() => 'rgba(0,0,0,0.15)'}
        polygonStrokeColor={() => 'rgba(0,0,0,0.25)'}
        polygonAltitude={(feat: any) => {
          const props = feat.properties || {};
          const name = props.name || props.ADMIN || props.admin || props.NAME;
          return name === selectedCountryName ? 0.015 : 0.0005;
        }}
        polygonLabel={(feat: any) => {
          const props = feat.properties || {};
          return props.name || props.ADMIN || props.admin || props.NAME || 'Country';
        }}
        onPolygonClick={(feat: any) => {
          const props = feat.properties || {};
          const name = props.name || props.ADMIN || props.admin || props.NAME;
          if (!name) return;
          const match = countries.find((c) => c.name.toLowerCase() === String(name).toLowerCase());
          if (match) {
            const focusAltitude = 0.6;
            const animMs = 900;
            try {
              if (globeRef.current?.pointOfView && match.lat && match.lng) {
                try {
                  const current = globeRef.current.pointOfView();
                  if (current) prevPOVRef.current = current;
                } catch (e) {
                  // ignore
                }

                globeRef.current.pointOfView({ lat: match.lat, lng: match.lng, altitude: focusAltitude }, animMs);
                setTimeout(() => onSelectCountry(match.code), animMs + 50);
                return;
              }
            } catch (err) {
              // ignore
            }

            onSelectCountry(match.code);
          }
        }}
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
        onPointClick={(point: object) => {
          const p = point as PointData;
          const focusAltitude = 0.6; // closer zoom
          const animMs = 900;
          // try to animate globe focus if API available
          try {
            if (globeRef.current?.pointOfView) {
              // save current POV so we can restore later
              try {
                const current = globeRef.current.pointOfView();
                if (current) prevPOVRef.current = current;
              } catch (e) {
                // ignore if API not available
              }

              globeRef.current.pointOfView({ lat: p.lat, lng: p.lng, altitude: focusAltitude }, animMs);
              // call parent after animation completes so UI appears after zoom
              setTimeout(() => onSelectCountry(p.country.code), animMs + 50);
              return;
            } else {
              const controls = globeRef.current?.controls?.();
              if (controls) {
                controls.target.set(p.lng, p.lat, 0);
              }
            }
          } catch (err) {
            // ignore animation errors
          }

          // fallback immediate
          onSelectCountry(p.country.code);
        }}
      />
    </div>
  );
}
