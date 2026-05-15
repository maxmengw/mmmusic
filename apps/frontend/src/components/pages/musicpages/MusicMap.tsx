import { useMemo, useState } from 'react';
import HomeButton from '../../common/nav/HomeButton';
import GlobeMap from './GlobeMap';
import { MUSIC_MAP_COUNTRIES, MUSIC_MAP_ERAS } from '@shared/data/musicMapData';
import type { MusicMapCountry, MusicMapEra, MusicMapSong } from '@shared/types/musicMap';

function buildYouTubeSearchUrl(song: MusicMapSong) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${song.title} ${song.artist}`)}`;
}

export default function MusicMap() {
  const [selectedEra, setSelectedEra] = useState<MusicMapEra>('2020s');
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [countryImageUrl, setCountryImageUrl] = useState<string | null>(null);
  const [resetViewSignal, setResetViewSignal] = useState(0);

  const selectedCountry = useMemo<MusicMapCountry | undefined>(() => {
    return MUSIC_MAP_COUNTRIES.find((country) => country.code === selectedCountryCode);
  }, [selectedCountryCode]);

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
        <header className="music-map-hero">
          <div className="music-map-kicker">Prototype first, AI later</div>
          <h1>Music Map</h1>
          <p>
            Pick a time period, tap a country, and explore sample tracks that represent the sound of that place.
          </p>
        </header>

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

        <section className="music-map-content">
          <div className="music-map-stage">
            <div className="music-map-board">
              <div className="music-map-board-title">World view</div>
              <div className="music-map-globe" aria-label="Selectable world map">
                <GlobeMap
                  countries={MUSIC_MAP_COUNTRIES}
                  selectedCountryCode={selectedCountry?.code}
                  resetViewSignal={resetViewSignal}
                  onSelectCountry={(code) => {
                    setSelectedCountryCode(code);
                    // fetch a placeholder country image (static mapping for MVP)
                    const imgMap: Record<string, string> = {
                      canada: '/images/flags/canada.svg',
                      japan: '/images/flags/japan.svg',
                      brazil: '/images/flags/brazil.svg',
                      nigeria: '/images/flags/nigeria.svg',
                    };
                    setCountryImageUrl(imgMap[code] ?? null);
                  }}
                />
              </div>
            </div>

            {selectedCountry && (
              <>
                  <div className="map-overlay-veil" onClick={() => {
                  // clicking outside closes panel and resets globe view
                  setSelectedCountryCode('');
                  
                  setCountryImageUrl(null);
                  setResetViewSignal((s) => s + 1);
                }} />
                <aside className={`music-map-panel is-floating ${countryImageUrl ? 'has-image' : ''}`} aria-label="Selected country details">
                  <button className="close-overlay" aria-label="Close" onClick={() => {
                    setSelectedCountryCode('');
                    setCountryImageUrl(null);
                    setResetViewSignal((s) => s + 1);
                  }}>×</button>
                {countryImageUrl && (
                  <div className="country-image">
                    <img src={countryImageUrl} alt={`${selectedCountry.name} image`} />
                  </div>
                )}
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
