import type { YouTubeMusic } from '@shared/types/youtubeData';
import type { YouTubePlayer } from 'react-youtube';

export class YouTubePlayerService {
	static getInitialSong(playlist: YouTubeMusic[]): YouTubeMusic | undefined {
		if (!playlist || playlist.length === 0) {
			return undefined;
		}
		return playlist[0];
	}

	static isSongInPlaylist(song: YouTubeMusic | undefined, playlist: YouTubeMusic[]): boolean {
		if (!song || !playlist || playlist.length === 0) {
			return false;
		}
		return playlist.some(playlistSong => playlistSong.videoId === song.videoId);
	}

	static updateCurrentSongForPlaylist(
		currentSong: YouTubeMusic | undefined,
		playlist: YouTubeMusic[]
	): YouTubeMusic | undefined {
		if (!playlist || playlist.length === 0) {
			return undefined;
		}
		if (!currentSong || !this.isSongInPlaylist(currentSong, playlist)) {
			return playlist[0];
		}
		return currentSong;
	}

	static getNextSong(currentSong: YouTubeMusic | undefined, playlist: YouTubeMusic[]): YouTubeMusic | undefined {
		if (!currentSong || !playlist || playlist.length === 0) {
			return undefined;
		}
		const currentIndex = playlist.findIndex((song) => song.videoId === currentSong.videoId);
		if (currentIndex === -1 || currentIndex === playlist.length - 1) {
			return playlist[0];
		}
		return playlist[currentIndex + 1];
	}

	static getPreviousSong(currentSong: YouTubeMusic | undefined, playlist: YouTubeMusic[]): YouTubeMusic | undefined {
		if (!currentSong || !playlist || playlist.length === 0) {
			return undefined;
		}
		const currentIndex = playlist.findIndex((song) => song.videoId === currentSong.videoId);
		if (currentIndex === -1 || currentIndex === 0) {
			return playlist[playlist.length - 1];
		}
		return playlist[currentIndex - 1];
	}

	static handleStateChange(eventData: number, setIsPlaying: (playing: boolean) => void): void {
		if (eventData === 1) {
			setIsPlaying(true);
		} else if (eventData === 2) {
			setIsPlaying(false);
		}
	}

	static togglePlayPause(
		player: YouTubePlayer,
		isPlaying: boolean
	): void {
		if (isPlaying) {
			player.pauseVideo();
		} else {
			player.playVideo();
		}
	}

	static calculateNextSong(
		currentSong: YouTubeMusic | undefined,
		playlist: YouTubeMusic[]
	): YouTubeMusic | undefined {
		return this.getNextSong(currentSong, playlist);
	}

	static calculatePreviousSong(
		currentSong: YouTubeMusic | undefined,
		playlist: YouTubeMusic[]
	): YouTubeMusic | undefined {
		return this.getPreviousSong(currentSong, playlist);
	}

	static handleSongEnd(
		currentSong: YouTubeMusic | undefined,
		playlist: YouTubeMusic[]
	): YouTubeMusic | undefined {
		return this.calculateNextSong(currentSong, playlist);
	}
}