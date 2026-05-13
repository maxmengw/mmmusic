import type { FilipinoMusicDto } from '@shared/types/FilipinoMusicDto';
import type { ApiResponse } from "../apiTypes";

const API_BASE = import.meta.env.VITE_API_BASE;

export async function getFilipinoMusics(sessionToken?: string): Promise<FilipinoMusicDto[]> {
    const res = await fetch(`${API_BASE}/api/v1/filipinomusic`, {
        ...(sessionToken && { headers: { Authorization: `Bearer ${sessionToken}` } }),
    });
    const response: ApiResponse<FilipinoMusicDto[]> = await res.json();
    
    if (response.status === "error") {
        throw new Error(response.message || response.error);
    }
    
    return response.data || [];
}

export async function addFilipinoMusicToCategory(name: string, example: string, sessionToken: string): Promise<{ data: FilipinoMusicDto; message?: string }> {
    const res = await fetch(`${API_BASE}/api/v1/filipinomusic/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
        body: JSON.stringify({ name, example }),
    });
    const response: ApiResponse<FilipinoMusicDto> = await res.json();

    if (response.status === "error" || !res.ok) {
        throw new Error(response.message || response.error);
    }
    
    return { data: response.data!, message: response.message };
}

export async function deleteFilipinoMusicFromCategory(name: string, example: string, sessionToken: string): Promise<{ data: FilipinoMusicDto; message?: string }> {
    const res = await fetch(`${API_BASE}/api/v1/filipinomusic/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
        body: JSON.stringify({ name, example }),
    });
    const response: ApiResponse<FilipinoMusicDto> = await res.json();

    if (response.status === "error" || !res.ok) {
        throw new Error(response.message || response.error);
    }
    
    return { data: response.data!, message: response.message };
}