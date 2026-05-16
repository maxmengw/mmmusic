import type { MusicMapCountry } from '@shared/types/musicMap';

export type PointData = {
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

export const normalizeCountryKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const buildCountryCode = (name: string) =>
  String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const capitalCoordsByCountry: Record<string, { lat: number; lng: number }> = {
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

export const countryNameAliases: Record<string, string> = {
  'russian federation': 'russia',
  'iran islamic republic of': 'iran',
  'venezuela bolivarian republic of': 'venezuela',
  'bolivia plurinational state of': 'bolivia',
  'tanzania united republic of': 'tanzania',
  'moldova republic of': 'moldova',
  'syrian arab republic': 'syria',
  'korea democratic peoples republic of': 'north korea',
  'korea republic of': 'south korea',
  'czech republic': 'czechia',
  'cote d ivoire': 'ivory coast',
  'congo democratic republic of the': 'democratic republic of the congo',
  'congo republic of the': 'republic of the congo',
  'united states america': 'united states of america',
  'viet nam': 'vietnam',
};

export const resolveCapitalByName = (countryName: string): { lat: number; lng: number } | null => {
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
      .replace(/\s+republic\s+of\s+/g, ' '),
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

export const getFeatureName = (feat: any): string => {
  const props = feat?.properties || {};
  return String(props.name || props.ADMIN || props.admin || props.NAME || '').trim();
};

export const estimateLatLngFromFeature = (feat: any): { lat: number; lng: number } | null => {
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

    let area2 = 0;
    let cxSum = 0;
    let cySum = 0;

    for (let index = 0; index < ring.length - 1; index += 1) {
      const [x0, y0] = ring[index] ?? [0, 0];
      const [x1, y1] = ring[index + 1] ?? [0, 0];
      const cross = x0 * y1 - x1 * y0;
      area2 += cross;
      cxSum += (x0 + x1) * cross;
      cySum += (y0 + y1) * cross;
    }

    if (Math.abs(area2) < 1e-9) {
      let lngSum = 0;
      let latSum = 0;
      for (const point of ring) {
        lngSum += Number(point?.[0] ?? 0);
        latSum += Number(point?.[1] ?? 0);
      }
      return {
        lat: latSum / ring.length,
        lng: lngSum / ring.length,
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

export const resolveCountryCenter = (countryName: string, feat: any): { lat: number; lng: number } | null => {
  const capital = resolveCapitalByName(countryName);
  if (capital) return capital;
  return estimateLatLngFromFeature(feat);
};

export const buildGlobePoints = (
  countries: MusicMapCountry[],
  polygons: any[],
  selectedCountryCode?: string,
): PointData[] => {
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
    const name = getFeatureName(feature);
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
      size: code === selectedCountryCode ? 0.9 : 0.6,
      color: code === selectedCountryCode ? 'rgba(98,210,162,0.95)' : 'rgba(255,209,102,0.95)',
      isPreset: false,
    });
    byName.add(key);
  }

  return result;
};
