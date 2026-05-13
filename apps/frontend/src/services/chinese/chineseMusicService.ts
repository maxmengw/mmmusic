import * as ChineseMusicRepo from '../../apis/chinese/chineseMusicRepo';
import type { MusicData } from "@shared/types/MusicData";
import type { ChineseMusicDto } from "@shared/types/ChineseMusicDto";

function mapMusicToName(chineseMusic: ChineseMusicDto) {
    return {
        name: chineseMusic.name,
        description: chineseMusic.description || "",
        examples: Array.isArray(chineseMusic.examples) ? chineseMusic.examples : []
    };
}

export async function getChineseMusics(sessionToken?: string): Promise<MusicData> {
    const chineseMusics = await ChineseMusicRepo.getChineseMusics(sessionToken);

    return {
        title: "Chinese Musics",
        categories: chineseMusics.map(mapMusicToName)
    };
}

export async function addChineseMusicToExample(name: string, example: string, sessionToken: string): Promise<string | undefined> {
    const result = await ChineseMusicRepo.addChineseMusicToExample(name, example, sessionToken);
    return result.message;
}

export async function deleteChineseMusicFromExample(name: string, example: string, sessionToken: string): Promise<string | undefined> {
    const result = await ChineseMusicRepo.deleteChineseMusicFromExample(name, example, sessionToken);
    return result.message;
}