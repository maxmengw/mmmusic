import type { ChineseMusicDto } from '@shared/types/ChineseMusicDto';
import type { ApiResponse } from "./../apiTypes";

const API_BASE = import.meta.env.VITE_API_BASE;

export async function getChineseMusics(sessionToken?: string): Promise<ChineseMusicDto[]> {
    const res = await fetch(`${API_BASE}/api/v1/chinesemusic`, {
        ...(sessionToken && { headers: { Authorization: `Bearer ${sessionToken}` } }),
    });
    const response: ApiResponse<ChineseMusicDto[]> = await res.json();
    
    if (response.status === "error") {
        throw new Error(response.message || response.error);
    }
    
    return response.data || [];
}

export async function addChineseMusicToExample(name: string, example: string, sessionToken: string): Promise<{ data: ChineseMusicDto; message?: string }> {
    const res = await fetch(`${API_BASE}/api/v1/chinesemusic/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
        body: JSON.stringify({ name, example }),
    });
    const response: ApiResponse<ChineseMusicDto> = await res.json();

    if (response.status === "error" || !res.ok) {
        throw new Error(response.message || response.error);
    }
    
    return { data: response.data!, message: response.message };
}

export async function deleteChineseMusicFromExample(name: string, example: string, sessionToken: string): Promise<{ data: ChineseMusicDto; message?: string }> {
    const res = await fetch(`${API_BASE}/api/v1/chinesemusic/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
        body: JSON.stringify({ name, example }),
    });
    const response: ApiResponse<ChineseMusicDto> = await res.json();

    if (response.status === "error" || !res.ok) {
        throw new Error(response.message || response.error);
    }
    
    return { data: response.data!, message: response.message };
}