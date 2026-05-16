import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Globe from 'react-globe.gl';
import * as topojson from 'topojson-client';
import type { MusicMapCountry } from '@shared/types/musicMap';

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

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.28;
        controls.enableZoom = true;

      }
    }

    const mat = globeRef.current?.globeMaterial?.();
    if (mat) {
      const loader = new THREE.TextureLoader();
      loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', (tex: THREE.Texture) => {
        mat.map = tex;
        mat.color = new THREE.Color('#9ad4ff');
        mat.emissive = new THREE.Color('#0c2b5a');
        mat.emissiveIntensity = 0.35;
        mat.needsUpdate = true;
      });
      loader.load('https://unpkg.com/three-globe/example/img/earth-topology.png', (tex: THREE.Texture) => {
        mat.bumpMap = tex;
        mat.bumpScale = 0.1;
        mat.needsUpdate = true;
      });
      loader.load('https://unpkg.com/three-globe/example/img/earth-specular.gif', (tex: THREE.Texture) => {
        mat.specularMap = tex;
        mat.specular = new THREE.Color('#4cc9ff');
        mat.shininess = 22;
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
      const controls = globeRef.current?.controls?.();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.28;
      }

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

  type PointData = {
    id: string;
    code: string;
    name: string;
    region: string;
    lat: number;
    lng: number;
    size: number;
    color: string;
    isPreset: boolean;
  };

  const [polygons, setPolygons] = useState<any[]>([]);

  const resolvedSelectedCountryName = selectedCountryName ?? countries.find((c) => c.code === selectedCountryCode)?.name;

  const normalizeCountryKey = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  const buildCountryCode = (name: string) =>
    String(name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const capitalCoordsByCountry: Record<string, { lat: number; lng: number }> = {
    vietnam: { lat: 21.0278, lng: 105.8342 },
    'viet nam': { lat: 21.0278, lng: 105.8342 },
    china: { lat: 39.9042, lng: 116.4074 },
    japan: { lat: 35.6762, lng: 139.6503 },
    'south korea': { lat: 37.5665, lng: 126.978 },
    'north korea': { lat: 39.0392, lng: 125.7625 },
    thailand: { lat: 13.7563, lng: 100.5018 },
    laos: { lat: 17.9757, lng: 102.6331 },
    cambodia: { lat: 11.5564, lng: 104.9282 },
    myanmar: { lat: 19.7633, lng: 96.0785 },
    malaysia: { lat: 3.139, lng: 101.6869 },
    singapore: { lat: 1.3521, lng: 103.8198 },
    indonesia: { lat: -6.2088, lng: 106.8456 },
    philippines: { lat: 14.5995, lng: 120.9842 },
    india: { lat: 28.6139, lng: 77.209 },
    pakistan: { lat: 33.6844, lng: 73.0479 },
    bangladesh: { lat: 23.8103, lng: 90.4125 },
    nepal: { lat: 27.7172, lng: 85.324 },
    'sri lanka': { lat: 6.9271, lng: 79.8612 },
    'united states': { lat: 38.9072, lng: -77.0369 },
    'united states of america': { lat: 38.9072, lng: -77.0369 },
    canada: { lat: 45.4215, lng: -75.6972 },
    mexico: { lat: 19.4326, lng: -99.1332 },
    brazil: { lat: -15.7939, lng: -47.8828 },
    argentina: { lat: -34.6037, lng: -58.3816 },
    chile: { lat: -33.4489, lng: -70.6693 },
    peru: { lat: -12.0464, lng: -77.0428 },
    colombia: { lat: 4.711, lng: -74.0721 },
    'united kingdom': { lat: 51.5074, lng: -0.1278 },
    france: { lat: 48.8566, lng: 2.3522 },
    germany: { lat: 52.52, lng: 13.405 },
    italy: { lat: 41.9028, lng: 12.4964 },
    spain: { lat: 40.4168, lng: -3.7038 },
    portugal: { lat: 38.7223, lng: -9.1393 },
    netherlands: { lat: 52.3676, lng: 4.9041 },
    belgium: { lat: 50.8503, lng: 4.3517 },
    switzerland: { lat: 46.948, lng: 7.4474 },
    austria: { lat: 48.2082, lng: 16.3738 },
    poland: { lat: 52.2297, lng: 21.0122 },
    ukraine: { lat: 50.4501, lng: 30.5234 },
    russia: { lat: 55.7558, lng: 37.6173 },
    turkey: { lat: 39.9334, lng: 32.8597 },
    'saudi arabia': { lat: 24.7136, lng: 46.6753 },
    'united arab emirates': { lat: 24.4539, lng: 54.3773 },
    iran: { lat: 35.6892, lng: 51.389 },
    iraq: { lat: 33.3152, lng: 44.3661 },
    israel: { lat: 31.7683, lng: 35.2137 },
    egypt: { lat: 30.0444, lng: 31.2357 },
    'south africa': { lat: -25.7479, lng: 28.2293 },
    nigeria: { lat: 9.0765, lng: 7.3986 },
    kenya: { lat: -1.2921, lng: 36.8219 },
    ethiopia: { lat: 8.9806, lng: 38.7578 },
    australia: { lat: -35.2809, lng: 149.13 },
    'new zealand': { lat: -41.2866, lng: 174.7756 },
  };

  const countryNameAliases: Record<string, string> = {
    'russian federation': 'russia',
    'iran islamic republic of': 'iran',
    'venezuela bolivarian republic of': 'venezuela',
    'bolivia plurinational state of': 'bolivia',
    'tanzania united republic of': 'tanzania',
    'moldova republic of': 'moldova',
    'syrian arab republic': 'syria',
    "korea democratic peoples republic of": 'north korea',
    'korea republic of': 'south korea',
    'czech republic': 'czechia',
    'cote d ivoire': 'ivory coast',
    'congo democratic republic of the': 'democratic republic of the congo',
    'congo republic of the': 'republic of the congo',
    'united states america': 'united states of america',
    'viet nam': 'vietnam',
  };

  const resolveCapitalByName = (countryName: string): { lat: number; lng: number } | null => {
    const key = normalizeCountryKey(countryName);
    const direct = capitalCoordsByCountry[key];
    if (direct) return direct;

    const aliasTarget = countryNameAliases[key];
    if (aliasTarget) {
      const aliasCapital = capitalCoordsByCountry[normalizeCountryKey(aliasTarget)];
      if (aliasCapital) return aliasCapital;
    }

    const withoutParens = normalizeCountryKey(key.replace(/\([^)]*\)/g, ''));
    if (withoutParens && withoutParens !== key) {
      const parenCapital = capitalCoordsByCountry[withoutParens];
      if (parenCapital) return parenCapital;
      const parenAlias = countryNameAliases[withoutParens];
      if (parenAlias) {
        const parenAliasCapital = capitalCoordsByCountry[normalizeCountryKey(parenAlias)];
        if (parenAliasCapital) return parenAliasCapital;
      }
    }

    const cleaned = normalizeCountryKey(
      key
        .replace(/^the\s+/, '')
        .replace(/\s+of\s+the\s*$/g, '')
        .replace(/\s+republic\s+of\s+/g, ' ')
    );
    if (cleaned && cleaned !== key) {
      const cleanedCapital = capitalCoordsByCountry[cleaned];
      if (cleanedCapital) return cleanedCapital;
      const cleanedAlias = countryNameAliases[cleaned];
      if (cleanedAlias) {
        const cleanedAliasCapital = capitalCoordsByCountry[normalizeCountryKey(cleanedAlias)];
        if (cleanedAliasCapital) return cleanedAliasCapital;
      }
    }

    return null;
  };

  const estimateLatLngFromFeature = (feat: any): { lat: number; lng: number } | null => {
    const geometry = feat?.geometry;
    if (!geometry?.coordinates) return null;

    const toOuterRings = (): number[][][] => {
      if (geometry.type === 'Polygon') {
        return [geometry.coordinates?.[0] ?? []];
      }
      if (geometry.type === 'MultiPolygon') {
        return (geometry.coordinates ?? []).map((poly: number[][][]) => poly?.[0] ?? []);
      }
      return [];
    };

    const polygonCentroid = (ring: number[][]): { lat: number; lng: number; areaAbs: number } | null => {
      if (!ring.length) return null;

      const points = ring;
      let area2 = 0;
      let cxSum = 0;
      let cySum = 0;

      for (let index = 0; index < points.length - 1; index += 1) {
        const [x0, y0] = points[index] ?? [0, 0];
        const [x1, y1] = points[index + 1] ?? [0, 0];
        const cross = x0 * y1 - x1 * y0;
        area2 += cross;
        cxSum += (x0 + x1) * cross;
        cySum += (y0 + y1) * cross;
      }

      if (Math.abs(area2) < 1e-9) {
        let lngSum = 0;
        let latSum = 0;
        for (const point of points) {
          lngSum += Number(point?.[0] ?? 0);
          latSum += Number(point?.[1] ?? 0);
        }
        return {
          lat: latSum / points.length,
          lng: lngSum / points.length,
          areaAbs: 0,
        };
      }

      return {
        lng: cxSum / (3 * area2),
        lat: cySum / (3 * area2),
        areaAbs: Math.abs(area2),
      };
    };

    let best: { lat: number; lng: number; areaAbs: number } | null = null;
    for (const ring of toOuterRings()) {
      const centroid = polygonCentroid(ring);
      if (!centroid) continue;
      if (!best || centroid.areaAbs > best.areaAbs) {
        best = centroid;
      }
    }

    if (!best) return null;
    return { lat: best.lat, lng: best.lng };
  };

  const resolveCountryCenter = (countryName: string, feat: any): { lat: number; lng: number } | null => {
    const capital = resolveCapitalByName(countryName);
    if (capital) return capital;
    return estimateLatLngFromFeature(feat);
  };

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

  const points: PointData[] = (() => {
    const byName = new Set<string>();
    const result: PointData[] = [];

    for (const country of countries) {
      const code = country.code;
      result.push({
        id: `preset-${code}`,
        code,
        name: country.name,
        region: country.region,
        lat: country.lat ?? 0,
        lng: country.lng ?? 0,
        size: code === selectedCountryCode ? 0.9 : 0.6,
        color: code === selectedCountryCode ? 'rgba(98,210,162,0.95)' : 'rgba(255,209,102,0.95)',
        isPreset: true,
      });
      byName.add(normalizeCountryKey(country.name));
    }

    for (const feature of polygons) {
      const props = feature?.properties || {};
      const name = String(props.name || props.ADMIN || props.admin || props.NAME || '').trim();
      if (!name) continue;
      const key = normalizeCountryKey(name);
      if (byName.has(key)) continue;

      const centroid = resolveCountryCenter(name, feature);
      if (!centroid) continue;

      const code = buildCountryCode(name) || 'country';
      result.push({
        id: `generated-${code}`,
        code,
        name,
        region: 'Global',
        lat: centroid.lat,
        lng: centroid.lng,
        // match preset sizing/color so generated points look consistent
        size: code === selectedCountryCode ? 0.9 : 0.6,
        color: code === selectedCountryCode ? 'rgba(98,210,162,0.95)' : 'rgba(255,209,102,0.95)',
        isPreset: false,
      });
      byName.add(key);
    }

    return result;
  })();

  const focusAndTransition = (lat: number, lng: number, code: string, name?: string) => {
    const focusAltitude = 1.2;
    const animMs = 900;
    try {
      const controls = globeRef.current?.controls?.();
      if (controls) {
        controls.autoRotate = false;
      }

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

          setTimeout(() => onSelectCountry(code, lat, lng, name), 250);
        }, animMs + animMs2);
        return;
      }
    } catch (err) {
      // ignore
    }
    onSelectCountry(code, lat, lng, name);
  };

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
        pointColor={(obj: object) => (obj as PointData).color}
        pointRadius={(obj: object) => (obj as PointData).size}
        pointAltitude={0.02}
        pointLabel={(obj: object) => {
          const point = obj as PointData;
          return `${point.name}: ${point.region}`;
        }}
        onPointClick={(point: object) => {
          const p = point as PointData;
          focusAndTransition(p.lat, p.lng, p.code, p.name);
        }}
        polygonsData={polygons}
        polygonCapColor={(feat: any) => {
          const props = feat.properties || {};
          const name = props.name || props.ADMIN || props.admin || props.NAME;
          return name === resolvedSelectedCountryName ? 'rgba(70,220,255,0.95)' : 'rgba(255,255,255,0.05)';
        }}
        polygonSideColor={() => 'rgba(34,92,140,0.22)'}
        polygonStrokeColor={() => 'rgba(118,219,255,0.34)'}
        polygonAltitude={(feat: any) => {
          const props = feat.properties || {};
          const name = props.name || props.ADMIN || props.admin || props.NAME;
          return name === resolvedSelectedCountryName ? 0.015 : 0.0005;
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
            focusAndTransition(match.lat ?? 0, match.lng ?? 0, match.code);
            return;
          }

          const centroid = resolveCountryCenter(String(name), feat);
          if (!centroid) return;
          const generatedCode = buildCountryCode(String(name));
          focusAndTransition(centroid.lat, centroid.lng, generatedCode || 'country', String(name));
        }}
      />
    </div>
  );
}
