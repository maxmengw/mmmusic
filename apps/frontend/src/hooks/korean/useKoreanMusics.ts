import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import * as KoreanMusicService from '../../services/korean/koreanMusicService';
import type { MusicData } from '@shared/types/MusicData';

export function useKoreanMusics() {
    const [data, setData] = useState<MusicData | null>(null);
    const { getToken, isSignedIn } = useAuth();

    const fetchData = async () => {
        if (!isSignedIn) {
            setData(null);
            return;
        }

        try {
            const sessionToken = await getToken();
            if (!sessionToken) {
                setData(null);
                return;
            }
            const result = await KoreanMusicService.getKoreaMusics(sessionToken);
            setData(result);
        } catch (error) {
            console.error('Failed to load Korean musics', error);
            setData(null);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isSignedIn, getToken]);

    return {
        data,
        refetch: fetchData
    };
}