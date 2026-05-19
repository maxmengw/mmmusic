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
 * - Reusable component across music pages using hook-service-repository architecture
 */
import YouTube from 'react-youtube';
import { useYouTube } from '../../hooks/music/useYoutube';
import { useYouTubeMusicsList } from '../../hooks/music/useYouTubeMusicsList';
import { useState, lazy, Suspense } from 'react';
import PlaylistModal from './PlaylistModal';
import PlayerExpanded from './PlayerExpanded';

export default function MusicPlayerBar() {
	const { musics, deleteFromPlaylist } = useYouTubeMusicsList();
	const [playlistOpen, setPlaylistOpen] = useState(false);
	const [showAddPlaylist, setShowAddPlaylist] = useState(false);
	const [expanded, setExpanded] = useState(false);
	
	const {
		currentSong,
		isPlaying,
		onReady,
		onStateChange,
		togglePlayPause,
		playNext,
		playPrevious,
        onEnd,
	} = useYouTube(musics);

	let playStatus;
	if (isPlaying) {
		playStatus = 'Pause';
	} else {
		playStatus = 'Play';
	}


	if (!currentSong || !currentSong.videoId) {
		return (
			<div className="music-player-bar">
				<div className="music-player-container inter-thin">
					<div className="player-song-info">
						<div className="song-title">No song selected</div>
						<div className="song-artist">Add songs to your playlist</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="music-player-bar">
			<div className="music-player-container inter-thin">
				<div style={{ display: 'none' }}>
					<YouTube
						key={currentSong.videoId}
						videoId={currentSong.videoId}
						opts={{ 
							height: '0', 
							width: '0',
							playerVars: { autoplay: 1 }
						}}
						onReady={onReady}
						onEnd={onEnd}
						onStateChange={onStateChange}
					/>
				</div>
				<div className="player-song-info">
					<button
						type="button"
						className="song-title song-title--expand"
						onClick={() => setExpanded(true)}
						aria-label={`Open expanded player for ${currentSong.title}`}
					>
						<span className="song-title-text">{currentSong.title}</span>
					</button>
					<div className="song-artist">{currentSong.artist}</div>
				</div>
				   <div className="player-controls">
					   <button className="control-btn" onClick={playPrevious}>Prev</button>
					   <button className="control-btn" onClick={togglePlayPause}>
						   {playStatus}
					   </button>
					   <button className="control-btn" onClick={playNext}>Next</button>
					   <button className="control-btn" title="Add to Playlist" onClick={() => setShowAddPlaylist(true)}>+</button>
					   <button className="control-btn playlist-btn" title="Playlist" onClick={() => setPlaylistOpen(open => !open)}>
						   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" >
							   <rect x="3" y="5" width="12" height="2" rx="1" fill="currentColor"/>
							   <rect x="3" y="9" width="12" height="2" rx="1" fill="currentColor"/>
							   <rect x="3" y="13" width="8" height="2" rx="1" fill="currentColor"/>
						   </svg>
						   <span>Playlist</span>
					   </button>
				   </div>
				   <PlaylistModal
					   open={playlistOpen}
					   onClose={() => setPlaylistOpen(false)}
					   musics={musics.map(m => ({
						   id: m.videoId ?? m.title,
						   title: m.title,
						   artist: m.artist || ''
					   }))}
					   onDelete={(id) => { void deleteFromPlaylist(String(id)); }}
				   />

				   {showAddPlaylist && (
					   <Suspense fallback={<div />}>
						   <AddPlaylistModal isOpen={showAddPlaylist} onClose={() => setShowAddPlaylist(false)} />
					   </Suspense>
				   )}

				<PlayerExpanded open={expanded} onClose={() => setExpanded(false)} song={currentSong} />
			</div>
		</div>
	);
}

const AddPlaylistModal = lazy(() => import('../common/AddPlaylistModal'));