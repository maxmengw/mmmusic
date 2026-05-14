import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import * as MusicService from '../../services/music/musicService';
import type { MusicData } from '@shared/types/MusicData';

export function useMusic() {
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
			const result = await MusicService.getMusics(sessionToken);
			setData(result);
		} catch (error) {
			console.error('Failed to load music data', error);
			setData(null);
		}
	};

	useEffect(() => {
		fetchData();
	}, [isSignedIn, getToken]);

	return {
		data,
		refetch: fetchData,
	};
}
