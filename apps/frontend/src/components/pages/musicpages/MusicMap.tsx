import { useMemo, useState } from 'react';
import HomeButton from '../../common/nav/HomeButton';
import GlobeMap from './GlobeMap';
import { MUSIC_MAP_COUNTRIES, MUSIC_MAP_ERAS } from '@shared/data/musicMapData';
import type { MusicMapCountry, MusicMapEra, MusicMapSong } from '@shared/types/musicMap';

function buildYouTubeSearchUrl(song: MusicMapSong) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${song.title} ${song.artist}`)}`;
}

function buildFallbackCountry(code: string, name: string): MusicMapCountry {
  const baseYears: Record<MusicMapEra, [number, number]> = {
    '1960s': [1964, 1968],
    '1980s': [1983, 1988],
    '2000s': [2004, 2009],
    '2020s': [2023, 2025],
  };

  const genres: Record<MusicMapEra, [string, string]> = {
    '1960s': ['Vintage Pop', 'Soul Folk'],
    '1980s': ['Synth Pop', 'New Wave'],
    '2000s': ['Electro Pop', 'Indie Electronic'],
    '2020s': ['Alt Pop', 'Global Electronic'],
  };

  const songs = {} as Record<MusicMapEra, MusicMapSong[]>;
  for (const era of MUSIC_MAP_ERAS) {
    const [yearA, yearB] = baseYears[era];
    const [genreA, genreB] = genres[era];
    songs[era] = [
      {
        id: `${code}-${era}-1`,
        title: `${name} Soundscape I`,
        artist: `${name} Collective`,
        videoId: `${code}-${era}-sample-1`,
        year: yearA,
        genre: genreA,
        description: `Representative ${era} style inspired by ${name}'s regional sound.`
      },
      {
        id: `${code}-${era}-2`,
        title: `${name} Soundscape II`,
        artist: `${name} Studio`,
        videoId: `${code}-${era}-sample-2`,
        year: yearB,
        genre: genreB,
        description: `Curated placeholder track for ${name} (${era}). You can replace with real songs later.`
      },
    ];
  }

  return {
    code,
    name,
    region: 'Global',
    description: `${name} is now available in the global map. This country uses starter sample tracks that can be customized.`,
    position: { top: '50%', left: '50%' },
    songs,
  };
}

export default function MusicMap() {
  const [selectedEra, setSelectedEra] = useState<MusicMapEra>('2020s');
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [resetViewSignal, setResetViewSignal] = useState(0);

  const selectedCountry = useMemo<MusicMapCountry | undefined>(() => {
    const preset = MUSIC_MAP_COUNTRIES.find((country) => country.code === selectedCountryCode);
    if (preset) return preset;
    if (!selectedCountryCode || !selectedCountryName) return undefined;
    return buildFallbackCountry(selectedCountryCode, selectedCountryName);
  }, [selectedCountryCode, selectedCountryName]);

  const songs = selectedCountry?.songs[selectedEra] ?? [];

  const handleExplore = (song: MusicMapSong) => {
    window.open(buildYouTubeSearchUrl(song), '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async (song: MusicMapSong) => {
    const payload = `${song.title} - ${song.artist} (${song.year})`;
    await navigator.clipboard.writeText(payload);
  };

  return (
    <div className="music-map-page">
      <HomeButton />
      <div className="music-map-shell">
        <section className="music-map-content">
          <div className="music-map-stage">
            <div className="music-map-board">
              <div className="music-map-board-title">World view</div>
              <div className="music-map-globe" aria-label="Selectable world map">
                <section className="music-map-controls" aria-label="Timeline selection">
                  {MUSIC_MAP_ERAS.map((era) => (
                    <button
                      key={era}
                      className={`timeline-chip ${selectedEra === era ? 'is-active' : ''}`}
                      onClick={() => setSelectedEra(era)}
                    >
                      {era}
                    </button>
                  ))}
                </section>
                <GlobeMap
                  countries={MUSIC_MAP_COUNTRIES}
                  selectedCountryCode={selectedCountry?.code}
                  selectedCountryName={selectedCountry?.name}
                  resetViewSignal={resetViewSignal}
                    onSelectCountry={(code, _lat, _lng, name) => {
                      setSelectedCountryCode(code);
                      setSelectedCountryName(name ?? '');
                    }}
                />

              </div>
            </div>

                {selectedCountry && (
              <>
                  <div className="map-overlay-veil" onClick={() => {
                  // clicking outside closes panel and resets globe view
                  setSelectedCountryCode('');
                  setSelectedCountryName('');
                  setResetViewSignal((s) => s + 1);
                }} />
                <aside className={`music-map-panel is-floating`} aria-label="Selected country details">
                  <button className="close-overlay" aria-label="Close" onClick={() => {
                    setSelectedCountryCode('');
                    setSelectedCountryName('');
                    setResetViewSignal((s) => s + 1);
                  }}>×</button>
                <div className="country-summary">
                  <div className="country-summary-top">
                    <span className="country-region">{selectedCountry.region}</span>
                    <span className="country-era">{selectedEra}</span>
                  </div>
                  <h2>{selectedCountry.name}</h2>
                  <p>{selectedCountry.description}</p>
                </div>

                <div className="song-list">
                  {songs.map((song) => (
                    <article key={song.id} className="song-card">
                      <div className="song-card-meta">
                        <span>{song.year}</span>
                        <span>{song.genre}</span>
                      </div>
                      <h3>{song.title}</h3>
                      <p>{song.artist}</p>
                      <p className="song-description">{song.description}</p>
                      <div className="song-card-actions">
                        <button className="song-action secondary" onClick={() => handleExplore(song)}>
                          Open YouTube
                        </button>
                        <button className="song-action" onClick={() => void handleCopy(song)}>
                          Copy info
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </aside>
                </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
