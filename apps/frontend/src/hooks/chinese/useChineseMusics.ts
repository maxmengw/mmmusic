import { useState, useEffect } from 'react';
import * as ChineseMusicService from '../../services/chinese/chineseMusicService';
import type { MusicData } from '@shared/types/MusicData';
import { useAuth } from '@clerk/clerk-react';


export function useChineseMusics() {
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
            const result = await ChineseMusicService.getChineseMusics(sessionToken);
            setData(result);
        } catch (error) {
            console.error('Failed to fetch Chinese music data:', error);
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