import { useState } from 'react';
import * as FilipinoMusicService from '../../services/filipino/filipinoMusicService';
import { useToast } from '../useToast';
import { useAuth } from '@clerk/clerk-react';

// useFilipinoMusicForm Custom Hook

// Manage UI state (add/delete modals) for Filipino music data.
// Call service functions (addMusicToExample, deleteMusicFromExample).
// Show toast notifications for success/error feedback.
// Refetch the latest data and close the modal.
export function useFilipinoMusicForm(refetch: () => void) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { showSuccess, showError } = useToast();
    const { getToken } = useAuth();

    const handleAddMusic = async (categoryName: string, musicTitle: string) => {
        try {
            const sessionToken = await getToken();
            if (!sessionToken) {
                throw new Error('User not authenticated.');
            }
            const message = await FilipinoMusicService.addFilipinoMusicToExample(categoryName, musicTitle, sessionToken);
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
                throw new Error('User not authenticated.');
            }
            const message = await FilipinoMusicService.deleteFilipinoMusicFromExample(categoryName, musicTitle, sessionToken);
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
        handleDeleteMusic
    };
}