import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./musicMetaService', () => ({
  fetchMusicMeta: vi.fn(async () => ({ coverUrl: null })),
}));

describe('generateCountryCandidates', () => {
  beforeEach(() => {
    delete (globalThis as any).__albumCandidatesCache;
    vi.unstubAllGlobals();
  });

  it('prefers iTunes candidates for placeholder country data and caches the result', async () => {
    const fetchMock = vi.fn(async (url: string) => {
      const requestUrl = String(url);

      if (!requestUrl.includes('itunes.apple.com')) {
        throw new Error(`Unexpected fetch request: ${requestUrl}`);
      }

      return {
        ok: true,
        json: async () => ({
          results: [
            {
              trackName: 'Indonesia Anthem',
              artistName: 'Artist A',
              artworkUrl100: 'https://example.com/100x100bb.jpg',
              releaseDate: '1964-07-01T00:00:00Z',
            },
            {
              trackName: 'Indonesia Echo',
              artistName: 'Artist B',
              artworkUrl100: null,
              releaseDate: '1968-07-01T00:00:00Z',
            },
          ],
        }),
      } as any;
    });

    vi.stubGlobal('fetch', fetchMock);

    const { generateCountryCandidates } = await import('./musicGenerateService');

    const first = await generateCountryCandidates('Indonesia', 2, '1960s');
    const second = await generateCountryCandidates('Indonesia', 2, '1960s');

    expect(first).toEqual([
      {
        title: 'Indonesia Anthem',
        artist: 'Artist A',
        coverUrl: 'https://example.com/600x600bb.jpg',
        source: 'itunes',
        year: 1964,
      },
      {
        title: 'Indonesia Echo',
        artist: 'Artist B',
        coverUrl: null,
        source: 'itunes',
        year: 1968,
      },
    ]);
    expect(second).toEqual(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});