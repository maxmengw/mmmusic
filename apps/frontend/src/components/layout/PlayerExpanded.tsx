import React, { useEffect, useRef } from 'react';
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

  const dispatchBackgroundControl = (action: 'pause' | 'play') => {
    try {
      const ev = new CustomEvent('mms-background-player-control', { detail: { action } });
      window.dispatchEvent(ev);
    } catch (_err) {
      // fallback for environments that may not support CustomEvent constructor
      try {
        // @ts-ignore - legacy API fallback
        const ev = document.createEvent('CustomEvent');
        // @ts-ignore
        ev.initCustomEvent('mms-background-player-control', true, true, { action });
        window.dispatchEvent(ev);
      } catch (e) {
        // give up silently
      }
    }
  };

  const prevWasPlaying = useRef<boolean>(false);

  const handleClose = () => {
    try {
      if (prevWasPlaying.current) {
        dispatchBackgroundControl('play');
        prevWasPlaying.current = false;
      }
    } catch (e) {
      // ignore
    }
    onClose();
  };

  useEffect(() => {
    try {
      // read current background playing state (set by useYoutube)
      // @ts-ignore
      prevWasPlaying.current = Boolean(window.__mms_background_playing);
    } catch (err) {
      prevWasPlaying.current = false;
    }
    // immediately pause background to prevent overlapping audio
    dispatchBackgroundControl('pause');

    return () => {
      // on unmount/close, restore background only if it was previously playing
      if (prevWasPlaying.current) {
        dispatchBackgroundControl('play');
      }
    };
  }, []);

  return (
    <Modal isOpen={open} onClose={handleClose}>
      <div className="player-expanded" onClick={(e) => e.stopPropagation()}>
        <div className="player-expanded-header">
          <h3>{song.title}</h3>
          <button className="player-expanded-close" onClick={handleClose} aria-label="Close">×</button>
        </div>

        <div className="player-expanded-body">
          <div className="player-expanded-media">
            {song.videoId ? (
              <YouTube
                videoId={song.videoId}
                opts={{ width: '480', height: '270', playerVars: { autoplay: 1 } }}
                onStateChange={(e: any) => {
                  // when expanded player starts playing, pause background player to avoid duplicate audio
                  const state = e?.data;
                  if (state === 1) {
                    dispatchBackgroundControl('pause');
                  } else if (state === 2 || state === 0) {
                    // paused or ended -> resume background player
                    dispatchBackgroundControl('play');
                  }
                }}
              />
            ) : (
              <div className="player-expanded-placeholder">No video available</div>
            )}
          </div>

          <div className="player-expanded-meta">
            <div className="meta-top">
              <div className="expanded-actions three-body">
              {/* Use same vinyl/song-cover design as MusicMap */}
              <div
                className="song-cover"
                role="button"
                tabIndex={0}
                aria-label={`Open YouTube for ${song.title}`}
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + (song.artist || ''))}`, '_blank', 'noopener,noreferrer')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + (song.artist || ''))}`, '_blank', 'noopener,noreferrer'); } }}
              >
                <>
                  {song.coverUrl ? (
                    <img src={song.coverUrl} alt={`${song.title} cover`} onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/image/cover-placeholder.png'; }} />
                  ) : null}
                  <div className="song-cover-label" aria-hidden="true">{song.artist ?? song.title}</div>
                </>
              </div>
              </div>
            </div>

            <p className="expanded-description">{song.description ?? ''}</p>
            {/* Placeholder button for future AI feature */}
            <button
              type="button"
              className="ai-placeholder"
              aria-label="AI feature (coming soon)"
              onClick={() => { alert('AI feature coming soon'); }}
            >
              AI
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
