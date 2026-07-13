import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('fetchMusicMeta', () => {
  beforeEach(() => {
    delete (globalThis as any).__musicMetaCache;
    vi.unstubAllGlobals();
  });

  it('fetches metadata once and serves later calls from cache', async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      const requestUrl = String(url);

      if (requestUrl.includes('musicbrainz.org')) {
        return {
          ok: true,
          json: async () => ({
            recordings: [
              {
                title: 'Song A',
                'artist-credit': [{ name: 'Artist A' }],
                releases: [{ id: 'release-123', date: '1999-01-01' }],
              },
            ],
          }),
        } as any;
      }

      if (requestUrl.includes('coverartarchive.org') && init?.method === 'HEAD') {
        return { ok: true } as any;
      }

      throw new Error(`Unexpected fetch request: ${requestUrl}`);
    });

    vi.stubGlobal('fetch', fetchMock);

    const { fetchMusicMeta } = await import('./musicMetaService');

    const first = await fetchMusicMeta('Artist A', 'Song A');
    const second = await fetchMusicMeta('Artist A', 'Song A');

    expect(first).toEqual({
      title: 'Song A',
      artist: 'Artist A',
      releaseId: 'release-123',
      releaseDate: '1999-01-01',
      coverUrl: 'https://coverartarchive.org/release/release-123/front-250',
    });
    expect(second).toEqual(first);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('returns null without calling fetch when no query is provided', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const { fetchMusicMeta } = await import('./musicMetaService');

    await expect(fetchMusicMeta()).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});