import prisma from '../../../../prisma/client';

export const MUSIC_MAP_ERAS = ['1960s', '1980s', '2000s', '2020s'] as const;
export type MusicMapEra = (typeof MUSIC_MAP_ERAS)[number];

type MusicMapSongDto = {
  id: string;
  title: string;
  artist: string;
  videoId: string;
  year: number;
  genre: string;
  description: string;
};

type MusicMapCountryDto = {
  code: string;
  name: string;
  region: string;
  description: string;
  position: { top: string; left: string };
  lat?: number;
  lng?: number;
  songs: Record<MusicMapEra, MusicMapSongDto[]>;
};

export async function fetchMusicMapCountries(): Promise<MusicMapCountryDto[]> {
  const countries = await prisma.musicMapCountry.findMany({
    orderBy: { name: 'asc' },
    include: {
      songs: {
        orderBy: [
          { sortOrder: 'asc' },
          { year: 'asc' },
          { title: 'asc' },
        ],
      },
    },
  });

  return countries.map((country) => {
    const songsByEra = Object.fromEntries(
      MUSIC_MAP_ERAS.map((era) => [era, [] as MusicMapSongDto[]]),
    ) as Record<MusicMapEra, MusicMapSongDto[]>;

    for (const song of country.songs) {
      const era = song.era as MusicMapEra;
      if (!songsByEra[era]) continue;
      songsByEra[era].push({
        id: song.id,
        title: song.title,
        artist: song.artist,
        videoId: song.videoId,
        year: song.year,
        genre: song.genre,
        description: song.description,
      });
    }

    return {
      code: country.code,
      name: country.name,
      region: country.region,
      description: country.description,
      position: {
        top: country.positionTop,
        left: country.positionLeft,
      },
      lat: country.lat ?? undefined,
      lng: country.lng ?? undefined,
      songs: songsByEra,
    };
  });
}