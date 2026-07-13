import { beforeEach, describe, expect, it, vi } from 'vitest';

const { prismaMock, upsertUserMock, loggerWarnMock } = vi.hoisted(() => {
  const prismaMock = {
    youTubeMusic: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    playlistItem: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  };

  return {
    prismaMock,
    upsertUserMock: vi.fn(),
    loggerWarnMock: vi.fn(),
  };
});

vi.mock('../../../../prisma/client', () => ({ default: prismaMock }));
vi.mock('../utils/userHelper', () => ({ upsertUser: upsertUserMock }));
vi.mock('../../../utils/logger', () => ({ default: { warn: loggerWarnMock } }));

describe('youtubeMusicsListService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns seed music when no user is logged in', async () => {
    prismaMock.youTubeMusic.findMany.mockResolvedValue([
      { title: 'Seed Song', artist: 'Seed Artist', videoId: 'seed-1' },
      { title: 'Another Seed', artist: 'Seed Artist 2', videoId: 'seed-2' },
    ]);

    const { getYouTubeMusicsList } = await import('./youtubeMusicsListService');

    const result = await getYouTubeMusicsList();

    expect(result).toEqual([
      { title: 'Seed Song', artist: 'Seed Artist', videoId: 'seed-1' },
      { title: 'Another Seed', artist: 'Seed Artist 2', videoId: 'seed-2' },
    ]);
    expect(upsertUserMock).not.toHaveBeenCalled();
  });

  it('copies seed musics into a new user library', async () => {
    prismaMock.youTubeMusic.findMany
      .mockResolvedValueOnce([
        { title: 'Seed Song', artist: 'Seed Artist', videoId: 'seed-1' },
        { title: 'Another Seed', artist: 'Seed Artist 2', videoId: 'seed-2' },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { title: 'Seed Song', artist: 'Seed Artist', videoId: 'seed-1' },
        { title: 'Another Seed', artist: 'Seed Artist 2', videoId: 'seed-2' },
      ]);

    prismaMock.youTubeMusic.create.mockResolvedValue({} as any);
    upsertUserMock.mockResolvedValue({ id: 'user-1' });

    const { getYouTubeMusicsList } = await import('./youtubeMusicsListService');

    const result = await getYouTubeMusicsList('clerk-123');

    expect(result).toEqual([
      { title: 'Seed Song', artist: 'Seed Artist', videoId: 'seed-1' },
      { title: 'Another Seed', artist: 'Seed Artist 2', videoId: 'seed-2' },
    ]);
    expect(prismaMock.youTubeMusic.create).toHaveBeenCalledTimes(2);
  });

  it('maps playlist items and falls back to the nested music title', async () => {
    prismaMock.playlistItem.findMany.mockResolvedValue([
      {
        name: 'Custom Playlist Name',
        youtubeMusic: { title: 'Song A', artist: 'Artist A', videoId: 'video-1' },
      },
      {
        name: null,
        youtubeMusic: { title: 'Song B', artist: 'Artist B', videoId: 'video-2' },
      },
    ]);

    const { getPlaylist } = await import('./youtubeMusicsListService');

    const result = await getPlaylist();

    expect(result).toEqual([
      { title: 'Song A', artist: 'Artist A', videoId: 'video-1', name: 'Custom Playlist Name' },
      { title: 'Song B', artist: 'Artist B', videoId: 'video-2', name: 'Song B' },
    ]);
  });
});