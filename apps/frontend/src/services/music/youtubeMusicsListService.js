import * as repo from '../../apis/music/youtubeMusicsListRepo';
import { useToast } from '../../hooks/useToast';
export async function getYouTubeMusicsList(sessionToken) {
    return await repo.getYouTubeMusicsList(sessionToken);
}
export async function getPlaylist(sessionToken) {
    return await repo.getPlaylist(sessionToken);
}
export async function addToPlaylist(songName, country, youtubeUrl, sessionToken) {
    const { showError, showSuccess } = useToast();
    if (!youtubeUrl.trim()) {
        try {
            showError('Please enter a YouTube URL');
        }
        catch { }
        throw new Error('Please enter a YouTube URL');
    }
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
        try {
            showError('Invalid YouTube URL');
        }
        catch { }
        throw new Error('Invalid YouTube URL');
    }
    const parts = songName.split(' - ');
    const title = parts[0]?.trim() || songName;
    const artist = parts[1]?.trim() || `${country} Artist`;
    const body = { title, artist, videoId };
    try {
        const res = await repo.addToPlaylist(body, sessionToken);
        try {
            window.dispatchEvent(new Event('mms_playlist_update'));
            if (res.message) {
                try {
                    showSuccess(res.message);
                }
                catch { }
            }
        }
        catch { }
        return res.data;
    }
    catch (error) {
        if (error.message) {
            try {
                showError(error.message);
            }
            catch { }
        }
        throw error;
    }
}
function extractVideoId(url) {
    const cleanUrl = url.trim();
    if (!cleanUrl)
        return '';
    if (cleanUrl.length === 11 && /^[a-zA-Z0-9_-]+$/.test(cleanUrl))
        return cleanUrl;
    const patterns = [
        /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
        /youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = cleanUrl.match(pattern);
        if (match && match[1])
            return match[1];
    }
    return '';
}
export async function deleteFromPlaylist(videoId, sessionToken) {
    const { showError, showSuccess } = useToast();
    if (!videoId || !videoId.trim()) {
        try {
            showError('Invalid video id');
        }
        catch { }
        throw new Error('Invalid video id');
    }
    try {
        const res = await repo.deleteFromPlaylist(videoId, sessionToken);
        try {
            window.dispatchEvent(new Event('mms_playlist_update'));
            if (res.message) {
                try {
                    showSuccess(res.message);
                }
                catch { }
            }
        }
        catch { }
        return res.data;
    }
    catch (error) {
        if (error.message) {
            try {
                showError(error.message);
            }
            catch { }
        }
        throw error;
    }
}
