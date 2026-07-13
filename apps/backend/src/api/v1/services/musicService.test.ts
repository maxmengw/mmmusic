import { beforeEach, describe, expect, it, vi } from 'vitest';

const { prismaMock, upsertUserMock } = vi.hoisted(() => {
  const prismaMock = {
    music: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  };

  return {
    prismaMock,
    upsertUserMock: vi.fn(),
  };
});

vi.mock('../../../../prisma/client', () => ({ default: prismaMock }));
vi.mock('../utils/userHelper', () => ({ upsertUser: upsertUserMock }));

const seedMusics = [
  {
    id: 'seed-1',
    name: 'Artist A',
    description: 'Seed artist A',
    examples: ['alpha'],
  },
  {
    id: 'seed-2',
    name: 'Artist B',
    description: 'Seed artist B',
    examples: ['beta'],
  },
];

describe('musicService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('copies seed music into a new user library on first access', async () => {
    prismaMock.music.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(seedMusics)
      .mockResolvedValueOnce([
        {
          id: 'user-1-music-1',
          name: 'Artist A',
          description: 'Seed artist A',
          examples: ['alpha'],
        },
        {
          id: 'user-1-music-2',
          name: 'Artist B',
          description: 'Seed artist B',
          examples: ['beta'],
        },
      ]);

    prismaMock.music.create.mockResolvedValue({} as any);
    upsertUserMock.mockResolvedValue({ id: 'user-1' });

    const { fetchAllMusic } = await import('./musicService');

    const result = await fetchAllMusic('clerk-123');

    expect(result).toEqual([
      {
        id: 'user-1-music-1',
        name: 'Artist A',
        description: 'Seed artist A',
        examples: ['alpha'],
      },
      {
        id: 'user-1-music-2',
        name: 'Artist B',
        description: 'Seed artist B',
        examples: ['beta'],
      },
    ]);
    expect(prismaMock.music.create).toHaveBeenCalledTimes(2);
    expect(prismaMock.music.create).toHaveBeenNthCalledWith(1, {
      data: {
        name: 'Artist A',
        description: 'Seed artist A',
        examples: ['alpha'],
        userId: 'user-1',
      },
    });
  });

  it('rejects duplicate music examples for the same user', async () => {
    prismaMock.music.findFirst.mockResolvedValue({
      id: 'music-1',
      name: 'Artist A',
      description: 'Seed artist A',
      examples: ['alpha'],
    });
    upsertUserMock.mockResolvedValue({ id: 'user-1' });

    const { addMusicToExample } = await import('./musicService');

    await expect(addMusicToExample('Artist A', ' alpha ', 'clerk-123')).rejects.toMatchObject({
      message: 'A music example with the same name already exists.',
      statusCode: 400,
    });
    expect(prismaMock.music.update).not.toHaveBeenCalled();
  });

  it('removes a music example from the stored array', async () => {
    prismaMock.music.findFirst.mockResolvedValue({
      id: 'music-1',
      name: 'Artist A',
      description: 'Seed artist A',
      examples: ['alpha', 'beta', 'gamma'],
    });
    prismaMock.music.update.mockResolvedValue({
      id: 'music-1',
      name: 'Artist A',
      description: 'Seed artist A',
      examples: ['alpha', 'gamma'],
    });
    upsertUserMock.mockResolvedValue({ id: 'user-1' });

    const { deleteMusicFromExample } = await import('./musicService');

    const result = await deleteMusicFromExample('Artist A', 'beta', 'clerk-123');

    expect(result).toEqual({
      id: 'music-1',
      name: 'Artist A',
      description: 'Seed artist A',
      examples: ['alpha', 'gamma'],
    });
    expect(prismaMock.music.update).toHaveBeenCalledWith({
      where: { id: 'music-1' },
      data: { examples: ['alpha', 'gamma'] },
    });
  });
});