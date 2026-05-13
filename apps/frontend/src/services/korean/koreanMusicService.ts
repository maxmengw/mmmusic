import * as KoreanMusicRepo from '../../apis/korean/koreanMusicRepo';
import type { MusicData } from "@shared/types/MusicData";
import type { KoreanMusicDto } from "@shared/types/KoreanMusicDto";

function mapMusicToName(koreanMusic: KoreanMusicDto) {
    return {
        name: koreanMusic.name,
        description: koreanMusic.description || "",
        examples: Array.isArray(koreanMusic.examples) ? koreanMusic.examples : []
    };
}

export async function getKoreaMusics(sessionToken?: string): Promise<MusicData> {
    const koreaMusics = await KoreanMusicRepo.getKoreaMusics(sessionToken);

    return {
        title: "Korean Musics",
        categories: koreaMusics.map(mapMusicToName)
    };
}

export async function addKoreanMusicToExample(name: string, example: string, sessionToken: string): Promise<string | undefined> {
    const result = await KoreanMusicRepo.addKoreanMusicToExample(name, example, sessionToken);
    return result.message;
}

export async function deleteKoreanMusicFromExample(name: string, example: string, sessionToken: string): Promise<string | undefined> {
    const result = await KoreanMusicRepo.deleteKoreanMusicFromExample(name, example, sessionToken);
    return result.message;
}