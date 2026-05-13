import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import * as YouTubeMusicsListService from '../../services/music/youtubeMusicsListService';
import type { YouTubeMusic } from '@shared/types/youtubeData';

export function useYouTubeMusicsList() {
    const [musics, setMusics] = useState<YouTubeMusic[]>([]);
    const [playlist, setPlaylist] = useState<YouTubeMusic[]>([]);
    const { getToken, isSignedIn } = useAuth();

    const loadData = async () => {
        if (!isSignedIn) {
            setMusics([]);
            setPlaylist([]);
            return;
        }

        try {
            const sessionToken = await getToken();
            if (!sessionToken) {
                setMusics([]);
                setPlaylist([]);
                return;
            }
            const musicData = await YouTubeMusicsListService.getYouTubeMusicsList(sessionToken);
            setMusics(musicData);

            const playlistData = await YouTubeMusicsListService.getPlaylist(sessionToken);
            setPlaylist(playlistData);
        } catch (error) {
            console.error('Failed to load YouTube musics/playlist', error);
            setMusics([]);
            setPlaylist([]);
        }
    };

    useEffect(() => {
        loadData();
    }, [isSignedIn, getToken]);

    useEffect(() => {
        const onUpdate = () => { void loadData(); };
        window.addEventListener('mms_playlist_update', onUpdate);
        return () => { window.removeEventListener('mms_playlist_update', onUpdate); };
    }, [isSignedIn, getToken]);

    const addToPlaylist = async (
        songName: string,
        country: string,
        youtubeUrl: string
    ): Promise<boolean> => {
        try {
            const sessionToken = await getToken();
            if (!sessionToken) {
                throw new Error("User not authenticated");
            }
            const updatedPlaylist = await YouTubeMusicsListService.addToPlaylist(
                songName,
                country,
                youtubeUrl,
                sessionToken
            );
            setPlaylist([...updatedPlaylist]);
            return true;
        } catch (error: any) {
            return false;
        }
    };

    const deleteFromPlaylist = async (videoId: string): Promise<boolean> => {
        try {
            const sessionToken = await getToken();
            if (!sessionToken) throw new Error('User not authenticated');
            const updated = await YouTubeMusicsListService.deleteFromPlaylist(videoId, sessionToken);
            setPlaylist([...updated]);
            return true;
        } catch (error: any) {
            return false;
        }
    };

    return {
        musics,
        playlist,
        addToPlaylist,
        deleteFromPlaylist,
        refetch: loadData
    };
}