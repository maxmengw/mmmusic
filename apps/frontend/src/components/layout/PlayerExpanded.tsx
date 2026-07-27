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
              {/* AI panel placeholder — cover removed per request */}
              <div className="ai-panel" role="region" aria-label="AI Music Story">
                <h4>AI Music Story</h4>
                <p className="ai-panel-desc">This area will display AI-generated music stories, background, or track interpretations.</p>
                <textarea className="ai-prompt" placeholder="(Optional — AI will generate based on track information)" aria-label="AI prompt" />
                <div className="ai-panel-actions">
                  <button
                    type="button"
                    className="ai-button"
                    onClick={() => { window.alert('Generate music story (placeholder) — backend AI endpoint not connected yet'); }}
                  >
                    Generate Music Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
