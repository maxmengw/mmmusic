import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import * as MusicService from '../../services/music/musicService';
import { useToast } from '../useToast';

export function useMusicForm(refetch: () => void) {
	const [showAddModal, setShowAddModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const { showSuccess, showError } = useToast();
	const { getToken } = useAuth();

	const handleAddMusic = async (categoryName: string, musicTitle: string) => {
		try {
			const sessionToken = await getToken();
			if (!sessionToken) {
				throw new Error('User not authenticated');
			}
			const message = await MusicService.addMusicToExample(categoryName, musicTitle, sessionToken);
			showSuccess(message || 'Music added successfully!');
			await refetch();
			setShowAddModal(false);
		} catch (error) {
			showError((error as Error).message);
		}
	};

	const handleDeleteMusic = async (categoryName: string, musicTitle: string) => {
		try {
			const sessionToken = await getToken();
			if (!sessionToken) {
				throw new Error('User not authenticated');
			}
			const message = await MusicService.deleteMusicFromExample(categoryName, musicTitle, sessionToken);
			showSuccess(message || 'Music deleted successfully!');
			await refetch();
			setShowDeleteModal(false);
		} catch (error) {
			showError((error as Error).message);
		}
	};

	return {
		showAddModal,
		setShowAddModal,
		showDeleteModal,
		setShowDeleteModal,
		handleAddMusic,
		handleDeleteMusic,
	};
}
