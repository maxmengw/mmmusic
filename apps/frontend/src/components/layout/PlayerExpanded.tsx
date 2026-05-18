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
            <p className="expanded-artist">{song.artist}</p>
            <p className="expanded-description">{song.description ?? ''}</p>
            <div className="expanded-actions three-body">
              {/* Rotating disc that opens YouTube search on click */}
              <button
                type="button"
                className="rotating-disc"
                aria-label={`Open YouTube for ${song.title}`}
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + (song.artist || ''))}`, '_blank', 'noopener,noreferrer')}
              />

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
      </div>
    </Modal>
  );
}
