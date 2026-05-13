import type { YouTubeMusic } from '@shared/types/youtubeData';
import type { ApiResponse } from '../apiTypes';

const API_BASE = import.meta.env.VITE_API_BASE as string;

export async function getYouTubeMusicsList(sessionToken?: string): Promise<YouTubeMusic[]> {
    const res = await fetch(`${API_BASE}/api/v1/youtubemusicslist`, {
        ...(sessionToken && { headers: { Authorization: `Bearer ${sessionToken}` } }),
    });
    const response: ApiResponse<YouTubeMusic[]> = await res.json();
    if (response.status === 'error' || !res.ok) throw new Error(response.message || response.error);
    return response.data || [];
}

export async function getPlaylist(sessionToken?: string): Promise<YouTubeMusic[]> {
    const res = await fetch(`${API_BASE}/api/v1/playlist`, {
        ...(sessionToken && { headers: { Authorization: `Bearer ${sessionToken}` } }),
    });
    const response: ApiResponse<YouTubeMusic[]> = await res.json();
    if (response.status === 'error' || !res.ok) throw new Error(response.message || response.error);
    return response.data || [];
}

export async function addToPlaylist(song: YouTubeMusic, sessionToken: string): Promise<{ data: YouTubeMusic[]; message?: string }> {
    const res = await fetch(`${API_BASE}/api/v1/playlist/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionToken}` },
        body: JSON.stringify(song),
    });
    const response: ApiResponse<YouTubeMusic[]> = await res.json();
    if (response.status === 'error' || !res.ok) throw new Error(response.message || response.error);
    return { data: response.data || [], message: response.message };
}


export async function isSongInPlaylist(videoId: string, sessionToken?: string): Promise<boolean> {
    const list = await getPlaylist(sessionToken);
    return list.some((s) => s.videoId === videoId);
}

export async function deleteFromPlaylist(videoId: string, sessionToken: string): Promise<{ data: YouTubeMusic[]; message?: string }>
{
    const res = await fetch(`${API_BASE}/api/v1/playlist/${encodeURIComponent(videoId)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionToken}` },
    });
    const response: ApiResponse<YouTubeMusic[]> = await res.json();
    if (response.status === 'error' || !res.ok) throw new Error(response.message || response.error);
    return { data: response.data || [], message: response.message };
}