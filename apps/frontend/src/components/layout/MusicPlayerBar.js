import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Architecture: hook-service-repository architecture
 * - Integrates YouTube Music player via hooks (useYoutube) -> service (youtubeService)
 * - Manages music playlist via hooks (useYouTubeMusicsList) -> service (youtubeMusicsListService) -> repository (youtubeMusicsListRepo) -> test data (youtubeMusicsList)
 * - Provides play/pause/next/previous controls in real-time
 * How: seperate tasks to various layers
 * - UI: controls the presentation of the player
 * - Hooks: accesses data (useYouTubeMusicsList) and handles player controls (useYouTube)
 * - Service: contains business logic and validation (youtubeMusicsListService)
 * - Repository: supports api for Read operations (youtubeMusicsListRepo)
 * - Data: stores test data (youtubeMusicsList)
 * Why: easy to maintain and expandable code by hook-service-repository architecture
 * - Expandable to add new features or switch to real DB
 * - Maintainable to fix bugs and current code by seperating tasks to various layers
 * - Reusable to use in other music pages (Korean/Chinese/Filipino) by hook-service-repository architecture
 */
import YouTube from 'react-youtube';
import { useYouTube } from '../../hooks/music/useYoutube';
import { useYouTubeMusicsList } from '../../hooks/music/useYouTubeMusicsList';
import { useState } from 'react';
import PlaylistModal from './PlaylistModal';
export default function MusicPlayerBar() {
    const { musics, deleteFromPlaylist } = useYouTubeMusicsList();
    const [playlistOpen, setPlaylistOpen] = useState(false);
    const { currentSong, isPlaying, onReady, onStateChange, togglePlayPause, playNext, playPrevious, onEnd, } = useYouTube(musics);
    let playStatus;
    if (isPlaying) {
        playStatus = 'Pause';
    }
    else {
        playStatus = 'Play';
    }
    if (!currentSong || !currentSong.videoId) {
        return (_jsx("div", { className: "music-player-bar", children: _jsx("div", { className: "music-player-container inter-thin", children: _jsxs("div", { className: "player-song-info", children: [_jsx("div", { className: "song-title", children: "No song selected" }), _jsx("div", { className: "song-artist", children: "Add songs to your playlist" })] }) }) }));
    }
    return (_jsx("div", { className: "music-player-bar", children: _jsxs("div", { className: "music-player-container inter-thin", children: [_jsx("div", { style: { display: 'none' }, children: _jsx(YouTube, { videoId: currentSong.videoId, opts: {
                            height: '0',
                            width: '0',
                            playerVars: { autoplay: 1 }
                        }, onReady: onReady, onEnd: onEnd, onStateChange: onStateChange }, currentSong.videoId) }), _jsxs("div", { className: "player-song-info", children: [_jsx("div", { className: "song-title", children: currentSong.title }), _jsx("div", { className: "song-artist", children: currentSong.artist })] }), _jsxs("div", { className: "player-controls", children: [_jsx("button", { className: "control-btn", onClick: playPrevious, children: "Prev" }), _jsx("button", { className: "control-btn", onClick: togglePlayPause, children: playStatus }), _jsx("button", { className: "control-btn", onClick: playNext, children: "Next" }), _jsxs("button", { className: "control-btn playlist-btn", title: "Playlist", onClick: () => setPlaylistOpen(open => !open), children: [_jsxs("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", children: [_jsx("rect", { x: "3", y: "5", width: "12", height: "2", rx: "1", fill: "currentColor" }), _jsx("rect", { x: "3", y: "9", width: "12", height: "2", rx: "1", fill: "currentColor" }), _jsx("rect", { x: "3", y: "13", width: "8", height: "2", rx: "1", fill: "currentColor" })] }), _jsx("span", { children: "Playlist" })] })] }), _jsx(PlaylistModal, { open: playlistOpen, onClose: () => setPlaylistOpen(false), musics: musics.map(m => ({
                        id: m.videoId ?? m.title,
                        title: m.title,
                        artist: m.artist || ''
                    })), onDelete: (id) => { void deleteFromPlaylist(String(id)); } })] }) }));
}
