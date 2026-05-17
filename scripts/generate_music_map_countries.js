const fs = require('fs');
const path = require('path');

const GEOJSON_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
const OUT_FILE = path.join(__dirname, '..', 'shared', 'data', 'musicMapCountries.ts');

const ERAS = ['1960s','1980s','2000s','2020s'];

function normalizeCode(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'country';
}

function centroidFromCoords(coords) {
  // coords expected as [ [lon, lat], ... ]
  if (!Array.isArray(coords) || coords.length === 0) return { lat: 0, lng: 0 };
  let latSum = 0, lngSum = 0, n = 0;
  for (const p of coords) {
    if (!Array.isArray(p)) continue;
    const lon = Number(p[0]);
    const lat = Number(p[1]);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      latSum += lat;
      lngSum += lon;
      n += 1;
    }
  }
  if (n === 0) return { lat: 0, lng: 0 };
  return { lat: latSum / n, lng: lngSum / n };
}

async function main() {
  console.log('Fetching countries geojson...');
  const res = await fetch(GEOJSON_URL);
  if (!res.ok) throw new Error('Failed to fetch geojson: ' + res.statusText);
  const geo = await res.json();
  const features = geo.features || [];

  const records = [];

  for (const feat of features) {
    const props = feat.properties || {};
    const name = props.ADMIN || props.name || props.NAME || props.NAME_LONG || props.SOVEREIGNT || 'Unknown';
    const region = props.CONTINENT || props.REGION_UN || 'Global';
    let lat = 0, lng = 0;
    try {
      const geom = feat.geometry || {};
      if (geom.type === 'Point' && Array.isArray(geom.coordinates)) {
        lng = geom.coordinates[0]; lat = geom.coordinates[1];
      } else if (geom.type === 'Polygon' && Array.isArray(geom.coordinates)) {
        const ring = geom.coordinates[0] || [];
        const c = centroidFromCoords(ring);
        lat = c.lat; lng = c.lng;
      } else if (geom.type === 'MultiPolygon' && Array.isArray(geom.coordinates)) {
        const ring = geom.coordinates[0] && geom.coordinates[0][0] ? geom.coordinates[0][0] : (geom.coordinates[0] || []);
        const c = centroidFromCoords(ring);
        lat = c.lat; lng = c.lng;
      }
    } catch (e) {
      // fallback zero
    }

    const code = normalizeCode(name);
    const songs = {};
    for (const era of ERAS) {
      const yearBase = era === '1960s' ? [1964,1968] : era === '1980s' ? [1983,1988] : era === '2000s' ? [2004,2009] : [2023,2025];
      const genrePairs = era === '1960s' ? ['Vintage Pop','Soul Folk'] : era === '1980s' ? ['Synth Pop','New Wave'] : era === '2000s' ? ['Electro Pop','Indie Electronic'] : ['Alt Pop','Global Electronic'];
      songs[era] = [
        { id: `${code}-${era}-1`, title: `${name} Soundscape I`, artist: `${name} Collective`, videoId: `${code}-${era}-sample-1`, year: yearBase[0], genre: genrePairs[0], description: `Representative ${era} style inspired by ${name}'s regional sound.` },
        { id: `${code}-${era}-2`, title: `${name} Soundscape II`, artist: `${name} Studio`, videoId: `${code}-${era}-sample-2`, year: yearBase[1], genre: genrePairs[1], description: `Representative track for ${name} (${era}).` },
      ];
    }

    records.push({ code, name, region, position: { top: '50%', left: '50%' }, lat, lng, description: `${name} starter tracks. Replace with real selections as desired.`, songs });
  }

  const out = `import type { MusicMapCountry, MusicMapEra } from '@shared/types/musicMap';\n\nexport const MUSIC_MAP_ERAS: MusicMapEra[] = ${JSON.stringify(ERAS, null, 2)};\n\nexport const MUSIC_MAP_COUNTRIES: MusicMapCountry[] = ${JSON.stringify(records, null, 2)};\n`;

  fs.writeFileSync(OUT_FILE, out, 'utf8');
  console.log('Wrote', OUT_FILE, 'with', records.length, 'countries');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
