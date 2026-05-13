import { useState } from 'react';
import * as ChineseMusicService from '../../services/chinese/chineseMusicService';
import { useToast } from '../useToast';
import { useAuth } from '@clerk/clerk-react';

export function useChineseMusicForm(refetch: () => void) {
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
            const message = await ChineseMusicService.addChineseMusicToExample(categoryName, musicTitle, sessionToken);
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
            const message = await ChineseMusicService.deleteChineseMusicFromExample(categoryName, musicTitle, sessionToken);
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