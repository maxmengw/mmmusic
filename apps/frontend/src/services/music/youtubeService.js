export class YouTubePlayerService {
    static getInitialSong(playlist) {
        if (!playlist || playlist.length === 0) {
            return undefined;
        }
        return playlist[0];
    }
    static isSongInPlaylist(song, playlist) {
        if (!song || !playlist || playlist.length === 0) {
            return false;
        }
        return playlist.some(playlistSong => playlistSong.videoId === song.videoId);
    }
    static updateCurrentSongForPlaylist(currentSong, playlist) {
        if (!playlist || playlist.length === 0) {
            return undefined;
        }
        if (!currentSong || !this.isSongInPlaylist(currentSong, playlist)) {
            return playlist[0];
        }
        return currentSong;
    }
    static getNextSong(currentSong, playlist) {
        if (!currentSong || !playlist || playlist.length === 0) {
            return undefined;
        }
        const currentIndex = playlist.findIndex((song) => song.videoId === currentSong.videoId);
        if (currentIndex === -1 || currentIndex === playlist.length - 1) {
            return playlist[0];
        }
        return playlist[currentIndex + 1];
    }
    static getPreviousSong(currentSong, playlist) {
        if (!currentSong || !playlist || playlist.length === 0) {
            return undefined;
        }
        const currentIndex = playlist.findIndex((song) => song.videoId === currentSong.videoId);
        if (currentIndex === -1 || currentIndex === 0) {
            return playlist[playlist.length - 1];
        }
        return playlist[currentIndex - 1];
    }
    static handleStateChange(eventData, setIsPlaying) {
        if (eventData === 1) {
            setIsPlaying(true);
        }
        else if (eventData === 2) {
            setIsPlaying(false);
        }
    }
    static togglePlayPause(player, isPlaying) {
        if (isPlaying) {
            player.pauseVideo();
        }
        else {
            player.playVideo();
        }
    }
    static calculateNextSong(currentSong, playlist) {
        return this.getNextSong(currentSong, playlist);
    }
    static calculatePreviousSong(currentSong, playlist) {
        return this.getPreviousSong(currentSong, playlist);
    }
    static handleSongEnd(currentSong, playlist) {
        return this.calculateNextSong(currentSong, playlist);
    }
}
