import type { MutableRefObject } from 'react';
import * as THREE from 'three';
import type { MusicMapCountry } from '@shared/types/musicMap';
import { getFeatureName, resolveCountryCenter } from './globeMapUtils';

type PrevPov = { lat: number; lng: number; altitude: number } | null;

const setGlobeControls = (globeRef: MutableRefObject<any>) => {
  const controls = globeRef.current?.controls?.();
  if (controls) {
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.28;
    controls.enableZoom = true;
  }
};

export const applyGlobeAssets = (globeRef: MutableRefObject<any>) => {
  setGlobeControls(globeRef);

  const mat = globeRef.current?.globeMaterial?.();
  if (!mat) return;

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
    globeRef.current.__satelliteTexture = satTex;
  });
};

export const resetGlobeView = (globeRef: MutableRefObject<any>, prevPovRef: MutableRefObject<PrevPov>) => {
  try {
    setGlobeControls(globeRef);

    if (prevPovRef.current && globeRef.current?.pointOfView) {
      const prev = prevPovRef.current;
      globeRef.current.pointOfView({ lat: prev.lat, lng: prev.lng, altitude: prev.altitude }, 800);
      window.setTimeout(() => {
        prevPovRef.current = null;
      }, 850);
    } else if (globeRef.current?.pointOfView) {
      globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 800);
    } else {
      const controls = globeRef.current?.controls?.();
      if (controls) controls.reset?.();
    }

    try {
      const mat = globeRef.current?.globeMaterial?.();
      const orig = globeRef.current.__originalMap;
      if (mat && orig) {
        mat.map = orig;
        mat.opacity = 1;
        mat.transparent = false;
        mat.needsUpdate = true;
        delete globeRef.current.__originalMap;
      }
    } catch {
      // ignore
    }

    try {
      const scene = globeRef.current?.scene?.() ?? globeRef.current?.scene;
      const sil = globeRef.current.__countrySilhouette as THREE.Mesh | undefined;
      if (sil && scene && scene.remove) {
        scene.remove(sil);
        globeRef.current.__countrySilhouette = undefined;
      }
    } catch {
      // ignore
    }
  } catch {
    // ignore
  }
};

type FocusGlobeParams = {
  globeRef: MutableRefObject<any>;
  countries: MusicMapCountry[];
  polygons: any[];
  lat: number;
  lng: number;
  code: string;
  name?: string;
  onSelectCountry: (code: string, lat?: number, lng?: number, name?: string) => void;
  prevPovRef: MutableRefObject<PrevPov>;
};

const createCountrySilhouette = (globeRef: MutableRefObject<any>, countries: MusicMapCountry[], polygons: any[], lat: number, lng: number, code: string) => {
  try {
    const scene = globeRef.current?.scene?.() ?? globeRef.current?.scene;
    if (!scene) return;

    const countryEntry = countries.find((country) => country.code === code);
    const geo = polygons.find((feature: any) => {
      const name = getFeatureName(feature);
      return name && countryEntry && name.toLowerCase() === countryEntry.name.toLowerCase();
    });

    if (!geo) return;

    const radius = globeRef.current?.getGlobeRadius?.() ?? globeRef.current?.globeRadius ?? 100;
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
    const coords = (geo.geometry && geo.geometry.coordinates && geo.geometry.coordinates[0]) || [];
    const ring = Array.isArray(coords[0][0]) ? coords[0][0] : coords[0] || coords;
    const shape = new THREE.Shape();
    let started = false;

    for (let index = 0; index < ring.length; index += 1) {
      const lon = ring[index][0];
      const latPoint = ring[index][1];
      const pointPhi = (90 - latPoint) * (Math.PI / 180);
      const pointTheta = (lon + 180) * (Math.PI / 180);
      const px = -radius * Math.sin(pointPhi) * Math.cos(pointTheta);
      const py = radius * Math.cos(pointPhi);
      const pz = radius * Math.sin(pointPhi) * Math.sin(pointTheta);
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

    if (!started) return;

    const geom = new THREE.ShapeGeometry(shape);
    const matSil = new THREE.MeshBasicMaterial({ color: 'black', transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false, depthWrite: false });
    const mesh = new THREE.Mesh(geom, matSil);
    const matrix = new THREE.Matrix4();
    matrix.makeBasis(ux, uy, up);
    mesh.applyMatrix4(matrix);
    mesh.position.copy(center.clone().multiplyScalar(radius * 1.002));
    mesh.renderOrder = 900;
    scene.add(mesh);
    globeRef.current.__countrySilhouette = mesh;

    const start = performance.now();
    const duration = 2100;
    const animateSilhouette = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      matSil.opacity = t * 0.9;
      mesh.scale.setScalar(0.5 + 1.0 * t);
      matSil.needsUpdate = true;
      if (t < 1) requestAnimationFrame(animateSilhouette);
    };

    requestAnimationFrame(animateSilhouette);
  } catch {
    // ignore silhouette errors
  }
};

