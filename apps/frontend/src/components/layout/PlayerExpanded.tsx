import React from 'react';
import Modal from '../common/ui/Modal';
import YouTube from 'react-youtube';
import type { YouTubeMusic } from '@shared/types/youtubeData';

interface Props {
  open: boolean;
  onClose: () => void;
  song: YouTubeMusic | null | undefined;
}

export default function PlayerExpanded({ open, onClose, song }: Props) {
  if (!open || !song) return null;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="player-expanded" onClick={(e) => e.stopPropagation()}>
        <div className="player-expanded-header">
          <h3>{song.title}</h3>
          <button className="player-expanded-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="player-expanded-body">
          <div className="player-expanded-media">
            {song.videoId ? (
              <YouTube
                videoId={song.videoId}
                opts={{ width: '480', height: '270', playerVars: { autoplay: 1 } }}
                onStateChange={(e) => {
                  // when expanded player starts playing, pause background player to avoid duplicate audio
                  const state = e.data;
                  if (state === 1) {
                    window.dispatchEvent(new CustomEvent('mms-background-player-control', { detail: { action: 'pause' } }));
                  } else if (state === 2 || state === 0) {
                    // paused or ended -> resume background player
                    window.dispatchEvent(new CustomEvent('mms-background-player-control', { detail: { action: 'play' } }));
                  }
                }}
              />
            ) : (
              <div className="player-expanded-placeholder">No video available</div>
            )}
          </div>

          <div className="player-expanded-meta">
            <p className="expanded-artist">{song.artist}</p>
            <p className="expanded-description">{song.description ?? ''}</p>
            <div className="expanded-actions">
              <a className="btn-open" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + (song.artist || ''))}`} target="_blank" rel="noreferrer">Open YouTube</a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
