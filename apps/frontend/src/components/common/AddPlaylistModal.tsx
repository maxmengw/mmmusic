import { useState, useMemo } from 'react';
import Modal from './ui/Modal';
import { useYouTubeMusicsList } from '../../hooks/music/useYouTubeMusicsList';
import { MUSIC_MAP_COUNTRIES } from '../../../../../shared/data/musicMapCountries';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPlaylistModal({ isOpen, onClose }: Props) {
  const { addToPlaylist } = useYouTubeMusicsList();
  const [songName, setSongName] = useState('');
  const [country, setCountry] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const countries = useMemo(() => {
    return (MUSIC_MAP_COUNTRIES as any).map((c: any) => c.name);
  }, []);

  const openYouTubeSearch = () => {
    const q = songName || '';
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAdd = async () => {
    if (!songName || !country || !youtubeUrl) return;
    setLoading(true);
    const ok = await addToPlaylist(songName, country, youtubeUrl);
    setLoading(false);
    if (ok) {
      setSongName('');
      setCountry('');
      setYoutubeUrl('');
      onClose();
    } else {
      // keep open so user can retry
      alert('Failed to add to playlist. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="add-playlist-modal inter-thin">
        <div className="add-playlist-header">
          <h3>Add to Playlist</h3>
          <button onClick={onClose} className="playlist-modal-close">×</button>
        </div>

        <div className="add-playlist-body">
          <label>Song Name</label>
          <input type="text" value={songName} onChange={(e) => setSongName(e.target.value)} placeholder="e.g. Violeta Parra - Gracias a la Vida" />

          <label>Country</label>
          <input
            list="countries-list"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Start typing to filter countries"
            aria-label="Country"
          />
          <datalist id="countries-list">
            <option value="">Select country</option>
            {countries.map((c: string) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          <label>YouTube URL</label>
          <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="Paste YouTube URL" />

          <div className="add-playlist-actions">
            <button type="button" onClick={openYouTubeSearch} className="btn-open">Open YouTube</button>
            <button type="button" onClick={handleAdd} className="btn-add" disabled={loading || !songName || !country || !youtubeUrl}>{loading ? 'Adding...' : 'Add'}</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
