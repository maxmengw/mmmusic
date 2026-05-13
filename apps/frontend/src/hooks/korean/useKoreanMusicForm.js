import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import * as MusicService from '../../services/music/musicService';
import { useToast } from '../useToast';
// useKoreanMusicForm Custom Hook
// Manage UI state (add/delete modals) for Korean music data.
// Call service functions (addMusicToCategory, deleteMusicFromCategory).
// Refetch the latest data and close the modal.
export function useKoreanMusicForm(refetch) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { showSuccess, showError } = useToast();
    const { getToken } = useAuth();
    const handleAddMusic = async (categoryName, musicTitle) => {
        try {
            const sessionToken = await getToken();
            if (!sessionToken) {
                throw new Error("User not authenticated");
            }
            const message = await MusicService.addMusicToExample(categoryName, musicTitle, sessionToken);
            showSuccess(message || 'Music added successfully!');
            await refetch();
            setShowAddModal(false);
        }
        catch (error) {
            showError(error.message);
        }
    };
    const handleDeleteMusic = async (categoryName, musicTitle) => {
        try {
            const sessionToken = await getToken();
            if (!sessionToken) {
                throw new Error("User not authenticated");
            }
            const message = await MusicService.deleteMusicFromExample(categoryName, musicTitle, sessionToken);
            showSuccess(message || 'Music deleted successfully!');
            await refetch();
            setShowDeleteModal(false);
        }
        catch (error) {
            showError(error.message);
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
