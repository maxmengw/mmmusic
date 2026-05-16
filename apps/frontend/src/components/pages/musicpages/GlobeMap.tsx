import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Globe from 'react-globe.gl';
import * as topojson from 'topojson-client';
import type { MusicMapCountry } from '@shared/types/musicMap';

type GlobeMapProps = {
  countries: MusicMapCountry[];
  selectedCountryCode?: string;
  onSelectCountry: (code: string, lat?: number, lng?: number) => void;
  resetViewSignal?: number;
};

export default function GlobeMap({ countries, selectedCountryCode, onSelectCountry, resetViewSignal }: GlobeMapProps) {
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

    const mat = globeRef.current?.globeMaterial?.();
    if (mat) {
      const loader = new THREE.TextureLoader();
      loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', (tex: THREE.Texture) => {
        mat.map = tex;
        mat.needsUpdate = true;
      });
      loader.load('https://unpkg.com/three-globe/example/img/earth-topology.png', (tex: THREE.Texture) => {
        mat.bumpMap = tex;
        mat.bumpScale = 0.06;
        mat.needsUpdate = true;
      });
      loader.load('https://unpkg.com/three-globe/example/img/earth-specular.gif', (tex: THREE.Texture) => {
        mat.specularMap = tex;
        mat.specular = new THREE.Color('grey');
        mat.shininess = 10;
        mat.needsUpdate = true;
      });
      loader.load('https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_8192.png', (satTex: THREE.Texture) => {
        (globeRef.current as any).__satelliteTexture = satTex;
      });
    }
  }, []);

  const prevPOVRef = useRef<{ lat: number; lng: number; altitude: number } | null>(null);

  useEffect(() => {
    if (typeof resetViewSignal === 'undefined') return;
    try {
      if (prevPOVRef.current && globeRef.current?.pointOfView) {
        const prev = prevPOVRef.current;
        globeRef.current.pointOfView({ lat: prev.lat, lng: prev.lng, altitude: prev.altitude }, 800);
        setTimeout(() => {
          prevPOVRef.current = null;
        }, 850);
      } else if (globeRef.current?.pointOfView) {
        globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 800);
      } else {
        const controls = globeRef.current?.controls?.();
        if (controls) controls.reset?.();
      }

      // revert satellite texture if applied
      try {
        const mat = globeRef.current?.globeMaterial?.();
        const orig = (globeRef.current as any).__originalMap;
        if (mat && orig) {
          mat.map = orig;
          mat.opacity = 1;
          mat.transparent = false;
          mat.needsUpdate = true;
          delete (globeRef.current as any).__originalMap;
        }
      } catch (err) {
        // ignore
      }

      // remove silhouette if present
      try {
        const scene = globeRef.current?.scene?.() ?? globeRef.current?.scene;
        const sil = (globeRef.current as any).__countrySilhouette as THREE.Mesh | undefined;
        if (sil && scene && scene.remove) {
          scene.remove(sil);
          (globeRef.current as any).__countrySilhouette = undefined;
        }
      } catch (err) {
        // ignore
      }
    } catch (err) {
      // ignore
    }
  }, [resetViewSignal]);

  type PointData = { id: string; lat: number; lng: number; size: number; color: string; country: MusicMapCountry };

  const [polygons, setPolygons] = useState<any[]>([]);

  const selectedCountryName = countries.find((c) => c.code === selectedCountryCode)?.name;

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

  const focusAndTransition = (lat: number, lng: number, code: string) => {
    const focusAltitude = 1.2;
    const animMs = 900;
    try {
      if (globeRef.current?.pointOfView) {
        try {
          const current = globeRef.current.pointOfView();
          if (current) prevPOVRef.current = current;
        } catch (e) {
          // ignore
        }

        globeRef.current.pointOfView({ lat, lng, altitude: focusAltitude }, animMs);

        // create silhouette immediately so it grows during zooms
        try {
          const scene = globeRef.current?.scene?.() ?? globeRef.current?.scene;
          const countryEntry = countries.find((c) => c.code === code);
          const geo = polygons.find((f: any) => {
            const props = f?.properties || {};
            const name = props.name || props.ADMIN || props.admin || props.NAME;
            return name && countryEntry && String(name).toLowerCase() === String(countryEntry.name).toLowerCase();
          });
          if (geo && scene) {
            const feat = geo as any;
            const radius = (globeRef.current?.getGlobeRadius?.() ?? (globeRef.current?.globeRadius ?? 100));
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lng + 180) * (Math.PI / 180);
            const cx = -radius * Math.sin(phi) * Math.cos(theta);
            const cy = radius * Math.cos(phi);
            const cz = radius * Math.sin(phi) * Math.sin(theta);
            const center = new THREE.Vector3(cx, cy, cz).normalize();
            const up = center.clone();
            const arbitrary = new THREE.Vector3(0, 1, 0);
            if (Math.abs(up.dot(arbitrary)) > 0.999) arbitrary.set(1, 0, 0);
            const ux = new THREE.Vector3().crossVectors(arbitrary, up).normalize();
            const uy = new THREE.Vector3().crossVectors(up, ux).normalize();
            const coords = (feat.geometry && feat.geometry.coordinates && feat.geometry.coordinates[0]) || [];
            const ring = Array.isArray(coords[0][0]) ? coords[0][0] : coords[0] || coords;
            const shape = new THREE.Shape();
            let started = false;
            for (let i = 0; i < ring.length; i++) {
              const lon = ring[i][0];
              const latp = ring[i][1];
              const ph = (90 - latp) * (Math.PI / 180);
              const th = (lon + 180) * (Math.PI / 180);
              const px = -radius * Math.sin(ph) * Math.cos(th);
              const py = radius * Math.cos(ph);
              const pz = radius * Math.sin(ph) * Math.sin(th);
              const pos = new THREE.Vector3(px, py, pz).normalize();
              const lx = pos.dot(ux) * radius * 1.01;
              const ly = pos.dot(uy) * radius * 1.01;
              if (!started) {
                shape.moveTo(lx, ly);
                started = true;
              } else {
                shape.lineTo(lx, ly);
              }
            }
            if (started) {
              const geom = new THREE.ShapeGeometry(shape);
              const matSil = new THREE.MeshBasicMaterial({ color: 'black', transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false, depthWrite: false });
              const mesh = new THREE.Mesh(geom, matSil);
              const m = new THREE.Matrix4();
              m.makeBasis(ux, uy, up);
              mesh.applyMatrix4(m);
              mesh.position.copy(center.clone().multiplyScalar(radius * 1.002));
              mesh.renderOrder = 900;
              scene.add(mesh);
              (globeRef.current as any).__countrySilhouette = mesh;
              const startS = performance.now();
              const durS = animMs + 1200;
              const animateSil = (nowS: number) => {
                const tt = Math.min(1, (nowS - startS) / durS);
                matSil.opacity = tt * 0.9;
                mesh.scale.setScalar(0.5 + 1.0 * tt);
                matSil.needsUpdate = true;
                if (tt < 1) requestAnimationFrame(animateSil);
              };
              requestAnimationFrame(animateSil);
            }
          }
        } catch (err) {
          // ignore silhouette errors
        }

        const deepAltitude = 0.35;
        const animMs2 = 1200;
        setTimeout(() => {
          try {
            globeRef.current.pointOfView({ lat, lng, altitude: deepAltitude }, animMs2);
          } catch (e) {
            // ignore
          }
        }, animMs);  // wait for initial zoom to finish before zooming further into the country

        // after both zoom phases, optionally swap to satellite texture and then fade silhouette
        setTimeout(() => {
          try {
            const mat = globeRef.current?.globeMaterial?.();
            const satTex = (globeRef.current as any).__satelliteTexture as THREE.Texture | undefined;
            if (mat && satTex) {
              (globeRef.current as any).__originalMap = mat.map;
              mat.transparent = true;
              mat.opacity = 0;
              mat.map = satTex;
              mat.needsUpdate = true;
              const start = performance.now();
              const dur = 600;
              const fade = (now: number) => {
                const t = Math.min(1, (now - start) / dur);
                mat.opacity = t;
                mat.needsUpdate = true;
                if (t < 1) requestAnimationFrame(fade);
              };
              requestAnimationFrame(fade);
            }
          } catch (err) {
            // ignore
          }

          // fade silhouette out after a short delay
          try {
            const sil = (globeRef.current as any).__countrySilhouette as THREE.Mesh | undefined;
            if (sil) {
              const matSil = sil.material as THREE.Material & { opacity?: number };
              const startF = performance.now() + 900;
              const durF = 900;
              const fadeSil = (now3: number) => {
                const t3 = Math.min(1, (now3 - startF) / durF);
                if (t3 > 0) {
                  if (matSil && typeof matSil.opacity === 'number') matSil.opacity = Math.max(0, 0.9 * (1 - t3));
                  (sil.material as any).needsUpdate = true;
                }
                if (t3 < 1) requestAnimationFrame(fadeSil);
                else {
                  try {
                    const scene2 = globeRef.current?.scene?.() ?? globeRef.current?.scene;
                    if (scene2 && sil && scene2.remove) scene2.remove(sil);
                    delete (globeRef.current as any).__countrySilhouette;
                  } catch (err) {
                    // ignore
                  }
                }
              };
              requestAnimationFrame(fadeSil);
            }
          } catch (err) {
            // ignore
          }

          setTimeout(() => onSelectCountry(code, lat, lng), 250);
        }, animMs + animMs2);
        return;
      }
    } catch (err) {
      // ignore
    }
    onSelectCountry(code, lat, lng);
  };

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
        onPointClick={(point: object) => {
          const p = point as PointData;
          focusAndTransition(p.lat, p.lng, p.country.code);
        }}
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
          if (match) focusAndTransition(match.lat ?? 0, match.lng ?? 0, match.code);
        }}
      />
    </div>
  );
}
