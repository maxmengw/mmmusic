import React from 'react';
import Modal from '../common/ui/Modal';

export interface PlaylistModalProps {
  open: boolean;
  onClose: () => void;
  musics: Array<{ title: string; artist: string; id: string | number }>;
  onDelete?: (id: string | number) => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ open, onClose, musics, onDelete }) => {
  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="playlist-modal" onClick={e => e.stopPropagation()}>
        <div className="playlist-modal-header">
          <span>Playlist</span>
          <button className="playlist-modal-close" onClick={onClose}>×</button>
        </div>
        <ul className="playlist-modal-list">
          {musics.map((music) => (
            <li key={music.id} className="playlist-modal-item">
              <div className="playlist-modal-meta">
                <span className="playlist-modal-title">{music.title}</span>
                <span className="playlist-modal-artist">{music.artist}</span>
              </div>

              <div className="playlist-modal-actions">
                <button className="playlist-modal-delete" onClick={() => onDelete && onDelete(music.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default PlaylistModal;
