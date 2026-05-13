import { useState, useRef, useEffect } from 'react';
import { YouTubePlayerService } from '../../services/music/youtubeService';
export const useYouTube = (playlist) => {
    const [currentSong, setCurrentSong] = useState(YouTubePlayerService.getInitialSong(playlist));
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef(null);
    // Update currentSong when playlist changes
    useEffect(() => {
        const updatedSong = YouTubePlayerService.updateCurrentSongForPlaylist(currentSong, playlist);
        if (updatedSong !== currentSong) {
            setCurrentSong(updatedSong);
        }
    }, [playlist, currentSong]);
    const onReady = (event) => {
        playerRef.current = event.target;
    };
    const onStateChange = (event) => {
        YouTubePlayerService.handleStateChange(event.data, setIsPlaying);
    };
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
