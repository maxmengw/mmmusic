import { useState, useRef, useEffect } from 'react';
import type { YouTubePlayer } from 'react-youtube';
import type { YouTubeMusic } from '@shared/types/youtubeData';
import { YouTubePlayerService } from '../../services/music/youtubeService';

export const useYouTube = (playlist: YouTubeMusic[]) => {
	const [currentSong, setCurrentSong] = useState<YouTubeMusic | undefined>(
		YouTubePlayerService.getInitialSong(playlist)
	);
	const [isPlaying, setIsPlaying] = useState(false);
	const playerRef = useRef<YouTubePlayer | null>(null);

	// Update currentSong when playlist changes
	useEffect(() => {
		const updatedSong = YouTubePlayerService.updateCurrentSongForPlaylist(currentSong, playlist);
		if (updatedSong !== currentSong) {
			setCurrentSong(updatedSong);
		}
	}, [playlist, currentSong]);

	const onReady = (event: any) => {
		playerRef.current = event.target;
	};

	const onStateChange = (event: any) => {
		YouTubePlayerService.handleStateChange(event.data, setIsPlaying);
	};

	// expose the current background play state so other components can query it
	useEffect(() => {
		try {
			// store as a simple boolean on window for cross-component coordination
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			window.__mms_background_playing = isPlaying;
		} catch (err) {
			// ignore
		}
	}, [isPlaying]);

	// Listen for global requests to pause/resume the background player (e.g., when expanded player plays)
	useEffect(() => {
		const handler = (e: Event) => {
			const custom = e as CustomEvent;
			const action = custom?.detail?.action;
			if (!playerRef.current || !action) return;
			try {
				if (action === 'pause') {
					playerRef.current.pauseVideo();
					setIsPlaying(false);
				} else if (action === 'play') {
					playerRef.current.playVideo();
					setIsPlaying(true);
				}
			} catch (err) {
				// ignore errors calling player API
			}
		};

		window.addEventListener('mms-background-player-control', handler as EventListener);
		return () => window.removeEventListener('mms-background-player-control', handler as EventListener);
	}, []);

	const togglePlayPause = () => {
		if (playerRef.current) {
			YouTubePlayerService.togglePlayPause(playerRef.current, isPlaying);
		}
	};

	const playNext = () => {
		const nextSong = YouTubePlayerService.calculateNextSong(currentSong, playlist);
		setCurrentSong(nextSong);
	};

	const playPrevious = () => {
		const prevSong = YouTubePlayerService.calculatePreviousSong(currentSong, playlist);
		setCurrentSong(prevSong);
	};
    
	const onEnd = () => {
		const nextSong = YouTubePlayerService.handleSongEnd(currentSong, playlist);
		setCurrentSong(nextSong);
	};

	return {
		currentSong,
		isPlaying,
		onReady,
		onStateChange,
		togglePlayPause,
		playNext,
		playPrevious,
        onEnd
	};
};