export const focusGlobeOnCountry = ({
  globeRef,
  countries,
  polygons,
  lat,
  lng,
  code,
  name,
  onSelectCountry,
  prevPovRef,
}: FocusGlobeParams) => {
  const focusAltitude = 1.2;
  const initialDuration = 900;

  try {
    const controls = globeRef.current?.controls?.();
    if (controls) {
      controls.autoRotate = false;
    }

    if (globeRef.current?.pointOfView) {
      try {
        const current = globeRef.current.pointOfView();
        if (current) prevPovRef.current = current;
      } catch {
        // ignore
      }

      globeRef.current.pointOfView({ lat, lng, altitude: focusAltitude }, initialDuration);
      createCountrySilhouette(globeRef, countries, polygons, lat, lng, code);

      const deepAltitude = 0.35;
      const deepDuration = 1200;
      window.setTimeout(() => {
        try {
          globeRef.current.pointOfView({ lat, lng, altitude: deepAltitude }, deepDuration);
        } catch {
          // ignore
        }
      }, initialDuration);

      window.setTimeout(() => {
        try {
          const mat = globeRef.current?.globeMaterial?.();
          const satTex = globeRef.current.__satelliteTexture as THREE.Texture | undefined;
          if (mat && satTex) {
            globeRef.current.__originalMap = mat.map;
            mat.transparent = true;
            mat.opacity = 0;
            mat.map = satTex;
            mat.needsUpdate = true;
            const start = performance.now();
            const duration = 600;
            const fade = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              mat.opacity = t;
              mat.needsUpdate = true;
              if (t < 1) requestAnimationFrame(fade);
            };
            requestAnimationFrame(fade);
          }
        } catch {
          // ignore
        }

        try {
          const sil = globeRef.current.__countrySilhouette as THREE.Mesh | undefined;
          if (sil) {
            const matSil = sil.material as THREE.Material & { opacity?: number };
            const startFade = performance.now() + 900;
            const fadeDuration = 900;
            const fadeSilhouette = (now: number) => {
              const t = Math.min(1, (now - startFade) / fadeDuration);
              if (t > 0) {
                if (matSil && typeof matSil.opacity === 'number') matSil.opacity = Math.max(0, 0.9 * (1 - t));
                (sil.material as any).needsUpdate = true;
              }
              if (t < 1) {
                requestAnimationFrame(fadeSilhouette);
              } else {
                try {
                  const scene = globeRef.current?.scene?.() ?? globeRef.current?.scene;
                  if (scene && sil && scene.remove) scene.remove(sil);
                  delete globeRef.current.__countrySilhouette;
                } catch {
                  // ignore
                }
              }
            };
            requestAnimationFrame(fadeSilhouette);
          }
        } catch {
          // ignore
        }

        window.setTimeout(() => onSelectCountry(code, lat, lng, name), 250);
      }, initialDuration + deepDuration);

      return;
    }
  } catch {
    // ignore
  }

  const fallback = resolveCountryCenter(name ?? '', polygons.find((feature: any) => getFeatureName(feature).toLowerCase() === String(name ?? '').toLowerCase()));
  if (fallback) {
    onSelectCountry(code, fallback.lat, fallback.lng, name);
    return;
  }

  onSelectCountry(code, lat, lng, name);
};
