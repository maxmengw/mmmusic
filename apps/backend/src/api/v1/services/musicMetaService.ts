import fetch from 'node-fetch';

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

    const parts: string[] = [];
    if (title) parts.push(`recording:${title}`);
    if (artist) parts.push(`artist:${artist}`);
    const q = encodeURIComponent(parts.join(' AND '));
    const url = `https://musicbrainz.org/ws/2/recording/?query=${q}&fmt=json&limit=1`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'mms_music/1.0 (contact@example.com)'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const rec = data.recordings && data.recordings[0];
    if (!rec) return null;

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
        const c = await fetch(coverUrl, { method: 'HEAD' });
        if (c.ok) {
          meta.coverUrl = coverUrl;
        }
      } catch (err) {
        // ignore cover fetch errors
      }
    }

    return meta;
  } catch (err) {
    return null;
  }
}
