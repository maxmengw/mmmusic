import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import * as MusicService from '../../services/music/musicService';
export function useKoreanMusics() {
    const [data, setData] = useState(null);
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
            const result = await MusicService.getMusics(sessionToken);
            setData(result);
        }
        catch (error) {
            console.error('Failed to load music data', error);
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
