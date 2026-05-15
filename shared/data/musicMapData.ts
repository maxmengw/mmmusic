import type { MusicMapCountry, MusicMapEra } from '@shared/types/musicMap';

export const MUSIC_MAP_ERAS: MusicMapEra[] = ['1960s', '1980s', '2000s', '2020s'];

export const MUSIC_MAP_COUNTRIES: MusicMapCountry[] = [
  {
    code: 'canada',
    name: 'Canada',
    region: 'North America',
    description: 'Wide atmospheric electronic and indie textures inspired by northern landscapes.',
    position: { top: '18%', left: '21%' },
    lat: 56.1304,
    lng: -106.3468,
    songs: {
      '1960s': [
        { id: 'canada-1960s-1', title: 'Northern Signal', artist: 'Ice Harbor Ensemble', videoId: 'ca1960s01x', year: 1964, genre: 'Folk Pop', description: 'Acoustic harmonies built around radio static and winter light.' },
        { id: 'canada-1960s-2', title: 'Lake of Echoes', artist: 'Aurora Line', videoId: 'ca1960s02x', year: 1968, genre: 'Dream Pop', description: 'A calm shoreline ballad with layered vocals and soft percussion.' },
      ],
      '1980s': [
        { id: 'canada-1980s-1', title: 'Glass Skyline', artist: 'Metro North', videoId: 'ca1980s01x', year: 1983, genre: 'Synth Pop', description: 'Bright pads and pulsing drums for a neon downtown skyline.' },
        { id: 'canada-1980s-2', title: 'Satellite Pines', artist: 'Cold Signal', videoId: 'ca1980s02x', year: 1989, genre: 'New Wave', description: 'A restless track with bright hooks and icy digital textures.' },
      ],
      '2000s': [
        { id: 'canada-2000s-1', title: 'Polar Frequency', artist: 'Northbound Static', videoId: 'ca2000s01x', year: 2004, genre: 'Electronic', description: 'A driving instrumental with clipped beats and spacious synths.' },
        { id: 'canada-2000s-2', title: 'Maple Circuit', artist: 'Echo Province', videoId: 'ca2000s02x', year: 2008, genre: 'Indie Electronic', description: 'Guitar loops and glitch accents with a warm summer pulse.' },
      ],
      '2020s': [
        { id: 'canada-2020s-1', title: 'Aurora Drift', artist: 'Signal Bloom', videoId: 'ca2020s01x', year: 2024, genre: 'Alt Pop', description: 'A cinematic hook built for streaming-era city nights.' },
        { id: 'canada-2020s-2', title: 'Soft Ice, Loud Sky', artist: 'Northern Frame', videoId: 'ca2020s02x', year: 2025, genre: 'Ambient Pop', description: 'Minimal vocals and shimmering textures for an immersive listen.' },
      ],
    },
  },
  {
    code: 'japan',
    name: 'Japan',
    region: 'East Asia',
    description: 'Precise melodic writing, city-pop glow, and modern digital detail.',
    position: { top: '26%', left: '78%' },
    lat: 36.2048,
    lng: 138.2529,
    songs: {
      '1960s': [
        { id: 'japan-1960s-1', title: 'Paper Lantern Shore', artist: 'Tokyo Harbor Trio', videoId: 'jp1960s01x', year: 1965, genre: 'Jazz Pop', description: 'A gentle opener with brushed drums and modal piano lines.' },
        { id: 'japan-1960s-2', title: 'Blue Tram Morning', artist: 'Shibuya Lights', videoId: 'jp1960s02x', year: 1969, genre: 'Enka Pop', description: 'An elegant melody moving through quiet morning streets.' },
      ],
      '1980s': [
        { id: 'japan-1980s-1', title: 'Neon Harbor', artist: 'Midnight Arcade', videoId: 'jp1980s01x', year: 1984, genre: 'City Pop', description: 'Glossy bass and chrome-sheen synths for a night drive playlist.' },
        { id: 'japan-1980s-2', title: 'Ribbon of Rain', artist: 'Pacific Fade', videoId: 'jp1980s02x', year: 1988, genre: 'Synth Funk', description: 'A bright, elastic groove with playful keyboard stabs.' },
      ],
      '2000s': [
        { id: 'japan-2000s-1', title: 'Pixel Garden', artist: 'Kyoto Loop', videoId: 'jp2000s01x', year: 2003, genre: 'Electropop', description: 'Shimmering arpeggios and crisp drums with a digital feel.' },
        { id: 'japan-2000s-2', title: 'Glass Koi', artist: 'East Signal', videoId: 'jp2000s02x', year: 2009, genre: 'J-Pop', description: 'Hook-forward melody writing with polished production layers.' },
      ],
      '2020s': [
        { id: 'japan-2020s-1', title: 'Future Tea Room', artist: 'Holo Avenue', videoId: 'jp2020s01x', year: 2023, genre: 'Hyper Pop', description: 'Fast edits, sparkling vocals, and a playful machine-learning edge.' },
        { id: 'japan-2020s-2', title: 'Afterimage Sky', artist: 'Tokyo Driftline', videoId: 'jp2020s02x', year: 2025, genre: 'Ambient Pop', description: 'A reflective track with wide reverb and slow-moving harmonies.' },
      ],
    },
  },
  {
    code: 'brazil',
    name: 'Brazil',
    region: 'South America',
    description: 'Rhythmic warmth, tropical harmony, and contemporary electronic color.',
    position: { top: '66%', left: '36%' },
    lat: -14.2350,
    lng: -51.9253,
    songs: {
      '1960s': [
        { id: 'brazil-1960s-1', title: 'Coconut Sunrise', artist: 'Rio Azul', videoId: 'br1960s01x', year: 1962, genre: 'Bossa Nova', description: 'Sunlit guitar patterns and soft percussion with ocean breeze energy.' },
        { id: 'brazil-1960s-2', title: 'Green Avenue', artist: 'Maré Alta', videoId: 'br1960s02x', year: 1969, genre: 'MPB', description: 'A lyrical arrangement with floating harmony and warm bass.' },
      ],
      '1980s': [
        { id: 'brazil-1980s-1', title: 'Electric Carnival', artist: 'Samba Circuit', videoId: 'br1980s01x', year: 1984, genre: 'Funk Pop', description: 'A dancefloor pulse built for bright synths and percussion breaks.' },
        { id: 'brazil-1980s-2', title: 'Neon Mangrove', artist: 'Litoral 84', videoId: 'br1980s02x', year: 1988, genre: 'Pop Rock', description: 'A breezy anthem with coastal shimmer and crisp guitar leads.' },
      ],
      '2000s': [
        { id: 'brazil-2000s-1', title: 'City Drift Samba', artist: 'Metro Mar', videoId: 'br2000s01x', year: 2005, genre: 'Electro Samba', description: 'Traditional rhythm framed by club-ready percussion and synth bass.' },
        { id: 'brazil-2000s-2', title: 'Golden Favela', artist: 'Skyline Tropic', videoId: 'br2000s02x', year: 2009, genre: 'Funk Carioca', description: 'A sharp, energetic beat with a gritty street-level pulse.' },
      ],
      '2020s': [
        { id: 'brazil-2020s-1', title: 'Solar Loop', artist: 'Amazon Pulse', videoId: 'br2020s01x', year: 2023, genre: 'Pop Electronica', description: 'Bright melodic fragments orbiting a warm, futuristic groove.' },
        { id: 'brazil-2020s-2', title: 'Tide of Light', artist: 'Rio Future', videoId: 'br2020s02x', year: 2025, genre: 'Alt Pop', description: 'A glossy, emotional song that feels made for the modern stream.' },
      ],
    },
  },
  {
    code: 'nigeria',
    name: 'Nigeria',
    region: 'West Africa',
    description: 'Percussive energy, call-and-response melodies, and modern Afrobeats motion.',
    position: { top: '52%', left: '53%' },
    lat: 9.0820,
    lng: 8.6753,
    songs: {
      '1960s': [
        { id: 'nigeria-1960s-1', title: 'Drumline Horizon', artist: 'Lagos Dawn', videoId: 'ng1960s01x', year: 1966, genre: 'Highlife', description: 'A brass-forward groove with bright guitars and rolling percussion.' },
        { id: 'nigeria-1960s-2', title: 'Savannah Echo', artist: 'Unity Brass', videoId: 'ng1960s02x', year: 1969, genre: 'Soul Highlife', description: 'A celebratory arrangement with horn melodies and chorus lift.' },
      ],
      '1980s': [
        { id: 'nigeria-1980s-1', title: 'Satellite Kora', artist: 'Lagos Vector', videoId: 'ng1980s01x', year: 1983, genre: 'Afro Funk', description: 'Analog synths and hand percussion driving a kinetic dance pulse.' },
        { id: 'nigeria-1980s-2', title: 'Market Moonlight', artist: 'Harbor Rhythm', videoId: 'ng1980s02x', year: 1989, genre: 'Juju Fusion', description: 'A layered groove with guitars, bells, and a late-night glow.' },
      ],
      '2000s': [
        { id: 'nigeria-2000s-1', title: 'Digital Palm', artist: 'Port Wave', videoId: 'ng2000s01x', year: 2006, genre: 'Afrobeats', description: 'A club-ready rhythm that balances bounce and melody.' },
        { id: 'nigeria-2000s-2', title: 'Rain on Ikoyi', artist: 'City Kinetics', videoId: 'ng2000s02x', year: 2009, genre: 'R&B Fusion', description: 'Smooth vocals over a clean groove and reflective atmosphere.' },
      ],
      '2020s': [
        { id: 'nigeria-2020s-1', title: 'Orbit Afrobeats', artist: 'Pulse Lagos', videoId: 'ng2020s01x', year: 2024, genre: 'Afrobeats', description: 'A polished global sound with infectious rhythm and bright hooks.' },
        { id: 'nigeria-2020s-2', title: 'Neon Baobab', artist: 'Sunline Static', videoId: 'ng2020s02x', year: 2025, genre: 'Alt Afropop', description: 'A futuristic blend of percussion, bass, and airy vocal textures.' },
      ],
    },
  },
];
