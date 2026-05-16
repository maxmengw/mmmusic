// use global fetch (Node 18+) via globalThis to avoid requiring node-fetch

export interface MusicMeta {
  title?: string;
  artist?: string;
  releaseId?: string;
  releaseDate?: string;
  coverUrl?: string | null;
}

export async function fetchMusicMeta(artist?: string, title?: string): Promise<MusicMeta | null> {
  try {
    if (!artist && !title) return null;

    // simple in-memory cache to reduce repeated MusicBrainz/CAA requests
    const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
    type CacheEntry = { meta: MusicMeta | null; expires: number };
    const cacheKey = `${artist ?? ''}::${title ?? ''}`.toLowerCase();

    // attach cache to module so it persists across calls
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof (global as any).__musicMetaCache === 'undefined') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (global as any).__musicMetaCache = new Map<string, CacheEntry>();
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const cache: Map<string, CacheEntry> = (global as any).__musicMetaCache;

    const existing = cache.get(cacheKey);
    if (existing && existing.expires > Date.now()) {
      return existing.meta;
    }

    const parts: string[] = [];
    if (title) parts.push(`recording:${title}`);
    if (artist) parts.push(`artist:${artist}`);
    const q = encodeURIComponent(parts.join(' AND '));
    const url = `https://musicbrainz.org/ws/2/recording/?query=${q}&fmt=json&limit=1`;

      const res = await (globalThis as any).fetch(url, {
      headers: {
        'User-Agent': 'mms_music/1.0 (contact@example.com)'
      }
    });
    if (!res.ok) {
      cache.set(cacheKey, { meta: null, expires: Date.now() + CACHE_TTL_MS });
      return null;
    }
    const data = await res.json();
    const rec = data.recordings && data.recordings[0];
    if (!rec) {
      cache.set(cacheKey, { meta: null, expires: Date.now() + CACHE_TTL_MS });
      return null;
    }

    const meta: MusicMeta = {
      title: rec.title,
      artist: (rec['artist-credit'] || []).map((a: any) => a.name).join(', '),
      releaseId: rec.releases && rec.releases[0] && rec.releases[0].id,
      releaseDate: rec.releases && rec.releases[0] && rec.releases[0].date,
      coverUrl: null,
    };

    if (meta.releaseId) {
      const coverUrl = `https://coverartarchive.org/release/${meta.releaseId}/front-250`;
      try {
          const c = await (globalThis as any).fetch(coverUrl, { method: 'HEAD' });
        if (c.ok) {
          meta.coverUrl = coverUrl;
        }
      } catch (err) {
        // ignore cover fetch errors
      }
    }

    cache.set(cacheKey, { meta, expires: Date.now() + CACHE_TTL_MS });
    return meta;
  } catch (err) {
    return null;
  }
}
