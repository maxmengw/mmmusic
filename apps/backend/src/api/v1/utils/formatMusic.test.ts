import { describe, expect, it } from 'vitest';
import { formatMusic } from './formatMusic';

describe('formatMusic', () => {
  it('keeps the core music fields and preserves example arrays', () => {
    const result = formatMusic({
      id: 'music-1',
      name: 'Artist A',
      description: 'A test artist',
      examples: ['one', 'two'],
      userId: null,
    } as any);

    expect(result).toEqual({
      id: 'music-1',
      name: 'Artist A',
      description: 'A test artist',
      examples: ['one', 'two'],
    });
  });

  it('normalizes non-array examples to an empty array', () => {
    const result = formatMusic({
      id: 'music-2',
      name: 'Artist B',
      description: 'Another test artist',
      examples: null,
      userId: null,
    } as any);

    expect(result.examples).toEqual([]);
  });
});