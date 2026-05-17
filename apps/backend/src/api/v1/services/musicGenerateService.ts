import { MUSIC_MAP_COUNTRIES } from '../../../../../../shared/data/musicMapCountries';
import { fetchMusicMeta } from './musicMetaService';

export type Candidate = {
  title: string;
  artist: string;
  coverUrl?: string | null;
  source: string;
  year?: number;
};

const CACHE_TTL = 1000 * 60 * 60 * 24; // 24h
// attach module cache map
// @ts-ignore
if (typeof (global as any).__albumCandidatesCache === 'undefined') {
  // @ts-ignore
  (global as any).__albumCandidatesCache = new Map<string, { items: Candidate[]; expires: number }>();
}
// @ts-ignore
const cache: Map<string, { items: Candidate[]; expires: number }> = (global as any).__albumCandidatesCache;

async function queryItunes(term: string, limit = 10): Promise<Candidate[]> {
  try {
    const q = encodeURIComponent(term);
    const url = `https://itunes.apple.com/search?term=${q}&entity=song&limit=${limit}`;
    const res = await (globalThis as any).fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r: any) => ({
      title: r.trackName,
      artist: r.artistName,
      coverUrl: r.artworkUrl100 ? String(r.artworkUrl100).replace(/100x100bb.jpg$/, '600x600bb.jpg') : null,
      source: 'itunes',
      year: r.releaseDate ? Number(new Date(r.releaseDate).getFullYear()) : undefined,
    }));
  } catch (err) {
    return [];
  }
}

function isPlaceholderCountrySong(title: string, artist: string): boolean {
  const normalizedTitle = title.toLowerCase();
  const normalizedArtist = artist.toLowerCase();
  return normalizedTitle.includes('soundscape') || normalizedArtist.includes('collective') || normalizedArtist.includes('studio');
}

export async function generateCountryCandidates(countryKeyOrName: string, count = 6, era?: string): Promise<Candidate[]> {
  const key = `gen:${String(countryKeyOrName).toLowerCase()}:${String(era ?? 'any')}:${count}`;
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expires > now) return cached.items;

  const items: Candidate[] = [];
  const normalizedCountryKey = String(countryKeyOrName).toLowerCase();

  // try to find a matching country entry
  const country = MUSIC_MAP_COUNTRIES.find((c: any) => c.code === normalizedCountryKey || c.name.toLowerCase() === normalizedCountryKey);

  // map eras to year ranges for era-based searching
  const ERA_YEARS: Record<string, [number, number]> = {
    '1960s': [1960, 1969],
    '1980s': [1980, 1989],
    '2000s': [2000, 2009],
    '2020s': [2020, 2029],
  };

  // 1) Try using country.songs -> fetchMusicMeta to get coverUrl when available.
  // If the country dataset is only placeholder content, prefer external results first so the
  // first generated card can show a real cover.
  if (country) {
    const erasToCheck = era ? [era] : Object.keys(country.songs || {});
    const realCandidates: Candidate[] = [];
    const seedCandidates: Candidate[] = [];
    let hasPlaceholderSongs = false;

    for (const e of erasToCheck) {
      const eraSongs = (country.songs as any)[e] as any[] | undefined;
      if (!eraSongs) continue;
      for (const s of eraSongs) {
        if (realCandidates.length + seedCandidates.length >= count) break;

        const placeholder = isPlaceholderCountrySong(s.title, s.artist);
        hasPlaceholderSongs = hasPlaceholderSongs || placeholder;

        try {
          const meta = await fetchMusicMeta(s.artist, s.title);
          if (meta?.coverUrl) {
            if (era && meta.releaseDate) {
              const yr = Number(new Date(meta.releaseDate).getFullYear());
              const range = ERA_YEARS[era];
              if (!range || (yr >= range[0] && yr <= range[1])) {
                realCandidates.push({ title: s.title, artist: s.artist, coverUrl: meta.coverUrl, source: 'musicbrainz', year: yr });
                continue;
              }
            } else {
              realCandidates.push({ title: s.title, artist: s.artist, coverUrl: meta.coverUrl, source: 'musicbrainz', year: meta.releaseDate ? Number(new Date(meta.releaseDate).getFullYear()) : undefined });
              continue;
            }
          }

          seedCandidates.push({ title: s.title, artist: s.artist, coverUrl: null, source: 'seed', year: s.year });
        } catch (err) {
          seedCandidates.push({ title: s.title, artist: s.artist, coverUrl: null, source: 'seed', year: s.year });
        }
      }
      if (realCandidates.length + seedCandidates.length >= count) break;
    }

    if (hasPlaceholderSongs) {
      const countryTerms = [`${country.name} popular`, `${country.name} music`, `${country.name} songs`];
      const eraRange = era ? ERA_YEARS[era] : undefined;

      for (const term of countryTerms) {
        if (realCandidates.length >= count) break;
        const res = await queryItunes(term, 25);
        for (const r of res) {
          if (realCandidates.length >= count) break;
          if (eraRange && r.year && (r.year < eraRange[0] || r.year > eraRange[1])) continue;
          if (!realCandidates.find((it) => it.title === r.title && it.artist === r.artist)) realCandidates.push(r);
        }
      }
    }

    if (hasPlaceholderSongs && realCandidates.length) {
      items.push(...realCandidates);
      if (items.length < count) items.push(...seedCandidates);
    } else {
      items.push(...realCandidates, ...seedCandidates);
    }
  }

  // 2) If we do not have a matching country dataset, or the country dataset is still empty,
  // supplement via iTunes using the country name.
  if ((!country || items.length < count) && items.length < count) {
    const tryTerms = [] as string[];
    tryTerms.push(`${countryKeyOrName} popular`);
    tryTerms.push(`${countryKeyOrName} top songs`);

    // if era provided, attempt year filtering after iTunes results
    const eraRange = era ? ERA_YEARS[era] : undefined;

    for (const term of tryTerms) {
      if (items.length >= count) break;
      const res = await queryItunes(term, 20);
      for (const r of res) {
        if (items.length >= count) break;
        if (eraRange && r.year) {
          if (r.year < eraRange[0] || r.year > eraRange[1]) continue;
        }
        if (!items.find((it) => it.title === r.title && it.artist === r.artist)) items.push(r);
      }
    }
  }

  // 3) pad with fallback entries if needed
  while (items.length < count) {
    items.push({
      title: country ? `${country.name} Soundscape` : 'Unknown',
      artist: country ? `${country.name} Collective` : String(countryKeyOrName),
      coverUrl: null,
      source: 'fallback',
      year: era ? ERA_YEARS[era]?.[0] : undefined,
    });
  }

  cache.set(key, { items, expires: now + CACHE_TTL });
  return items.slice(0, count);
}
