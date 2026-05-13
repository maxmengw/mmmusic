const API_BASE = import.meta.env.VITE_API_BASE;
export async function getKoreaMusics(sessionToken) {
    const res = await fetch(`${API_BASE}/api/v1/koreanmusic`, {
        ...(sessionToken && { headers: { Authorization: `Bearer ${sessionToken}` } }),
    });
    const response = await res.json();
    if (response.status === "error") {
        throw new Error(response.message || response.error);
    }
    return response.data || [];
}
export async function addKoreanMusicToExample(name, example, sessionToken) {
    const res = await fetch(`${API_BASE}/api/v1/koreanmusic/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
        body: JSON.stringify({ name, example }),
    });
    const response = await res.json();
    if (response.status === "error" || !res.ok) {
        throw new Error(response.message || response.error);
    }
    return { data: response.data, message: response.message };
}
export async function deleteKoreanMusicFromExample(name, example, sessionToken) {
    const res = await fetch(`${API_BASE}/api/v1/koreanmusic/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
        body: JSON.stringify({ name, example }),
    });
    const response = await res.json();
    if (response.status === "error" || !res.ok) {
        throw new Error(response.message || response.error);
    }
    return { data: response.data, message: response.message };
}
