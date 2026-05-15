export type MusicMapEra = '1960s' | '1980s' | '2000s' | '2020s';

export interface MusicMapSong {
  id: string;
  title: string;
  artist: string;
  videoId: string;
  year: number;
  genre: string;
  description: string;
}

export interface MusicMapCountry {
  code: string;
  name: string;
  region: string;
  description: string;
  position: {
    top: string;
    left: string;
  };
  lat?: number;
  lng?: number;
  songs: Record<MusicMapEra, MusicMapSong[]>;
}
